import { useEffect, useMemo, useState } from 'react';
import { animate } from 'framer-motion';
import type { StatsConfig } from '../api/portal';

interface StatsStripProps {
  stats: StatsConfig | null;
}

const StatsStrip: React.FC<StatsStripProps> = ({ stats }) => {
  const metrics = useMemo(
    () =>
      [
        { label: '\u6210\u7ACB', value: stats?.founded_year ?? 0, suffix: '' },
        { label: '\u6838\u5FC3\u9635\u5BB9', value: stats?.members ?? 0, suffix: '+' },
        { label: '\u5E74\u5EA6\u6F14\u51FA', value: stats?.performances ?? 0, suffix: '+' },
      ].filter((item) => item.value !== undefined),
    [stats?.founded_year, stats?.members, stats?.performances],
  );

  const [animatedValues, setAnimatedValues] = useState<number[]>(metrics.map(() => 0));

  useEffect(() => {
    setAnimatedValues(metrics.map(() => 0));
    metrics.forEach((metric, index) => {
      animate(0, Number(metric.value), {
        duration: 1.2,
        delay: index * 0.1,
        onUpdate: (latest) => {
          setAnimatedValues((prev) => {
            const next = [...prev];
            next[index] = latest;
            return next;
          });
        },
      });
    });
  }, [metrics]);

  if (!metrics.length) return null;

  return (
    <section className="relative isolate overflow-hidden py-14">
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(247,200,90,0.08)] via-transparent to-[rgba(214,66,50,0.08)]" />
      <div className="sunrise-glow card-surface relative mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-10 rounded-[36px] border border-[rgba(246,196,92,0.18)] px-8 py-10">
        {metrics.map((item, index) => (
          <div key={item.label} className="flex-1 min-w-[150px]">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--color-accent)]">{item.label}</p>
            <p className="mt-3 font-display text-4xl text-white md:text-5xl">
              {Math.round(animatedValues[index])}
              {item.suffix}
            </p>
            <div className="mt-2 h-[2px] w-24 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-crimson)] to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
