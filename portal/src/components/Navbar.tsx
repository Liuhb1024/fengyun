import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { motion, useScroll, useSpring } from 'framer-motion';

type NavLink = {
  id: number;
  name: string;
  link_url: string;
  is_external?: boolean;
};

interface NavbarProps {
  links: NavLink[];
}

const scrollToAnchor = (href: string, isExternal?: boolean) => {
  if (!href) return;
  if (href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: (target as HTMLElement).offsetTop - 90,
        behavior: 'smooth',
      });
    }
  } else if (typeof window !== 'undefined') {
    window.open(href, isExternal ? '_blank' : '_self');
  }
};

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string>('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const positions = links
        .filter((link) => link.link_url?.startsWith('#'))
        .map((link) => {
          const element = document.querySelector(link.link_url);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { id: link.link_url, offset: rect.top };
        })
        .filter(Boolean) as { id: string; offset: number }[];

      const current = positions.find((pos) => pos.offset >= -120 && pos.offset <= 200);
      if (current) setActiveLink(current.id);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [links]);

  return (
    <motion.nav
      className={clsx(
        'group fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[rgba(12,6,5,0.9)] backdrop-blur-2xl border-b border-[rgba(247,200,90,0.25)] shadow-[0_10px_40px_rgba(0,0,0,0.35)]'
          : 'bg-transparent',
      )}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(247,200,90,0.45)] bg-gradient-to-br from-[rgba(247,200,90,0.2)] to-[rgba(214,66,50,0.2)] text-sm font-semibold tracking-[0.3em] text-white">
            YG
          </div>
          <div>
            <p className="font-display text-base uppercase tracking-[0.6em] text-white">YINGGE</p>
            <p className="text-xs text-[var(--color-muted)]">Chaoshan Heritage Collective</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm uppercase tracking-[0.3em] text-white/70 lg:flex">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToAnchor(link.link_url, link.is_external)}
              className={clsx(
                'relative transition',
                activeLink === link.link_url ? 'text-[var(--color-accent)]' : 'hover:text-white',
              )}
            >
              {link.name}
              <span
                className={clsx(
                  'absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[var(--color-accent)] to-transparent transition transform',
                  activeLink === link.link_url ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden text-xs uppercase tracking-[0.3em] text-white/60 sm:block"
            onClick={() => scrollToAnchor('#gallery')}
          >
            Immersive View
          </button>
          <button type="button" className="neon-button" onClick={() => scrollToAnchor('#contact')}>
            Book
          </button>
        </div>
      </div>
      <motion.span
        className="block h-[2px] origin-left bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-soft)] to-transparent"
        style={{ scaleX: progress }}
      />
    </motion.nav>
  );
};

export default Navbar;
