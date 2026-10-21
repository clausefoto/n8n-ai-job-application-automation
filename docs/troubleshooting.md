# Troubleshooting and lessons learned

## Google Sheets API read quota exceeded

Avoid per-row reads in tight loops. Read existing rows in batches, deduplicate locally where possible, and rate-limit writes. Google Sheets per-user read quotas can be triggered quickly by repeated polling.

## OAuth redirect opens localhost on the wrong computer

n8n may run on another host while OAuth uses localhost. Configure Google OAuth redirect URIs to match n8n's reachable callback URL. During local debugging, SSH port forwarding can expose the callback on the browser machine. Do not share the private callback or credentials publicly.

## Code node sees Sheet columns instead of AI response

Inspect the preceding node and its actual JSON. When fields such as `Link`, `Resume`, and `Cover Letter` appear instead of the AI `output`, check the workflow connections. `$input.all()` reads the immediate upstream node.

## Missing résumé or cover letter

The two-stage AI process returns structured `resume` and `cover_letter` objects. Parse the model's actual output text, not a guessed array position. Validate work-history entries and achievement counts; never silently produce incomplete applications.

## Invalid or undefined document_type

Every item leaving the document preparation stage must carry `document_type` set to `resume` or `cover_letter`. Downstream nodes must preserve it.

## Cannot access hasProjects before initialization

Declare `let hasProjects = false` once before the document-type conditional. Later **assign** `hasProjects = Boolean(projects.trim())` without redeclaring it.

## Empty projects section leaves a horizontal line

Google Docs keeps an empty paragraph's border even if `replaceAllText` replaces its placeholder with empty text. Use a separate no-project résumé template.

## Google Drive returned no file ID

Check ordering: Build Template Replacements → Drive Copy → Attach Copied File ID → Docs HTTP Request. Drive Copy usually returns `id`; Google Docs batchUpdate returns `documentId`.

## Matching files back to jobs

Use the original normalized `Link` to identify the Sheet row. When using arrays to associate Drive results with earlier document items, verify counts and ordering. Preserve item-link metadata where possible.

## Résumé spills onto a second page

Prioritize accurate experience over strict one-page limits. Keep paragraph spacing compact, manage the skills section, and verify actual Google Docs formatting. Avoid removing entire prior roles simply to save space.
