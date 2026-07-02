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

## 四辨审核 Agent 规则

- 四辨审核 Agent 只能生成辅助建议，不应直接修改人工决策字段。
- Agent 输出应覆盖辨善恶、辨真伪、辨大小、辨远近和人工复核清单。
- 对证据不足、隐私风险、医疗结论不确定、公开募捐合规边界不清的情况，必须提示人工复核。
- 不要自动公开项目。公开项目草稿仍需后台机构用户手动发布。
- 不要承诺救助结果、拨款结果、票据结果或治疗效果。

## 数据流建议

四辨审核细调时，优先从 `aid-applications` 读取申请材料，从 `agent-configs` 读取启用配置，生成 `case-reviews` 草稿字段。若没有启用的 Agent 配置，应回退到现有规则辅助逻辑，并在后台提示需要配置模型。

## 测试要求

涉及 Agent 配置或四辨审核 Agent 的改动，至少覆盖：

- 未登录用户不能读取或写入 `agent-configs`。
- 非管理员后台用户不能读取或写入 `agent-configs`。
- 管理员可以创建和更新 Agent 配置。
- Agent 调用不得把 `apiKey` 暴露给前台组件或公开 API。
- 生成公开项目时仍保持 `isPublished=false`，不要自动公开项目。
