# Draft release review — 24 October 2026

Removed missed homepage/questions/fee-page and postcode-tool Kerrigans referrals. Removed the unused featured-agent record. Paused the email-only editorial recommendation endpoint and hid its form until durable storage, privacy and mailbox checks are approved. Added a real privacy page and footer link. Updated compatible vulnerable dependencies. Fixed the existing mobile-menu implicit-any type error.

Validation: local build and typecheck pass. Dependency audit is recorded in the sprint evidence. Best additionally runs its SEO and postcode checks. These are local checks, not live lead capture or deliverability tests.

Release gate: owner approves the exact commit, rendered legal/editorial copy, destinations and local test evidence. No release or preview is authorised here. The primary site intake stays closed until its separate D1/mailbox/privacy/staging gates pass. Referral suspensions remain in force. No personal data is sent through guide links.

Push only with the documented [CI Skip] commit prefix to prevent automatic Pages preview deployment; verify production deployment hash stays unchanged. Never merge or deploy without explicit release approval.

Rollback: revert the approved owned-site commit through a separately approved release. Preserve enquiry records and retention obligations. Never reactivate suspended referrals.
