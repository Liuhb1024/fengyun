import { motion } from 'framer-motion';
import type { ImageItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface GallerySectionProps {
  images: ImageItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  if (!images.length) return null;
  const featured = images.slice(0, 10);

  return (
    <section id="gallery" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          align="center"
          eyebrow="Gallery"
          title="定格英歌张力"
          description="自由摄影、慢镜与航拍捕捉阵列交错的瞬间，悬停即可放大细节。"
        />
        <div className="gallery-masonry mt-14">
          {featured.map((image, index) => (
            <motion.figure
              key={image.id}
              className="gallery-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img src={image.thumbnail_url || image.url} alt={image.title_zh || 'gallery'} />
              <figcaption>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)]">
                  {image.category || 'MOMENT'}
                </p>
                <h3 className="font-display text-xl">{image.title_zh}</h3>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
