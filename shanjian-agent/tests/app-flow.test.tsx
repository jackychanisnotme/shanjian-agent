import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Shanjian Agent flow', () => {
  beforeEach(() => {
    window.localStorage.removeItem?.('shanjian-agent-demo-state');
    window.history.pushState({}, '', '/');
  });

  it('starts on public project home and navigates to all three backends', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /公众项目展示/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /把救助个案变成可复核项目/ })).toBeInTheDocument();
    expect(screen.getByText(/本地 Agent 串联材料整理/)).toBeInTheDocument();
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
    expect(screen.getByRole('heading', { name: /获奖 Demo 中心/ })).toBeInTheDocument();
    expect(screen.getByText(/混乱求助材料/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /材料智能处理台/ })).toBeInTheDocument();
    expect(screen.getByText(/OCR抽取/)).toBeInTheDocument();
    expect(screen.getAllByText(/金额矛盾/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/隐私脱敏/).length).toBeGreaterThan(0);
    expect(screen.getByText(/节省/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /运行本地LLM Agent/ })).toBeInTheDocument();
    expect(screen.getAllByText(/评分抓手/).length).toBeGreaterThan(0);
    expect(screen.getByText(/商业落地/)).toBeInTheDocument();
    expect(screen.getByText(/加分项/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
    expect(window.location.pathname).toBe('/apply');
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
    expect(window.location.pathname).toBe('/workbench');
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
    expect(window.location.pathname).toBe('/intentions');
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
    expect(window.location.pathname).toBe('/projects');
    await user.click(screen.getAllByRole('button', { name: /我要帮助/ })[0]);
    expect(window.location.pathname).toBe('/intentions');
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
    expect(screen.getByText(/项目：患儿A/)).toBeInTheDocument();
  });

  it('opens section-specific URLs directly', () => {
    window.history.pushState({}, '', '/workbench');

    render(<App />);

    expect(screen.getByRole('heading', { name: /机构四辨工作台/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /公众项目展示/ })).not.toBeInTheDocument();
  });

  it('uses edited aid application values when generating the institution package', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/apply');
    render(<App />);

    await user.clear(screen.getByLabelText(/患者脱敏称呼/));
    await user.type(screen.getByLabelText(/患者脱敏称呼/), '患儿Z');
    await user.clear(screen.getByLabelText(/费用缺口/));
    await user.type(screen.getByLabelText(/费用缺口/), '12345');

    await user.click(screen.getByRole('button', { name: /生成机构申请包/ }));

    const result = screen.getByRole('region', { name: /机构申请包/ });
    expect(within(result).getByText(/患儿Z/)).toBeInTheDocument();
    expect(within(result).getByText(/12,345元/)).toBeInTheDocument();
  });

  it('registers the edited donation intention instead of a canned one', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/intentions');
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/帮助类别/), 'services');
    await user.selectOptions(screen.getByLabelText(/帮助类型/), 'policy_consultation');
    await user.clear(screen.getByLabelText(/金额或资源说明/));
    await user.type(screen.getByLabelText(/金额或资源说明/), '可提供周末医保政策咨询');
    await user.clear(screen.getByLabelText(/城市\/地区/));
    await user.type(screen.getByLabelText(/城市\/地区/), '广州');

    await user.click(screen.getByRole('button', { name: /AI分类并生成跟进建议/ }));

    expect(screen.getAllByText(/服/).length).toBeGreaterThan(0);
    expect(screen.getByText(/广州/)).toBeInTheDocument();
    expect(screen.getByText(/可提供周末医保政策咨询/)).toBeInTheDocument();
  });

  it('refreshes AI project answers when the selected project changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/治疗费用缺口：巩固治疗阶段/)).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /查看详情/ })[1]);

    expect(screen.getByText(/药品资源信息：需要机构确认/)).toBeInTheDocument();
    expect(screen.queryByText(/治疗费用缺口：巩固治疗阶段/)).not.toBeInTheDocument();
  });
});
