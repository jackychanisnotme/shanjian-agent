import { ShieldCheck } from 'lucide-react';

export function ComplianceNotice() {
  return (
    <section className="notice-band" aria-label="合规边界">
      <ShieldCheck aria-hidden="true" size={20} />
      <p>
        本 demo 不自营募捐、不代收善款、不建立资金池；只展示虚构/脱敏案例并登记帮助意向。真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
      </p>
    </section>
  );
}
