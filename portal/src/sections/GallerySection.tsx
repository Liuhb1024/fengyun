import type { ImageItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface GallerySectionProps {
  images: ImageItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  if (!images.length) return null;
  return (
    <section id="gallery" className="bg-[#05060b] py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Gallery"
          title="舞步之间 捕捉力量与温度"
          description="精选镜头记录排练与演出中的高光瞬间，感受英歌舞的呼吸与节奏。"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-3xl ${
                idx === 0 ? 'md:row-span-2 md:col-span-2' : ''
              }`}
            >
              <img
                src={image.thumbnail_url || image.url}
                alt={image.title_zh || 'gallery'}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs uppercase tracking-[0.4em] text-accent">
                  {image.category || 'moment'}
                </p>
                <p className="font-display text-xl">{image.title_zh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
