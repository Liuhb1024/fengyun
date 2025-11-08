import type { StatsConfig } from '../api/portal';

interface StatsStripProps {
  stats: StatsConfig | null;
}

const StatsStrip: React.FC<StatsStripProps> = ({ stats }) => {
  if (!stats) return null;
  const data = [
    { label: '创建年份', value: stats.founded_year, suffix: '' },
    { label: '核心成员', value: stats.members, suffix: '+' },
    { label: '年度演出', value: stats.performances, suffix: '+' },
  ];

  return (
    <section className="bg-deep text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        {data.map((item) => (
          <div key={item.label} className="text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.5em] text-accent">{item.label}</p>
            <p className="font-display text-4xl md:text-5xl">
              {item.value}
              {item.suffix}
            </p>
            <div className="mt-1 h-0.5 w-16 bg-gradient-to-r from-accent to-transparent md:w-24" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
