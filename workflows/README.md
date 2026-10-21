# Combined n8n workflow export

[`indeed-job-discovery-and-application-generator.sanitized.json`](indeed-job-discovery-and-application-generator.sanitized.json) is the **sanitized 19-node workflow** from the project's combined discovery, scoring, and application-preparation canvas.

It contains **two branches within one n8n workflow**:
1. **Indeed discovery and AI job scoring** through Apify, Google Sheets, and OpenAI.
2. **Manually selected application preparation** through two AI calls, JavaScript Code nodes, Google Drive template copying, the Google Docs API, and Google Sheets link updates.

This is a **demonstration/reference export**, not the original live configuration. It includes fictional candidate data and placeholder identifiers. Credentials and pinned execution data are intentionally excluded. Both schedule triggers are disabled.

To use it, import the JSON in n8n, configure your own credentials, actor and document resource IDs, and replace the fictional profile with accurate private information. The current AI/JavaScript formatting expects particular experience roles and is **not a generic résumé product**.

Refer to [Setup](../docs/setup.md), [Architecture](../docs/architecture.md), and [Security](../docs/security.md). Review job-rating assumptions before using scores for real decisions.
