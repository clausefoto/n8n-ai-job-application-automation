# Security and privacy

**Public repository content must be sanitized before publication.** The local workflow handles personal employment information and third-party service credentials.

## Never publish

- API keys, bearer tokens, refresh tokens, passwords, OAuth client secrets, cookie values
- Credential node payloads, credential IDs with identifying metadata, private webhook endpoints
- Production Google Sheets/Docs/Drive IDs and URLs or actual generated application documents
- Personal candidate profiles, real job tracking rows, contact information, execution logs
- Local IP addresses or internal n8n hostnames, session screenshots containing sensitive data

## Publishing a safe n8n export

1. Export workflow JSON from n8n, excluding credentials and execution data.
2. Work on a copy, never the only live export.
3. Remove or substitute credentials, provider tokens, webhook paths, private URLs, resource IDs, pinned data, candidate profiles, and sensitive Code-node literals.
4. Inspect all expression strings and node parameters: secrets can be embedded anywhere.
5. Run `python scripts/audit_n8n_export.py workflows/your-workflow.sanitized.json`.
6. Review the entire file manually; the script is a heuristic and cannot certify safety.
7. Test the sanitized export in a separate environment before publishing it.

A `.gitignore` file prevents accidental tracking only when properly matched; it does not protect secrets already committed. If a secret is published, revoke/rotate it and remove it from Git history.

Publish fictional example job records and redacted architecture screenshots. The public repo should be useful without disclosing your own job applications.
