import { FaPlay } from 'react-icons/fa6';
import type { VideoItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface VideoShowcaseProps {
  videos: VideoItem[];
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  if (!videos.length) return null;
  return (
    <section id="videos" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Documentary"
          title="鼓点与呼吸的影像诗"
          description="精选演出实录、幕后纪录与创作花絮，沉浸式体验英歌鼓点的力量。"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {videos.slice(0, 4).map((video) => (
            <article
              key={video.id}
              className="group relative overflow-hidden rounded-3xl bg-black/80 text-white shadow-lg"
            >
              <img
                src={video.cover_url || '/video-cover.jpg'}
                alt={video.title_zh}
                className="h-64 w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <button
                type="button"
                onClick={() => window.open(video.url, '_blank')}
                className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105"
              >
                <FaPlay />
              </button>
              <div className="absolute bottom-0 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-accent">
                  {video.category || 'performance'}
                </p>
                <h3 className="mt-1 font-display text-2xl">{video.title_zh}</h3>
                {video.duration && (
                  <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide">
                    {video.duration}s
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
