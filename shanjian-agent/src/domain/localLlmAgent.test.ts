import { describe, expect, it, vi } from 'vitest';
import { demoAidApplication } from './demoData';
import { buildLocalLlmConfig, runLocalFourDiscernmentAgent } from './localLlmAgent';

describe('local LLM agent adapter', () => {
  it('keeps the configured base URL separate from the internal chat endpoint', () => {
    expect(buildLocalLlmConfig().baseUrl).toBe('http://127.0.0.1:3000');
    expect(buildLocalLlmConfig().chatCompletionsUrl).toBe('http://127.0.0.1:3000/v1/chat/completions');
    expect(buildLocalLlmConfig({ baseUrl: 'https://api.opencodex.uk/v1' }).baseUrl).toBe('https://api.opencodex.uk');
    expect(buildLocalLlmConfig({ baseUrl: 'https://api.opencodex.uk/v1' }).chatCompletionsUrl).toBe(
      'https://api.opencodex.uk/v1/chat/completions',
    );
    expect(buildLocalLlmConfig({ baseUrl: 'http://127.0.0.1:3000/v1/chat/completions' }).baseUrl).toBe(
      'http://127.0.0.1:3000',
    );
  });

  it('calls the local LLM as the four-discernment review brain with the provided api key', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                goodAndHarm: [
                  {
                    id: 'privacy-risk',
                    category: 'privacy',
                    label: '公开材料存在隐私风险',
                    evidence: '叙事中包含学校和病房楼层。',
                    severity: 'high',
                  },
                ],
                truth: [
                  {
                    id: 'invoice-missing',
                    category: 'amount_conflict',
                    label: '最新票据缺失',
                    evidence: '材料备注显示最新发票缺失。',
                    severity: 'high',
                  },
                ],
                scale: {
                  urgency: 'high',
                  resourceGap: 100000,
                  rationale: '连续治疗阶段需要优先核验费用缺口。',
                },
                proximity: ['联系医院社工核实治疗阶段'],
                humanChecklist: ['人工核对最新发票与费用清单金额是否一致'],
              }),
            },
          },
        ],
      }),
    });

    const result = await runLocalFourDiscernmentAgent(demoAidApplication, { fetcher });

    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-6',
          'Content-Type': 'application/json',
        }),
      }),
    );
    const request = JSON.parse(String(fetcher.mock.calls[0][1]?.body));
    expect(request.messages[0].content).toContain('机构四辨审核');
    expect(request.messages[0].content).not.toContain('获奖');
    expect(request.messages[0].content).not.toContain('评分');
    expect(request.messages[0].content).not.toContain('路演');
    expect(request.messages[1].content).toContain('患儿A');
    expect(request.messages[1].content).toContain('最新发票缺失');
    expect(result.source).toBe('local-llm');
    expect(result.report.humanChecklist).toContain('人工核对最新发票与费用清单金额是否一致');
  });
});
