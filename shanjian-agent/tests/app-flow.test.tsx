import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Shanjian Agent flow', () => {
  it('starts on public project home and navigates to all three backends', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /公众项目展示/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
    expect(screen.getByRole('heading', { name: /求助申请入口/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /机构四辨工作台/ }));
    expect(screen.getByRole('heading', { name: /机构四辨工作台/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /捐助意向管理/ }));
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
  });
});
