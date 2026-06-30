# AI Charity Hackathon Pack

## 1. Project Positioning

Project name options:

- 善见 Agent
- 善流 ClawFlow
- LightBridge Agent
- AidLens

Recommended name:

```text
善见 Agent
```

One-liner:

```text
让公益求助、材料核验、隐私传播和捐赠反馈，变成 Agent 可执行、人工可复核、公众可追踪的标准化交付流程。
```

Short version:

```text
我们不做 AI 决定谁该拿钱，也不自营募捐或代收善款。我们做的是给有资质公益机构使用的大病救助项目系统：对外收集求助申请，内部辅助四辨审核，对公众展示脱敏项目和救助成果，并收集社会捐助意向供机构跟进。
```

Core stance:

```text
AI 不替代慈善组织，也不替代人的善意。AI 负责把高成本、低透明、易出错的公益流程变成可核验的任务交付。
```

Core AI capability:

```text
AI 的价值不是替人做最终裁决，而是辅助公益机构和有资质工作人员完成“四辨”：辨善恶、辨真伪、辨大小、辨远近。
```

Four discernments:

- 辨善恶：识别求助叙事中的善意、欺诈风险、道德风险和可能的二次伤害，不给人贴标签，只提示风险线索。
- 辨真伪：交叉核验病历、票据、证明、时间线、金额、联系人、公开信息，标出矛盾和缺失。
- 辨大小：评估紧急程度、资源缺口、影响范围、救助后的边际改善，帮助工作人员排序。
- 辨远近：判断求助人与可用资源、属地机构、志愿者网络、捐赠意愿之间的匹配距离，提升分发效率。

Human review boundary:

```text
AI 给出的是证据结构、风险提示和优先级建议；最终受助确认、资金拨付和公开表达仍由人工或有资质机构负责。
```

## 2. Why This Fits ClawHunt

ClawHunt 的主题是：

```text
需求方发赏金，Agent 接单干活。
```

公益场景里同样有大量真实任务：

- 求助材料整理
- 病历和票据结构化
- 证明材料缺失检查
- 风险线索提示
- 求助故事脱敏改写
- 短视频脚本生成
- 捐赠反馈报告生成
- 项目进展公开摘要

这些任务不适合简单聊天机器人，适合做成标准化 Agent 工作流：

```text
任务发布 -> Agent 执行 -> 留痕 -> 人工复核 -> 交付物生成 -> 透明反馈
```

## 3. Compliance Boundary

Must say clearly:

```text
我们不自营公开募捐，不代收善款，不建立资金池。
平台可以为有资质机构提供求助信息收集、项目展示、捐助意向登记和AI审核辅助；真实募捐主体、资金账户、票据、拨付和最终救助决策仍由有资质机构负责。
```

AI role:

```text
AI 只做辅助：材料结构化、风险提示、隐私保护、反馈报告生成。
```

AI can assist with:

```text
辨善恶、辨真伪、辨大小、辨远近，但输出必须是“建议/证据/风险提示”，不是“最终判决”。
```

Human role:

```text
最终判断、资金拨付、公开募捐和受助确认，必须由有资质机构或人工审核完成。
```

Safe hackathon scope:

```text
黑客松 Demo 使用模拟案例，不处理真实隐私材料，不产生真实捐赠支付。捐助功能做“意向登记”，由机构后台跟进，不在平台内完成收款。
```

## 4. MVP Product Structure

### Home: 公众项目展示

Purpose:

- 展示已由机构审核通过并完成脱敏的大病救助项目
- 展示救助进展、资金/资源缺口、已完成帮助和成果反馈
- 提供“我要帮助”入口，收集捐助意向而不是直接收款

Top-right entries:

- 求助申请入口
- 机构四辨工作台
- 捐助意向管理

### Entry 1: 求助申请入口

Input:

- 求助人/家属/志愿者填写大病救助申请
- 病情摘要、费用清单、医保/商保情况、家庭负担、证明材料说明
- 授权与隐私同意

Output:

- AI 生成结构化求助档案
- 缺失材料清单
- 可提交给机构审核的规范版本

### Entry 2: 机构四辨工作台

Input:

- 机构待审求助档案
- 模拟病历摘要、费用清单、证明材料、求助叙事

Output:

- 辨善恶：欺诈、夸大、隐私伤害、二次伤害风险
- 辨真伪：材料缺失、金额矛盾、时间线冲突、证明链断点
- 辨大小：紧急程度、费用缺口、救助边际改善、资源优先级
- 辨远近：属地机构、医院社工、志愿者、捐助意向匹配
- 人工复核 checklist
- 脱敏后的项目展示稿

### Entry 3: 捐助意向管理

Input:

- 公众在项目页提交的帮助意向
- 类型包括资金意向、医疗资源、药品资源、陪诊志愿、传播支持、企业支持

Output:

- AI 分类和去重
- 按项目、地区、资源类型、紧急程度匹配
- 机构跟进话术
- 后续透明反馈报告草稿

## 5. 30-Second Self Introduction

```text
大家好，我这次想做一个 AI+公益方向的项目，暂定叫“善见 Agent”。

我的想法不是做一个募捐平台，也不是让 AI 决定谁该被帮助，而是做公益任务的标准化交付系统。

首页展示机构审核后的大病救助项目和救助成果；右上角有求助申请入口、机构四辨工作台、捐助意向管理。一个求助案例进来，AI 帮求助者整理病历和费用材料，帮机构做辨善恶、辨真伪、辨大小、辨远近，再把通过审核的项目脱敏展示给公众，收集社会捐助意向给机构跟进。

整个过程不自营募捐、不代收善款、不建资金池，AI 只做辅助，最终都由人工或有资质机构复核。

我希望找 vibe coding / AI 原生开发流的队友，一起把这个做成 72 小时内能跑、能展示、能验收的公益 Agent 工作台。
```

## 6. Group Message: Find Teammates

Most natural version for group chat:

```text
我这次想做一个 AI+公益方向，暂定叫“善见 Agent”。

先说边界：不是个人求助平台，不自营募捐，不代收善款，不碰资金池，也不是让 AI 决定谁该被帮助。

我想做的是给有资质机构使用的大病救助项目系统：首页展示审核后的公益项目和救助成果；右上角有求助申请入口、机构四辨工作台、捐助意向管理。AI 帮求助者整理病历/费用材料，帮机构做四辨审核，再把通过审核的项目脱敏展示给公众，收集捐助意向供机构跟进。

想找偏 vibe coding / AI 原生开发流的队友：会用 Codex、Claude Code、Cursor、OpenClaw、Coze、n8n 这些工具快速拼原型、跑流程、打磨 demo 的朋友。

如果你对公益、医疗、教育、内容传播、产品体验或者多 Agent 工作流感兴趣，可以私聊我。想在破冰会前先碰一下方向。
```

Recommended version:

```text
我这次基本确定想做一个 AI+公益方向的项目，暂定叫“善见 Agent”。

不是做个人求助平台，也不自营募捐或代收善款，而是做给有资质机构使用的大病救助项目系统：首页展示审核后的救助项目，后台包含求助申请入口、机构四辨工作台和捐助意向管理。AI 负责整理求助材料、结构化病历和费用、提示缺失证明与风险点、生成脱敏项目展示和透明反馈报告。

我想找偏 vibe coding / AI 原生开发流的队友：不一定传统手写代码特别强，但会用 Codex、Claude Code、Cursor、OpenClaw、Coze、n8n、各种 Agent 工具快速拼原型、跑流程、打磨 demo。

如果你也对“AI 做真实公益任务交付”感兴趣，或者擅长前端、产品体验、短视频传播、公益/医疗/教育场景，欢迎私聊我。想在破冰会前先碰一下方向。
```

Shorter version:

```text
我想做一个 AI+公益项目，暂定“善见 Agent”：给有资质机构使用的大病救助项目系统。首页展示脱敏救助项目，后台有求助申请、机构四辨审核、捐助意向管理；不自营募捐、不代收善款，AI 做材料整理、风险提示、隐私脱敏和透明反馈。

想找 vibe coding / AI 原生开发流的队友，一起用 Codex、OpenClaw、Coze、n8n 等工具 72 小时内拼出能跑、能展示、能验收的 demo。感兴趣可以私聊我。
```

## 7. Private Message To Vibe-Coding Builders

```text
你好，我看到你也比较像 AI 原生开发 / vibe coding 路线，我这边想做一个 AI+公益项目。

核心是给有资质机构使用的大病救助项目系统：首页展示脱敏救助项目，后台做求助申请、机构四辨审核和捐助意向管理。平台不自营募捐、不代收善款，AI 负责材料整理、病历/费用结构化、真实性风险提示、隐私脱敏和反馈报告。

我觉得这个方向很适合用多 Agent 和工具链快速做 MVP。你如果有兴趣，我们可以提前聊 10 分钟，看能不能一起组一个偏 AI 工具驱动的小队。
```

## 8. Private Message To Business / Public Welfare People

```text
你好，我这次想做 AI+公益方向，不碰资金池、不自营募捐、不代收善款，而是做给有资质机构使用的大病救助项目系统。

比如患者/家属/志愿者提交求助申请后，AI 可以帮机构整理材料、检查缺失证明、做四辨风险提示、生成脱敏项目展示；公众可以提交捐助意向，再由机构跟进。

如果你有公益、医疗、教育、志愿者、短视频传播或真实需求场景，我很想提前请教一下，看这个方向是否有更真实的切入口。
```

## 9. Team Roles Needed

Priority teammates:

1. Vibe coding builder
   - Can quickly assemble frontend, workflow, API calls, no-code/low-code tools, agent chains.

2. Product / UX person
   - Can make the workflow simple, credible, and emotionally restrained.

3. Public welfare / healthcare / education scenario person
   - Can provide realistic case flow and evaluation criteria.

4. Storytelling / video person
   - Can help make the demo memorable without becoming melodramatic.

Less urgent:

- Pure algorithm optimization
- Blockchain-only direction
- Fundraising/payment integration
- Heavy backend infrastructure

## 10. Judging Narrative

Creativity:

```text
把公益场景拆成 Agent 可执行任务，而不是做又一个求助信息平台。
```

User experience:

```text
志愿者只需要上传材料，系统就能生成清晰的待复核档案、风险提示和传播/反馈交付物。
```

Feasibility:

```text
MVP 不碰真钱、不碰真实隐私，用模拟案例跑完整流程，合规边界清楚。
```

Business / sustainability:

```text
可作为公益机构、志愿者组织、校园公益社团、医疗救助项目的技术服务工具。
```

Agent relevance:

```text
每个模块都是明确任务：结构化、核验、脱敏、传播、反馈。适合接入 ClawHunt 的任务市场。
```

AI empowerment:

```text
这个系统真正的 AI 赋能，不是把慈善变成自动化审批，而是给公益工作人员一个可追溯的“判断辅助台”：它把分散材料、模糊叙事和复杂伦理问题，拆成证据、风险、优先级和匹配建议。
```

## 11. 72-Hour Target

Day 1:

- Confirm team and scope.
- Build clickable dashboard.
- Prepare 2-3 simulated aid cases.
- Finish first agent workflow: material structuring + missing checklist.

Day 2:

- Add risk prompt agent.
- Add privacy-preserving story agent.
- Add transparent feedback report generator.
- Polish UI and demo flow.

Day 3:

- Freeze scope.
- Prepare pitch.
- Record backup demo.
- Emphasize compliance boundary and human review.

## 12. Demo Case Ideas

Case A: 大病儿童救助

- Simulated hospital diagnosis summary.
- Simulated hospitalization expense list.
- Simulated insurance reimbursement estimate.
- Simulated family burden note.
- Missing material: recent invoice, guardian relationship proof, reimbursement status confirmation.
- Risk signals: amount conflict, privacy exposure, emotional overstatement, unclear prior fundraising record.

Case B: 乡村教育物资

- Simulated school request.
- Need books, tablets, tutoring volunteers.
- Risk: vague recipient count, missing school contact confirmation.

Case C: 流浪未成年人临时援助

- Highly sensitive.
- Demo only uses fictional/de-identified data.
- Strong privacy and referral-to-authority boundary.

Recommended case for demo:

```text
Case A: 大病儿童救助
```

Reason:

- Stronger emotional clarity and judging impact.
- Harder real workflow: medical material,费用缺口、医保/商保、家庭负担、隐私传播、公众信任.
- Better shows why AI should assist with “辨善恶、辨真伪、辨大小、辨远近”.
- Must use fictional/de-identified data and keep human review as the final gate.

Recommended fictional case:

```text
县医院社工台收到一个儿童急性白血病救助案例。材料包括模拟诊断摘要、住院费用清单、医保报销预估、家庭收入说明、属地民政说明和监护人陈述。

AI 发现：最新发票缺失、医保报销状态不清、监护关系证明未附、费用清单中有一笔金额和求助信表述不一致，同时公开传播稿里出现了可识别患儿学校和病房信息。
```

Demo output:

```text
结构化病情/费用档案 + 证据地图 + 缺失材料清单 + 风险提示 + 紧急程度/资源缺口评估 + 属地核验任务 + 脱敏传播稿 + 透明反馈报告模板。
```

## 13. If People Ask About Compliance

Question:

```text
这个是不是涉及募捐？会不会不合规？
```

Answer:

```text
所以我一开始就把边界切掉：Demo 不收钱、不建资金池、不自营公开募捐，也不处理真实隐私材料。捐助功能只做“意向登记”，由有资质机构后续跟进。

我们做的是公益项目的技术服务层，比如求助信息收集、材料整理、四辨审核、项目展示、捐助意向管理和反馈报告。真实募捐主体、资金账户、票据、拨付和最终受助决策必须在有资质机构框架下完成。
```

Question:

```text
AI 会不会误判谁该被帮助？
```

Answer:

```text
不会让 AI 做最终判断。AI 只负责把材料变清楚，把风险点列出来，把缺失项标出来。最终判断一定是人工复核。
```

Question:

```text
公益方向会不会太难落地？
```

Answer:

```text
如果做自营募捐平台当然很难，也不适合 72 小时。但做机构使用的大病救助项目系统是可落地的：求助收集、案例复核、传播脱敏、捐助意向管理和反馈报告都是机构日常会遇到的具体任务。
```
