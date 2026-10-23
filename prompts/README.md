# AI prompts

This folder contains the system and user messages for the workflow's four AI tasks. Files are plain text so they can be copied into n8n without Markdown formatting.

## Prompt files

| n8n AI node | System message(s) | User message | Source / note |
| --- | --- | --- | --- |
| Eligibility pre-filter | [System](eligibility-filter.system.txt) | [User](eligibility-filter.user.txt) | Generalized public template based on the eligibility rules; replace regional placeholders before reuse. |
| Rate pending Jobs | [System](rate-pending-jobs.system.txt) | [User](rate-pending-jobs.user.txt) | 100-point scoring version discussed in October 2026 (50% fit / 25% salary / 25% benefits, $100K preferred). This was reconstructed from the discussion, **not extracted from a fresh live n8n export**. Verify the career-profile expression against your workflow. |
| Create Resume and Cover Letter | [System](create-resume-and-cover-letter.system.txt) | [User](create-resume-and-cover-letter.user.txt) | Copied character-for-character from the owner's October 21 n8n export; no prompt-text changes. |
| Review Application Documents | [System message 1](review-application.system-1.txt) | [System message 2](review-application.system-2.txt) | Both exported messages were marked `system` in n8n and are copied character-for-character. The second contains the application JSON expressions. |

## Notes

- These are prompt texts and n8n expressions, not a workflow import or any credentials.
- The original exported workflow used a **10-point rating** and an embedded résumé. That outdated rating is intentionally **not** included. The 100-point version is the newer proposed text, not a verified byte-for-byte export of the running node.
- The résumé and review prompts are from the last uploaded source export. The résumé prompt includes the public author's name and a photography-business reference; both were preserved because those prompts were requested unchanged. Check content before republishing elsewhere.
- Do not publish the complete private career profile, production API keys, OAuth credentials, document IDs, or live application data.
- Some expressions reference upstream node names. They work only when names and data shapes match your particular n8n workflow.
- The filtering step sends ineligible jobs to `Rating=0` with `Not Interested Reason` `not remote` or `military`; it should not overwrite sheet ratings for eligible jobs.
