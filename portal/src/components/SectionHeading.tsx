interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
}) => {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <div className="accent-chip">
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="font-display text-3xl text-white md:text-4xl">
        <span className="gradient-text">{title}</span>
      </h2>
      <div className="h-px w-24 bg-gradient-to-r from-[var(--color-crimson)] via-[var(--color-accent)] to-transparent" />
      {description && <p className="text-base text-white/70">{description}</p>}
    </div>
  );
};

export default SectionHeading;
