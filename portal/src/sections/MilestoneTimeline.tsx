import dayjs from 'dayjs';
import { useMemo } from 'react';
import type { MilestoneEvent } from '../api/portal';

interface Props {
  events?: MilestoneEvent[];
}

const MilestoneTimeline: React.FC<Props> = ({ events = [] }) => {
  const sorted = useMemo(
    () => [...events].sort((a, b) => dayjs(a.event_date).valueOf() - dayjs(b.event_date).valueOf()),
    [events],
  );

  if (!sorted.length) {
    return null;
  }

  return (
    <section id="timeline" className="relative overflow-hidden px-6 py-20">
      <div className="floating-orb" aria-hidden />
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-left md:text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--color-accent)]">Heritage Path</p>
          <h2 className="font-display text-3xl text-white">溯源节点纪实</h2>
          <p className="mt-3 text-white/60">以分镜卡片呈现每个高光瞬间，横向时间轴一览。</p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-full gap-6">
            {sorted.map((event, idx) => (
              <article
                key={event.id}
                className="group relative w-[320px] flex-shrink-0 rounded-[32px] border border-white/10 bg-[rgba(9,9,18,0.95)] p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.5)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40">
                  <span>{dayjs(event.event_date).format('YYYY · MMM')}</span>
                  <span>{event.category || `Scene ${idx + 1}`}</span>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  {event.cover_url ? (
                    <img
                      src={event.cover_url}
                      alt={event.title}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-white/30">Yingge</div>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-display text-2xl leading-tight">{event.title}</h3>
                  {event.location && <p className="text-sm text-white/60">{event.location}</p>}
                  {event.description && <p className="text-sm text-white/80">{event.description}</p>}
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-transparent transition group-hover:border-[rgba(246,196,92,0.35)]" />
              </article>
            ))}
          </div>
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
