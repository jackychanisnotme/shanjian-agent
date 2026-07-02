import type { AidApplication, PublicProject } from './types';

const defaultBaseUrl = 'http://127.0.0.1:3000';
const defaultApiKey = 'sk-6';
const defaultModel = 'local-charity-agent';

export interface LocalLlmConfigInput {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface LocalLlmConfig {
  apiKey: string;
  baseUrl: string;
  chatCompletionsUrl: string;
  model: string;
}

export interface AwardDemoAgentInput {
  application: AidApplication;
  judgeQuestion: string;
  projects: PublicProject[];
}

export interface AwardDemoAgentResult {
  content: string;
  source: 'local-llm' | 'fallback';
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

interface RunAwardDemoOptions {
  config?: LocalLlmConfigInput;
  fetcher?: typeof fetch;
}

export function buildLocalLlmConfig(input: LocalLlmConfigInput = {}): LocalLlmConfig {
  const normalizedBaseUrl = normalizeBaseUrl(input.baseUrl ?? defaultBaseUrl);

  return {
    apiKey: input.apiKey ?? defaultApiKey,
    baseUrl: normalizedBaseUrl,
    chatCompletionsUrl: `${normalizedBaseUrl}/chat/completions`,
    model: input.model ?? defaultModel,
  };
}

export async function runAwardDemoAgent(
  input: AwardDemoAgentInput,
  options: RunAwardDemoOptions = {},
): Promise<AwardDemoAgentResult> {
  const config = buildLocalLlmConfig(options.config);
  const fetcher = options.fetcher ?? globalThis.fetch;

  if (!fetcher) {
    return {
      content: buildFallbackDemoAnswer(input),
      source: 'fallback',
    };
  }

  try {
    const response = await fetcher(config.chatCompletionsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              '你是慈善机构工作人员的获奖 Demo Agent。请从 Demo、用户价值、技术实现、创新性、商业潜力和路演表达六个评分维度输出极简建议。只基于输入材料，不编造真实患者信息，不给医疗建议。',
          },
          {
            role: 'user',
            content: buildAwardDemoPrompt(input),
          },
        ],
      }),
    });

    const payload = (await response.json()) as ChatCompletionResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message ?? 'Local LLM request failed');
    }

    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Local LLM returned an empty answer');
    }

    return {
      content,
      source: 'local-llm',
    };
  } catch {
    return {
      content: buildFallbackDemoAnswer(input),
      source: 'fallback',
    };
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  const withoutTrailingSlash = baseUrl.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/v1') ? withoutTrailingSlash : `${withoutTrailingSlash}/v1`;
}

function buildAwardDemoPrompt(input: AwardDemoAgentInput): string {
  const projectSummaries = input.projects
    .map((project) => `${project.patientAlias}：${project.verifiedNeed}，缺口${project.resourceGap}元，意向${project.matchedIntentions}条`)
    .join('\n');

  return [
    `评委问题：${input.judgeQuestion}`,
    `当前案例：${input.application.patientAlias}，${input.application.disease}，${input.application.treatmentStage}`,
    `材料备注：${input.application.materialNotes.join('；')}`,
    `真实需要：${input.application.requestedNeeds.map((need) => need.label).join('、')}`,
    `公开项目：\n${projectSummaries}`,
    '请输出：1. 5分钟 Demo 顺序；2. 技术亮点；3. 用户价值量化；4. 商业落地一句话。',
  ].join('\n');
}

function buildFallbackDemoAnswer(input: AwardDemoAgentInput): string {
  return [
    '本地LLM暂不可用，已使用离线获奖剧本。',
    `先展示${input.application.patientAlias}的混乱求助材料，再一键生成机构申请包、证据链、隐私风险、脱敏项目页、钱物服匹配和反馈草稿。`,
    '技术亮点：OpenAI-compatible 本地 Agent、证据来源提示、金额一致性检查、隐私脱敏边界和合规话术。',
    '用户价值：把一线社工的材料整理、复核准备和反馈初稿从小时级压缩到分钟级。',
    '商业落地：从大病救助项目切入，卖给慈善机构、基金会、医院社工部和政府购买服务项目。',
  ].join('\n');
}
