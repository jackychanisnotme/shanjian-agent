# 善见 Agent MVP Design

Date: 2026-06-30

## 1. Product Positioning

善见 Agent 是给有资质公益机构使用的大病救助项目系统。

It is not a personal-help platform, not a self-operated fundraising platform, and not a payment/custody system. It helps qualified institutions collect aid applications, run AI-assisted four-discernment review, publish de-identified project pages, collect public help intentions, and generate transparent feedback.

Core line:

```text
首页展示公众项目，后台承接求助申请、机构四辨审核和捐助意向管理。
```

Compliance boundary:

```text
平台不自营公开募捐，不代收善款，不建立资金池。
真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
黑客松 demo 使用虚构/脱敏数据；捐助功能只做意向登记，不产生真实支付。
```

## 2. MVP Information Architecture

```text
首页 / 公众项目展示
  -> 项目列表
  -> 项目详情
  -> 救助进展
  -> 成果反馈
  -> 我要帮助：捐助意向登记

右上角入口
  -> 求助申请入口
  -> 机构四辨工作台
  -> 捐助意向管理
```

The home page is public-facing. The three top-right entries go to separate functional backends.

## 3. Users And Jobs

Public visitor:

- Browse de-identified serious-illness aid projects.
- Understand project progress, verified need, and current resource gap.
- Submit help intention, such as funding intention, medical resource, drug resource, volunteer help, propagation support, or corporate support.

Aid applicant / family / volunteer:

- Submit serious-illness aid application.
- Provide disease summary, expense gap, insurance/reimbursement information, family burden, proof material notes, and privacy authorization.
- Receive AI-generated missing-material hints and a cleaner application packet.

Institution staff / hospital social worker:

- Review aid applications.
- Use AI-assisted four-discernment output: 辨善恶、辨真伪、辨大小、辨远近.
- Decide request补充材料, reject, approve for project display, or follow up offline.

Institution donation coordinator:

- Review public help intentions.
- Let AI classify, deduplicate, match and draft follow-up messages.
- Track follow-up status and generate feedback tasks.

## 4. Screens

### 4.1 Public Project Home

Purpose:

- Make the first screen show real project value and rescue outcomes.
- Avoid a marketing-style landing page.
- Present the platform as an institution-operated charity project system.

Main content:

- Project cards: anonymized patient label, disease type, aid stage, resource gap, verification status, latest progress.
- Filters: urgent, in treatment, awaiting materials, receiving help intentions, completed.
- Outcome band: total cases helped, matched intentions, completed feedback reports. In demo, these are simulated metrics.
- Project detail: de-identified story, evidence summary, progress timeline, help options, feedback section.
- Help button: opens donation-intention form, not payment.

Top-right entries:

- 求助申请入口
- 机构四辨工作台
- 捐助意向管理

### 4.2 Aid Application Entry

Purpose:

- Let applicants or volunteers submit materials to a qualified institution.
- Use AI to reduce messy intake, not to approve aid.

Fields:

- Applicant role: family, patient, volunteer, institution staff.
- Patient alias / anonymized label.
- Disease and treatment stage.
- Hospital / location.
- Expense total, paid amount, insurance/reimbursement estimate, remaining gap.
- Family burden summary.
- Material notes: diagnosis summary, expense list, invoices, proof of relationship, local civil-affairs note.
- Consent checkbox: institution review and de-identified public display after approval.

AI output:

- Structured case file.
- Missing-material checklist.
- Amount and timeline consistency hints.
- Privacy-risk hints.
- Institution-ready application summary.

### 4.3 Institutional Four-Discernment Workbench

Purpose:

- Give staff a review cockpit with evidence, risks, priority and next actions.
- AI provides suggestions and traces; humans make decisions.

Panels:

- Case summary: diagnosis, treatment stage, cost gap, insurance status, family burden.
- Evidence map: materials received, missing, conflicting, needs manual verification.
- 辨善恶: fraud risk, emotional overstatement, privacy harm, secondary-harm risk.
- 辨真伪: invoice conflict, diagnosis/expense timeline conflict, missing relationship proof, unclear reimbursement.
- 辨大小: urgency, current treatment stage, resource gap, expected marginal improvement.
- 辨远近: local hospital social worker, civil-affairs contact, charity partner, volunteer and help-intention matching.
- Human checklist: what staff must check before approval.
- Decision actions: request materials, reject, approve for public display, mark as offline follow-up.

### 4.4 Donation Intention Management

Purpose:

- Let the public express willingness to help without the platform receiving money.
- Help institution staff follow up lawfully.

Form fields from public project page:

- Help type: funding intention, medical resource, drug resource, volunteer help, propagation support, corporate support.
- Intended amount or resource description.
- City / region.
- Contact method.
- Receipt / project information need.
- Message.

AI output for staff:

- Intent classification and priority.
- Duplicate or similar contact hints.
- Match suggestions by project, region, resource type and urgency.
- Follow-up script.
- Feedback task creation after help is confirmed by the institution.

## 5. Data Objects

```text
AidApplication
CaseFile
EvidenceItem
MissingMaterial
RiskSignal
FourDiscernmentReport
ReviewDecision
PublicProject
DonationIntention
FollowUpTask
FeedbackReport
```

## 6. Main Demo Flow

```text
1. Open the home page: public sees de-identified serious-illness aid projects.
2. Click 求助申请入口: submit a simulated acute leukemia child aid application.
3. AI generates structured case file and missing-material checklist.
4. Click 机构四辨工作台: staff reviews the case.
5. AI highlights missing latest invoice, unclear reimbursement status, missing guardian proof, amount conflict and privacy exposure.
6. Staff approves for de-identified public display.
7. Home page shows the generated public project card.
8. Public visitor clicks 我要帮助 and submits donation/help intention.
9. Click 捐助意向管理: AI classifies the intention and suggests follow-up.
10. System generates a transparent feedback report draft for later institutional disclosure.
```

## 7. AI Tasks

- Intake structuring: convert messy aid request into JSON-like case file.
- Evidence checking: identify missing materials and contradictions.
- Four-discernment reasoning: produce explainable suggestions for staff.
- Privacy redaction: remove identifiable patient, school, hospital room, phone and address details from public copy.
- Public project generation: produce restrained, factual project card and progress text.
- Donation-intention matching: classify and match public help intentions to cases and follow-up tasks.
- Feedback generation: turn execution logs into donor/public feedback draft.

## 8. Non-Goals

- No real payment.
- No platform-side money custody.
- No self-operated public fundraising.
- No real patient data upload in hackathon demo.
- No AI-only approval.
- No medical diagnosis or treatment advice.
- No blockchain-first solution.
- No large NGO CRM.

## 9. Demo Case

Fictional case:

```text
县医院社工台收到一个儿童急性白血病救助申请。材料包括模拟诊断摘要、住院费用清单、医保报销预估、家庭收入说明、属地民政说明和监护人陈述。
```

AI-discovered issues:

- Latest invoice is missing.
- Insurance reimbursement status is unclear.
- Guardian relationship proof is not attached.
- One expense amount conflicts with the cost list.
- Draft public story exposes identifiable school and hospital-room information.

## 10. Success Criteria

The MVP is successful if judges can understand, within three minutes:

- This is an institution-facing charity project system, not a personal fundraising platform.
- AI has concrete work: intake, evidence, four-discernment, privacy, public display, help-intention matching and feedback.
- The product has a complete loop: public project display, aid application, institutional review, public help intention, institutional follow-up.
- The compliance boundary is explicit and visible in the UI.
