# Shanjian Platform Payload + Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `shanjian-platform/` as a production-oriented Next.js + Payload CMS v2 while leaving `shanjian-agent/` untouched.

**Architecture:** Scaffold a Payload 3 blank app, keep Payload Admin as the first institutional staff surface, and build a restrained public Next.js route group for project registry, project detail and help-intention registration. Move charity-specific rules into pure TypeScript domain modules so UI and Payload collections share the same tested behavior.

**Tech Stack:** Next.js, React, Payload CMS 3.85.2, `@payloadcms/db-sqlite`, TypeScript, Vitest, Testing Library, plain CSS with self-owned shadcn-style primitives.

---

## File Map

- Create `shanjian-platform/`: independent Payload + Next.js app.
- Create `shanjian-platform/src/domain/charity.ts`: enums, labels, shared domain types and formatting helpers.
- Create `shanjian-platform/src/domain/discernment.ts`: deterministic four-discernment report builder.
- Create `shanjian-platform/src/domain/intentions.ts`: help-intention classification and matching.
- Create `shanjian-platform/src/domain/demoSeed.ts`: fictional seed data.
- Create `shanjian-platform/src/collections/*.ts`: Payload collection configs.
- Modify `shanjian-platform/src/payload.config.ts`: register collections and SQLite adapter.
- Create `shanjian-platform/src/app/(public)/*`: public registry, detail and intention routes.
- Create `shanjian-platform/src/components/ui/*`: Button, Badge, Field and simple layout primitives.
- Create `shanjian-platform/tests/domain/*.test.ts`: TDD coverage for custom logic.
- Create `shanjian-platform/tests/public/*.test.tsx`: public UI coverage.

## Task 1: Scaffold New Payload App

**Files:**

- Create: `shanjian-platform/`
- Modify: `shanjian-platform/package.json`

- [ ] **Step 1: Generate scaffold**

```bash
cd /Users/pc/Documents/shanjian-7.3
npx create-payload-app@3.85.2 shanjian-platform -t blank --use-npm --no-agent
```

Expected: `shanjian-platform/package.json`, `shanjian-platform/src/payload.config.ts` and Payload route files exist.

- [ ] **Step 2: Install test dependencies**

```bash
cd /Users/pc/Documents/shanjian-7.3/shanjian-platform
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: dependencies install without errors.

- [ ] **Step 3: Add test scripts**

Set `package.json` scripts to include:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

Expected: `npm test -- --runInBand` is not required; Vitest runs directly.

## Task 2: Domain Model And Demo Data

**Files:**

- Create: `shanjian-platform/src/domain/charity.ts`
- Create: `shanjian-platform/src/domain/discernment.ts`
- Create: `shanjian-platform/src/domain/intentions.ts`
- Create: `shanjian-platform/src/domain/demoSeed.ts`
- Create: `shanjian-platform/tests/domain/discernment.test.ts`
- Create: `shanjian-platform/tests/domain/intentions.test.ts`

- [ ] **Step 1: Write failing discernment test**

```ts
import { demoAidApplication } from '../../src/domain/demoSeed'
import { buildFourDiscernmentReport } from '../../src/domain/discernment'

it('flags privacy, reimbursement and missing-material risks for institutional review', () => {
  const report = buildFourDiscernmentReport(demoAidApplication)

  expect(report.goodAndHarm.map((risk) => risk.category)).toContain('privacy')
  expect(report.truth.map((risk) => risk.category)).toContain('reimbursement')
  expect(report.truth.map((risk) => risk.category)).toContain('missing_material')
  expect(report.humanChecklist).toContain('由机构工作人员作出最终救助和展示决定')
})
```

Run:

```bash
npm test -- tests/domain/discernment.test.ts
```

Expected: FAIL because domain modules do not exist yet.

- [ ] **Step 2: Implement minimal domain modules**

`charity.ts` defines `AidApplication`, `ResourceNeed`, `RiskSignal`, `FourDiscernmentReport`, `DonationIntention`, `DonationClassification`, `PublicProject`.

`discernment.ts` exports:

```ts
export function buildFourDiscernmentReport(application: AidApplication): FourDiscernmentReport
```

`demoSeed.ts` exports fictional `demoAidApplication` and `seedPublicProjects`.

Run:

```bash
npm test -- tests/domain/discernment.test.ts
```

Expected: PASS.

- [ ] **Step 3: Write failing intention test**

```ts
import { seedPublicProjects } from '../../src/domain/demoSeed'
import { classifyDonationIntention } from '../../src/domain/intentions'

it('classifies money intentions as registration without payment handling', () => {
  const result = classifyDonationIntention({
    projectId: seedPublicProjects[0].id,
    helpCategory: 'money',
    helpType: 'funding_intention',
    amountOrResource: '愿意支持5000元，由机构联系确认',
    city: '深圳',
    contact: 'contact@example.org',
    receiptNeed: true,
    message: '希望了解项目进展',
  }, seedPublicProjects)

  expect(result.categoryLabel).toBe('钱')
  expect(result.followUpScript).toContain('平台仅登记意向')
  expect(result.followUpScript).not.toContain('支付')
  expect(result.matchedNeedLabels.length).toBeGreaterThan(0)
})
```

Run:

```bash
npm test -- tests/domain/intentions.test.ts
```

Expected: FAIL until `intentions.ts` is implemented.

## Task 3: Payload Collections

**Files:**

- Create: `shanjian-platform/src/collections/Users.ts`
- Create: `shanjian-platform/src/collections/AidApplications.ts`
- Create: `shanjian-platform/src/collections/CaseReviews.ts`
- Create: `shanjian-platform/src/collections/PublicProjects.ts`
- Create: `shanjian-platform/src/collections/DonationIntentions.ts`
- Create: `shanjian-platform/src/collections/FeedbackReports.ts`
- Modify: `shanjian-platform/src/payload.config.ts`
- Create: `shanjian-platform/tests/domain/collections.test.ts`

- [ ] **Step 1: Write failing collection config test**

```ts
import { AidApplications } from '../../src/collections/AidApplications'
import { PublicProjects } from '../../src/collections/PublicProjects'
import { DonationIntentions } from '../../src/collections/DonationIntentions'

it('defines the core operational collection slugs', () => {
  expect(AidApplications.slug).toBe('aid-applications')
  expect(PublicProjects.slug).toBe('public-projects')
  expect(DonationIntentions.slug).toBe('donation-intentions')
})
```

Run:

```bash
npm test -- tests/domain/collections.test.ts
```

Expected: FAIL until collections are created.

- [ ] **Step 2: Implement collection configs**

Each collection exports a Payload `CollectionConfig`. Use `json` fields for repeated nested structures in the first milestone to reduce migration risk.

Required field names must match the design spec exactly for custom domain data:

```text
patientAlias, diseaseSummary, treatmentStage, region, remainingGap,
goodAndHarm, truth, humanChecklist,
helpCategory, helpType, amountOrResource, followUpScript
```

Run:

```bash
npm test -- tests/domain/collections.test.ts
npm run generate:types
```

Expected: tests pass and Payload types generate.

## Task 4: Public Registry UI

**Files:**

- Create/modify: `shanjian-platform/src/app/(public)/page.tsx`
- Create: `shanjian-platform/src/app/(public)/projects/page.tsx`
- Create: `shanjian-platform/src/app/(public)/projects/[slug]/page.tsx`
- Create: `shanjian-platform/src/components/public/ProjectRegistry.tsx`
- Create: `shanjian-platform/src/components/public/ProjectDetailView.tsx`
- Create: `shanjian-platform/src/components/ui/Button.tsx`
- Create: `shanjian-platform/src/components/ui/Badge.tsx`
- Modify: `shanjian-platform/src/styles/globals.css` or generated global CSS file.
- Create: `shanjian-platform/tests/public/project-registry.test.tsx`

- [ ] **Step 1: Write failing public registry test**

```tsx
import { render, screen } from '@testing-library/react'
import { ProjectRegistry } from '../../src/components/public/ProjectRegistry'
import { seedPublicProjects } from '../../src/domain/demoSeed'

it('renders de-identified projects without payment CTA', () => {
  render(<ProjectRegistry projects={seedPublicProjects} />)

  expect(screen.getByText('公众项目展示')).toBeInTheDocument()
  expect(screen.getByText(seedPublicProjects[0].patientAlias)).toBeInTheDocument()
  expect(screen.queryByText('立即支付')).not.toBeInTheDocument()
  expect(screen.getAllByText(/登记帮助意向/).length).toBeGreaterThan(0)
})
```

Run:

```bash
npm test -- tests/public/project-registry.test.tsx
```

Expected: FAIL until component exists.

- [ ] **Step 2: Implement registry and detail components**

Implement registry as an operational project list:

- Left area: project rows/cards.
- Right/secondary areas: status, real needs, compliance notice.
- CTA label: `登记帮助意向`.
- No hero marketing layout.

Run:

```bash
npm test -- tests/public/project-registry.test.tsx
```

Expected: PASS.

## Task 5: Help Intention Form

**Files:**

- Create: `shanjian-platform/src/app/(public)/intentions/new/page.tsx`
- Create: `shanjian-platform/src/components/public/IntentionRegistrationForm.tsx`
- Create: `shanjian-platform/tests/public/intention-form.test.tsx`

- [ ] **Step 1: Write failing form test**

```tsx
import { render, screen } from '@testing-library/react'
import { IntentionRegistrationForm } from '../../src/components/public/IntentionRegistrationForm'
import { seedPublicProjects } from '../../src/domain/demoSeed'

it('labels the public action as intention registration rather than payment', () => {
  render(<IntentionRegistrationForm project={seedPublicProjects[0]} />)

  expect(screen.getByRole('heading', { name: '登记帮助意向' })).toBeInTheDocument()
  expect(screen.getByText(/平台仅登记帮助意向/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /支付/ })).not.toBeInTheDocument()
})
```

Run:

```bash
npm test -- tests/public/intention-form.test.tsx
```

Expected: FAIL until form exists.

- [ ] **Step 2: Implement form**

Fields:

- help category
- help type
- amount/resource description
- city
- contact
- receipt need
- message

The submit button label is `生成机构跟进建议`; it must not say payment or donation checkout.

Run:

```bash
npm test -- tests/public/intention-form.test.tsx
```

Expected: PASS.

## Task 6: Final Verification

**Files:**

- Modify: `shanjian-platform/README.md`

- [ ] **Step 1: Document local run**

README must include:

```bash
npm install
npm run dev
npm test
npm run build
```

It must also state:

```text
平台不自营公开募捐，不代收善款，不建立资金池。
```

- [ ] **Step 2: Run full checks**

```bash
cd /Users/pc/Documents/shanjian-7.3/shanjian-platform
npm test
npm run build
```

Expected: both commands exit 0.

