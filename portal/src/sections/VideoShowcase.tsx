import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa6';
import type { VideoItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface VideoShowcaseProps {
  videos: VideoItem[];
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [current, setCurrent] = useState<VideoItem | null>(null);

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
  const [hero, ...rest] = filtered;
  const displayList = rest.length ? rest : videos.slice(1);

  const onPlay = (video: VideoItem) => setCurrent(video);

  return (
    <section id="videos" className="px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          eyebrow="Video Archive"
          title="英歌影像精选"
          description="灯箱主推 + 纵向列表，沉浸观看英歌舞的鼓点、阵列与舞步。"
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

        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <motion.article
            key={hero.id}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative overflow-hidden rounded-[32px] border border-[rgba(246,208,124,0.16)] bg-[rgba(12,6,5,0.78)] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(246,208,124,0.12),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(214,66,50,0.08),transparent_40%)]" />
            <img
              src={hero.cover_url || '/video-cover.jpg'}
              alt={hero.title_zh}
              className="h-[380px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.35)] to-transparent" />
            <button
              type="button"
              onClick={() => onPlay(hero)}
              className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-black shadow-lg transition hover:scale-105"
            >
              <FaPlay />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">{hero.category || 'performance'}</p>
              <h3 className="mt-2 font-display text-3xl">{hero.title_zh}</h3>
              <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
                {hero.duration && <span className="rounded-full bg-white/15 px-3 py-1">{hero.duration}s</span>}
                <span className="rounded-full border border-white/15 bg-[rgba(12,6,5,0.55)] px-3 py-1">播放</span>
              </div>
            </div>
          </motion.article>

          <div className="space-y-3 rounded-[24px] border border-white/10 bg-[rgba(6,6,15,0.7)] p-4">
            {displayList.map((video, index) => (
              <motion.button
                type="button"
                key={video.id}
                onClick={() => onPlay(video)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                viewport={{ once: true, amount: 0.3 }}
                className="group flex gap-4 rounded-[18px] border border-[rgba(246,208,124,0.16)] bg-[rgba(12,6,5,0.6)] p-3 text-left shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-[var(--color-accent)]"
              >
                <div className="relative h-20 w-32 overflow-hidden rounded-[14px]">
                  <img
                    src={video.cover_url || '/video-cover.jpg'}
                    alt={video.title_zh}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.55)]" />
                  <div className="pointer-events-none absolute right-2 top-2 rounded-full bg-[rgba(0,0,0,0.6)] px-2 py-0.5 text-[11px] text-white">
                    {video.duration ? `${video.duration}s` : 'PLAY'}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">{video.category || 'clip'}</p>
                  <h4 className="mt-1 text-base font-semibold text-white line-clamp-2">{video.title_zh}</h4>
                </div>
                <div className="flex items-center">
                  <span className="text-[var(--color-accent)] transition group-hover:translate-x-0.5">▶</span>
                </div>
              </motion.button>
            ))}
          </div>
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
