import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa6';
import type { VideoItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface VideoShowcaseProps {
  videos: VideoItem[];
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  if (!videos.length) return null;
  const [hero, ...rest] = videos;

  return (
    <section id="videos" className="px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-10">
        <SectionHeading
          eyebrow="Video Archive"
          title="英歌影像实验室"
          description="6K 摄录 + 多声道采集，搭配慢速与加速剪辑呈现鼓点呼吸：点播任意条目即可进入场景。"
        />

        <div className="glass-panel grid gap-6 rounded-[40px] border border-white/10 bg-[rgba(6,6,15,0.95)] p-10 lg:grid-cols-[1.3fr,0.7fr]">
          {hero && (
            <motion.article
              key={hero.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5"
            >
              <img src={hero.cover_url || '/video-cover.jpg'} alt={hero.title_zh} className="h-[360px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => window.open(hero.url, '_blank')}
                className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-black shadow-lg transition hover:scale-105"
              >
                <FaPlay />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">{hero.category || 'performance'}</p>
                <h3 className="mt-2 font-display text-3xl">{hero.title_zh}</h3>
                {hero.duration && (
                  <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                    {hero.duration}s
                  </span>
                )}
              </div>
            </motion.article>
          )}

          <div className="video-rail overflow-x-auto pb-4">
            <div className="flex gap-4">
              {rest.slice(0, 6).map((video, index) => (
                <motion.button
                  type="button"
                  key={video.id}
                  onClick={() => window.open(video.url, '_blank')}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="video-chip"
                >
                  <img src={video.cover_url || '/video-cover.jpg'} alt={video.title_zh} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">{video.category || 'clip'}</p>
                    <h4 className="text-base font-semibold text-white">{video.title_zh}</h4>
                  </div>
                  <span className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">Play</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
