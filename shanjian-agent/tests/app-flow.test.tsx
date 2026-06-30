import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Shanjian Agent flow', () => {
  it('starts on public project home and navigates to all three backends', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /公众项目展示/ })).toBeInTheDocument();
    expect(screen.getByText(/不自营募捐/)).toBeInTheDocument();
    expect(screen.getAllByText(/患儿A/).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI问项目/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /这个项目目前最需要什么/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /我要帮助/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/透明反馈草稿/).length).toBeGreaterThan(0);
    expect(screen.getByText(/不含可识别个人隐私/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
    expect(screen.getByRole('heading', { name: /求助申请入口/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /机构四辨工作台/ }));
    expect(screen.getByRole('heading', { name: /机构四辨工作台/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /捐助意向管理/ }));
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /善见 Agent/ }));
    await user.click(screen.getAllByRole('button', { name: /我要帮助/ })[0]);
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
    expect(screen.getByText(/项目：患儿A/)).toBeInTheDocument();
  });
});
