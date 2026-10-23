# Public n8n AI prompt library

These prompts are reusable public templates derived from the working n8n workflow. The goal is to document how the AI nodes operate **without publishing a real applicant's identity, employment history, or private career profile**.

| AI node | First message | Second message |
| --- | --- | --- |
| Filter Non-remote and Military jobs | [System](eligibility-filter.system.txt) | [User](eligibility-filter.user.txt) |
| Rate pending Jobs | [System](rate-pending-jobs.system.txt) | [User](rate-pending-jobs.user.txt) |
| Create Resume and Cover Letter | [System](create-resume-and-cover-letter.system.txt) | [User](create-resume-and-cover-letter.user.txt) |
| Review Application Documents | [System 1](review-application.system-1.txt) | [System 2](review-application.system-2.txt) |

## Privacy and source notes

- **Eligibility:** Geographic preferences are placeholders. Replace `[HOME_STATE_OR_REGION]` and `[ALLOWED_ONSITE_OR_HYBRID_LOCATIONS]` with the candidate's permitted locations before use. Three malformed JSON examples in the original were corrected.
- **Rating:** The example uses a $100,000 salary preference and 50/25/25 scoring split (career fit / salary / benefits). Customize salary preferences for each candidate; the prompt should not assume previous pay.
- **Resume and review:** Hard-coded candidate names, past employer names, dates, technical background details, and project-history claims were generalized. The verified career profile supplied at runtime is the source of truth.
- **Review:** Both messages were configured as `system` messages in the source workflow, even though the second supplies the application data and review request.
- **n8n expressions:** Some messages begin with `=` or contain `{{ ... }}` expressions, which need the correct Expression mode and upstream node names.
- These files **are not byte-for-byte copies** of the private workflow. They intentionally exclude identifying candidate facts, credentials, actual profile data, private IDs, and real job applications.
- The separately published sanitized workflow export represents a different, earlier snapshot and may have different prompts.

## Behavior

The eligibility filter can assign `Rating=0` and explain the rejection with the `Not Interested Reason` field. Jobs that proceed to full rating are assessed using career fit (50 points), salary (25), and benefits (25). The other AI steps produce and review résumé and cover-letter JSON grounded in the verified candidate profile.
