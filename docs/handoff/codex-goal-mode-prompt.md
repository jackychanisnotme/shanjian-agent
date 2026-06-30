# Codex Goal Mode Prompt

Copy this whole prompt into Codex goal mode.

```text
目标：请根据本仓库中的设计规格、实施计划和任务清单，完整实现“善见 Agent”黑客松 MVP。

工作目录：/Users/pc/Documents/7.3黑客松

请先阅读：
- docs/superpowers/specs/2026-06-30-shanjian-agent-mvp-design.md
- docs/superpowers/plans/2026-06-30-shanjian-agent-mvp-implementation.md
- docs/shanjian-agent-task-checklist.md
- ai-charity-hackathon-pack.md
- charity-operations-research.md

必须遵守：
1. 使用 docs/superpowers/plans/2026-06-30-shanjian-agent-mvp-implementation.md 作为主执行计划，逐项打勾推进。
2. 在 /Users/pc/Documents/7.3黑客松/shanjian-agent 新建独立 Vite + React + TypeScript Web App。
3. 不要在 /Users/pc/Documents/agentERP-0.1.0 里实现；它是 Chrome 扩展，不适合作为本项目底座。
4. 产品结构必须是：首页展示公众项目；右上角三个入口分别为“求助申请入口”“机构四辨工作台”“捐助意向管理”。
5. 捐助功能只做“捐助/帮助意向登记”，不做真实支付，不做平台收款，不做资金池。
6. Demo 使用虚构/脱敏大病救助案例，不上传或处理真实患者隐私数据。
7. AI 功能先用 deterministic local agent functions 实现，保证离线可演示；函数接口要清晰，便于后续替换成真实 LLM。
8. UI 要克制、可信、像公益机构项目系统；不要做情绪化募捐页，不要做营销 landing page，不要使用夸张悲情文案。
9. 所有最终判断都必须表现为机构人工复核，不能让 AI 自动批准救助。
10. 每个阶段完成后运行验证命令并提交小 commit。

实现范围：
- shanjian-agent/src/domain/types.ts
- shanjian-agent/src/domain/demoData.ts
- shanjian-agent/src/domain/agents.ts
- shanjian-agent/src/app/navigation.ts
- shanjian-agent/src/app/storage.ts
- shanjian-agent/src/app/demoStore.ts
- shanjian-agent/src/components/*
- shanjian-agent/src/styles/global.css
- shanjian-agent/tests/app-flow.test.tsx
- shanjian-agent/README.md
- shanjian-agent/DEMO.md

核心功能：
1. 公众项目展示首页：项目列表、项目详情、救助进展、成果反馈、我要帮助入口。
2. 求助申请入口：表单录入大病救助申请，AI 输出结构化档案和缺失材料清单。
3. 机构四辨工作台：AI 输出辨善恶、辨真伪、辨大小、辨远近、人工复核 checklist 和决策按钮。
4. 捐助意向管理：公众提交帮助意向，AI 分类、匹配项目并生成机构跟进话术。
5. 透明反馈草稿：从项目进展生成需要机构复核的反馈文本。

验收标准：
- npm test 通过。
- npm run build 通过。
- 本地 dev server 可打开。
- 桌面和移动视口均无空白、无明显遮挡、无按钮文字溢出。
- 首页第一屏就是公众项目展示。
- 右上角三个入口清晰可见。
- 合规边界在 UI 和 README 中可见：不自营公开募捐、不代收善款、不建立资金池、不处理真实患者数据、不提供医疗诊断或治疗建议。

完成后请汇报：
- 创建/修改的关键文件。
- 运行过的验证命令及结果。
- 本地预览 URL。
- 还剩哪些可选增强项。
```
