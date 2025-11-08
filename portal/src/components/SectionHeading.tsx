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
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-accent">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl md:text-4xl text-white">{title}</h2>
      {description && <p className="mt-3 text-base text-white/70">{description}</p>}
    </div>
  );
};

export default SectionHeading;
