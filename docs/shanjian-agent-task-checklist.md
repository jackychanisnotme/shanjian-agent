# 善见 Agent Task Checklist

Use this as the short execution tracker. The detailed plan lives at:

```text
docs/superpowers/plans/2026-06-30-shanjian-agent-mvp-implementation.md
```

## Phase 0: Setup

- [x] Create standalone app at `shanjian-agent/`.
- [x] Use Vite + React + TypeScript.
- [x] Install `lucide-react`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- [x] Verify `npm test` and `npm run build`.

## Phase 1: Domain And Agent Core

- [x] Define `AidApplication`, `PublicProject`, `DonationIntention`, `FourDiscernmentReport`.
- [x] Define `ResourceNeed`, `HelpCategory`, `ProjectQuestion`, `ProjectAnswer`.
- [x] Seed fictional acute leukemia child aid case.
- [x] Seed three public project cards.
- [x] Implement deterministic intake structuring agent.
- [x] Implement deterministic four-discernment agent.
- [x] Implement public project generation agent.
- [x] Implement AI问项目 agent.
- [x] Implement donation-intention classification agent.
- [x] Support money/material/service donation categories.
- [x] Capture beneficiary-stated real needs and low-barrier narrative input.
- [x] Implement feedback draft generator.

## Phase 2: App Shell And Navigation

- [x] Home starts as `公众项目展示`.
- [x] Right top nav includes `求助申请入口`.
- [x] Right top nav includes `机构四辨工作台`.
- [x] Right top nav includes `捐助意向管理`.
- [x] Mobile nav wraps without overflow.

## Phase 3: Public Home

- [x] Show compliance notice.
- [x] Show project metrics.
- [x] Show de-identified project cards.
- [x] Show project detail and progress timeline.
- [x] Show AI问项目 questions and answers.
- [x] Show `我要帮助` as intention registration, not payment.

## Phase 4: Aid Application Entry

- [x] Show large-illness aid application form.
- [x] Include disease, treatment, expense, reimbursement, family burden and materials.
- [x] Include privacy and institution review consent.
- [x] Generate structured case file.
- [x] Generate missing-material checklist.

## Phase 5: Institutional Four-Discernment Workbench

- [x] Show case summary.
- [x] Show evidence map.
- [x] Show 辨善恶.
- [x] Show 辨真伪.
- [x] Show 辨大小.
- [x] Show 辨远近.
- [x] Show human review checklist.
- [x] Provide decision buttons: request materials, reject, approve display, offline follow-up.

## Phase 6: Donation Intention Management

- [x] Show existing help intentions.
- [x] Show help-intention form.
- [x] Help categories include money, materials, services.
- [x] Help types include funding intention, medical resource, drug resource, nutrition, accommodation, transportation, volunteer escort, policy consultation, psychological support, propagation, corporate support.
- [x] AI classifies intention.
- [x] AI matches to beneficiary-stated real needs.
- [x] AI generates institution follow-up script.
- [x] UI states platform does not collect money.

## Phase 7: Feedback And Demo

- [ ] Generate transparent feedback draft.
- [ ] Feedback says it needs institution review.
- [ ] README explains AI问项目 and money/material/service matching.
- [ ] README documents compliance boundary.
- [ ] DEMO.md explains 3-minute pitch flow.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Open in browser and verify desktop.
- [ ] Open in browser and verify mobile.

## Non-Negotiables

- [ ] No real payment.
- [ ] No platform-side money custody.
- [ ] No self-operated public fundraising.
- [ ] No real patient data upload in demo.
- [ ] No AI-only approval.
- [ ] No medical diagnosis or treatment advice.
- [ ] No dramatic tragedy-marketing UI.
- [ ] Compliance boundary visible in UI.
