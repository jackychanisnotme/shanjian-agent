# 善见 Agent

大病救助项目系统。首页展示公众项目，后台承接求助申请、机构四辨审核和捐助意向管理，并通过 AI问项目、钱/物/服资源匹配和透明反馈，让善意更精准地抵达真实需要。

## Run

```bash
npm install
npm run dev
```

## Local LLM

机构四辨工作台默认调用本地 OpenAI-compatible 接口：

```text
Base URL: http://127.0.0.1:3000
API key: sk-6
```

代码内部会按 OpenAI-compatible 约定请求 `/v1/chat/completions`。产品界面只展示 Base URL。如果本地 LLM 未启动，四辨工作台会使用本地规则兜底，保证审核结果不空白。生产环境不应把 API key 放在浏览器端，本项目按本地演示处理。

## Verify

```bash
npm test
npm run build
```

## Product Scope

- 首页第一屏是公众项目展示，面向机构日常使用，不放产品自我解释或方案论证内容。
- 右上角三个入口分别是：求助申请入口、机构四辨工作台、捐助意向管理。
- 主要界面有独立 URL 路径：`/projects`、`/apply`、`/workbench`、`/intentions`。
- 基础 AI 功能由 deterministic local agent functions 实现，离线可演示，接口集中在 `src/domain/agents.ts`；机构四辨工作台通过 `src/domain/localLlmAgent.ts` 接入本地 LLM。
- 样例数据均为虚构/脱敏大病救助案例，不上传或处理真实患者隐私数据。
- 捐助功能只做“捐助/帮助意向登记”，支持钱、物、服三类资源匹配，不做真实支付。
- 所有审核输出都是证据、风险、优先级和人工复核清单，最终判断由机构工作人员完成。

## Compliance Boundary

本系统样例不处理真实患者数据，不自营公开募捐，不代收善款，不建立资金池，不提供医疗诊断或治疗建议。捐助功能为意向登记，由有资质机构后续跟进；真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
