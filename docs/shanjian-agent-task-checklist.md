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

- [ ] Define `AidApplication`, `PublicProject`, `DonationIntention`, `FourDiscernmentReport`.
- [ ] Define `ResourceNeed`, `HelpCategory`, `ProjectQuestion`, `ProjectAnswer`.
- [ ] Seed fictional acute leukemia child aid case.
- [ ] Seed three public project cards.
- [ ] Implement deterministic intake structuring agent.
- [ ] Implement deterministic four-discernment agent.
- [ ] Implement public project generation agent.
- [ ] Implement AI问项目 agent.
- [ ] Implement donation-intention classification agent.
- [ ] Support money/material/service donation categories.
- [ ] Capture beneficiary-stated real needs and low-barrier narrative input.
- [ ] Implement feedback draft generator.

## Phase 2: App Shell And Navigation

- [ ] Home starts as `公众项目展示`.
- [ ] Right top nav includes `求助申请入口`.
- [ ] Right top nav includes `机构四辨工作台`.
- [ ] Right top nav includes `捐助意向管理`.
- [ ] Mobile nav wraps without overflow.

## Phase 3: Public Home

- [ ] Show compliance notice.
- [ ] Show project metrics.
- [ ] Show de-identified project cards.
- [ ] Show project detail and progress timeline.
- [ ] Show AI问项目 questions and answers.
- [ ] Show `我要帮助` as intention registration, not payment.

## Phase 4: Aid Application Entry

- [ ] Show large-illness aid application form.
- [ ] Include disease, treatment, expense, reimbursement, family burden and materials.
- [ ] Include privacy and institution review consent.
- [ ] Generate structured case file.
- [ ] Generate missing-material checklist.

## Phase 5: Institutional Four-Discernment Workbench

- [ ] Show case summary.
- [ ] Show evidence map.
- [ ] Show 辨善恶.
- [ ] Show 辨真伪.
- [ ] Show 辨大小.
- [ ] Show 辨远近.
- [ ] Show human review checklist.
- [ ] Provide decision buttons: request materials, reject, approve display, offline follow-up.

## Phase 6: Donation Intention Management

- [ ] Show existing help intentions.
- [ ] Show help-intention form.
- [ ] Help categories include money, materials, services.
- [ ] Help types include funding intention, medical resource, drug resource, nutrition, accommodation, transportation, volunteer escort, policy consultation, psychological support, propagation, corporate support.
- [ ] AI classifies intention.
- [ ] AI matches to beneficiary-stated real needs.
- [ ] AI generates institution follow-up script.
- [ ] UI states platform does not collect money.

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
