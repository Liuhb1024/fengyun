import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

  const sliderItems = useMemo(() => {
    if (carousels?.length) return carousels.slice(0, 5);
    return quickNav.slice(0, 5).map((item) => ({
      id: item.id,
      image_url: '',
      title_zh: item.name,
      link_url: item.link_url,
      is_external: item.is_external,
    })) as Carousel[];
  }, [carousels, quickNav]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sliderItems.length) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderItems.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [sliderItems]);

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
            <span>{hero?.title_en || 'FENGYUN YINGGE'}</span>
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

        <div className="relative rounded-[34px] p-[2px] bg-gradient-to-br from-[rgba(246,208,124,0.85)] via-[rgba(214,66,50,0.55)] to-[rgba(246,208,124,0.85)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="card-surface soft-shadow rounded-[32px] border border-[rgba(246,208,124,0.12)] bg-[rgba(12,6,5,0.78)] p-8"
          >
            <div className="overflow-hidden rounded-2xl border border-[rgba(246,208,124,0.2)] bg-[rgba(20,10,6,0.75)]">
              <div className="relative h-72">
                <AnimatePresence mode="wait">
                  {sliderItems.length > 0 && (
                    <motion.div
                      key={sliderItems[activeIndex]?.id ?? activeIndex}
                      className="absolute inset-0 overflow-hidden rounded-2xl"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center scale-[1] origin-center"
                        style={{
                          backgroundImage: sliderItems[activeIndex]?.image_url
                            ? `url(${sliderItems[activeIndex]?.image_url})`
                            : 'radial-gradient(circle at 30% 30%, rgba(247,200,90,0.18), transparent 45%), radial-gradient(circle at 70% 60%, rgba(214,66,50,0.18), transparent 40%), linear-gradient(135deg, rgba(20,10,6,0.9), rgba(15,8,6,0.8))',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,6,12,0.12)] via-[rgba(8,6,12,0.48)] to-[rgba(8,6,12,0.82)]" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 pb-5 text-white">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Yingge Highlights</p>
                        <h4 className="font-display text-xl leading-tight">
                          {sliderItems[activeIndex]?.title_zh || '英歌瞬间'}
                        </h4>
                        {sliderItems[activeIndex]?.link_url && (
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              className="rounded-full border border-[rgba(246,208,124,0.35)] px-3 py-1 text-[11px] text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                              onClick={() => {
                                const link = sliderItems[activeIndex]?.link_url;
                                if (!link) return;
                                if (link.startsWith('#')) {
                                  document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  window.open(link, sliderItems[activeIndex]?.is_external ? '_blank' : '_self');
                                }
                              }}
                            >
                              Explore
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {sliderItems.map((item, idx) => (
                    <button
                      key={item.id ?? idx}
                      type="button"
                      aria-label={`slide ${idx + 1}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 w-6 rounded-full transition ${
                        idx === activeIndex
                          ? 'bg-[var(--color-accent)] shadow-[0_0_10px_rgba(247,200,90,0.6)] scale-110'
                          : 'bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
