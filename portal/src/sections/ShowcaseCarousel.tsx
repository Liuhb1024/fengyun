import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { Carousel } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface ShowcaseCarouselProps {
  carousels: Carousel[];
}

const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ carousels }) => {
  const items = useMemo(() => carousels.slice(0, 6), [carousels]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  if (!items.length || !active) return null;

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-24">
      <div className="floating-orb" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-6 text-left md:flex-row md:items-center md:justify-between">
          <SectionHeading
            eyebrow="Immersive Showcase"
            title="鼓点与镜头的共振"
            description="高帧率摄影 + 视差分镜，将鼓点、队形与光束拆解成章节；滑动右侧章节，即可切换不同场景。"
          />
          <button
            type="button"
            className="outline-button self-start md:self-auto"
            onClick={() => window.open(active.link_url || items[0]?.link_url || '#videos', '_blank')}
          >
            观看全片
          </button>
        </div>

        <div className="glass-panel relative flex overflow-hidden rounded-[40px] border border-white/10 bg-[rgba(7,7,16,0.92)] shadow-[0_35px_120px_rgba(0,0,0,0.55)]">
          <motion.div
            key={active.id}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex-1 overflow-hidden"
          >
            <img src={active.image_url} alt={active.title_zh || 'showcase'} className="h-[440px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            <div className="absolute left-0 top-0 w-full p-10 text-white md:w-2/3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">Chapter {activeIndex + 1}</p>
              <h3 className="mt-4 font-display text-4xl leading-tight">{active.title_zh || '英歌瞬间'}</h3>
              {active.link_url && (
                <button
                  type="button"
                  onClick={() => window.open(active.link_url, '_blank')}
                  className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/30 px-5 py-2 text-sm uppercase tracking-[0.4em] text-white/80 transition hover:border-white hover:shadow-[0_0_25px_rgba(246,196,92,0.5)]"
                >
                  进入场景
                </button>
              )}
            </div>
          </motion.div>

          <div className="relative w-full min-w-[220px] border-t border-white/5 bg-[rgba(4,4,10,0.7)] px-6 py-6 text-white md:w-[280px] md:border-l md:border-t-0">
            <p className="text-xs uppercase tracking-[0.45em] text-white/50">章节切换</p>
            <div className="mt-4 space-y-3">
              {items.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                      isActive ? 'border-[var(--color-accent)] bg-white/5' : 'border-white/10 hover:border-white/40'
                    }`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <span className="text-xs uppercase tracking-[0.35em] text-white/50">{String(idx + 1).padStart(2, '0')}</span>
                    <span className={`text-sm font-semibold leading-tight ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {item.title_zh || '英歌片段'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseCarousel;
