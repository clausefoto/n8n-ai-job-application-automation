# Setup and reproduction

The [sanitized combined workflow](../workflows/indeed-job-discovery-and-application-generator.sanitized.json) is a **reference export**, not a plug-and-play deployment. It represents **one n8n workflow containing two branches**. Both schedule triggers are disabled.

## Prerequisites

- Self-hosted n8n in Docker (this prototype uses Unraid).
- Access to Apify and a compatible **Indeed job-search actor**.
- OpenAI API credentials.
- A Google Cloud project with Sheets, Drive and Docs APIs enabled, along with OAuth 2.0 authorization.
- A Google Sheet for tracking job listings.
- Three native Google Docs templates: résumé **with projects**, résumé **without projects**, and **cover letter**.

## Import and configure

1. Import `workflows/indeed-job-discovery-and-application-generator.sanitized.json` into n8n.
2. Open the Apify node and replace `YOUR_APIFY_ACTOR_ID`; select your Apify credential.
3. Update the Google Sheets nodes with `YOUR_GOOGLE_SPREADSHEET_ID`, the correct sheet tab, and your own credentials.
4. Set `YOUR_OUTPUT_FOLDER_ID` and the three Google Docs template identifiers in the Google Drive Copy node.
5. Reconnect OpenAI API and Google Drive credentials to the AI and HTTP Request nodes.
6. In `Load Career Profile`, replace the **fictional example** with a private, verified career profile. Review AI instructions and experience title matching to match *your own* data.
7. Test both branches separately with fictional job data; enable schedules only after successful manual testing.

The public export intentionally contains **no actual credentials, private resource IDs, execution data or real candidate profile**.

## Required Google Sheet columns

The workflow references these exact field names:

| Column | Used for |
| --- | --- |
| `Link` | Matching previously stored jobs and final documents |
| `Title` | Job title for AI tailoring |
| `Company Name` | Hiring company |
| `Job Description` | Position requirements |
| `Rating` | AI job-fit score |
| `Score breakdown` | Explanation of rating |
| `Make Cover` | Human approval signal |
| `Resume` | New Google Doc URL |
| `Cover Letter` | New Google Doc URL |

Other fields such as `Benefits`, `Remote`, `Type`, `Salary`, `Date`, and `City` may be present.

The current discovery branch matches rows by the provider's job `Link`; it does not guarantee URL canonicalization. Consider stripping tracking parameters before storing URLs.

## Document templates

Placeholders must match the Code node `Build Template Replacements` **exactly**. Examples:

- Résumé: `{{HEADLINE}}`, `{{SUMMARY}}`, `{{SKILLS}}`, `{{SYSADMIN_BULLETS}}`, `{{SPECIALIST_BULLETS}}`, `{{ANALYST_BULLETS}}`.
- Optional projects: `{{PROJECTS_HEADING}}` and `{{PROJECTS}}`.
- Cover letter: `{{COMPANY}}`, `{{POSITION}}`, `{{SALUTATION}}`, `{{LETTER_BODY}}`, `{{CLOSING}}`, `{{SIGNATURE}}`.

The **no-projects** template should omit the projects paragraphs **and their borders**, not replace their text with empty strings.

## Validation checklist

- Run one sample Indeed search and confirm the dataset maps to the expected Sheet columns.
- Check rating calculations manually. **The current prompt hard-codes Benefits: Yes and Type: Full Time.**
- Select one *fictional* sample job and inspect the initial and reviewed AI JSON.
- Confirm both documents are generated using the correct template, include complete required history, and have no visible placeholders.
- Confirm both links were written to the **same** selected `Link` row, with no new duplicate.
- Review API quota limits, errors and retries before enabling schedules.

See [Architecture](architecture.md), [Troubleshooting](troubleshooting.md) and [Security](security.md).
