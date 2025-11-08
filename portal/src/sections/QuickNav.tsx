type QuickLink = {
  id: number;
  name: string;
  link_url: string;
  is_external?: boolean;
};

interface QuickNavProps {
  items: QuickLink[];
}

const QuickNav: React.FC<QuickNavProps> = ({ items }) => {
  if (!items?.length) return null;
  return (
    <section id="story" className="bg-[#f5f5f7] py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.link_url.startsWith('#')) {
                document.querySelector(item.link_url)?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.open(item.link_url, item.is_external ? '_blank' : '_self');
              }
            }}
            className="rounded-3xl border border-deep/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-accent">Explore</p>
            <p className="mt-4 font-display text-xl text-deep">{item.name}</p>
            <p className="mt-6 text-sm font-semibold text-primary">了解更多 →</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickNav;
