import { useEffect, useState } from 'react';
import { loadDemoState, saveDemoState } from './app/demoStore';
import { pathForView, viewFromPathname, type ViewKey } from './app/navigation';
import { AppShell } from './components/AppShell';
import { AidApplicationEntry } from './components/AidApplicationEntry';
import { AwardDemoCenter } from './components/AwardDemoCenter';
import { ComplianceNotice } from './components/ComplianceNotice';
import { DonationIntentionManagement } from './components/DonationIntentionManagement';
import { FourDiscernmentWorkbench } from './components/FourDiscernmentWorkbench';
import { MetricStrip } from './components/MetricStrip';
import { HomeVisual } from './components/HomeVisual';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectQuestionPanel } from './components/ProjectQuestionPanel';
import './styles/global.css';

export default function App() {
  const [view, setView] = useState<ViewKey>(() => viewFromPathname(currentPathname()));
  const [state, setState] = useState(loadDemoState);
  const selectedProject = state.projects.find((project) => project.id === state.selectedProjectId) ?? state.projects[0];

  useEffect(() => {
    const normalizedView = viewFromPathname(currentPathname());
    const normalizedPath = pathForView(normalizedView);

    setView(normalizedView);
    if (currentPathname() !== normalizedPath) {
      window.history.replaceState({}, '', normalizedPath);
    }

    function handlePopState() {
      setView(viewFromPathname(currentPathname()));
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  function navigate(nextView: ViewKey) {
    setView(nextView);
    const nextPath = pathForView(nextView);

    if (currentPathname() !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  }

  function selectProject(projectId: string) {
    setState((current) => ({ ...current, selectedProjectId: projectId }));
  }

  function openHelpIntention(projectId: string) {
    selectProject(projectId);
    navigate('intentions');
  }

  return (
    <AppShell view={view} onNavigate={navigate}>
      {view === 'home' && (
        <div className="view-panel public-home">
          <section className="home-hero" aria-labelledby="home-title">
            <div className="home-hero-copy">
              <p className="section-kicker">善见 Agent · 公益机构项目系统</p>
              <h1 id="home-title">把救助个案变成可复核项目</h1>
              <p>
                本地 Agent 串联材料整理、四辨审核、脱敏公示、资源匹配和透明反馈。
              </p>
              <div className="hero-actions" aria-label="核心操作">
                <button className="primary-button" type="button" onClick={() => navigate('application')}>
                  提交求助申请
                </button>
                <button className="secondary-button" type="button" onClick={() => navigate('workbench')}>
                  查看机构复核
                </button>
              </div>
            </div>
            <HomeVisual />
          </section>

          <AwardDemoCenter application={state.applications[0]} projects={state.projects} />

          <section className="project-section" aria-labelledby="public-project-title">
            <div className="section-heading">
              <p className="section-kicker">公开项目索引</p>
              <h1 id="public-project-title">公众项目展示</h1>
              <p>选择一个脱敏案例，查看项目进展、证据摘要、AI 问项目和帮助意向入口。</p>
            </div>
            <div className="home-grid" aria-label="公众项目列表与详情">
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
            </div>
          </section>

          <section className="home-intro-grid" aria-label="产品定位">
            <article>
              <span>01</span>
              <h2>公开展示</h2>
              <p>公众先看到脱敏项目事实、真实需要、救助进展和反馈草稿，而不是情绪化募捐文案。</p>
            </article>
            <article>
              <span>02</span>
              <h2>项目核验路径</h2>
              <p>求助材料进入机构工作台，AI 只整理证据、风险和缺失项，最终由工作人员复核。</p>
            </article>
            <article>
              <span>03</span>
              <h2>尊严与选择</h2>
              <p>帮助意向按钱、物、服匹配受助人真实需要，避免把所有善意都压成单一现金。</p>
            </article>
          </section>

          <ComplianceNotice />
          <MetricStrip />
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

function currentPathname() {
  if (typeof window === 'undefined') return '/projects';
  return window.location.pathname;
}
