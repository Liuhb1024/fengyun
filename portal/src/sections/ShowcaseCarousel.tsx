import { motion } from 'framer-motion';
import type { Carousel } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface ShowcaseCarouselProps {
  carousels: Carousel[];
}

const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ carousels }) => {
  if (!carousels.length) return null;
  return (
    <section className="bg-gradient-to-b from-white to-[#f5f5f7] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Feature"
          title="沉浸式英歌影像"
          description="以现代视角捕捉舞者与鼓点之间的张力，营造呼吸感十足的视觉体验。"
        />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {carousels.slice(0, 4).map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl bg-black/70 text-white shadow-xl"
            >
              <img
                src={item.image_url}
                alt={item.title_zh || 'carousel'}
                className="h-72 w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-accent">Featured</p>
                <h3 className="mt-2 font-display text-2xl">{item.title_zh || '英歌瞬间'}</h3>
                {item.link_url && (
                  <a
                    href={item.link_url}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-white/80 underline-offset-4 hover:underline"
                  >
                    查看详情
                  </a>
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
