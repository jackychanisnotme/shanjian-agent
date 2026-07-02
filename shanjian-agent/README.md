# 善见 Agent

大病救助项目系统 MVP。首页展示公众项目，后台承接求助申请、机构四辨审核和捐助意向管理，并通过 AI问项目、钱/物/服资源匹配和透明反馈，让善意更精准地抵达真实需要。

## Run

```bash
npm install
npm run dev
```

## Local LLM Agent

获奖 Demo 中心默认调用本地 OpenAI-compatible 接口：

```text
Base URL: http://127.0.0.1:3000
Chat endpoint: http://127.0.0.1:3000/v1/chat/completions
API key: sk-6
```

如果本地 LLM 未启动，页面会自动使用离线兜底剧本，保证现场 Demo 不空白。生产环境不应把 API key 放在浏览器端，本项目按黑客松本地演示处理。

## Verify

```bash
npm test
npm run build
```

## MVP Scope

- 首页第一屏是获奖导向产品演示，随后保留公众项目展示作为核心业务闭环。
- 首页新增 `获奖 Demo 中心`，把混乱求助材料、证据链、脱敏公示、钱/物/服匹配和反馈草稿压缩成 5 分钟演示路径。
- `材料智能处理台` 显性展示 OCR抽取、金额矛盾和隐私脱敏能力，便于评委理解技术实现。
- 右上角三个入口分别是：求助申请入口、机构四辨工作台、捐助意向管理。
- 主要界面有独立 URL 路径：`/projects`、`/apply`、`/workbench`、`/intentions`。
- 基础 AI 功能由 deterministic local agent functions 实现，离线可演示，接口集中在 `src/domain/agents.ts`；获奖 Demo Agent 通过 `src/domain/localLlmAgent.ts` 接入本地 LLM。
- Demo 数据均为虚构/脱敏大病救助案例，不上传或处理真实患者隐私数据。
- 捐助功能只做“捐助/帮助意向登记”，支持钱、物、服三类资源匹配，不做真实支付。
- 所有审核输出都是证据、风险、优先级和人工复核清单，最终判断由机构工作人员完成。

## Compliance Boundary

本 demo 不处理真实患者数据，不自营公开募捐，不代收善款，不建立资金池，不提供医疗诊断或治疗建议。捐助功能为意向登记，由有资质机构后续跟进；真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
