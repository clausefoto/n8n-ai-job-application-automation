# Combined n8n workflows and scheduled digests

These public workflow exports are **sanitized references**; all are disabled or inactive until manually configured.

| File | Use |
| --- | --- |
| `indeed-job-discovery-and-application-generator.sanitized.json` | **27-node** parent workflow: discovery, eligibility, rating, document generation, first-seen tracking, and disabled post-run hook |
| `post-run-telegram-digest.sanitized.json` | **5-node** child: per-update Telegram summary keyed to the parent's execution ID |
| `daily-9pm-email-and-telegram-digest.sanitized.json` | **7-node** daily: 9 PM Pacific Gmail HTML table and Telegram summary of jobs first seen today |

See **[Scheduled digest setup](../docs/job-digests.md)** for required Sheet columns, credentials, the child-workflow connection, timezone, and testing.

## Safety and customization

- No private candidate details, credential references, resource IDs, or pinned results are published.
- Parent scheduled triggers and the parent call to its child digest remain **disabled**; the nightly trigger is disabled, and all workflow active flags are false.
- Provide your own Google Sheet, dashboard web-app deployment URL, Telegram channel Chat ID, and Gmail account.
- Both digest workflows read fresh Sheets values for job descriptions, type, score, and dashboard links.
- Job discovery timestamps are separate from Indeed's posted date; existing rows without first-seen metadata are not silently counted as new jobs.
- The dashboard deep-link feature must be deployed to your private Google Apps Script web app.
- The résumé document Code nodes remain role-specific examples, not a general résumé generation product.

See [Setup](../docs/setup.md), [Architecture](../docs/architecture.md), and [Security](../docs/security.md).
