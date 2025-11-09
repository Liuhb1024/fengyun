import { motion } from 'framer-motion';
import type { Carousel, HeroConfig, StatsConfig } from '../api/portal';

type QuickLink = {
  id: number;
  name: string;
  link_url: string;
  is_external?: boolean;
};

interface HeroProps {
  hero: HeroConfig | null;
  carousels: Carousel[];
  quickNav: QuickLink[];
  stats: StatsConfig | null;
}

const Hero: React.FC<HeroProps> = ({ hero, carousels, quickNav, stats }) => {
  const backgroundVisual = hero?.video_url || carousels[0]?.image_url || '';
  const heroStats = [
    { label: '\u521B\u5EFA\u5E74\u4EFD', value: stats?.founded_year },
    { label: '\u6838\u5FC3\u6210\u5458', value: stats?.members ? `${stats.members}+` : undefined },
    { label: '\u5E74\u5EA6\u6F14\u51FA', value: stats?.performances ? `${stats.performances}+` : undefined },
  ].filter((item) => item.value);

  const accents = quickNav.slice(0, 3);

  const onPrimaryClick = () => {
    if (hero?.cta_link?.startsWith('#')) {
      document.querySelector(hero.cta_link)?.scrollIntoView({ behavior: 'smooth' });
    } else if (hero?.cta_link) {
      window.open(hero.cta_link, '_blank');
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative isolate overflow-hidden text-white">
      {backgroundVisual && backgroundVisual.endsWith('.mp4') ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src={backgroundVisual}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${backgroundVisual || '/hero-placeholder.jpg'})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,6,15,0.4)] via-[rgba(5,6,15,0.85)] to-[rgba(5,6,15,0.95)]" />
      <div className="floating-orb left-10 top-24" />
      <div className="floating-orb right-16 bottom-16" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-6 py-24 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="accent-chip">
            <span>{hero?.title_en || 'CHAOSHAN YINGGE'}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-[0.08em] text-white md:text-6xl">
            <span className="gradient-text">
              {hero?.title_zh || '\u6F6E\u6C55\u82F1\u6B4C\u821E\u0020\u00B7\u0020\u975E\u9057\u7684\u672A\u6765\u5F62\u6001'}
            </span>
          </h1>
          <p className="text-lg text-white/75 md:text-xl">
            {hero?.subtitle_zh ||
              '\u4EE5\u73B0\u4EE3\u89C6\u89C9\u4E0E\u58F0\u97F3\u8BED\u8A00\u91CD\u5851\u9F13\u70B9\u3001\u9635\u5217\u4E0E\u8EAB\u6CD5\uFF1B\u7A7F\u8D8A\u4E09\u767E\u5E74\u9F13\u58F0\uFF0C\u6C89\u6D78\u5F0F\u8D70\u8FDB\u6F6E\u6C55\u7684\u7CBE\u795E\u5B87\u5B99\u3002'}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="neon-button" onClick={onPrimaryClick}>
              {hero?.cta_text_zh || '\u9884\u7EA6\u6F14\u51FA'}
            </button>
            <button
              type="button"
              className="outline-button"
              onClick={() => document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {'\u63A2\u7D22\u53D9\u4E8B'}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs tracking-[0.4em] text-white/60">
            <span className="accent-chip">IMMERSIVE SHOWCASE</span>
            <span className="accent-chip">GLOBAL STAGE</span>
            <span className="accent-chip">{'\u975E\u9057\u4F20\u627F\u5B9E\u9A8C\u5BA4'}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="card-surface soft-shadow rounded-[32px] border border-[rgba(246,208,124,0.2)] p-8"
        >
          <p className="text-xs uppercase tracking-[0.5em] text-white/60">Live Chapters</p>
          <div className="mt-4 space-y-3">
            {accents.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.link_url.startsWith('#')) {
                    document.querySelector(item.link_url)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.open(item.link_url, item.is_external ? '_blank' : '_self');
                  }
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-[rgba(246,208,124,0.25)] bg-[rgba(20,10,6,0.75)] px-4 py-3 text-left transition hover:border-[var(--color-accent)]"
              >
                <span className="font-display text-lg">{item.name}</span>
                <span className="text-xs uppercase tracking-[0.4em] text-white/60">GO</span>
              </button>
            ))}
          </div>
          <div className="mt-6 h-px w-full bg-white/10" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[rgba(246,208,124,0.25)] bg-[rgba(20,10,6,0.72)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{stat.label}</p>
                <p className="mt-2 font-display text-2xl text-white">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-xs uppercase tracking-[0.5em] text-white/50">
            SCROLL TO ENTER · {'\u6EDA\u52A8\u8FDB\u5165\u573A\u666F'}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
