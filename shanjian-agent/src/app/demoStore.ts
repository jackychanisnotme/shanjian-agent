import { demoAidApplication, seedDonationIntentions, seedPublicProjects } from '../domain/demoData';
import type { AidApplication, DonationIntention, PublicProject, ReviewDecision } from '../domain/types';
import { loadJson, saveJson } from './storage';

const storageKey = 'shanjian-agent-demo-state';

export interface DemoState {
  applications: AidApplication[];
  projects: PublicProject[];
  intentions: DonationIntention[];
  selectedProjectId: string;
  latestDecision?: ReviewDecision;
}

export const initialDemoState: DemoState = {
  applications: [demoAidApplication],
  projects: seedPublicProjects,
  intentions: seedDonationIntentions,
  selectedProjectId: seedPublicProjects[0].id,
};

export function loadDemoState(): DemoState {
  return loadJson(storageKey, initialDemoState);
}

export function saveDemoState(state: DemoState): void {
  saveJson(storageKey, state);
}
