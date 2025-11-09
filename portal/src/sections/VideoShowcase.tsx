import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa6';
import type { VideoItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface VideoShowcaseProps {
  videos: VideoItem[];
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  if (!videos.length) return null;
  const [first, ...rest] = videos;

  return (
    <section id="videos" className="px-6 py-24">
      <div className="sunrise-glow card-surface mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.2)] p-10">
        <div className="mb-10 text-left text-white">
          <SectionHeading
            eyebrow="Video Archive"
            title={'\u82F1\u6B4C\u5F71\u50CF\u5B9E\u9A8C\u5BA4'}
            description={
              '6K \u6444\u5F55 + \u591A\u58F0\u9053\u91C7\u96C6\uFF0C\u642D\u914D\u6162\u901F\u4E0E\u52A0\u901F\u526A\u8F91\u5448\u73B0\u9F13\u70B9\u547C\u5438\uFF1A\u70B9\u51FB\u4EFB\u610F\u6761\u76EE\u5373\u53EF\u8FDB\u5165\u573A\u666F\u3002'
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            {first && (
            <motion.article
              key={first.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.4 }}
              className="group relative overflow-hidden rounded-[32px] card-surface"
            >
              <img
                src={first.cover_url || '/video-cover.jpg'}
                alt={first.title_zh}
                className="h-[360px] w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => window.open(first.url, '_blank')}
                className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-black shadow-lg transition hover:scale-105"
              >
                <FaPlay />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  {first.category || 'performance'}
                </p>
                <h3 className="mt-2 font-display text-2xl">{first.title_zh}</h3>
                {first.duration && (
                  <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                    {first.duration}s
                  </span>
                )}
              </div>
            </motion.article>
          )}
          <div className="space-y-4">
            {rest.slice(0, 4).map((video, index) => (
              <motion.button
                type="button"
                key={video.id}
                onClick={() => window.open(video.url, '_blank')}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.4 }}
                className="card-surface flex w-full items-center justify-between rounded-2xl border border-[rgba(246,208,124,0.18)] p-4 text-left"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                    {video.category || 'clip'}
                  </p>
                  <h4 className="mt-1 font-display text-lg text-white">{video.title_zh}</h4>
                </div>
                <span className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">Play</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
