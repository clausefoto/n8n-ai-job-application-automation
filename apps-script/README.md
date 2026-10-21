# Apps Script dashboard source

This folder contains the Google Apps Script implementation of the job hunt dashboard. It is a template for your own Sheet; it does not include a live spreadsheet ID, deployment URL, real job data, or document links.

## Files

- `Code.gs` reads and updates job rows in the configured Google Sheet.
- `Index.html` is the dashboard interface.

## Configure your copy

1. Create a new Apps Script project and add these two files, keeping the names `Code.gs` and `Index.html`.
2. In **Project Settings → Script Properties**, add `SPREADSHEET_ID` with the ID of your Google Sheet. Keep this value in Script Properties; do not paste it into source code or commit it to a public repository.
3. Make sure the tab name matches `SHEET_NAME` near the top of `Code.gs` (default: `Sheet1`).
4. Confirm the first row of the tab includes these headers (additional columns are fine):

   `Title`, `Job Description`, `Platform`, `Link`, `Date`, `Rating`, `Company Name`, `Score breakdown`, `Salary`, `City`, `Expired`, `Remote`, `Status`, `Age`, `Make Cover`, `Cover Letter`.

   The script also uses optional columns such as `Resume`, `Company Logo`, and `Not Interested` when present.
5. Save the project, then deploy it as a **Web app** that executes as your account and is accessible only to you. Review access settings before deployment; do not publish the deployment URL.

The dashboard uses Apps Script's `google.script.run` bridge, so opening `Index.html` as a standalone local file will not connect to the Sheet. The project must be deployed through Apps Script.

## Privacy

This repository is public. Keep spreadsheet IDs, Apps Script project/deployment IDs and URLs, OAuth credentials, actual job records, résumé/cover-letter links, and personal candidate details out of commits and screenshots. If you suspect one was committed, remove it from the repository history and rotate/revoke the exposed credential where applicable.

## Overview dashboard update (October 2026)

The **Overview** page uses a small additive block appended to the original `Index.html` rather than replacing the other pages. It has New Jobs, Jobs Tracked, Interested Jobs, Selected for Cover Letter, and Docs Generated counters, plus a searchable table. The **Job Search**, **Pipeline**, **Documents**, and **Insights** pages and their behavior remain unchanged.

**New Jobs** counts posting dates equal to the browser's current calendar date or the previous date. It uses the Google Sheet `Date` column—not `Age` or row insertion time. `getJobs()` reads this with `getDisplayValues()` to preserve the Sheet-visible calendar date without script-timezone shifts. **Interested Jobs** counts jobs explicitly marked Interested, independent of the cover-letter selection flag.

To deploy, synchronize **both** `Code.gs` and `Index.html` into your Apps Script project, then use **Test deployments**. Updating the repository alone does not deploy changes to the live Google Apps Script web app.
