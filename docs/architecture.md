# Architecture and node reference

The current project has **one n8n workflow with two independent branches and 23 nodes**. Both branches share the Google Sheets job database. This page documents the latest provided n8n export (October 2026).

![Actual 23-node n8n workflow shown in the editor on October 23, 2026](images/n8n-workflow-screenshot-oct-2026.webp)

*Actual n8n editor screenshot of the current two-branch workflow. The [previous editor screenshot](images/n8n-workflow-screenshot.webp) documents an earlier iteration.*

For a simplified view of the same processing stages, see the [architecture schematic](images/workflow-schematic.svg).

## Branch A — Discover, screen and score jobs

**Sequence:**

1. **Update Jobs at 8am,12pm,4pm,8pm** triggers the Apify Indeed Systems Administrator search; **Get Jobs Dataset** collects results.
2. **Send to Google Sheets** upserts by `Link`. Existing rows retain their ratings when not explicitly overwritten.
3. **Grab pending rating Rows** loads jobs with an empty `Rating`.
4. **Filter Non-remote and Military jobs** examines the full description instead of trusting the remote metadata. The public prompt template anonymizes the user's allowed work locations. It identifies mandatory military/government clearance requirements.
5. **Update Google Sheet Ratings1** writes the eligibility outputs, using the same `Link`. Clearly rejected jobs receive `Rating=0`, plus `Not Interested` and `Not Interested Reason` fields.
6. **Grab additional pending rating Rows** re-reads still-unrated listings. This is an intentional second Sheet lookup, not a direct IF branch.
7. **Load Rating Career Profile** supplies a verified candidate profile to **Rate pending Jobs**.
8. The detailed AI scoring stage produces **1–100** based on **career fit (50) / salary (25) / benefits (25)**. **Update Google Sheet Ratings** writes `Rating` and `Score breakdown` back by `Link`.

The source export selects separate models for filtering (**GPT-6 Luna**) and scoring (**GPT-6.1 Sol**). Model choice is configurable and does not replace a review of actual classifications.

## Branch B — Create and review application documents

The schedule trigger **Resume Updates every 15 min** checks jobs manually flagged `Make Cover` in Sheets. The workflow loads **Load Career Profile**, then uses **Create Resume and Cover Letter** (GPT-6 Astra in the source) and **Review Application Documents** (GPT-6.1 Sol in the source).

Code nodes validate the review output, build separate résumé and cover-letter data items, and select appropriate Google Docs templates (with or without optional projects). Google Drive copies native Docs, the Docs API replaces template placeholders via `documents.batchUpdate`, and **Update Google Sheet Links** writes the two document URLs back using the original job `Link`.

**Applications are never submitted automatically.** Human review and application submission remain outside the workflow.

## Differences between public and private copies

The public [workflow export](../workflows/indeed-job-discovery-and-application-generator.sanitized.json) is a **23-node sanitized demonstration** with fictional career data, placeholder resource identifiers, no credentials or pinned data, and **both schedule triggers disabled**. It is not a working copy of the author's private automation.

The published [prompt library](../prompts/README.md) uses generalized prompts and privacy-safe examples. The private workflow and the public example may differ in profile content and exact wording.

## Implementation trade-offs and limitations

- **False positives:** Remote metadata can be misleading; the filter reads the actual description. Ambiguous listings should be reviewed instead of rejected without evidence.
- **Re-query cost:** Reading unrated Sheet rows twice separates rejection from full scoring, but increases Sheets API reads and may require batching or retry controls.
- **Identifier:** `Link` is the join key; URL parameter normalization and fully idempotent retry behavior still need stronger guarantees.
- **Candidate accuracy:** AI output must be grounded in a verified profile, and résumé/cover-letter JSON must be checked before use.
- **Profile format:** The current résumé templates and Code nodes still have role- and placeholder-specific expectations; replacing the fictional profile alone does not make this a general résumé product.
- **Privacy:** Never commit actual career profiles, OAuth credentials, resource IDs, or execution/pinned data.
