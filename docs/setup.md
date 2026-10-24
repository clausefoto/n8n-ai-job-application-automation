# Setup and reproduction

The [sanitized combined workflow](../workflows/indeed-job-discovery-and-application-generator.sanitized.json) represents the newer **27-node parent n8n workflow with two primary branches and an optional digest branch**. It is a **reference export**, not a plug-and-play deployment. **Both schedule triggers are disabled**.

## Prerequisites

- n8n running in Docker (the original is hosted on Unraid).
- An Apify account and compatible **Indeed job-search actor**.
- OpenAI API credentials for the four AI processing nodes.
- A Google Cloud project with Sheets, Drive and Docs APIs enabled, plus OAuth 2.0 authorization.
- A Google Sheet used as the job database.
- Three native Google Docs templates: résumé **with projects**, résumé **without projects**, and **cover letter**.

## Configure and import

1. Import `workflows/indeed-job-discovery-and-application-generator.sanitized.json` into n8n.
2. Configure the Apify actor (`YOUR_APIFY_ACTOR_ID`) and API credentials.
3. Point **every Google Sheets node**—including **Update Google Sheet Ratings1** and **Grab additional pending rating Rows**—at your own spreadsheet and sheet tab.
4. Set the Google Drive folder and all three Docs template IDs, and authorize the relevant Google API credentials.
5. Reconnect OpenAI credentials and verify supported model IDs.
6. In **Load Rating Career Profile** and **Load Career Profile**, replace the **fictional sample** with your own *private verified career profile*. These are separate Set nodes.
7. Adjust [eligibility prompt geography placeholders](../prompts/eligibility-filter.system.txt) and the job-scoring salary preference for your own requirements.
8. Check the document-preparation Code nodes and template placeholders against the roles, fields and date formatting in your actual profile.
9. Test both branches with fictional listings before enabling the two schedules.

The public export includes **no private career profile, credential references, Google resource IDs, or execution data**.

## Required Sheet columns

| Column | Purpose |
| --- | --- |
| `Link` | Stable key used for both scoring updates and document links |
| `Title`, `Company Name`, `Job Description` | Job details and AI inputs |
| `City`, `Remote`, `Type`, `Salary`, `Benefits` | Filtering and weighted scoring inputs |
| `Rating` | Blank when unrated, `0` when rejected, or `1–100` when rated |
| `Not Interested` / `Not Interested Reason` | Eligibility rejection flag and explanation |
| `Score breakdown` | Detailed 50/25/25 rating reasoning |
| `Make Cover` | Manual approval for application preparation |
| `Resume` / `Cover Letter` | Links to generated Google Docs |

The upsert matches by provider `Link`. The current export does not fully canonicalize job URLs or remove all tracking parameters.

## Document templates

Template placeholders must match **Build Template Replacements** exactly:

- Résumé: `{{HEADLINE}}`, `{{SUMMARY}}`, `{{SKILLS}}`, `{{SYSADMIN_BULLETS}}`, `{{SPECIALIST_BULLETS}}`, `{{ANALYST_BULLETS}}`.
- Optional projects: `{{PROJECTS_HEADING}}` and `{{PROJECTS}}`.
- Cover letter: `{{COMPANY}}`, `{{POSITION}}`, `{{SALUTATION}}`, `{{LETTER_BODY}}`, `{{CLOSING}}`, `{{SIGNATURE}}`.

The no-projects résumé template should omit projects paragraphs and decorative borders entirely. The current workflow's three role-specific placeholders are examples, not a universal experience schema.

## Validation checklist

- Import test: both schedule triggers are disabled and all expected nodes and connections are present.
- Dataset test: one fictional Indeed listing is upserted by `Link`, without producing duplicate rows.
- Eligibility test: a clearly disallowed in-person listing or mandatory military-clearance job receives `Rating=0` and an appropriate reason.
- Pass-through test: a genuinely eligible job remains unrated after the eligibility update, is picked up by the **second pending-rating lookup**, and receives a **1–100** score with the appropriate fit / salary / benefits breakdown.
- Verify the actual `Benefits` and `Type` inputs rather than assuming they are present.
- Document test: one *manually selected* fictional job produces a validated résumé and cover letter with no unsupported career claims.
- Verify both Google Doc links update the same existing `Link` row, not a new duplicate.
- Check AI costs, rate limits, Sheets read quotas, item lineage, and retry behavior before enabling schedules.

See [Architecture](architecture.md), [Troubleshooting](troubleshooting.md), and [Security](security.md).
