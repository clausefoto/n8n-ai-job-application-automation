const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const SHEET_NAME = 'Sheet1';

const APPLICATION_STAGES = [
  'To review', 'Ready to apply', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Job Hunt Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getJobs() {
  const sheet = getJobsSheet_();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const displayValues = dataRange.getDisplayValues();
  const richValues = dataRange.getRichTextValues();
  const formulas = dataRange.getFormulas();
  if (values.length < 2) return [];

  const headers = values[0].map(value => String(value).trim());
  const columns = headerMap_(headers);
  const required = ['Title', 'Job Description', 'Platform', 'Link', 'Date', 'Rating',
    'Company Name', 'Score breakdown', 'Salary', 'City', 'Expired', 'Remote', 'Status',
    'Age', 'Make Cover', 'Cover Letter'];
  const missing = required.filter(name => columns[name.toLowerCase()] === undefined);
  if (missing.length) throw new Error('Missing required column(s): ' + missing.join(', '));

  return values.slice(1).flatMap((row, index) => {
    if (row.every(value => value === '' || value === null)) return [];
    const get = name => {
      const column = columns[name.toLowerCase()];
      return column === undefined ? '' : row[column];
    };
    const getLink = name => {
      const column = columns[name.toLowerCase()];
      if (column === undefined) return '';
      const rich = richValues[index + 1] && richValues[index + 1][column];
      const richUrl = rich && rich.getLinkUrl();
      if (richUrl && /^https?:\/\//i.test(richUrl)) return richUrl;
      const raw = String(get(name) || '').trim();
      if (/^https?:\/\//i.test(raw)) return raw;
      const formula = formulas[index + 1] && formulas[index + 1][column] || '';
      const match = String(formula).match(/HYPERLINK\s*\(\s*"([^"]+)"/i);
      return match ? match[1] : '';
    };
    const remote = toBoolean_(get('Remote'));

    // Read the calendar date exactly as displayed in Google Sheets.
    // Converting a date-cell Date object with the SCRIPT timezone can shift
    // 2026-10-20 to October 19. The displayed value avoids that error.
    const postedDate = String(displayValues[index + 1][columns.date] || '').trim();

    return [{
      id: index + 2,
      title: asText_(get('Title')),
      description: asText_(get('Job Description')),
      platform: asText_(get('Platform')),
      link: asText_(get('Link')),
      date: postedDate,
      rating: Number(get('Rating')) || 0,
      company: asText_(get('Company Name')),
      score: asText_(get('Score breakdown')),
      salary: asText_(get('Salary')),
      city: asText_(get('City')),
      expired: toBoolean_(get('Expired')),
      remote: remote ? 'Remote' : 'On-site',
      stage: asText_(get('Status')) || 'To review',
      age: asText_(get('Age')),
      makeCover: toBoolean_(get('Make Cover')),
      coverLetter: getLink('Cover Letter') || asText_(get('Cover Letter')),
      resumeLink: getLink('Resume'),
      companyLogoUrl: asText_(get('Company Logo URL') || get('Company Logo')),
      interestStatus: interestStatus_(get('Not Interested'), get('Not Interested Reason')),
      notInterested: ['Not interested', 'Not relevant', 'Not qualified', 'Military', 'Not remote']
        .includes(interestStatus_(get('Not Interested'), get('Not Interested Reason')))
    }];
  });
}

function updateJobField(jobId, jobLink, field, value) {
  const headerByField = {
    stage: 'Status',
    makeCover: 'Make Cover',
    coverLetter: 'Cover Letter',
    interestStatus: 'Not Interested'
  };
  const header = headerByField[field];
  if (!header) throw new Error('This field cannot be updated.');

  const sheet = getJobsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) throw new Error('The jobs sheet has no data rows.');
  const headers = values[0].map(item => String(item).trim());
  const columns = headerMap_(headers);
  const linkColumn = columns.link;
  const targetColumn = columns[header.toLowerCase()];
  if (linkColumn === undefined) throw new Error('Missing required column: Link');
  if (targetColumn === undefined) {
    throw new Error('Add a "' + header + '" column to Sheet1 before saving this field.');
  }

  const normalizedLink = String(jobLink || '').trim();
  if (!normalizedLink) throw new Error('This job has no Link value, so it cannot be matched safely.');
  const targetRow = Number(jobId);
  if (!Number.isInteger(targetRow) || targetRow < 2 || targetRow > values.length) {
    throw new Error('This job row is no longer available. Refresh the dashboard and try again.');
  }
  if (String(values[targetRow - 1][linkColumn] || '').trim() !== normalizedLink) {
    throw new Error('The sheet rows changed since this job loaded. Refresh the dashboard and try again.');
  }

  let savedValue = value;
  if (field === 'stage') {
    savedValue = String(value || '').trim();
    if (!APPLICATION_STAGES.includes(savedValue)) throw new Error('Choose one of the listed application stages.');
  } else if (field === 'makeCover') {
    if (typeof value !== 'boolean') throw new Error('Expected a yes/no value.');
  } else if (field === 'interestStatus') {
    if (!['Awaiting review', 'Interested', 'Not interested', 'Not relevant', 'Not qualified', 'Military', 'Not remote'].includes(value)) throw new Error('Choose a valid interest status.');
    savedValue = value === 'Awaiting review' ? '' : value === 'Interested' ? false : true;
  } else {
    savedValue = String(value || '');
    if (savedValue.length > 45000) throw new Error('Cover Letter is too long to save.');
    if (/^[=+\-@]/.test(savedValue)) savedValue = "'" + savedValue;
  }

  const targetRange = sheet.getRange(targetRow, targetColumn + 1);
  targetRange.setValue(savedValue);
  SpreadsheetApp.flush();
  if (String(targetRange.getValue()) !== String(savedValue)) {
    throw new Error('The Sheet did not retain this update. Refresh and try again.');
  }
  if (field === 'interestStatus') {
    let reasonColumn = columns['not interested reason'];
    if (reasonColumn === undefined) {
      reasonColumn = sheet.getLastColumn();
      sheet.getRange(1, reasonColumn + 1).setValue('Not Interested Reason');
    }
    const reason = ['Not relevant', 'Not qualified', 'Military', 'Not remote'].includes(value) ? value : '';
    sheet.getRange(targetRow, reasonColumn + 1).setValue(reason);
  }
  return { ok: true, field: field, value: value };
}

function getJobsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Could not find the tab named "' + SHEET_NAME + '".');
  return sheet;
}

function headerMap_(headers) {
  const map = {};
  headers.forEach((header, index) => {
    const key = header.toLowerCase();
    if (map[key] !== undefined) throw new Error('Duplicate column header: ' + header);
    map[key] = index;
  });
  return map;
}

function asText_(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function toBoolean_(value) {
  if (value === true || value === 1) return true;
  return ['true', 'yes', '1'].includes(String(value || '').trim().toLowerCase());
}

function interestStatus_(value, reason) {
  const categories = { 'not relevant': 'Not relevant', 'not qualified': 'Not qualified', 'military': 'Military', 'not remote': 'Not remote' };
  const reasonKey = String(reason || '').trim().toLowerCase();
  if (categories[reasonKey]) return categories[reasonKey];
  if (value === '' || value === null || value === undefined) return 'Awaiting review';
  const normalized = String(value).trim().toLowerCase();
  if (categories[normalized]) return categories[normalized];
  if (value === true || ['true', 'yes', '1', 'not interested'].includes(normalized)) return 'Not interested';
  if (value === false || ['false', 'no', '0', 'interested'].includes(normalized)) return 'Interested';
  if (normalized === 'awaiting review') return 'Awaiting review';
  return 'Awaiting review';
}

function formatDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'MMM d, yyyy');
  }
  return asText_(value);
}
