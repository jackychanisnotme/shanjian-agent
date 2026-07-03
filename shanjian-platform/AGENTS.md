# 善见平台 Agents 指南

## 项目边界

善见平台只登记求助申请、四辨审核建议、公开项目草稿、帮助意向和反馈报告。Agent 可以辅助整理材料、生成复核建议和起草文案，但最终审核、发布和跟进必须由机构人员完成。

## Agent 配置

后台菜单中的 `Agent 配置` 对应 Payload 集合 `agent-configs`。后续实现四辨审核 Agent 时，应从启用的配置读取：

- `baseUrl`：OpenAI 兼容接口地址或本地模型网关地址。
- `apiKey`：后台服务端调用大模型使用的密钥。
- `modelName`：模型名称。
- `temperature`、`maxOutputTokens`、`timeoutSeconds`：推理参数。
- `systemPrompt`：四辨审核 Agent 的基础系统提示词。

`apiKey` 只能在服务端读取和使用。不要把 `apiKey` 传给前台页面、公开 REST/GraphQL 响应、浏览器日志、服务端普通日志或测试快照。

## Agent Runtime

服务端 Agent Runtime 位于 `src/server/agent`，第一期只开放工具底座，不直接执行四辨审核决策。工具定义使用 Zod 做参数校验，并统一生成 JSON schema；工具执行必须经过 `executeAgentTool`，由执行器负责超时、错误包装、结果截断、敏感字段脱敏和审计日志。

后台 `Agent 运行日志` 对应 Payload 集合 `agent-runtime-logs`。日志只能保存工具名、读写分类、耗时、成功状态、参数摘要、结果摘要和错误摘要，不保存完整 `apiKey`、Token、密码、授权头或未脱敏长文本。

当前默认能力包：

- `base-read-pack`：运行时状态、本地文件列目录/搜索/读取、只读终端状态与只读命令。
- `repo-pack`：当前仓库列表、README 摘要、指定仓库文件读取；依赖 `base-read-pack`。
- `data-pack`、`memory-pack`、`search-pack`：先保留能力包名称，后续扩展 SQL、长期记忆、联网搜索时再逐步挂载。

只读终端只能用于检查型命令，例如 `ls`、`rg`、`cat`、`git status`、`git diff`。不要开放 `npm run`、`python` 写文件、`rm`、`git reset`、`git checkout`、`git clean`、管道、重定向或外部提交命令，除非后续有单独的人工确认机制和审计测试。

## 四辨审核 Agent 规则

- 四辨审核 Agent 只能生成辅助建议，不应直接修改人工决策字段。
- Agent 输出应覆盖辨善恶、辨真伪、辨大小、辨远近和人工复核清单。
- 对证据不足、隐私风险、医疗结论不确定、公开募捐合规边界不清的情况，必须提示人工复核。
- 不要自动公开项目。公开项目草稿仍需后台机构用户手动发布。
- 不要承诺救助结果、拨款结果、票据结果或治疗效果。
- 接入四辨审核 Agent 时，第一期只能使用只读文件、仓库、只读终端和机构知识读取工具；不要让 Agent 自动修改 `case-reviews.decision`、`public-projects.isPublished` 或任何公开发布字段。

## 数据流建议

四辨审核细调时，优先从 `aid-applications` 读取申请材料，从 `agent-configs` 读取启用配置，生成 `case-reviews` 草稿字段。若没有启用的 Agent 配置，应回退到现有规则辅助逻辑，并在后台提示需要配置模型。

## 测试要求

涉及 Agent 配置或四辨审核 Agent 的改动，至少覆盖：

- 未登录用户不能读取或写入 `agent-configs`。
- 非管理员后台用户不能读取或写入 `agent-configs`。
- 管理员可以创建和更新 Agent 配置。
- Agent 调用不得把 `apiKey` 暴露给前台组件或公开 API。
- Agent 工具调用必须写入 `agent-runtime-logs`，并验证摘要中没有密钥、Token 或密码。
- 只读终端测试必须覆盖允许命令和拒绝命令。
- 生成公开项目时仍保持 `isPublished=false`，不要自动公开项目。
