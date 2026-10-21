# Troubleshooting and lessons learned

These cases occurred during development of the **single combined n8n workflow**.

## Sheets read quota exceeded
Reading a spreadsheet once per row can exceed Google Sheets per-user quota limits. Read existing rows in batches, deduplicate locally where practical, and rate-limit API calls.

## Google OAuth callback on the wrong computer
A self-hosted n8n machine may be reached from a different browser machine. Match the authorized redirect URI to the actual callback URL; for local debugging an SSH tunnel can allow a localhost OAuth callback. Never publish the real callback or secrets.

## Code node receives Sheet fields instead of AI JSON
Use the input panel to verify the upstream connection. Fields such as `Link`, `Make Cover`, and `Resume` indicate a Sheets row rather than OpenAI JSON. `$input.all()` reads the direct upstream input.

## Missing résumé or cover letter from OpenAI
The OpenAI node may nest structured JSON within `output[].content[].text`. Inspect the actual output array rather than assuming index zero. Parse JSON and validate keys `resume` and `cover_letter`; never silently create an incomplete résumé.

## `source_index` missing or `document_type` undefined
The selected source index may not survive multi-step transformations. Keep `Link` and `document_type` on **each** prepared item, and use n8n item lineage or a verified matching key.

## `hasProjects` before initialization
Initialize `let hasProjects = false` once per processed document, then *assign* `hasProjects = Boolean(projects.trim())`. Don't redeclare with `const hasProjects` within the same scope.

## Empty project heading still leaves a border
Google Docs can preserve formatting for an empty paragraph even when its `replaceAllText` placeholder becomes an empty string. Choose a separate résumé template that physically omits the projects section.

## Copied Google Drive document ID missing
Correct order: `Build Template Replacements` → `Google Drive — Copy Template` → `Attach Copied File ID` → `HTTP Request` → `Prepare Document Links`. Drive Copy returns `id`, while Google Docs batchUpdate may return `documentId`.

## Missing experience bullets or title mismatch
The AI may shorten earlier work history or vary job titles. Validate required roles and minimum bullet counts before formatting; match job titles flexibly rather than silently leaving sections empty. Ensure the reviewer returns all required data without inventing facts.

## Education spills to page two
Use compact skills, paragraph spacing, and selected achievement counts. One page is not guaranteed for every job; prefer a complete two-page résumé over omitting earlier roles.

## Stable job identifiers and duplicates
The `Link` column is the matching key. However, some job URLs have tracking parameters. A URL-normalization pass and keyed joins would make deduplication and batch document assignment more reliable.

## Scoring assumptions
The current `Rate pending Jobs` prompt uses fixed `Benefits: Yes` and `Type: Full Time`. These may not reflect actual listing data. A future change should use the corresponding Sheet fields and account for unknowns.
