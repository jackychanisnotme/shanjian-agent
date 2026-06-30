# Charity Operations Research

Date: 2026-06-30

Purpose: prepare for the ClawHunt hackathon project "善见 Agent", an AI-assisted charity task verification and delivery system.

## Executive Summary

Charity institutions do not operate like simple donation pages. A typical charity workflow is closer to a regulated project-management pipeline:

```text
qualification -> project design -> filing / platform publishing -> fundraising -> beneficiary verification -> implementation -> evidence collection -> disclosure -> donor feedback -> audit / supervision
```

The strongest opportunity for "AI + charity" is not to replace regulated institutions or make final funding decisions. It is to provide a judgment-assistance layer for staff:

```text
辨善恶 -> detect fraud risk, moral hazard, privacy harm, secondary harm
辨真伪 -> cross-check documents, timeline, invoices, proof materials, public records
辨大小 -> estimate urgency, resource gap, beneficiary impact, project priority
辨远近 -> match cases with local institutions, volunteers, donors, platforms, and resources
```

Hackathon-safe scope:

- Do not self-operate public fundraising.
- Do not receive, custody or allocate donation money.
- Do not process real personal/private medical data in the demo.
- Use simulated cases.
- Position AI output as "evidence, risk hints, priority suggestions", not final judgment.
- Donation-related demo function is "intention registration" for institutional follow-up, not payment.

## 0. Hackathon-Ready Takeaways

### 0.1 What charity operations really look like

In current Chinese internet charity practice, the visible donation page is only the front door. Behind it is an operating chain:

```text
organization qualification
-> project design and internal decision
-> fundraising filing / platform qualification check
-> case intake and beneficiary verification
-> project execution / procurement / service delivery
-> evidence archive
-> progress disclosure
-> donor feedback
-> evaluation / audit / supervision
```

This means the project should not be pitched as "AI fundraising". The stronger pitch is:

```text
AI helps charity staff and qualified institutions make公益项目 more verifiable, privacy-safe, explainable and efficient.
```

### 0.2 The practical AI seats

The strongest Agent jobs are:

1. Intake assistant: turns messy help letters, receipts, screenshots and field notes into a structured case file.
2. Verification assistant: finds missing evidence, conflicts, suspicious claims and manual-check tasks.
3. Priority assistant: helps staff compare urgency, resource gap, mission fit and potential impact.
4. Privacy and communication assistant: rewrites public stories, progress updates and short-video scripts without exposing sensitive information.
5. Transparency assistant: turns delivery logs, receipts and photos into donor-facing progress reports and disclosure packets.
6. Donation-intention assistant: classifies public help intentions and routes them to institution staff for lawful follow-up.

These five seats map cleanly to the four discernments:

```text
辨善恶 = harm / fraud / exploitation / public-opinion risk
辨真伪 = evidence map / contradictions / missing documents
辨大小 = urgency / impact / resource gap / mission fit
辨远近 = local verification / partner / volunteer / platform / donor matching
```

### 0.3 The most credible 72h demo

Recommended demo scenario:

```text
Serious illness aid case, but only with fictional / de-identified materials.
```

Why:

- It is the most intuitive charity scenario for judges and teammates.
- It exposes the hardest real pain points: messy medical material, high verification cost, privacy risk, urgent resource matching and donor trust.
- It gives AI a meaningful role without making AI the final decision maker.

Suggested demo task:

```text
"Please receive this serious illness aid application, help the institution review it, publish a de-identified project card, and manage public help intentions."
```

Agent output:

- structured case file
- evidence map
- diagnosis / expense / insurance / family burden summary
- missing material checklist
- contradiction / risk signals
- urgency and resource-gap assessment
- local hospital / charity / mutual-aid resource matching tasks
- privacy-safe public story
- public project card
- donation-intention registration and matching summary
- donor feedback report draft

Hard demo boundary:

```text
The case is simulated. No real patient data, no real medical record upload, no real donation payment, no self-operated public fundraising, no automatic approval.
```

### 0.4 Questions to ask tonight / before forming a team

Ask公益 or public-service people:

```text
你们真实工作里，最耗时的是材料收集、真实性核验、受助排序、传播脱敏、进展反馈，还是捐赠人服务？
```

Ask AI-native builders:

```text
我们能不能 72 小时内做出一个“善见 Agent”MVP：首页展示脱敏救助项目，右上角三个入口分别进入求助申请、机构四辨工作台、捐助意向管理？
```

Ask potential product / UX teammates:

```text
这个产品怎么做得克制可信，而不是像情绪化募捐页？工作人员一眼要看到哪些信息，才敢用它辅助判断？
```

## 1. Legal And Regulatory Operating Frame In China

### 1.1 Public fundraising is qualification-based

Charity organizations need public fundraising qualification before conducting public fundraising. The revised Charity Law lowered the basic waiting period from two years to one year for eligible charity organizations, but still requires governance and operational standards. Shenzhen Civil Affairs' interpretation of the revised Charity Law summarizes this threshold and approval logic: [深圳民政局解读新修改《慈善法》](https://mzj.sz.gov.cn/gkmlpt/content/11/11575/post_11575393.html).

Practical implication for us:

```text
善见 Agent should not be described as a self-operated fundraising or personal-help platform. It should be described as a serious-illness aid project system for qualified organizations: collecting aid applications, assisting institutional review, publishing de-identified project pages, and collecting donation/help intentions for staff follow-up.
```

### 1.2 Internet public fundraising must use designated platforms

The 2026 Internet Public Fundraising Service Platform rules define such platforms as State Council civil-affairs-designated networks serving charity organizations' public fundraising. They provide information display, donation payment, and donation-use query services. They also must meet cybersecurity, data security, privacy, business-system, authenticity-checking, and rule-file requirements. Source: [CAC / 民政部等《互联网公开募捐服务平台管理办法》](https://www.cac.gov.cn/2026-04/30/c_1779276538353684.htm).

As of an April 2026 Shenzhen Civil Affairs page, 29 designated internet public fundraising platforms were listed, including Tencent Charity, Alibaba Charity, Alipay Charity, Weibo Charity, JD Charity, ByteDance Charity, Meituan Charity, Waterdrop Charity, Xiaomi Charity, bilibili Charity, Ping An Charity, China Mobile Charity, Ctrip Charity and others: [深圳民政局：互联网公开募捐平台有哪些](https://mzj.sz.gov.cn/gkmlpt/content/12/12731/post_12731811.html).

Practical implication:

```text
In the demo, if there is a "help / donate" step, make it donation-intention registration for a qualified institution to follow up, not direct payment or platform custody of funds.
```

### 1.3 Platforms verify qualifications and cannot receive donations on behalf of charities

The 2026 public fundraising platform service rules require platforms such as media or network service providers to check charity registration certificates, public fundraising qualification certificates, and civil-affairs filing status. They cannot receive charitable donated property on behalf of the charity organization. Source: [《公开募捐平台服务管理办法》](https://www.cac.gov.cn/2026-04/30/c_1779276538655621.htm).

The technical specification for internet fundraising platforms also says donation funds should enter the charity organization's bank account or secure qualified third-party payment account, not be intercepted or received on behalf by the platform. It also specifies activity details, charity organization details, donation records, social reporting, activity management, donation management, and donor management functions. Source: [民政部《慈善组织互联网公开募捐信息平台基本技术规范》PDF](https://www.cac.gov.cn/wxb_pdf/cishan.pdf).

Practical implication:

```text
善见 Agent can generate a "project disclosure and verification packet" that contains required project facts, but it must not route or custody funds.
```

### 1.4 Public fundraising projects need filing and internal decisions

The public fundraising filing guide requires qualified organizations to file before raising funds. Materials include the filing form, commitment letter, internal decision documents, external approval materials when applicable, and cooperation fundraising materials such as partner evaluation reports and cooperation agreements. Filing is submitted through the national charity information disclosure platform, "慈善中国". Source: [慈善组织公开募捐方案备案指引](https://policy.mofcom.gov.cn/claw/clawContent.shtml?id=104059).

Practical implication:

```text
AI can help staff prepare and check filing materials: internal decision summary, partner evaluation checklist, project purpose, budget, beneficiary scope, fundraising cost, remaining-property disposal plan.
```

### 1.5 Personal help is a separate regulated category

Personal online help platforms are regulated separately. They are defined as platforms for individuals facing financial difficulty due to illness and other reasons, providing help-info publishing and donated-fund collection, management, and allocation services. They also must be designated by the State Council civil-affairs department. Undesignated organizations or individuals cannot operate under that platform name or conduct those services. They must have capabilities to verify the authenticity of help information. Source: [《个人求助网络服务平台管理办法》](https://www.cswef.org/cswef/info/detail/id/264.html).

Public fundraising service rules also require risk warnings when personal hardship information is published through media/network channels: such information is not charitable public fundraising information, and authenticity is the responsibility of the help seeker and publisher. Source: [《公开募捐平台服务管理办法》](https://www.cac.gov.cn/2026-04/30/c_1779276538655621.htm).

Practical implication:

```text
If our demo includes serious illness aid, it must clearly be an institution-operated aid project scenario. The platform can collect applications and help intentions on behalf of qualified institutions, but it should not present itself as a personal-help platform or a donation-money collection/custody platform.
```

## 2. How Charity Institutions Actually Operate

### 2.1 Governance and qualification management

Charity organizations typically maintain:

- legal registration and charity organization identity
- public fundraising qualification if applicable
- board / council decision procedures
- supervisors / supervision mechanisms
- finance, procurement, archive, project, information disclosure, personnel and risk-control systems
- annual work report and financial accounting report

This matters because staff do not just "do good"; they need defensible processes and documentation.

### 2.2 Project management cycle

A mature institution's project-management logic is visible in China Foundation for Rural Development's project management system:

- professional project procedures and operation manuals
- contract-based cooperation with project stakeholders
- project archives and electronic records
- participation by beneficiaries and local stakeholders
- public disclosure around project initiation, fundraising, implementation and feedback
- project performance evaluation
- legal, public-opinion, and risk-control bottom lines

Source: [中国乡村发展基金会项目管理制度](https://www.cfpa.org.cn/information/management.aspx?id=5).

Common project stages:

```text
need discovery
project design
budget and beneficiary criteria
internal review / approval
fundraising or resource mobilization
beneficiary intake and verification
procurement / service delivery / cash or in-kind assistance
evidence collection
progress update
final report
remaining-property handling
audit / review
```

### 2.3 Fundraising channels

Common channels:

- public fundraising through qualified charity organization
- internet public fundraising on designated platforms
- targeted fundraising from specific donors
- corporate CSR and foundation grants
- special funds under a public foundation
- government purchase of services / commissioned social service projects
- offline charity events with filing and site restrictions
- community charity and volunteer networks

Digital platforms usually do not replace the charity organization. They provide platform services, traffic, payment, display, donor service, transparency tools and reporting infrastructure.

### 2.4 Internet platform operations

Major platforms are not only "payment pages"; they increasingly provide:

- charity organization onboarding
- project publishing workflow
- public disclosure components
- progress feedback tools
- donor query and donor service
- platform rules and content moderation
- complaint/reporting mechanisms
- traffic and creator participation
- transparency and reporting tools

ByteDance Charity says it provides public fundraising information publishing services for charity organizations and product/operations support for enrolled projects. It also shows platform-scale metrics, partner institutions, projects and creator participation. Source: [字节跳动公益平台](https://gongyi.bytedance.com/m/platform).

Tencent Foundation's public-welfare platform page describes Tencent Charity as a designated internet fundraising information platform focused on transparent charity and using technology to make project process transparency visible. Source: [腾讯基金会公益平台](https://www.tencentfoundation.org/fieldpage/?id=4&index=1&link=&type=fieldpage).

### 2.5 Information disclosure and transparency

Transparency is operational, not decorative. The updated charity information disclosure rules emphasize more disclosure content, annual reports, financial reports, major charity project implementation, partner evaluation/supervision in cooperation fundraising, remaining property after project termination, and broader voluntary disclosure. Source: [深圳罗湖民政局《慈善组织信息公开办法》解读](https://www.szlh.gov.cn/lhmzj/gkmlpt/content/12/12442/post_12442781.html).

People's Daily described internet charity transparency tools as standard financial-disclosure components, modular project details, progress feedback tools, charity organization reports and use-of-funds details. Source: [人民日报：让“指尖公益”更透明](https://paper.people.com.cn/rmrbwap/html/2020-09/14/nw.D110000renmrb_20200914_4-19.htm).

Tencent Charity's "透明计划" discussions with China Social Welfare Foundation show a strong operational need: digital execution tools that connect donors, institutions, platforms and beneficiaries, making donor service warmer, institution work more efficient, platform management more transparent and beneficiary protection more secure. Source: [中国社会福利基金会与腾讯公益“透明计划”交流](https://www.cswef.org/index.php/cswef/news/detail/id/1398.html).

## 3. Operational Pain Points

### 3.1 Intake pain

Staff and volunteers often receive messy materials:

- long unstructured narratives
- screenshots
- scanned certificates
- invoices and payment records
- medical summaries
- village / school / hospital proofs
- repeated or inconsistent information

AI opportunity:

```text
turn messy materials into a structured case file and missing-material checklist.
```

### 3.2 Authenticity pain

Verifying truth is expensive:

- time-line conflict
- amount conflict
- unclear issuer / stamp
- repeated fundraising elsewhere
- unverifiable beneficiary identity
- privacy-sensitive or emotionally exaggerated narratives
- possible fraud or moral hazard

AI opportunity:

```text
create a "truth-check workbench": not truth verdict, but evidence map, contradiction list, and manual-review checklist.
```

### 3.3 Priority pain

Charity resources are scarce. Staff need to decide:

- which cases are urgent
- which cases are large-impact
- which are within the organization's mission
- which require referral rather than direct assistance
- which need local verification first

AI opportunity:

```text
score urgency / resource gap / impact / mission fit with transparent rationale and no final automatic decision.
```

### 3.4 Disclosure pain

Project teams need to publish progress and reports without leaking private data or overstating impact.

AI opportunity:

```text
generate privacy-preserving progress reports, donor updates, public summaries and disclosure checklists.
```

### 3.5 Donor trust pain

Donors want to know:

- who received help
- what was delivered
- when it was delivered
- how much cost went to implementation
- whether impact is real

AI opportunity:

```text
automatically draft donor feedback and transparent use-of-funds summaries from execution logs and receipts.
```

## 4. Project Opportunities For 善见 Agent

### 4.1 Best hackathon direction

Build:

```text
善见 Agent：大病救助项目系统
```

Core promise:

```text
AI assists qualified charity staff across the full serious-illness aid loop: public project display, aid application intake, four-discernment review, donation-intention management and transparent feedback.
```

### 4.2 Target users

Primary:

- charity organization project staff
- public fundraising project operators
- volunteer coordinators
- campus charity club operators
- community charity workers

Secondary:

- internet public fundraising platform operations staff
- corporate CSR project managers
- content / public communication staff
- donors who need structured feedback

### 4.3 MVP modules

Module 1: Public Project Home

- First screen is the public-facing project display.
- Show de-identified serious-illness aid projects, progress, resource gap, help options and feedback.
- Top-right entries: 求助申请入口, 机构四辨工作台, 捐助意向管理.

Module 2: Aid Application Intake

- Input: simulated help letter, diagnosis summary, expense list, insurance/reimbursement status, family burden, proof list, privacy consent.
- Output: structured case file, missing-material checklist, institution-ready application packet.

Module 3: Institutional Four-Discernment Workbench

- 辨善恶: possible harm / exaggeration / exploitative storytelling / fraud risk.
- 辨真伪: contradiction and missing evidence.
- 辨大小: urgency, amount, expected impact, resource gap.
- 辨远近: local resource / institution / volunteer matching suggestions.
- Output: evidence map, risk hints, priority rationale, local verification tasks, human-review checklist.

Module 4: Donation Intention Management

- Input: public help-intention forms.
- Fields: help type, intended amount/resource, location, contact, invoice/receipt needs, message.
- Output: AI classification, deduplication, case-resource matching, institution follow-up script, feedback tasks.

Module 5: Privacy-Safe Project Publishing And Feedback

- Output: public project card, de-identified story, progress updates, donor/public feedback report generated from institution execution logs.

### 4.4 What not to build in the hackathon

Avoid:

- real donation payment
- money custody
- self-operated public fundraising publishing
- presenting the product as a personal-help platform
- real medical document upload
- automatic beneficiary approval
- AI-only charity score as final verdict
- blockchain-first solution
- overbuilt NGO CRM

## 5. Demo Narrative

Use a fictional serious illness aid project. It is higher sensitivity than education aid, so the demo must be stricter about privacy, human review and no money flow.

Demo case:

```text
A county hospital social-work desk receives a serious illness aid case for a child with acute leukemia. Materials include a simulated diagnosis summary, hospitalization cost list, insurance reimbursement estimate, family income note, local civil-affairs note and guardian statement. Some information is incomplete: the latest invoice is missing, reimbursement status is unclear, guardian relationship proof is not attached, and one expense amount conflicts with the cost list.
```

Demo path:

```text
1. Public home shows de-identified serious-illness aid projects and progress.
2. A family / volunteer enters the aid application入口 and submits simulated materials.
3. Agent generates a structured case file: diagnosis, treatment stage, cost gap, insurance status, family burden.
4. Institution staff opens the four-discernment workbench.
5. Agent flags missing evidence, amount conflicts and privacy risks.
6. Agent suggests urgency level, resource gap and local verification steps.
7. Human reviewer approves / rejects / requests补充材料.
8. Approved case becomes a privacy-safe public project card.
9. Public users submit help intentions instead of payment.
10. Institution staff opens donation-intention management, where AI classifies, matches and drafts follow-up / feedback tasks.
```

Pitch line:

```text
善见 Agent 不替人做善恶裁判，而是把公益工作人员最难、最耗时、最容易出错的判断过程结构化、留痕化、可复核化。
```

## 6. How This Maps To ClawHunt

ClawHunt framing:

```text
Demand-side task:
"Please verify this charity case and prepare a public disclosure package."

Agent delivery:
structured case file + risk hints + missing checklist + review tasks + privacy-safe project card + donation-intention matching + feedback report.

Acceptance:
human reviewer can see evidence, risks, missing items and generated output; no hidden black-box decision.
```

This is strong for the hackathon because:

- It is a real task market category.
- It has clear deliverables.
- It has human verification.
- It respects compliance.
- It has social value and business/service potential.

## 7. Questions To Ask Potential Teammates Or Mentors

Ask charity / public-service people:

1. In your workflow, what takes longest: intake, verification, reporting, communication, disclosure or donor service?
2. What materials do you need before a case can move forward?
3. Which information is usually missing or contradictory?
4. What cannot be automated under any circumstance?
5. How do you protect beneficiary privacy while still communicating impact?

Ask builders:

1. Can we build a fast dashboard with upload/paste input, agent output and review status?
2. Can we simulate document extraction without real OCR first?
3. Can we generate reviewer checklists and reports from structured JSON?
4. Can we make a demo that looks credible without touching real money or data?

## 8. Suggested Architecture For Hackathon

Simple architecture:

```text
Frontend dashboard
  -> public project home
  -> aid application entry
  -> institutional four-discernment workbench
  -> donation-intention management

Backend or local workflow
  -> prompt templates
  -> JSON schema for case file
  -> four-discernment scoring schema
  -> donation-intention schema
  -> public project and feedback templates
```

Suggested data objects:

```text
Case
Evidence
RiskSignal
MissingItem
PriorityAssessment
PrivacyRedaction
ReviewDecision
PublicReport
DonationIntention
ProjectPage
```

## 9. Source List

- [互联网公开募捐服务平台管理办法, 2026](https://www.cac.gov.cn/2026-04/30/c_1779276538353684.htm)
- [公开募捐平台服务管理办法, 2026](https://www.cac.gov.cn/2026-04/30/c_1779276538655621.htm)
- [深圳民政局解读新修改《慈善法》](https://mzj.sz.gov.cn/gkmlpt/content/11/11575/post_11575393.html)
- [慈善组织公开募捐方案备案指引](https://policy.mofcom.gov.cn/claw/clawContent.shtml?id=104059)
- [个人求助网络服务平台管理办法](https://www.cswef.org/cswef/info/detail/id/264.html)
- [深圳民政局：互联网公开募捐平台名录](https://mzj.sz.gov.cn/gkmlpt/content/12/12731/post_12731811.html)
- [字节跳动公益平台](https://gongyi.bytedance.com/m/platform)
- [腾讯基金会公益平台](https://www.tencentfoundation.org/fieldpage/?id=4&index=1&link=&type=fieldpage)
- [中国乡村发展基金会项目管理制度](https://www.cfpa.org.cn/information/management.aspx?id=5)
- [慈善组织信息公开办法解读](https://www.szlh.gov.cn/lhmzj/gkmlpt/content/12/12442/post_12442781.html)
- [人民日报：让“指尖公益”更透明](https://paper.people.com.cn/rmrbwap/html/2020-09/14/nw.D110000renmrb_20200914_4-19.htm)
- [腾讯公益透明计划交流](https://www.cswef.org/index.php/cswef/news/detail/id/1398.html)
- [慈善组织互联网公开募捐信息平台基本技术规范 PDF](https://www.cac.gov.cn/wxb_pdf/cishan.pdf)
