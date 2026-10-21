# Setup guide

This is an architecture reference for a self-hosted prototype, **not a one-click installation**. Sanitized workflow exports are not yet published.

## Prerequisites

- Docker host running n8n; an Unraid deployment was used for this project.
- Access to Apify's job-search actor and an OpenAI API account.
- Google Cloud project with enabled Sheets, Drive, and Docs APIs and suitable OAuth 2.0 consent/configuration.
- Google Sheet for tracking jobs.
- Google Docs templates: résumé with projects, résumé without projects, and cover letter.

## Tracking sheet

Create these columns with the exact names used by the workflows:

| Column | Purpose |
| --- | --- |
| Link | Canonical job URL used to match rows |
| Make Cover | Human selection flag |
| Resume | Generated Google Docs URL |
| Cover Letter | Generated Google Docs URL |

Other fields (company, title, description, ranking, dates) can be added.

## Job discovery

Create a scheduled workflow that runs the Apify actor, reads resulting listings, normalizes LinkedIn URLs, removes duplicates, ranks candidate jobs, then appends only new records to Sheets. Use batching to stay within Google Sheets quota limits.

## Application preparation

Read pending selected rows using `Grab Pending Rows1`. Load a private, verified candidate profile. Use one OpenAI stage to draft and another to review against that profile. Expect JSON with `resume` and `cover_letter` keys, including structured `experience` entries. Validate required career history before document generation.

Create two document items per selected job and preserve `Link` and `document_type`. Build Google Docs `replaceAllText` requests for the respective placeholders. Choose the Google Drive template based on the document type and `hasProjects`. Copy it, capture the returned ID, call the Google Docs `documents.batchUpdate` endpoint, and write both resulting document URLs to the original row using `Link` as the matching column.

## Verify before enabling schedules

Test with **fictional** sample data on a separate sheet. Confirm no missing history, correct document formatting, no leftover placeholders, and correct job-to-document association. Keep real credentials and personal application content private. See [Security](security.md).

## Operational notes

The actual OAuth setup and node parameters vary by environment. Never commit active client secrets, webhook URLs, candidate records, or document/template IDs. See [Troubleshooting](troubleshooting.md) for failure patterns encountered in development.
