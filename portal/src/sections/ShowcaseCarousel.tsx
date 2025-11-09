import { motion } from 'framer-motion';
import type { Carousel } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface ShowcaseCarouselProps {
  carousels: Carousel[];
}

const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ carousels }) => {
  if (!carousels.length) return null;
  const items = carousels.slice(0, 6);

  return (
    <section id="experience" className="px-6 py-24">
      <div className="sunrise-glow card-surface mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.2)] p-10">
        <div className="flex flex-col gap-6 text-left md:flex-row md:items-center md:justify-between">
          <SectionHeading
            eyebrow="Immersive Showcase"
            title="鼓点与镜头的共振"
            description="高帧率摄影与动态声景，将击鼓、步伐与阵列拆分成可感知的“分镜”。横向滑动，在数秒间感受能量递进。"
          />
          <button
            type="button"
            className="outline-button self-start md:self-auto"
            onClick={() => window.open(items[0]?.link_url || '#videos', '_blank')}
          >
            观看全片
          </button>
        </div>
        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.4 }}
              className="group relative min-w-[280px] max-w-sm flex-1 overflow-hidden rounded-[32px] card-surface"
            >
              <img
                src={item.image_url}
                alt={item.title_zh || 'carousel'}
                className="h-72 w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">
                  Cinematic Loop
                </p>
                <h3 className="mt-2 font-display text-2xl">{item.title_zh || '英歌瞬间'}</h3>
                {item.link_url && (
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white"
                    onClick={() => window.open(item.link_url, '_blank')}
                  >
                    查看片段 <span className="text-[var(--color-accent)]">→</span>
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseCarousel;
