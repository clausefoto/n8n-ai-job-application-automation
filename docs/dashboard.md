# Job dashboard

The dashboard is the human review and tracking surface for the job-search system. It reads job rows from a Google Sheet and writes user-controlled fields back to the matching row. The interface is served by a private Google Apps Script web app.

> Screenshots in this guide are illustrative mockups with fictional data. They do not show the live Sheet, generated documents, or private deployment URL.

## Views

- **Overview** summarizes saved jobs, application stages, fit scores, jobs awaiting review, and jobs set aside. Charts show stage and score distributions and work arrangements.
- **Pipeline board** groups jobs by application stage and separates jobs awaiting review, jobs marked interested, and jobs set aside by reason.
- **All jobs** uses two side-by-side panels: a searchable and sortable list and a selected-job detail view. Drag the divider to adjust panel widths. Sort by rating, age, or salary; filter by stage, interest, and work arrangement.
- **Insights** provides additional summaries of job scores, interest decisions, and search results.

## Reviewing a job

The selected-job panel includes the job description, score breakdown, salary, interest controls, and application tracking. The status menu uses these stages:

`To review` → `Ready to apply` → `Applied` → `Interviewing` → `Offer`

`Rejected` and `Withdrawn` are also available. **Move to …** advances to the next stage.

Jobs awaiting review can be marked **Interested** or set aside as **Not relevant**, **Not qualified**, **Military**, or **Not remote**. An empty interest field means **Awaiting review**.

## Preparing application documents

The **Make Cover** switch is a yes/no request flag for the separate n8n document-preparation workflow. The dashboard does not submit job applications; review generated materials before applying.

The `Resume` and `Cover Letter` cells hold document links when the workflow finishes. The dashboard shows an **Open** link and a **Download** action for each available document. If a link is missing, it displays **Not added yet**.

## Sheet fields and updates

| Sheet column | Dashboard use |
| --- | --- |
| `Link` | Stable job key used to find the row for updates |
| `Status` | Application stage |
| `Make Cover` | Request flag watched by the document workflow |
| `Resume` | Generated résumé document link |
| `Cover Letter` | Generated cover-letter document link |
| `Not Interested` | Optional interest decision / reason |

Other columns supply title, company, description, platform, date, rating, score breakdown, salary, location, remote status, and logo. The integration should update a row only when `Link` matches exactly one row; blank or duplicate links are ambiguous.

## Source files

The current Apps Script source is in [`apps-script/`](../apps-script/README.md). Follow that folder's setup guide to configure a private copy using your own Script Property for `SPREADSHEET_ID`; private identifiers and live job data are not included here.

## Deployment and privacy

Deploy the Apps Script web app to execute as an account that can edit the Sheet, and restrict access to that account. Keep deployment URLs and Sheet IDs private. Do not publish real job rows, candidate records, document URLs or IDs, or screenshots of the authenticated dashboard. See [Screenshots](screenshots.md).
