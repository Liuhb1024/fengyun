import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { ImageItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface GallerySectionProps {
  images: ImageItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const categories = useMemo(() => {
    const set = new Set<string>();
    images.forEach((img) => {
      if (img.category) set.add(img.category);
    });
    return ['全部', ...Array.from(set)];
  }, [images]);

  const filtered = useMemo(
    () => (activeCategory === '全部' ? images : images.filter((img) => img.category === activeCategory)),
    [activeCategory, images],
  );

  if (!images.length) return null;
  const display = filtered.slice(0, 10);
  const baseItems = display.length ? display : filtered;
  const repeatCount =
    baseItems.length >= 6 ? 2 : baseItems.length >= 3 ? 3 : baseItems.length >= 2 ? 4 : 6;
  const stripItems = Array.from({ length: repeatCount }, () => baseItems).flat();
  const CARD_WIDTH = 260;
  const GAP_PX = 16;
  const shiftDistance = baseItems.length * (CARD_WIDTH + GAP_PX);
  const trackWidth = stripItems.length * (CARD_WIDTH + GAP_PX);

  return (
    <section id="gallery" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          align="center"
          eyebrow="Gallery"
          title="英歌瞬间"
          description="横向胶片式浏览，像桌上摊开的照片，轻盈而富有层次。"
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

        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[rgba(12,6,5,0.4)] via-transparent to-[rgba(12,6,5,0.4)]">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--color-bg,#05060f)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--color-bg,#05060f)] to-transparent" />

          <motion.div
            className="flex py-4"
            style={{ width: `${trackWidth}px`, columnGap: `${GAP_PX}px` }}
            animate={baseItems.length > 1 ? { x: [0, -shiftDistance] } : false}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          >
            {stripItems.map((image, index) => {
              const tilt = (index % 2 === 0 ? -3 : 3) + (index % 5 === 0 ? 1 : 0);
              const cardNumber = ((index % baseItems.length) + 1).toString().padStart(2, '0');
              return (
                <motion.figure
                  key={`${image.id}-${index}`}
                  className="relative overflow-visible"
                  style={{ width: `${CARD_WIDTH}px` }}
                  whileHover={{ rotate: 0, y: -8, boxShadow: '0 24px 60px rgba(0,0,0,0.55)' }}
                >
                  <motion.div
                    className="relative overflow-hidden rounded-[20px] border border-[rgba(246,208,124,0.12)] bg-[rgba(12,6,5,0.68)] shadow-[0_16px_44px_rgba(0,0,0,0.48)] backdrop-blur-xl"
                    style={{ rotate: `${tilt}deg` }}
                  >
                    <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_20%_20%,rgba(246,208,124,0.08),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(214,66,50,0.06),transparent_40%)] mix-blend-screen opacity-80" />
                    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-[rgba(8,6,12,0.1)] via-[rgba(8,6,12,0.28)] to-[rgba(8,6,12,0.7)]" />
                    <div className="absolute inset-0 rounded-[20px] opacity-35 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width%3D%22100%22 height%3D%22100%22 viewBox%3D%220 0 100 100%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22n%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23n)%22 opacity%3D%220.12%22/%3E%3C/svg%3E")' }} />

                    <div className="relative">
                      <img
                        src={image.thumbnail_url || image.url}
                        alt={image.title_zh || 'gallery'}
                        className="h-60 w-full rounded-[18px] object-cover"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-b from-[rgba(0,0,0,0.06)] via-[rgba(0,0,0,0.22)] to-[rgba(0,0,0,0.65)]" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                        <span className="rounded-full border border-white/15 bg-[rgba(12,6,5,0.6)] px-3 py-1 text-[10px]">
                          {image.category || 'Moment'}
                        </span>
                        <span className="rounded-full border border-white/15 bg-[rgba(12,6,5,0.55)] px-2 py-1 text-[11px]">
                          {cardNumber}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                        {image.title_zh || '英歌曲线'}
                      </h3>
                    </div>
                  </motion.div>
                </motion.figure>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
