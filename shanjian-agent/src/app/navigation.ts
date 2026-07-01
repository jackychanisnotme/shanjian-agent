export type ViewKey = 'home' | 'application' | 'workbench' | 'intentions';

export const viewPaths: Record<ViewKey, string> = {
  home: '/projects',
  application: '/apply',
  workbench: '/workbench',
  intentions: '/intentions',
};

export const navItems: Array<{ key: Exclude<ViewKey, 'home'>; label: string }> = [
  { key: 'application', label: '求助申请入口' },
  { key: 'workbench', label: '机构四辨工作台' },
  { key: 'intentions', label: '捐助意向管理' },
];

export function pathForView(view: ViewKey): string {
  return viewPaths[view];
}

export function viewFromPathname(pathname: string): ViewKey {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/' || normalized === '/projects') return 'home';
  if (normalized === '/apply') return 'application';
  if (normalized === '/workbench') return 'workbench';
  if (normalized === '/intentions') return 'intentions';

  return 'home';
}
