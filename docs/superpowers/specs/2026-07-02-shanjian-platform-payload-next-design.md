# 善见 Platform Payload + Next.js Design

Date: 2026-07-02

## 1. Goal

Build a production-oriented v2 beside the existing demo:

```text
/Users/pc/Documents/shanjian-7.3/shanjian-platform
```

The existing `shanjian-agent/` Vite demo stays intact as a reference and hackathon artifact. The new `shanjian-platform/` becomes the commercializable system foundation for public project display, institutional case intake, four-discernment review, help-intention management and feedback reporting.

## 2. Product Read

This is an institutional public-service case management product, not a marketing site and not a personal fundraising platform.

Design language:

- Serious, calm, operational and audit-friendly.
- Dense enough for repeated staff use, but not cluttered.
- Public pages should feel trustworthy and restrained.
- Admin pages should prioritize scanability, status, evidence and next action.

Non-negotiable product boundaries:

- No real payment.
- No platform-side money custody.
- No self-operated public fundraising.
- No real patient data in local seed data.
- No AI-only approval.
- No medical diagnosis or treatment advice.

## 3. Architecture

Use a new full-stack Next.js application with Payload CMS embedded in the same app.

Payload is suitable here because current official docs describe it as a Next.js-native CMS / app framework with Admin Panel, REST and GraphQL routes inside the Next app. Official docs also list SQLite, Postgres and MongoDB as supported database adapters.

Local development database:

```text
SQLite through @payloadcms/db-sqlite
```

Commercial deployment path:

```text
Postgres through @payloadcms/db-postgres
```

The first implementation uses SQLite to keep local setup easy. Data model boundaries must remain compatible with Postgres so the project can move later without changing product logic.

## 4. Directory Shape

Target shape:

```text
shanjian-platform/
  package.json
  next.config.mjs
  payload.config.ts
  tsconfig.json
  src/
    app/
      (payload)/
        admin/
        api/
      (public)/
        layout.tsx
        page.tsx
        projects/
          page.tsx
          [slug]/
            page.tsx
        intentions/
          new/
            page.tsx
    collections/
      Users.ts
      AidApplications.ts
      CaseReviews.ts
      PublicProjects.ts
      DonationIntentions.ts
      FeedbackReports.ts
    domain/
      charity.ts
      demoSeed.ts
      discernment.ts
      intentions.ts
    components/
      public/
      workbench/
      ui/
    styles/
      globals.css
  tests/
    domain/
    public/
```

If `create-payload-app` generates a slightly different canonical structure, keep the generated Payload route files intact and adapt the public app into a clearly named route group.

## 5. Core Collections

### Users

Payload auth collection for institutional users.

Required fields:

- `name`
- `email`
- `role`: `admin`, `reviewer`, `coordinator`, `viewer`
- `organizationName`

Access intent:

- Admin can manage users and all records.
- Reviewer can review applications and case reviews.
- Coordinator can manage help intentions and feedback reports.
- Viewer can read approved public projects.

### AidApplications

Institution-side intake object.

Required fields:

- `patientAlias`
- `applicantRole`
- `diseaseSummary`
- `treatmentStage`
- `region`
- `expenseTotal`
- `paidAmount`
- `reimbursementEstimate`
- `remainingGap`
- `familyBurden`
- `requestedNeeds`
- `materialNotes`
- `rawNarrative`
- `consentForInstitutionReview`
- `consentForDeidentifiedDisplay`
- `status`: `draft`, `submitted`, `needs_materials`, `under_review`, `approved`, `rejected`, `published`

### CaseReviews

Four-discernment review report tied to an application.

Required fields:

- Relationship to `AidApplications`
- `goodAndHarm`
- `truth`
- `scaleUrgency`
- `scaleRationale`
- `resourceGap`
- `proximity`
- `humanChecklist`
- `decision`: `request_materials`, `reject`, `approve_display`, `offline_follow_up`
- `reviewSource`: `deterministic`, `local_llm`, `manual`

### PublicProjects

Public de-identified display object.

Required fields:

- Relationship to `AidApplications`
- `slug`
- `patientAlias`
- `diseaseLabel`
- `region`
- `status`: `urgent`, `in_treatment`, `awaiting_materials`, `receiving_intentions`, `completed`
- `verifiedNeed`
- `resourceGap`
- `needs`
- `progress`
- `story`
- `evidenceSummary`
- `feedback`
- `isPublished`

### DonationIntentions

Public help intention record. It is not a payment record.

Required fields:

- Relationship to `PublicProjects`
- `helpCategory`: `money`, `materials`, `services`
- `helpType`
- `amountOrResource`
- `city`
- `contact`
- `receiptNeed`
- `message`
- `classification`
- `matchedNeedLabels`
- `followUpScript`
- `status`: `new`, `matched`, `contacted`, `closed`

### FeedbackReports

Institution-reviewed feedback drafts.

Required fields:

- Relationship to `PublicProjects`
- Relationship to `DonationIntentions`
- `draft`
- `requiresInstitutionReview`
- `status`: `draft`, `reviewed`, `published`

## 6. Public User Flow

The public route group starts with real project data, not a landing-page pitch.

Pages:

- `/`: public project index.
- `/projects`: same index route or redirect target.
- `/projects/[slug]`: project detail with progress, evidence summary, real needs and AI question panel.
- `/intentions/new?project=<slug>`: help-intention registration form.

Public copy must always state:

```text
平台仅登记帮助意向，不在平台内收款。
真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
```

## 7. Staff Flow

Payload Admin handles the first staff-facing version:

1. Staff creates or opens an `AidApplication`.
2. Staff reviews structured fields and material notes.
3. Staff creates a `CaseReview` using deterministic four-discernment helpers.
4. Staff records a human decision.
5. If approved, staff creates or publishes a `PublicProject`.
6. Coordinator reviews `DonationIntentions`.
7. Coordinator generates or edits `FeedbackReports`.

A custom workbench UI can be added after the data model stabilizes. The first milestone should not fight Payload Admin; it should use Payload Admin as the commercial-grade operational surface.

## 8. Domain Logic

Move mature parts of the old deterministic agent logic into pure TypeScript modules:

- `discernment.ts`: build a four-discernment report from application facts.
- `intentions.ts`: classify and match help intentions to project needs.
- `charity.ts`: shared enums, labels and formatting helpers.
- `demoSeed.ts`: fictional seed data only.

Domain modules must not import React, Payload Admin components or browser globals. They should be directly testable.

## 9. UI System

Use self-owned shadcn-style components for the public app:

- Button
- Badge
- Card only for repeated records
- Field
- Select
- Textarea
- StatusRail
- EvidenceList
- NeedList

Visual constraints:

- No purple-blue AI gradient theme.
- No hero marketing page.
- No nested cards.
- No visible product tutorial text.
- Buttons and form controls must have clear focus and error states.
- Public index should read as a project registry.
- Staff work stays inside Payload Admin for the first milestone.

## 10. Testing Strategy

Test first for custom logic and public workflows.

Required first tests:

- Domain test: four-discernment report includes human checklist, privacy risk and reimbursement/material risk.
- Domain test: help intention classification maps money/material/service to matching needs and follow-up script.
- Public page test: project index renders seeded de-identified project and no payment CTA.
- Public form test: intention form labels the action as registration, not payment.

Payload-generated admin internals should not be heavily unit-tested. Instead, test collection configs enough to confirm required slugs and field names exist.

## 11. Migration Boundary

Do not edit or delete `shanjian-agent/` during the initial v2 build.

Allowed shared source:

- Product language from `ai-charity-hackathon-pack.md`.
- Data shape and fictional demo data from `shanjian-agent/src/domain/*`.
- Compliance copy from current README / UI.

Do not directly copy the old single-page UI structure.

## 12. First Milestone Acceptance Criteria

The first milestone is accepted when:

- `shanjian-platform/` runs as an independent Next + Payload app.
- Payload Admin is available.
- Collections for applications, reviews, public projects, intentions and feedback exist.
- Seeded fictional data renders on the public project index.
- A project detail page shows needs, evidence and progress.
- Help-intention form creates or at least validates a non-payment intention flow.
- Domain tests pass.
- Build passes.
- Existing `shanjian-agent/` remains untouched by the migration.

