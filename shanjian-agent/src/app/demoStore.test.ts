import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadDemoState } from './demoStore';

describe('demo store', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();

    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
      setItem: (key: string, value: string) => storage.set(key, value),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not hydrate stale homepage/workbench copy from the previous product version', () => {
    window.localStorage.setItem(
      'shanjian-agent-demo-state',
      JSON.stringify({
        applications: [
          {
            evidence: [
              {
                note: '显示疾病类型与治疗阶段，仅用于 demo。',
              },
            ],
          },
        ],
        projects: [],
        intentions: [],
        selectedProjectId: 'project-child-a',
      }),
    );

    const state = loadDemoState();
    const evidenceNotes = state.applications.flatMap((application) =>
      application.evidence.map((item) => item.note),
    );

    expect(evidenceNotes.join(' ')).not.toMatch(/仅用于 demo/i);
  });
});
