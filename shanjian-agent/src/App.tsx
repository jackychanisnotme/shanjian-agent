import { useEffect, useState } from 'react';
import { loadDemoState, saveDemoState } from './app/demoStore';
import { navItems, type ViewKey } from './app/navigation';
import './styles/global.css';

export default function App() {
  const [view, setView] = useState<ViewKey>('home');
  const [state] = useState(loadDemoState);

  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  return (
    <main className="app-root">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setView('home')}>
          善见 Agent
        </button>
        <nav className="topnav" aria-label="后台入口">
          {navItems.map((item) => (
            <button key={item.key} type="button" onClick={() => setView(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {view === 'home' && (
        <section className="view-panel" aria-labelledby="home-title">
          <p className="eyebrow">大病救助项目系统 MVP</p>
          <h1 id="home-title">公众项目展示</h1>
          <p>当前展示项目：{state.projects.length}个</p>
        </section>
      )}

      {view === 'application' && (
        <section className="view-panel" aria-labelledby="application-title">
          <h1 id="application-title">求助申请入口</h1>
          <p>用于提交虚构/脱敏的大病救助申请材料。</p>
        </section>
      )}

      {view === 'workbench' && (
        <section className="view-panel" aria-labelledby="workbench-title">
          <h1 id="workbench-title">机构四辨工作台</h1>
          <p>AI 仅生成证据、风险和人工复核清单。</p>
        </section>
      )}

      {view === 'intentions' && (
        <section className="view-panel" aria-labelledby="intentions-title">
          <h1 id="intentions-title">捐助意向管理</h1>
          <p>平台仅登记帮助意向，不在平台内收款。</p>
        </section>
      )}
    </main>
  );
}
