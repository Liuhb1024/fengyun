const ContactCTA = () => (
  <section id="contact" className="bg-gradient-to-b from-deep to-black py-24 text-white">
    <div className="mx-auto max-w-5xl px-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.5em] text-accent">Connect</p>
      <h2 className="mt-4 font-display text-4xl">预约演出 / 合作洽谈</h2>
      <p className="mt-4 text-white/70">
        支持全国巡演、文化交流、品牌定制演出与非遗课堂。提供全程编导、服装、器乐。
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 text-lg">
        <a href="tel:+8613800000000" className="text-white/90 hover:text-white">
          +86 138 0000 0000
        </a>
        <a href="mailto:heritage@yingge.com" className="text-white/90 hover:text-white">
          heritage@yingge.com
        </a>
        <p className="text-white/60">广东省汕头市金平区非遗中心</p>
      </div>
    </div>
  </section>
);

export default ContactCTA;
