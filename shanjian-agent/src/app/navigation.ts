export type ViewKey = 'home' | 'application' | 'workbench' | 'intentions';

export const navItems: Array<{ key: Exclude<ViewKey, 'home'>; label: string }> = [
  { key: 'application', label: '求助申请入口' },
  { key: 'workbench', label: '机构四辨工作台' },
  { key: 'intentions', label: '捐助意向管理' },
];
