# 善见

善见是一个面向公益机构的大病救助业务系统实验仓库。它把公开项目展示、求助申请承接、机构四辨审核、钱/物/服帮助意向管理和反馈报告串成一条可演示、可继续产品化的工作流。

当前推荐从 `shanjian-platform/` 开始开发。它是基于 Payload CMS + Next.js 的生产化 v2；`shanjian-agent/` 是早期 Vite + React 演示版，保留为产品原型和本地 agent 逻辑参考。

## 项目边界

- 不自营公开募捐。
- 不代收善款，不建立平台资金池。
- 公众侧只登记帮助意向，不做真实支付。
- 真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
- 样例数据为虚构或脱敏案例，不应上传或处理真实患者隐私数据。
- AI 或规则输出只做证据整理、风险提示、优先级建议和复核清单，不替代机构工作人员最终判断，也不提供医疗诊断或治疗建议。

## 仓库结构

```text
.
├── shanjian-platform/   # Payload + Next.js 生产化业务系统底座
├── shanjian-agent/      # Vite + React 本地演示版和 agent 逻辑参考
├── docs/                # 设计稿、实施计划和交接文档
├── ai-charity-hackathon-pack.md
└── charity-operations-research.md
```

## 快速开始

### 善见 Platform

```bash
cd shanjian-platform
npm install
npm run dev
```

本地环境需要 `.env` 中包含：

```bash
DATABASE_URL=file:./shanjian-platform.db
PAYLOAD_SECRET=replace-with-a-local-secret
```

打开：

- 公众项目展示：`http://localhost:3000`
- 项目列表：`http://localhost:3000/projects`
- 帮助意向登记：`http://localhost:3000/intentions/new`
- Payload Admin：`http://localhost:3000/admin`

验证：

```bash
npm test
npm run generate:types
npm run build
```

### 善见 Agent

```bash
cd shanjian-agent
npm install
npm run dev
```

验证：

```bash
npm test
npm run build
```

## 当前功能

- 公众项目展示：脱敏项目索引、项目详情、证据摘要、真实需要、进展和帮助入口。
- 机构后台：通过 Payload Admin 管理求助申请、四辨报告、公开项目、帮助意向和反馈报告。
- 四辨审核：围绕辨善恶、辨真伪、辨大小、辨远近生成证据、风险、优先级和人工复核清单。
- 帮助意向：登记钱、物、服三类帮助，匹配项目真实需要，并生成机构跟进建议。
- 反馈报告：面向机构复核和后续公开反馈的结构化记录。

## 主要代码

- `shanjian-platform/src/collections/`: Payload 业务集合。
- `shanjian-platform/src/domain/`: 可测试的纯 TypeScript 领域逻辑。
- `shanjian-platform/src/components/public/`: 公众侧项目展示和帮助意向登记界面。
- `shanjian-agent/src/domain/`: 早期本地 agent 与规则逻辑参考。

## 开发原则

- 公众侧优先展示真实项目事实，不做营销化包装。
- 后台界面优先服务机构日常审核、跟进和留痕。
- 领域逻辑尽量保持纯函数，避免和 React、Payload Admin 或浏览器环境耦合。
- 本地开发可使用 SQLite；后续产品化部署可迁移到 Postgres，并保留相同业务边界。
