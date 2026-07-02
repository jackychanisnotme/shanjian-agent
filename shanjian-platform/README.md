# 善见 Platform

Payload + Next.js 版本的善见业务系统底座。这个目录是新的生产化 v2，和旧的 `shanjian-agent/` Vite demo 并排存在。

## Scope

- 公众项目展示：脱敏项目列表、项目详情、证据摘要、真实需要和进展。
- 机构后台：Payload Admin 管理求助申请、四辨报告、公开项目、帮助意向和反馈报告。
- 领域逻辑：纯 TypeScript 的四辨报告、钱/物/服帮助意向分类与匹配。
- 本地数据库：SQLite，连接串在 `.env` 中。

## Compliance Boundary

平台不自营公开募捐，不代收善款，不建立资金池。公众侧只做帮助意向登记，不做真实支付；真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。

本地种子数据全部为虚构/脱敏案例，不应上传或处理真实患者隐私数据。AI 或规则输出只作为证据、风险、优先级和复核清单，不替代机构工作人员最终判断，也不提供医疗诊断或治疗建议。

## Run

```bash
npm install
npm run dev
```

Open:

- Public project registry: `http://localhost:3000`
- Payload Admin: `http://localhost:3000/admin`

## Verify

```bash
npm test
npm run generate:types
npm run build
```

## Main Files

- `src/domain/charity.ts`: shared charity domain types and labels.
- `src/domain/discernment.ts`: deterministic four-discernment report builder.
- `src/domain/intentions.ts`: help-intention classification and matching.
- `src/domain/demoSeed.ts`: fictional project and application data.
- `src/collections/*`: Payload collections for institutional operations.
- `src/components/public/*`: public project registry, detail and intention form.

