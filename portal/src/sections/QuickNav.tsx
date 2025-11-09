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

const QuickNav: React.FC<QuickNavProps> = ({ items }) => {
  if (!items?.length) return null;

  const handleClick = (item: QuickLink) => {
    if (item.link_url.startsWith('#')) {
      document.querySelector(item.link_url)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(item.link_url, item.is_external ? '_blank' : '_self');
    }
  };

  return (
    <section id="story" className="relative isolate overflow-hidden px-6 py-20">
      <div className="sunrise-glow card-surface relative mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.22)] p-8">
        <div className="mb-10 flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Immersive Chapters"
            title={'\u5206\u955C\u5F0F\u53D9\u4E8B'}
            description={
              '\u4ECE\u8D77\u6E90\u3001\u9635\u5217\u3001\u566A\u95F4\u5230\u4EBA\u4F53\u4E92\u52A8\uFF0C\u6309\u7AE0\u8282\u63A2\u7D22\u82F1\u6B4C\u821E\u7684\u7CBE\u795E\u8F68\u8FF9\uFF1B\u6BCF\u4E00\u7AD9\u5747\u53EF\u76F4\u8FBE\u9875\u9762\u951A\u70B9\u6216\u4E13\u9898\u6587\u7AE0\u3002'
            }
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
                {item.is_external ? 'External' : 'Internal'} {'\u00B7'} Tap {'\u2192'}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickNav;
