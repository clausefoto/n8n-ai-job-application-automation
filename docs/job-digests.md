# Scheduled job digests — setup and testing

This folder contains three related **sanitized example workflows**:

- `indeed-job-discovery-and-application-generator.sanitized.json` — existing discovery, eligibility and rating flow, now **27 nodes** with first-seen tracking and a **disabled** post-scoring digest call.
- `post-run-telegram-digest.sanitized.json` — **5-node child workflow**. Sends a Telegram report for each completed discovery run (8 AM, noon, 4 PM, 8 PM Pacific when the parent schedule is enabled).
- `daily-9pm-email-and-telegram-digest.sanitized.json` — **7-node nightly workflow**. Sends a 9 PM Pacific HTML **email table** and Telegram digest covering jobs first discovered today.

All workflows are **inactive public examples**. No private credentials, Sheet IDs, chat IDs, email recipients or dashboard deployment URLs are embedded.

## Sheet changes required

Add **two new columns** to your existing Google Sheets job database, spelling and capitalization exactly:

- `First Seen At`: Pacific calendar date in `YYYY-MM-DD` format saved the *first time* a job with a given `Link` is inserted.
- `First Seen Run ID`: n8n execution ID for the run that originally discovered that job.

The original `Date` column is the job board's **publication date**, not the date n8n found it. The new date is what the 9 PM summary uses. Format the column as **Plain text** to avoid Sheets date coercion. **Existing rows** will be left with empty first-seen values until you choose to backfill them. This is intentional to avoid incorrectly counting all historic rows as new jobs.

The first-seen guard runs **before** `Send to Google Sheets`: `Read Existing Jobs Before Upsert` → `Preserve First Seen Metadata`. It reads rows to preserve original dates for repeated listings and stamps only genuinely new links. The main Sheet still uses `Link` for upserts. It does not automatically overwrite older ratings.

## Import and configure

1. Back up your **live n8n workflow** and Google Sheet before editing. The parent JSON in GitHub is a public sample, not your fully connected working copy; **do not import it over your existing private workflow without comparing nodes and retaining credentials**. Instead, port the two new tracking nodes and the branch shown here, or selectively import the sample into a separate test workflow.
2. Add the two columns in Sheets.
3. In the parent workflow, connect the discovery dataset to `Read Existing Jobs Before Upsert` → `Preserve First Seen Metadata` → `Send to Google Sheets`, preserving the existing eligibility/rating path. Map the two new fields in `Send to Google Sheets`.
4. Import the **Post-Run Telegram Digest** workflow. Set its Google Sheet and tab in `Read Jobs for Run Digest`. In `Digest Configuration`, replace `YOUR_TELEGRAM_CHAT_ID` and `YOUR_DEPLOYMENT_ID`. Connect a Telegram Bot credential to the send node. Set the child trigger input to accept input from the parent workflow. Save it.
5. Back in the parent workflow, select that imported child in `Run Telegram Digest Subworkflow`, **enable the node**, and ensure the notification path remains **below** the main scoring path. The v1 execution order finishes the upper branch before the lower branch. The child receives the parent `runId`; its Sheet lookup returns only records first discovered by that run, now with their current ratings. It also produces a "no new jobs" summary if none matched.
6. Import the **Daily 9 PM Email and Telegram Digest** workflow. Configure its own Sheet/tab, Telegram credential, and Gmail OAuth credential. In `Digest Configuration`, replace `YOUR_EMAIL_ADDRESS`, `YOUR_TELEGRAM_CHAT_ID`, and `YOUR_DEPLOYMENT_ID`.
7. Verify the timezone in both workflows is **America/Los_Angeles**. The nightly schedule is `0 21 * * *`. Enable the nightly schedule only after testing. The parent sample's existing schedules are disabled for public safety.
8. Test one **new** listing and one **duplicate** listing to ensure the first-seen date and run ID remain unchanged on duplicates, and confirm the Google Sheets row count does not grow for repeat `Link` values.

### Alert contents

Every per-run Telegram summary includes title, company, a short description, employment type, rating, and a **specific dashboard deep link**. A 9 PM digest includes the same job data, grouped into a clear **HTML table** in Gmail and mobile-friendly entries on Telegram.

Links are built as:

```javascript
String(dashboardUrl).replace(/\/$/, '') + '?job=' + encodeURIComponent(job.Link)
```

The private dashboard must be deployed with the `?job=` deep-link support in the current GitHub `apps-script/Index.html`.

### Important reliability notes

- **Duplicate matches**: An existing job is not counted as "new" again because its original `First Seen At` and `First Seen Run ID` are retained.
- **Daily time window**: Reports use the Pacific calendar day. The 9 PM report only includes jobs discovered by the time it executes; jobs first seen later that evening will not appear in that 9 PM email. Consider the next morning's catch-up if late-night scans are added.
- **Ratings**: Post-run notifications start after the score-write branch in the current layout, but a failed AI run or delayed retry could leave some jobs unrated. The digest labels missing ratings as **Pending** rather than inventing values.
- **Volume**: Telegram limits text size. The sample chunks larger digests into messages around 3,400 characters. If your bot or channel has formatting limits, use no parse mode.
- **Quota**: The existing-row lookup and both digests add Sheets reads. Watch Google Sheets API quotas and use batching if jobs grow substantially.
- **Concurrency**: Overlapping discovery runs can both consider the same link new before their Sheet upserts finish. Consider an n8n concurrency limit of 1 for this discovery workflow and reliable idempotency if enabling simultaneous manual or scheduled runs.
- **Fault isolation**: If the Telegram send fails, avoid allowing it to roll back the scoring workflow; set up error handling or retry the child separately. Configure a dedicated error-notification workflow later.
- **Credentials and privacy**: Don't publish real deployment URLs, Chat IDs or personal email addresses, actual job data, or raw workflow exports to public Git.
- **No autonomous applications**: Summaries report jobs and dashboard links. Sending résumés or submitting applications still requires user selection and review.

## Validation checklist

- Import all public examples separately; confirm no credentials and no active triggers.
- Set and test your own credentials without publishing them to GitHub.
- First new test job has a nonempty `First Seen At` and `First Seen Run ID`.
- Rerun the same job: no new row and no changed first-seen metadata.
- One accepted job receives a 1–100 rating; a rejected job receives 0; both appear in summaries if first discovered within the window.
- The four scheduled run digests send to **Telegram only**, including an empty-run report when applicable.
- The 9 PM digest sends **one Gmail HTML table and a Telegram digest** (possibly chunked).
- Dashboard links open the **exact** job, not just the dashboard homepage.
- Use separate n8n test credentials or send only to a private test Telegram channel while validating.
