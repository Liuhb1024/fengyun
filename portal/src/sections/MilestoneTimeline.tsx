import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { MilestoneEvent } from '../api/portal';

interface Props {
  events?: MilestoneEvent[];
}

const CARD_WIDTH = 420;

const MilestoneTimeline: React.FC<Props> = ({ events = [] }) => {
  const sorted = useMemo(
    () => [...events].sort((a, b) => dayjs(a.event_date).valueOf() - dayjs(b.event_date).valueOf()),
    [events],
  );

  const [activeId, setActiveId] = useState<number | null>(sorted[0]?.id ?? null);
  const activeEvent = sorted.find((item) => item.id === activeId) ?? sorted[0];

  if (!sorted.length) {
    return null;
  }

  return (
    <section id="timeline" className="relative overflow-hidden px-6 py-20">
      <div className="floating-orb" aria-hidden />
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-left md:text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--color-accent)]">Heritage Path</p>
          <h2 className="font-display text-3xl text-white">溯源节点纪实</h2>
          <p className="mt-3 text-white/60">以分镜方式渲染每段高光，沿着时间轴渐进揭示。</p>
        </div>

        <div className="hidden flex-col gap-8 md:flex">
          <div className="timeline-rail relative px-6">
            <div className="timeline-line" />
            <div className="flex flex-wrap justify-center gap-8 text-white">
              {sorted.map((event) => {
                const isActive = activeEvent?.id === event.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    className="timeline-node group flex flex-col items-center gap-3 text-center"
                    onMouseEnter={() => setActiveId(event.id)}
                    onFocus={() => setActiveId(event.id)}
                    onClick={() => setActiveId(event.id)}
                  >
                    <span className={`text-xs uppercase tracking-[0.4em] ${isActive ? 'text-white' : 'text-white/50'}`}>
                      {dayjs(event.event_date).format('YYYY · MMM')}
                    </span>
                    <span className={`max-w-[160px] text-sm font-semibold tracking-[0.2em] ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {event.title}
                    </span>
                    <span className={`timeline-dot ${isActive ? 'timeline-dot-active' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {activeEvent && (
            <div className="timeline-preview glass-panel mx-auto hidden rounded-[32px] border border-white/10 bg-[rgba(9,9,18,0.96)] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.6)] transition md:flex">
              <div className="flex gap-6">
                <div
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                  style={{ width: CARD_WIDTH }}
                >
                  {activeEvent.cover_url ? (
                    <img src={activeEvent.cover_url} alt={activeEvent.title} className="h-[220px] w-full object-cover" />
                  ) : (
                    <div className="flex h-[220px] items-center justify-center text-white/30">Yingge</div>
                  )}
                  <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.4em] text-white/70">
                    {dayjs(activeEvent.event_date).format('YYYY · MMM DD')}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/50">
                    <span>{activeEvent.category || 'Milestone'}</span>
                    {activeEvent.highlight && <span className="text-[var(--color-accent)]">Highlight</span>}
                  </div>
                  <h3 className="font-display text-3xl leading-tight">{activeEvent.title}</h3>
                  {activeEvent.location && <p className="text-white/70">{activeEvent.location}</p>}
                  {activeEvent.description && <p className="text-white/85">{activeEvent.description}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:hidden">
          {sorted.map((event) => (
            <div key={event.id} className="glass-panel rounded-[24px] p-4 text-white">
              <div className="text-xs uppercase tracking-[0.4em] text-white/40">
                {dayjs(event.event_date).format('YYYY · MMM DD')}
              </div>
              <h3 className="mt-2 font-display text-xl">{event.title}</h3>
              {event.cover_url && (
                <img src={event.cover_url} alt={event.title} className="mt-3 h-44 w-full rounded-2xl object-cover" />
              )}
              {event.description && <p className="mt-3 text-white/80">{event.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestoneTimeline;
