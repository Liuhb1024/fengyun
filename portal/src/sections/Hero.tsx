import { motion } from 'framer-motion';
import type { Carousel, HeroConfig } from '../api/portal';

interface HeroProps {
  hero: HeroConfig | null;
  carousels: Carousel[];
}

const Hero: React.FC<HeroProps> = ({ hero, carousels }) => {
  const backgroundVideo = hero?.video_url || carousels[0]?.image_url || '';

  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-deep text-white"
    >
      {backgroundVideo && backgroundVideo.endsWith('.mp4') ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src={backgroundVideo}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${backgroundVideo || '/hero-placeholder.jpg'})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <motion.p
          className="font-display text-sm uppercase tracking-[0.5em] text-accent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {hero?.title_en || 'CHAOSHAN YINGGE'}
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-4xl tracking-[0.2em] uppercase md:text-6xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {hero?.title_zh || '潮汕英歌舞'}
        </motion.h1>
        <motion.p
          className="mt-6 max-w-3xl text-lg text-white/80 md:text-2xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {hero?.subtitle_zh || '舞动千年鼓点 · 重塑非遗风采'}
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            type="button"
            className="rounded-full bg-primary px-8 py-3 font-display text-sm uppercase tracking-[0.4em] transition hover:bg-primary/80"
            onClick={() => {
              if (hero?.cta_link?.startsWith('#')) {
                document.querySelector(hero.cta_link)?.scrollIntoView({ behavior: 'smooth' });
              } else if (hero?.cta_link) {
                window.open(hero.cta_link, '_blank');
              }
            }}
          >
            {hero?.cta_text_zh || '预约演出'}
          </button>
          <a
            href="#story"
            className="rounded-full border border-white/40 px-8 py-3 text-sm uppercase tracking-[0.4em] text-white transition hover:border-white"
          >
            探索文化
          </a>
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <div className="animate-bounce text-xs tracking-[0.5em] text-white/70">SCROLL</div>
      </div>
    </section>
  );
};

export default Hero;
