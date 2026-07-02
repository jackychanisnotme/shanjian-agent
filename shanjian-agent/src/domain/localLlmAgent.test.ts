import { describe, expect, it, vi } from 'vitest';
import { demoAidApplication, seedPublicProjects } from './demoData';
import { buildLocalLlmConfig, runAwardDemoAgent } from './localLlmAgent';

describe('local LLM agent adapter', () => {
  it('normalizes the local OpenAI-compatible endpoint without duplicating v1', () => {
    expect(buildLocalLlmConfig().chatCompletionsUrl).toBe('http://127.0.0.1:3000/v1/chat/completions');
    expect(buildLocalLlmConfig({ baseUrl: 'https://api.opencodex.uk/v1' }).chatCompletionsUrl).toBe(
      'https://api.opencodex.uk/v1/chat/completions',
    );
  });

  it('calls the local LLM with the demo case, scoring context and provided api key', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '本地LLM输出：先展示混乱材料，再生成证据链、脱敏项目、钱物服匹配和反馈草稿。',
            },
          },
        ],
      }),
    });

    const result = await runAwardDemoAgent(
      {
        application: demoAidApplication,
        projects: seedPublicProjects,
        judgeQuestion: '5分钟内如何证明用户价值？',
      },
      { fetcher },
    );

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
    expect(request.messages[0].content).toContain('慈善机构工作人员');
    expect(request.messages[1].content).toContain('患儿A');
    expect(request.messages[1].content).toContain('5分钟内如何证明用户价值');
    expect(result.source).toBe('local-llm');
    expect(result.content).toContain('本地LLM输出');
  });
});
