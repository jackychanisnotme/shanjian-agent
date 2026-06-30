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
    expect(screen.getByRole('img', { name: /机构项目工作台示意图/ })).toBeInTheDocument();
    expect(screen.getAllByText(/患儿A/).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI问项目/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /这个项目目前最需要什么/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /我要帮助/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/透明反馈草稿/).length).toBeGreaterThan(0);
    expect(screen.getByText(/不含可识别个人隐私/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
    expect(screen.getByRole('heading', { name: /求助申请入口/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/病情摘要/)).toBeInTheDocument();
    expect(screen.getByLabelText(/费用缺口/)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /当前最需要的支持/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/我不会整理材料，先写一段话/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /生成机构申请包/ }));
    expect(screen.getByText(/最新医疗费用发票/)).toBeInTheDocument();
    expect(screen.getAllByText(/治疗费用缺口/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /机构四辨工作台/ }));
    expect(screen.getByRole('heading', { name: /机构四辨工作台/ })).toBeInTheDocument();
    expect(screen.getByText(/辨善恶/)).toBeInTheDocument();
    expect(screen.getByText(/辨真伪/)).toBeInTheDocument();
    expect(screen.getByText(/辨大小/)).toBeInTheDocument();
    expect(screen.getByText(/辨远近/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /运行四辨审核/ }));
    expect(screen.getByText(/人工核对最新发票/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /批准展示/ }));
    expect(screen.getByText(/已生成脱敏项目卡片/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /捐助意向管理/ }));
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
    expect(screen.getByText(/平台仅登记意向/)).toBeInTheDocument();
    expect(screen.getByLabelText(/帮助类别/)).toBeInTheDocument();
    expect(screen.getByLabelText(/帮助类型/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /AI分类并生成跟进建议/ }));
    expect(screen.getAllByText(/钱/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/治疗费用缺口/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/不在平台内收款/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /善见 Agent/ }));
    await user.click(screen.getAllByRole('button', { name: /我要帮助/ })[0]);
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
    expect(screen.getByText(/项目：患儿A/)).toBeInTheDocument();
  });
});
