import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

type NavLink = {
  id: number;
  name: string;
  link_url: string;
  is_external?: boolean;
};

interface NavbarProps {
  links: NavLink[];
}

const scrollToAnchor = (href: string) => {
  if (href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: (target as HTMLElement).offsetTop - 100,
        behavior: 'smooth',
      });
    }
  } else {
    window.open(href, '_blank');
  }
};

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        scrolled ? 'bg-[#0e0f19]/95 backdrop-blur border-b border-white/10' : 'bg-transparent',
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
        <div className="flex flex-col">
          <span className="font-display text-xl tracking-[0.3em] uppercase">Yingge</span>
          <span className="text-xs text-white/70">Chaoshan Heritage Troupe</span>
        </div>
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToAnchor(link.link_url || '#')}
              className="text-sm font-medium uppercase tracking-wide text-white/80 transition hover:text-white"
            >
              {link.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollToAnchor('#contact')}
          className="rounded-full border border-white/40 px-4 py-2 text-sm uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
        >
          Book a Show
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
