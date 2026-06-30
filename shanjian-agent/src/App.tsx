import { useEffect, useState } from 'react';
import { loadDemoState, saveDemoState } from './app/demoStore';
import type { ViewKey } from './app/navigation';
import { AppShell } from './components/AppShell';
import { AidApplicationEntry } from './components/AidApplicationEntry';
import { ComplianceNotice } from './components/ComplianceNotice';
import { DonationIntentionManagement } from './components/DonationIntentionManagement';
import { FourDiscernmentWorkbench } from './components/FourDiscernmentWorkbench';
import { MetricStrip } from './components/MetricStrip';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectQuestionPanel } from './components/ProjectQuestionPanel';
import './styles/global.css';

export default function App() {
  const [view, setView] = useState<ViewKey>('home');
  const [state, setState] = useState(loadDemoState);
  const selectedProject = state.projects.find((project) => project.id === state.selectedProjectId) ?? state.projects[0];

  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  function selectProject(projectId: string) {
    setState((current) => ({ ...current, selectedProjectId: projectId }));
  }

  function openHelpIntention(projectId: string) {
    selectProject(projectId);
    setView('intentions');
  }

  return (
    <AppShell view={view} onNavigate={setView}>
      {view === 'home' && (
        <div className="view-panel public-home">
          <section className="home-heading" aria-labelledby="home-title">
            <p className="eyebrow">机构项目系统 · 虚构/脱敏演示数据</p>
            <h1 id="home-title">公众项目展示</h1>
            <p>
              展示经机构审核后的大病救助项目、救助进展和成果反馈。公众在这里了解真实需要，并提交钱、物、服三类帮助意向。
            </p>
          </section>
          <ComplianceNotice />
          <MetricStrip />
          <section className="home-grid" aria-label="公众项目列表与详情">
            <div className="project-list" aria-label="项目列表">
              {state.projects.map((project) => (
                <ProjectCard
                  active={project.id === selectedProject.id}
                  key={project.id}
                  project={project}
                  onHelp={openHelpIntention}
                  onSelect={selectProject}
                />
              ))}
            </div>
            <div className="project-workspace">
              <ProjectDetail project={selectedProject} onHelp={openHelpIntention} />
              <ProjectQuestionPanel project={selectedProject} />
            </div>
          </section>
        </div>
      )}

      {view === 'application' && (
        <AidApplicationEntry application={state.applications[0]} />
      )}

      {view === 'workbench' && (
        <FourDiscernmentWorkbench
          application={state.applications[0]}
          onDecision={(latestDecision) => setState((current) => ({ ...current, latestDecision }))}
        />
      )}

      {view === 'intentions' && (
        <DonationIntentionManagement
          intentions={state.intentions}
          project={selectedProject}
          projects={state.projects}
          onRegister={(intention) =>
            setState((current) => ({
              ...current,
              intentions: [intention, ...current.intentions],
            }))
          }
        />
      )}
    </AppShell>
  );
}
