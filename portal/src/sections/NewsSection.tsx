import type { Article } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface NewsSectionProps {
  articles: Article[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  if (!articles.length) return null;
  return (
    <section id="news" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="md:flex md:items-end md:justify-between">
          <SectionHeading
            eyebrow="News"
            title="最新舞团动态"
            description="实时更新演出、巡演与非遗活动资讯。"
          />
          <a
            href="/articles"
            className="mt-6 inline-flex items-center text-sm font-semibold text-primary md:mt-0"
          >
            查看全部资讯 →
          </a>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-3xl border border-deep/10 bg-[#fdfdfd] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-primary">
                {article.category || 'NEWS'}
              </p>
              <h3 className="mt-3 font-display text-2xl text-deep">{article.title_zh}</h3>
              <p className="mt-3 text-sm text-deep/70 line-clamp-3">{article.summary_zh}</p>
              <div className="mt-6 text-sm text-deep/50">
                {article.publish_at ? new Date(article.publish_at).toLocaleDateString() : ''}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
