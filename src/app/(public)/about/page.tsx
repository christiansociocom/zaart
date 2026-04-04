import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us – Za Art',
  description: 'Learn the story behind Za Art — handcrafted wooden furniture made in Tanzania.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        {/* Replace /icons/about-hero.png with your own illustration */}
        <div className="text-6xl mb-4" aria-hidden="true">🪵</div>
        <h1 className="section-heading mb-3">Our Story</h1>
        <p className="text-bark-600 text-lg">
          Handmade in Tanzania, with love and quality wood.
        </p>
      </div>

      {/* Story */}
      <div className="prose-custom space-y-6 text-bark-700 text-base leading-relaxed">
        <p className="text-lg font-medium text-wood-800">
          Za Art started with a simple idea: beautiful things should be made by hand.
        </p>
        <p>
          We are a small Tanzanian workshop that crafts wooden furniture and home accessories
          using locally sourced timber and traditional techniques passed down through generations.
          Every tray, bowl, shelf, and table that leaves our workshop is made by skilled hands —
          no machines, no shortcuts.
        </p>
        <p>
          We believe your home deserves pieces that are unique. Because wood is natural, every
          grain pattern is different. That means no two Za Art products are ever exactly the same —
          yours is truly one of a kind.
        </p>
        <p>
          Our products are built to last. We use quality finishes that protect the wood and
          keep it looking beautiful for years. Whether it&apos;s a serving tray on your kitchen counter
          or a coffee table in your living room, we craft it with the same attention and pride.
        </p>
        <p className="font-medium text-wood-800">
          Thank you for supporting local craftsmanship.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14">
        {[
          { icon: '✋',   title: 'Handmade',       desc: 'Every piece shaped and finished by skilled hands in our workshop.' },
          { icon: '🌳',   title: 'Local Wood',     desc: 'We use quality Tanzanian timber, supporting our local forests responsibly.' },
          { icon: '❤️',   title: 'Made with Care', desc: 'We take pride in every product. If you are not happy, neither are we.' },
        ].map(v => (
          <div key={v.title} className="card p-6 text-center">
            <div className="text-4xl mb-3" aria-hidden="true">{v.icon}</div>
            <h3 className="font-display font-bold text-wood-900 text-lg mb-2">{v.title}</h3>
            <p className="text-bark-600 text-sm">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
