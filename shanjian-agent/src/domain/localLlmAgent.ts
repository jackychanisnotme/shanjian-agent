import { runFourDiscernment } from './agents';
import type { AidApplication, FourDiscernmentReport } from './types';

const defaultBaseUrl = 'http://127.0.0.1:3000';
const defaultApiKey = 'sk-6';
const defaultModel = 'local-charity-reviewer';

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

export interface LocalFourDiscernmentResult {
  report: FourDiscernmentReport;
  source: 'local-llm' | 'fallback';
}

interface RunLocalFourDiscernmentOptions {
  config?: LocalLlmConfigInput;
  fetcher?: typeof fetch;
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

export function buildLocalLlmConfig(input: LocalLlmConfigInput = {}): LocalLlmConfig {
  const baseUrl = normalizeBaseUrl(input.baseUrl ?? defaultBaseUrl);

  return {
    apiKey: input.apiKey ?? defaultApiKey,
    baseUrl,
    chatCompletionsUrl: `${baseUrl}/v1/chat/completions`,
    model: input.model ?? defaultModel,
  };
}

export async function runLocalFourDiscernmentAgent(
  application: AidApplication,
  options: RunLocalFourDiscernmentOptions = {},
): Promise<LocalFourDiscernmentResult> {
  const config = buildLocalLlmConfig(options.config);
  const fetcher = options.fetcher ?? globalThis.fetch;

  if (!fetcher) {
    return fallbackReport(application);
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
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content:
              '你是公益机构四辨审核工作台的大脑。只做机构复核建议，不做募捐营销、公开传播或医疗诊断。请输出严格 JSON，字段为 goodAndHarm、truth、scale、proximity、humanChecklist。',
          },
          {
            role: 'user',
            content: buildReviewPrompt(application),
          },
        ],
      }),
    });

    const payload = (await response.json()) as ChatCompletionResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message ?? 'Local LLM request failed');
    }

    const content = payload.choices?.[0]?.message?.content;
    const report = parseFourDiscernmentReport(content);

    if (!report) {
      throw new Error('Local LLM returned an invalid four-discernment report');
    }

    return {
      report,
      source: 'local-llm',
    };
  } catch {
    return fallbackReport(application);
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl
    .replace(/\/+$/, '')
    .replace(/\/v1\/chat\/completions$/i, '')
    .replace(/\/v1$/i, '');
}

function buildReviewPrompt(application: AidApplication): string {
  return [
    `案例：${application.patientAlias}`,
    `疾病与阶段：${application.disease}，${application.treatmentStage}`,
    `地区：${application.hospitalRegion}`,
    `费用：总费用${application.expenseTotal}元，已支付${application.paidAmount}元，报销预估${application.reimbursementEstimate}元，缺口${application.remainingGap}元`,
    `家庭负担：${application.familyBurden}`,
    `材料备注：${application.materialNotes.join('；')}`,
    `证据状态：${application.evidence.map((item) => `${item.label}/${item.status}/${item.note}`).join('；')}`,
    `受助人需要：${application.requestedNeeds.map((need) => `${need.label}/${need.category}/${need.priority}`).join('；')}`,
    '请按辨善恶、辨真伪、辨大小、辨远近生成可追溯证据、风险解释和人工复核清单。',
  ].join('\n');
}

function parseFourDiscernmentReport(content: string | undefined): FourDiscernmentReport | null {
  if (!content) return null;

  const raw = extractJson(content);

  try {
    const parsed = JSON.parse(raw) as FourDiscernmentReport;
    if (
      Array.isArray(parsed.goodAndHarm) &&
      Array.isArray(parsed.truth) &&
      parsed.scale &&
      typeof parsed.scale.resourceGap === 'number' &&
      Array.isArray(parsed.proximity) &&
      Array.isArray(parsed.humanChecklist)
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function extractJson(content: string): string {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return content.trim();
}

function fallbackReport(application: AidApplication): LocalFourDiscernmentResult {
  return {
    report: runFourDiscernment(application),
    source: 'fallback',
  };
}
