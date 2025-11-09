import { motion } from 'framer-motion';
import type { MemberItem } from '../api/portal';
import SectionHeading from '../components/SectionHeading';

interface MemberSpotlightProps {
  members: MemberItem[];
}

const MemberSpotlight: React.FC<MemberSpotlightProps> = ({ members }) => {
  if (!members.length) return null;
  const spotlight = members.slice(0, 6);

  return (
    <section id="members" className="px-6 py-24">
      <div className="sunrise-glow card-surface mx-auto max-w-6xl rounded-[36px] border border-[rgba(246,196,92,0.2)] p-10 text-center text-white">
        <SectionHeading
          align="center"
          eyebrow="Heritage Ensemble"
          title={"\u82F1\u6B4C\u7075\u9B42\u4EBA\u7269"}
          description={
            "\u9F13\u624B\u3001\u65D7\u624B\u3001\u5531\u9886\u4E0E\u9752\u5E74\u4F20\u627F\u4EBA\u540C\u53F0\uFF0C\u5171\u6784\u82F1\u6B4C\u821E\u7684\u201C\u547C\u5438\u7CFB\u7EDF\u201D\u3002"
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {spotlight.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
              className="card-surface relative overflow-hidden rounded-[28px] p-6 text-left"
            >
              {member.avatar && (
                <img src={member.avatar} alt={member.name_zh} className="h-40 w-full rounded-2xl object-cover" />
              )}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  {member.position_zh || 'Performer'}
                </p>
                <h3 className="mt-2 font-display text-2xl text-white">{member.name_zh}</h3>
                <p className="mt-3 text-sm text-white/70 line-clamp-3">{member.bio_zh}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberSpotlight;
