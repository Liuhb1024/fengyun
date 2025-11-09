import { motion } from 'framer-motion';
import type { ImageItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface GallerySectionProps {
  images: ImageItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  if (!images.length) return null;
  const featured = images.slice(0, 5);

  return (
    <section id="gallery" className="relative overflow-hidden px-6 py-24">
      <div className="sunrise-glow card-surface relative mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.2)] p-10 text-white">
        <SectionHeading
          align="center"
          eyebrow="Gallery"
          title={'\u5B9A\u683C\u82F1\u6B4C\u5F20\u529B'}
          description={
            '\u81EA\u7531\u6444\u5F71\u3001\u6162\u95F4\u4E0E\u822A\u62CD\u6355\u6349\u9635\u5217\u4EA4\u9519\u7684\u77AC\u95F4\uFF0C\u60AC\u505C\u5373\u53EF\u653E\u5927\u7EC6\u8282\uFF0C\u8EAB\u4EFB\u811A\u4E0B\u7EC8\u70B9\u4F19\u4F34\u7684\u8109\u52A8\u3002'
          }
        />
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {featured.map((image, index) => (
            <motion.div
              key={image.id}
              className={`group relative overflow-hidden rounded-[30px] card-surface ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={image.thumbnail_url || image.url}
                alt={image.title_zh || 'gallery'}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">
                  {image.category || 'MOMENT'}
                </p>
                <h3 className="font-display text-xl">{image.title_zh}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
