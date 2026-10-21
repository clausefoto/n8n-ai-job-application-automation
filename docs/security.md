# Security and privacy checklist

This n8n project processes OAuth credentials, private career information and job application data. Treat **raw workflow exports as private** until manually audited.

## Never publish

- OpenAI or Apify API keys, OAuth refresh tokens, access tokens, client secrets, passwords or authentication headers.
- n8n credential identifiers and internal credential names.
- Private Google Sheets, Drive folder, document, or template IDs and URLs.
- Embedded candidate career profiles, real generated résumés, cover letters, contact information or job notes.
- Internal network addresses, webhook secrets, private callback URLs or self-hosted management endpoints.
- Pinned data, execution records, copied job datasets or personal data in screenshots.

## Sanitizing an export

1. Export n8n workflow JSON and work on a disposable **copy**.
2. Remove `credentials`, `pinData`, execution data and any provider tokens.
3. Replace Google spreadsheet, folder and template IDs, along with Apify actor IDs, with descriptive placeholders.
4. Replace embedded personal career profiles and any example résumé text with fictional equivalents.
5. Inspect **all node parameters** (especially Code-node JavaScript and AI messages) for literals containing identities, private URLs or secrets.
6. Run `python scripts/audit_n8n_export.py workflows/your-export.json`.
7. Manually inspect the entire sanitized JSON. **A zero-warning scan is not a guarantee that no sensitive data remains.**
8. Verify images, filenames and git diffs prior to publishing.

A `.gitignore` helps with accidental commits but cannot remove secrets that have already entered Git history. If anything sensitive is exposed, revoke/rotate it and follow incident-response procedures rather than just deleting the file.

## Privacy and scope

The repository uses **fictional candidate data and placeholder identifiers**. It is intended to demonstrate implementation patterns and design decisions, not to run against the original operator's resources.

The system **prepares** application documents after human selection; it does **not** automatically submit job applications. Treat job listing text as untrusted content, and verify AI-generated career claims against a trusted private candidate profile.
