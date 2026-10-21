# AI-Assisted Job Search & Application Automation

**A self-hosted n8n project that discovers and scores job listings, then helps prepare tailored applications with two-stage AI review and styled Google Docs templates.**

Built with **n8n, Docker / Unraid, Apify, JavaScript, OpenAI, and Google Sheets / Drive / Docs APIs**.

> **Human in the loop:** Jobs are selected manually for application preparation. This project does not automatically submit job applications.

![Overview of the two branches of the n8n workflow](docs/images/workflow-overview.svg)

## What it does

This is **one n8n workflow containing two branches**, rather than two separate n8n workflows:

1. **Job discovery and scoring:** A scheduled Apify **Indeed** search gets new Systems Administrator listings; an upsert into Google Sheets uses the listing's `Link` as the matching key. A second stage reads jobs without ratings, asks an AI model to evaluate fit, and stores a numeric rating with an explanation.
2. **Application preparation:** After a job is marked `Make Cover` in Sheets, the workflow loads a verified career profile, drafts a tailored résumé and cover letter, performs an additional AI review, validates the result, creates formatted Google Docs from templates, and stores both document links in the original job row.

The sample configuration shows both schedule triggers **disabled**. Manual testing is possible, but scheduling must be deliberately enabled after setup and testing.

## Technical highlights

- Multi-service orchestration in self-hosted **n8n** running in Docker on Unraid.
- **Apify** actor + dataset consumption, with results stored in **Google Sheets** using the `Link` field for row matching.
- Independent **AI job scoring** and **two-step application drafting/review**.
- **JavaScript Code nodes** for validating model-generated JSON, preserving item relationships, splitting résumé and cover-letter records, and grouping final document URLs.
- **Google Drive** template copying and **Google Docs** `documents.batchUpdate` / `replaceAllText` for consistent formatting.
- Conditional résumé templates for jobs with or without a relevant personal projects section.
- OAuth-based Google API integration, structured-data processing, debugging of item links, and handling API quota limits.
- Manual selection and final document review before an application is sent to an employer.

## Dashboard guide

The private Google Sheets dashboard supports job review, application tracking, interest decisions, and generated document links. See the [dashboard guide](docs/dashboard.md) and [illustrative screenshots](docs/screenshots.md). The screenshots use fictional data; the live dashboard and Sheet are private.




## Workflow layout

```mermaid
flowchart TB
  subgraph D[Discovery and rating]
    A[Scheduled Indeed search] --> B[Apify actor and dataset]
    B --> C[Append or update job in Google Sheets]
    C --> E[Get unrated rows]
    E --> F[AI fit rating]
    F --> G[Write score and explanation]
  end
  subgraph P[Application preparation]
    H[Selected pending rows] --> I[Load private career profile]
    I --> J[AI résumé and cover letter]
    J --> K[AI factual/editorial review]
    K --> L[Validate + prepare two items]
    L --> M[Build Google Docs replacements]
    M --> N[Copy styled template]
    N --> O[Insert text with Docs API]
    O --> Q[Group document links by Link]
    Q --> R[Update matching Sheets row]
  end
```

See the [node-level architecture guide](docs/architecture.md) for exact exported node names and data handling.

## Project contents

```text
.
├── README.md
├── docs/
│   ├── architecture.md
│   ├── setup.md
│   ├── security.md
│   ├── troubleshooting.md
│   ├── screenshots.md
│   └── images/workflow-overview.png
├── workflows/
│   ├── indeed-job-discovery-and-application-generator.sanitized.json
│   └── README.md
├── scripts/audit_n8n_export.py
├── examples/sample-job.json
└── .gitignore
```

The [workflow export](workflows/indeed-job-discovery-and-application-generator.sanitized.json) is a **sanitized demonstration** of the actual node graph, **not a live configuration**. It contains fictional candidate data and placeholder IDs, and deliberately excludes service credentials and execution/pinned data. You must provide your own authorized service accounts, Sheets and Docs resources, and verified candidate details.

## Dashboard

| Field | Purpose |
| --- | --- |
| `Link` | Unique job URL, used as the row-matching key |
| `Rating` / `Score breakdown` | Job-fit rating and justification |
| `Make Cover` | Human selection flag |
| `Resume` | Link to generated styled Google Doc |
| `Cover Letter` | Link to generated styled Google Doc |

Other tracked fields include job title, description, company, date, salary, work arrangement, and job type.

## Setup

Start with [docs/setup.md](docs/setup.md), then consult the [security checklist](docs/security.md). The recommended test is one fictional job with both documents verified before making the workflow accessible to live data.

## Decisions and trade-offs

- **Prevent silent omissions:** Validate AI output rather than assume the reviewer preserved all résumé positions and bullets.
- **Keep a stable job key:** Use the `Link` column to update the correct existing row, not the Sheet row number.
- **Separate content from presentation:** AI produces structured text; Google Docs templates preserve visual formatting.
- **Support optional projects:** Use two résumé templates to avoid blank sections and leftover horizontal rules.
- **Control AI behavior:** Career information must come from verified profile data, not from unsupported job-posting claims.
- **Avoid autonomous applications:** Final application submission is outside this automation.

## Current limitations and next steps

- The exported rating prompt currently **hard-codes benefits and full-time status**; these should instead use actual job data, with unknown values handled explicitly.
- Selected portions of the document-handling pipeline still depend on item ordering. Robust keyed joins and idempotent retries would strengthen reliability.
- The export contains an example résumé with fixed experience-placeholder expectations. A reusable product should make role count, names, and formatting data-driven.
- Resume page length is not yet automatically validated; PDF export, quality checks, and document versioning are potential additions.
- Both schedule triggers are disabled in the shared export.

This is a **personal automation / systems-integration portfolio project**, not an autonomous application service or a production-ready product.

## License

No license selected yet. See the repository owner for permissions to reuse or redistribute.
