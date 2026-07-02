import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { seedPublicProjects } from '../domain/demoData';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  it('keeps project actions wired while exposing project progress', async () => {
    const user = userEvent.setup();
    const onHelp = vi.fn();
    const onSelect = vi.fn();
    const project = seedPublicProjects[0];

    render(
      <ProjectCard
        active
        onHelp={onHelp}
        onSelect={onSelect}
        project={project}
      />,
    );

    const progress = screen.getByRole('progressbar', { name: /项目进度/ });
    expect(progress).toHaveAttribute('aria-valuenow');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');

    await user.click(screen.getByRole('button', { name: /查看详情/ }));
    expect(onSelect).toHaveBeenCalledWith(project.id);

    await user.click(screen.getByRole('button', { name: /我要帮助/ }));
    expect(onHelp).toHaveBeenCalledWith(project.id);
  });
});
