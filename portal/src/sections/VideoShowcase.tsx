import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa6';
import type { VideoItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface VideoShowcaseProps {
  videos: VideoItem[];
}

const CARD_HEIGHT = 200;
const CARD_WIDTH = 260;
const GAP_PX = 16;

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [current, setCurrent] = useState<VideoItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (current) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setCurrent(null);
      };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener('keydown', onKey);
      };
    }
    return undefined;
  }, [current]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => v.category && set.add(v.category));
    return ['全部', ...Array.from(set)];
  }, [videos]);

  const filtered = useMemo(
    () => (activeCategory === '全部' ? videos : videos.filter((v) => v.category === activeCategory)),
    [activeCategory, videos],
  );

  if (!filtered.length) return null;

  const onPlay = (video: VideoItem) => setCurrent(video);

  const baseItems = filtered.slice(0, 10).length ? filtered.slice(0, 10) : filtered;
  const repeatCount =
    baseItems.length >= 6 ? 2 : baseItems.length >= 3 ? 3 : baseItems.length >= 2 ? 4 : 6;
  const stripItems = Array.from({ length: repeatCount }, () => baseItems).flat();
  const shiftDistance = baseItems.length * (CARD_WIDTH + GAP_PX);
  const trackWidth = stripItems.length * (CARD_WIDTH + GAP_PX);

  return (
    <section id="videos" className="px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          eyebrow="Video Archive"
          title="英歌影像精选"
          description="横向胶片带自动滑动，像翻阅光盘盒一样连续浏览表演瞬间。"
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-2 transition ${
                cat === activeCategory
                  ? 'border-[var(--color-accent)] bg-[rgba(246,208,124,0.12)] text-[var(--color-accent)] shadow-[0_0_16px_rgba(246,208,124,0.25)]'
                  : 'border-white/15 bg-[rgba(20,10,6,0.6)] text-white/70 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[rgba(12,6,5,0.45)] via-[rgba(12,6,5,0.3)] to-[rgba(12,6,5,0.45)]">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--color-bg,#05060f)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--color-bg,#05060f)] to-transparent" />

          <motion.div
            className="flex py-4"
            style={{ width: `${trackWidth}px`, columnGap: `${GAP_PX}px` }}
            animate={baseItems.length > 1 && !isPaused ? { x: [0, -shiftDistance] } : undefined}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          >
            {stripItems.map((video, index) => {
              const tilt = (index % 2 === 0 ? -3 : 3) + (index % 5 === 0 ? 1 : 0);
              const cardNumber = ((index % baseItems.length) + 1).toString().padStart(2, '0');
              return (
                <motion.button
                  type="button"
                  key={`${video.id}-${index}`}
                  onClick={() => onPlay(video)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    rotate: 0,
                    y: -10,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
                  }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative flex-shrink-0 overflow-hidden rounded-[20px] border border-[rgba(246,208,124,0.14)] bg-[rgba(12,6,5,0.76)] shadow-[0_16px_44px_rgba(0,0,0,0.48)] backdrop-blur-xl"
                  style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px`, rotate: `${tilt}deg` }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_20%_20%,rgba(246,208,124,0.08),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(214,66,50,0.06),transparent_40%)] mix-blend-screen opacity-80" />
                  <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-[rgba(8,6,12,0.1)] via-[rgba(8,6,12,0.28)] to-[rgba(8,6,12,0.7)]" />

                  <div className="relative h-full w-full overflow-hidden rounded-[18px]">
                    <img
                      src={video.cover_url || '/video-cover.jpg'}
                      alt={video.title_zh}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.05)] via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.6)]" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/70">
                      <span className="rounded-full border border-white/15 bg-[rgba(12,6,5,0.6)] px-3 py-1 text-[10px]">
                        {video.category || 'clip'}
                      </span>
                      <span className="rounded-full border border-white/15 bg-[rgba(12,6,5,0.55)] px-2 py-1 text-[11px]">
                        {video.duration ? `${video.duration}s` : cardNumber}
                      </span>
                    </div>
                    <h4 className="mt-2 font-display text-lg text-white line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                      {video.title_zh}
                    </h4>
                  </div>

                  <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(246,208,124,0.35)] bg-[rgba(0,0,0,0.55)] text-[var(--color-accent)] shadow-[0_0_18px_rgba(246,208,124,0.35)] backdrop-blur">
                    <FaPlay />
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.98)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrent(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/12 bg-[rgba(10,10,18,0.98)] shadow-[0_60px_140px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-white/25 bg-[rgba(20,20,30,0.7)] px-3 py-1 text-sm text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  onClick={() => setCurrent(null)}
                >
                  关闭
                </button>
              </div>
              <video src={current.url} controls autoPlay className="h-[70vh] w-full bg-black object-contain">
                您的浏览器不支持视频播放。
              </video>
              <div className="p-5 text-white">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                  {current.category || 'performance'}
                </p>
                <h4 className="mt-1 font-display text-2xl">{current.title_zh}</h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoShowcase;
