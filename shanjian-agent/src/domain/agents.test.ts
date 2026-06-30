import { describe, expect, it } from 'vitest';
import { demoAidApplication, seedPublicProjects } from './demoData';

describe('demo data', () => {
  it('uses fictional de-identified serious-illness data', () => {
    expect(demoAidApplication.patientAlias).toBe('患儿A');
    expect(demoAidApplication.disease).toContain('急性淋巴细胞白血病');
    expect(demoAidApplication.rawNarrative).not.toMatch(/\d{11}/);
    expect(demoAidApplication.rawNarrative).not.toContain('身份证');
  });

  it('seeds public projects for the home page', () => {
    expect(seedPublicProjects).toHaveLength(3);
    expect(seedPublicProjects[0].status).toBe('receiving_intentions');
  });
});
