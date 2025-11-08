import type { MemberItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface MemberSpotlightProps {
  members: MemberItem[];
}

const MemberSpotlight: React.FC<MemberSpotlightProps> = ({ members }) => {
  if (!members.length) return null;
  return (
    <section id="members" className="bg-[#f5f5f7] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Team"
          title="英歌灵魂 · 核心成员"
          description="从首席鼓手到青年传承人，每一位成员都是非遗故事的讲述者。"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {members.slice(0, 6).map((member) => (
            <article
              key={member.id}
              className="rounded-3xl border border-white/60 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              {member.avatar && (
                <img
                  src={member.avatar}
                  alt={member.name_zh}
                  className="h-40 w-full rounded-2xl object-cover"
                />
              )}
              <h3 className="mt-4 font-display text-xl text-deep">{member.name_zh}</h3>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">
                {member.position_zh || '表演者'}
              </p>
              <p className="mt-3 text-sm text-deep/70 line-clamp-3">{member.bio_zh}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberSpotlight;
