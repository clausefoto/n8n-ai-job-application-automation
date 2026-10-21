# n8n workflow exports

The live n8n workflow JSON exports are intentionally **not included** in this initial documentation package.

Planned sanitized exports:
- `job-discovery.sanitized.json`
- `application-generator.sanitized.json`

Before committing:
1. Export a copy from n8n; never export actual credentials or execution histories.
2. Remove private resource IDs, credential metadata, webhook URLs, pinned data, personal profile information, and secrets in all node fields and Code-node strings.
3. Audit with `python scripts/audit_n8n_export.py workflows/your-export.sanitized.json`.
4. Review the complete file manually and test an import with fictional sample data.

These are intended as reference workflows. Users must supply their own service credentials, templates, and a verified personal career profile.
