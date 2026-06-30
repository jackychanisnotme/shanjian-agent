import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Shanjian Agent flow', () => {
  it('starts on public project home and navigates to all three backends', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /公众项目展示/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /让善意先被核验，再抵达/ })).toBeInTheDocument();
    expect(screen.getByText(/参考优秀非营利网站的信息架构/)).toBeInTheDocument();
    expect(screen.getByText(/不自营募捐/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /机构项目复核工作台示意图/ })).toBeInTheDocument();
    expect(screen.getByText(/项目核验路径/)).toBeInTheDocument();
    expect(screen.getByText(/尊严与选择/)).toBeInTheDocument();
    expect(screen.getAllByText(/患儿A/).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI问项目/)).toBeInTheDocument();
    expect(screen.getByText(/提示词库/)).toBeInTheDocument();
    expect(screen.getByText(/证据来源/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /问当前最缺什么/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /我要帮助/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/透明反馈草稿/).length).toBeGreaterThan(0);
    expect(screen.getByText(/不含可识别个人隐私/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
    expect(screen.getByRole('heading', { name: /求助申请入口/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/病情摘要/)).toBeInTheDocument();
    expect(screen.getByLabelText(/费用缺口/)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /当前最需要的支持/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/我不会整理材料，先写一段话/)).toBeInTheDocument();
    expect(screen.getByText(/AI 整理提示词/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /生成机构申请包/ }));
    expect(screen.getByText(/最新医疗费用发票/)).toBeInTheDocument();
    expect(screen.getAllByText(/治疗费用缺口/).length).toBeGreaterThan(0);
    expect(screen.getByText(/人工复核前不可公开/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /机构四辨工作台/ }));
    expect(screen.getByRole('heading', { name: /机构四辨工作台/ })).toBeInTheDocument();
    expect(screen.getByText(/辨善恶/)).toBeInTheDocument();
    expect(screen.getByText(/辨真伪/)).toBeInTheDocument();
    expect(screen.getByText(/辨大小/)).toBeInTheDocument();
    expect(screen.getByText(/辨远近/)).toBeInTheDocument();
    expect(screen.getByText(/AI 输出不是结论，是复核材料/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /运行四辨审核/ }));
    expect(screen.getByText(/人工核对最新发票/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /批准展示/ }));
    expect(screen.getByText(/已生成脱敏项目卡片/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /捐助意向管理/ }));
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
    expect(screen.getByText(/平台仅登记意向/)).toBeInTheDocument();
    expect(screen.getByLabelText(/帮助类别/)).toBeInTheDocument();
    expect(screen.getByLabelText(/帮助类型/)).toBeInTheDocument();
    expect(screen.getByText(/资源匹配不是收款/)).toBeInTheDocument();
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
