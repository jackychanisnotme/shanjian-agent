# 善见 Agent

大病救助项目系统 MVP。首页展示公众项目，后台承接求助申请、机构四辨审核和捐助意向管理，并通过 AI问项目、钱/物/服资源匹配和透明反馈，让善意更精准地抵达真实需要。

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

## MVP Scope

- 首页第一屏是公众项目展示，不是营销 landing page。
- 右上角三个入口分别是：求助申请入口、机构四辨工作台、捐助意向管理。
- 主要界面有独立 URL 路径：`/projects`、`/apply`、`/workbench`、`/intentions`。
- AI 功能由 deterministic local agent functions 实现，离线可演示，接口集中在 `src/domain/agents.ts`，后续可替换真实 LLM。
- Demo 数据均为虚构/脱敏大病救助案例，不上传或处理真实患者隐私数据。
- 捐助功能只做“捐助/帮助意向登记”，支持钱、物、服三类资源匹配，不做真实支付。
- 所有审核输出都是证据、风险、优先级和人工复核清单，最终判断由机构工作人员完成。

## Compliance Boundary

本 demo 不处理真实患者数据，不自营公开募捐，不代收善款，不建立资金池，不提供医疗诊断或治疗建议。捐助功能为意向登记，由有资质机构后续跟进；真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
