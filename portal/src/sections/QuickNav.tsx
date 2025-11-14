import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';

type QuickLink = {
  id: number;
  name: string;
  link_url: string;
  is_external?: boolean;
};

interface QuickNavProps {
  items: QuickLink[];
}

const scrollToAnchor = (link: string) => {
  if (!link) return false;
  const targetId = link.startsWith('#') ? link.slice(1) : link;
  if (!targetId) return false;
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
};

const QuickNav: React.FC<QuickNavProps> = ({ items }) => {
  if (!items?.length) return null;

  const handleClick = (item: QuickLink) => {
    const link = item.link_url?.trim();
    if (!link) return;

    const looksLikeUrl = /^[a-zA-Z]+:/.test(link) || link.startsWith('/');
    if (!looksLikeUrl && scrollToAnchor(link)) {
      return;
    }
    if (link.startsWith('#') && scrollToAnchor(link)) {
      return;
    }

    window.open(link, item.is_external ? '_blank' : '_self');
  };

  return (
    <section id="story" className="relative isolate overflow-hidden px-6 py-20">
      <div className="sunrise-glow card-surface relative mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.22)] p-8">
        <div className="mb-10 flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Immersive Chapters"
            title="分镜式叙事"
            description="从起源、阵列、噪环到人机互动，按章节探索英歌舞的精神轨迹；每一站均可直达页面锚点或专题文章。"
          />
          <span className="text-xs uppercase tracking-[0.4em] text-white/50">Scroll to navigate</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, idx) => (
            <motion.button
              type="button"
              key={item.id}
              onClick={() => handleClick(item)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-[32px] card-surface p-6 text-left"
            >
              <div className="absolute -right-5 top-6 h-16 w-16 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent blur-2xl transition group-hover:opacity-80" />
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">0{idx + 1}</p>
              <h3 className="mt-4 font-display text-2xl">{item.name}</h3>
              <p className="mt-6 text-sm uppercase tracking-[0.4em] text-[var(--color-accent)]">
                {item.is_external ? 'External' : 'Internal'} · Tap →
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickNav;
