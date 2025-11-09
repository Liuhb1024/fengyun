import type { ContactInfo } from '../api/portal';

interface Props {
  info?: ContactInfo | null;
}

const fallback: ContactInfo = {
  title: '预约演出 / 合作洽谈',
  description:
    '支持全国巡演、文化交流、品牌定制演出、沉浸式发布会及非遗工作坊，提供编导、舞美、鼓乐录音与教育方案。',
  phone: '+86 138 0000 0000',
  email: 'heritage@yingge.com',
  locations: ['汕头', '深圳', '上海', '全球巡演'],
  tags: ['品牌共创', '国际巡演', '教育工作坊', '沉浸体验'],
  cta_text: '立即联系',
  cta_link: 'mailto:heritage@yingge.com',
};

const ContactCTA: React.FC<Props> = ({ info }) => {
  const data = info ?? fallback;

  return (
    <section id="contact" className="relative px-6 pb-24 pt-16 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1b0e08] via-[#120c0c] to-[#1b0e08]" />
      <div className="sunrise-glow card-surface relative mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-[36px] border border-[rgba(246,196,92,0.25)] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--color-accent)]">Connect</p>
        <h2 className="font-display text-4xl">{data.title}</h2>
        {data.description && <p className="max-w-2xl text-white/70">{data.description}</p>}
        <div className="neon-divider" />
        <div className="flex flex-col gap-3 text-lg">
          {data.phone && (
            <a href={`tel:${data.phone}`} className="text-white/90 hover:text-white">
              {data.phone}
            </a>
          )}
          {data.email && (
            <a href={`mailto:${data.email}`} className="text-white/90 hover:text-white">
              {data.email}
            </a>
          )}
          {data.wechat && <p className="text-white/80">微信：{data.wechat}</p>}
          {data.locations && data.locations.length > 0 && (
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">{data.locations.join(' · ')}</p>
          )}
        </div>
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
            {data.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        {data.cta_text && (
          <a
            href={data.cta_link || '#contact'}
            className="rounded-full border border-white/40 px-8 py-3 text-sm uppercase tracking-[0.4em] text-white/90 transition hover:border-white hover:bg-white/10"
          >
            {data.cta_text}
          </a>
        )}
      </div>
    </section>
  );
};

export default ContactCTA;
