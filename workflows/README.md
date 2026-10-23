# Combined n8n workflow export

`indeed-job-discovery-and-application-generator.sanitized.json` is a privacy-safe example of the **23-node workflow** reflected in the latest export (October 2026).

It contains **two branches**: job discovery/eligibility/100-point rating, and manual-selection résumé/cover-letter drafting with AI review and Google Docs templates.

## Latest architecture changes

- Added **Filter Non-remote and Military jobs** to analyze location and clearance restrictions rather than trusting the `Remote` flag.
- Added **Update Google Sheet Ratings1** to write automatic rejection ratings and reasons.
- Added **Grab additional pending rating Rows** so the full scorer reads only jobs still missing a rating.
- Added **Load Rating Career Profile** for 50/25/25 career-fit / salary / benefits evaluation.
- The résumé document-check trigger changed to **every 15 minutes**.
- The source workflow uses separate AI models for filtering, rating, drafting and final review.

## Safety and customization

- **Both schedule triggers are disabled.**
- Credential references, private Google and Apify identifiers, execution data and pinned results are removed.
- The real career profiles and identifying details are replaced with fictional examples.
- The AI prompts use the privacy-safe public versions from [../prompts/](../prompts/README.md), not raw personal prompt data.
- You must provide your own authorized credentials, actors, spreadsheets, folder and template IDs, and verified career information.
- The code and Docs templates still assume certain role names and experience fields. Adapt them to your own career profile before use.

This is a demonstrative project export, **not** an autonomous job application service. Final application submission requires human action.

See [Setup](../docs/setup.md), [Architecture](../docs/architecture.md), and [Security](../docs/security.md).
