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


## Link directly to a job from an alert

The dashboard accepts a `job` query parameter in its deployed Google Apps Script web-app URL. Its value must equal the Google Sheet's `Link` field for the job. Once the Sheet has loaded, the dashboard switches to **All jobs** and opens that record. It clears list filters so the selected job is visible.

**Example URL format (placeholders, not a live deployment):**

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?job=URL_ENCODED_JOB_LINK
```

In the **n8n Gmail message** and **Telegram message** fields, add this expression (replace the placeholder deployment URL with your own private Apps Script `/exec` URL):

```javascript
{{ 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?job=' + encodeURIComponent($('Grab additional pending rating Rows').item.json.Link) }}
```

This uses the *same* Sheet job URL used as the stable key in the existing rating flow; it does **not** use the Sheet row number. Include the result in your Gmail/Telegram message as a **Dashboard Job** link. Optionally add the original external job posting URL as a separate link.

**Important:** The public repository does not include the actual dashboard deployment URL. Updating `Index.html` in GitHub does **not** deploy the Apps Script web app. Copy the changed `Index.html` into your Apps Script project, save, and deploy a **new version** of the web app; then test a direct job link while signed in to the account with access. Keep your dashboard restricted to your account. Missing or unmatched job links show a message and leave the dashboard usable.

## Source files

The current Apps Script source is in [`apps-script/`](../apps-script/README.md). Follow that folder's setup guide to configure a private copy using your own Script Property for `SPREADSHEET_ID`; private identifiers and live job data are not included here.

## Deployment and privacy

Deploy the Apps Script web app to execute as an account that can edit the Sheet, and restrict access to that account. Keep deployment URLs and Sheet IDs private. Do not publish real job rows, candidate records, document URLs or IDs, or screenshots of the authenticated dashboard. See the [dashboard illustrations](../README.md#dashboard-screenshots) in the main README.
