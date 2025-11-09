import { motion } from 'framer-motion';
import type { Article } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface NewsSectionProps {
  articles: Article[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  if (!articles.length) return null;
  return (
    <section id="news" className="px-6 py-24">
      <div className="sunrise-glow card-surface mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.2)] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Newsroom"
            title={'\u5DF7\u5E97\u4E0E\u6D3B\u52A8\u64AD\u62A5'}
            description={
              '\u8BB0\u5F55\u6700\u65B0\u5DE1\u6F14\u3001\u975E\u9057\u8BFE\u5802\u4E0E\u56FD\u9645\u5408\u4F5C\uFF0C\u52A8\u6001\u5185\u5BB9\u7531 CMS \u5B9E\u65F6\u63A8\u9001\u3002'
            }
          />
          <a
            href="/articles"
            className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)] hover:text-white"
          >
            查看全部 → 
          </a>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
              className="card-surface relative rounded-[28px] border border-[rgba(246,208,124,0.18)] p-6"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                {article.category || 'INSIGHT'}
              </p>
              <h3 className="mt-3 font-display text-2xl text-white">{article.title_zh}</h3>
              <p className="mt-3 text-sm text-white/70 line-clamp-3">{article.summary_zh}</p>
              <div className="mt-6 flex items-center justify-between text-xs text-white/60">
                <span>{article.publish_at ? new Date(article.publish_at).toLocaleDateString() : ''}</span>
                <span className="tracking-[0.4em]">READ</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
