# 善见 Platform

Payload CMS + Next.js 版本的善见业务系统底座。这个目录是当前推荐开发的生产化 v2，和旧的 `shanjian-agent/` Vite demo 并排存在。

善见 Platform 面向公益机构的大病救助业务场景，把公众项目展示、求助申请承接、机构四辨审核、钱/物/服帮助意向管理和反馈报告放在同一个可迭代应用里。

## Product Scope

- 公众项目展示：脱敏项目列表、项目详情、证据摘要、真实需要和进展。
- 机构后台：Payload Admin 管理求助申请、四辨报告、公开项目、帮助意向和反馈报告。
- 领域逻辑：纯 TypeScript 的四辨报告、钱/物/服帮助意向分类与匹配。
- 本地数据库：SQLite，连接串在 `.env` 中；后续产品化部署可迁移到 Postgres。

## Compliance Boundary

平台不自营公开募捐，不代收善款，不建立资金池。公众侧只做帮助意向登记，不做真实支付；真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。

本地种子数据全部为虚构/脱敏案例，不应上传或处理真实患者隐私数据。AI 或规则输出只作为证据、风险、优先级和复核清单，不替代机构工作人员最终判断，也不提供医疗诊断或治疗建议。

## Requirements

- Node.js `^18.20.2` 或 `>=20.9.0`
- npm

## Environment

本地 `.env` 至少需要：

```bash
DATABASE_URL=file:./shanjian-platform.db
PAYLOAD_SECRET=replace-with-a-local-secret
```

`DATABASE_URL` 指向本地 SQLite 文件。`PAYLOAD_SECRET` 只用于本地开发时可以使用任意足够长的随机字符串；不要提交真实密钥。

## Run Locally

```bash
npm install
npm run dev
```

打开：

- 公众项目展示：`http://localhost:3000`
- 项目列表：`http://localhost:3000/projects`
- 帮助意向登记：`http://localhost:3000/intentions/new`
- Payload Admin：`http://localhost:3000/admin`

首次进入 `/admin` 时，按 Payload 页面提示创建第一个机构用户。

## Public Flow

- `/` 和 `/projects` 展示脱敏公开项目索引。
- `/projects/[slug]` 展示项目事实、证据摘要、真实需要、救助进展和帮助入口。
- `/intentions/new?project=<slug>` 登记钱、物、服三类帮助意向，并生成机构跟进建议。

公众侧始终提示平台只登记帮助意向，不在平台内收款。

## Admin Collections

- `Users`：机构用户和角色。
- `AidApplications`：求助申请和材料承接。
- `CaseReviews`：四辨审核报告。
- `PublicProjects`：脱敏公开项目。
- `DonationIntentions`：帮助意向，不是支付记录。
- `FeedbackReports`：机构复核后的反馈报告。
- `Media`：Payload 媒体资产集合。

## Domain Logic

- `src/domain/charity.ts`：共享类型、标签和格式化工具。
- `src/domain/discernment.ts`：确定性的四辨报告生成。
- `src/domain/intentions.ts`：帮助意向分类和真实需要匹配。
- `src/domain/demoSeed.ts`：虚构/脱敏样例数据。

领域模块不依赖 React、Payload Admin 或浏览器全局对象，便于直接测试和迁移。

## Verify

```bash
npm test
npm run generate:types
npm run build
```

## Main Files

- `src/app/(frontend)/`：公众侧路由。
- `src/app/(payload)/`：Payload Admin、REST、GraphQL 路由。
- `src/collections/*`：机构业务集合。
- `src/components/public/*`：项目列表、项目详情、帮助意向登记。
- `src/components/ui/*`：轻量 UI 基础组件。

## Development Notes

- 公共页面优先呈现项目事实和机构边界，不做营销化包装。
- 后台第一阶段优先使用 Payload Admin，避免过早维护一套独立运营后台。
- 新增业务规则时优先放在 `src/domain/`，再由页面、组件或 Payload 集合调用。
- 不要把真实患者资料、联系方式、病房、学校、详细地址或真实捐赠记录写入本地种子数据。
