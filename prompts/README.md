# n8n AI prompt library

These are the message contents for the four AI nodes in the latest n8n workflow export provided by the project owner (October 2026). Each `.txt` contains raw n8n message text, ready to inspect or adapt.

| AI node | System message | Other message |
| --- | --- | --- |
| Filter Non-remote and Military jobs | [System](eligibility-filter.system.txt) | [User](eligibility-filter.user.txt) |
| Rate pending Jobs | [System](rate-pending-jobs.system.txt) | [User](rate-pending-jobs.user.txt) |
| Create Resume and Cover Letter | [System](create-resume-and-cover-letter.system.txt) | [User](create-resume-and-cover-letter.user.txt) |
| Review Application Documents | [System 1](review-application.system-1.txt) | [System 2](review-application.system-2.txt) |

## Source fidelity

- **Rate pending Jobs**, **Create Resume and Cover Letter**, and **Review Application Documents** are copied **character-for-character** from the latest provided workflow export. No prompt text was rewritten or anonymized.
- **Filter Non-remote and Military jobs** is a **public template**, not the exact live system message. Geographic preferences were replaced with `[HOME_STATE_OR_REGION]` and `[ALLOWED_ONSITE_OR_HYBRID_LOCATIONS]`. Three malformed JSON *examples* were corrected (missing commas and unquoted `TRUE`); the rejection labels and screening rules were otherwise preserved. Fill in both placeholders when reusing it.
- The review node contains **two system messages** in the export; neither has been relabeled as a user message.
- Some message texts begin with `=` because n8n serializes expressions this way. When configuring n8n manually, use its Expression mode as appropriate. Job-data and career-profile expressions depend on upstream node names.
- The rating prompt targets **$100,000** annual compensation; one illustrative reasoning string in the exported prompt still mentions a **$75,000 target**. It is deliberately left unchanged for source fidelity.
- The original job-rating user message references the output of `Load Rating Career Profile`; ensure this node exists and runs before scoring.
- These files **do not** contain the actual private career profile, authentication credentials, Google resource IDs, live job rows, or the unsanitized n8n workflow export.
- The résumé and review prompts do include the owner's name and employer names. They are **not anonymized**, as requested.
- The separately published sanitized workflow JSON is an earlier snapshot; its prompts may differ from this folder.

## Workflow behavior

The eligibility filter is evaluated before detailed rating. It can reject jobs by setting `Rating` to `0` and `Not Interested Reason` to `Not Remote` or `Military`. The main rating prompt allocates 50 points to career fit, 25 to salary, and 25 to benefits.
