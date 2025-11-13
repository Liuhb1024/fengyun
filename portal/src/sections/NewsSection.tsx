import clsx from 'clsx';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Article } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface NewsSectionProps {
  articles: Article[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  if (!articles.length) return null;

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((article) => {
      if (article.category) set.add(article.category);
    });
    return Array.from(set);
  }, [articles]);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const filtered = useMemo(
    () => (activeCategory === 'ALL' ? articles : articles.filter((a) => a.category === activeCategory)),
    [articles, activeCategory],
  );

  const [headline, ...rest] = filtered;
  if (!headline) return null;

  return (
    <section id="news" className="px-6 py-24">
      <div className="glass-panel mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-[rgba(6,6,15,0.95)] p-10 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Newsroom"
            title="巷声与活动播报"
            description="记录最新巡演、非遗课堂与国际合作，动态内容实时推送。"
          />
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em]">
            <button
              type="button"
              className={clsx('chip-filter', activeCategory === 'ALL' && 'chip-filter-active')}
              onClick={() => setActiveCategory('ALL')}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={clsx('chip-filter', activeCategory === category && 'chip-filter-active')}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <motion.article
            key={headline.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5"
          >
            <img
              src={headline.cover_url || '/news-cover.jpg'}
              alt={headline.title_zh}
              className="h-[320px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">
                {headline.category || 'INSIGHT'}
              </p>
              <h3 className="mt-3 font-display text-3xl leading-snug">{headline.title_zh}</h3>
              {headline.summary_zh && <p className="mt-3 text-white/80 line-clamp-3">{headline.summary_zh}</p>}
              <div className="mt-6 flex items-center justify-between text-xs text-white/60">
                <span>{headline.publish_at ? dayjs(headline.publish_at).format('YYYY.MM.DD') : ''}</span>
                <span className="tracking-[0.4em]">READ</span>
              </div>
            </div>
          </motion.article>

          <div className="space-y-4">
            {rest.slice(0, 4).map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                  <span>{article.category || 'INSIGHT'}</span>
                  <span>{article.publish_at ? dayjs(article.publish_at).format('MM/DD') : ''}</span>
                </div>
                <h4 className="mt-2 font-display text-xl">{article.title_zh}</h4>
                {article.summary_zh && <p className="mt-2 text-sm text-white/70 line-clamp-2">{article.summary_zh}</p>}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
