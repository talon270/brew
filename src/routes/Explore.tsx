import Mascot from '../components/Mascot'
import CherryAnatomy from '../components/visuals/CherryAnatomy'
import Processing from '../components/visuals/Processing'
import RoastSpectrum from '../components/visuals/RoastSpectrum'
import GrindSizes from '../components/visuals/GrindSizes'
import FlavourWheel from '../components/visuals/FlavourWheel'
import MilkDrinks from '../components/visuals/MilkDrinks'

const ORIGINS = [
  {
    name: 'Chikmagalur',
    state: 'Karnataka',
    text: 'Where Indian coffee started — legend has Baba Budan smuggling seven seeds here in the 1600s. Balanced washed arabicas with chocolate and citrus.',
  },
  {
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    text: "India's largest producing district. Robusta-heavy, but the arabica estates at altitude are excellent and often underpriced.",
  },
  {
    name: 'Biligiris',
    state: 'Karnataka',
    text: 'High-altitude estates like Attikan. Denser beans, more acidity, more clarity in the cup.',
  },
  {
    name: 'Wayanad',
    state: 'Kerala',
    text: 'Mostly robusta, grown alongside pepper and cardamom. Heavy-bodied and low-acid — the backbone of South Indian filter coffee.',
  },
  {
    name: 'Araku Valley',
    state: 'Andhra Pradesh',
    text: 'Tribal cooperative-grown, organic, and unusually clean and floral for Indian coffee. A genuine specialty success story.',
  },
  {
    name: 'Shevaroys',
    state: 'Tamil Nadu',
    text: 'Yercaud estates at altitude. Also the home of much of the monsooned Malabar process.',
  },
]

function Section({
  title,
  lede,
  children,
}: {
  title: string
  lede: string
  children: React.ReactNode
}) {
  return (
    <section className="explore-section">
      <div className="section-head">
        <h2>{title}</h2>
        <div className="rule" />
      </div>
      <p className="lede" style={{ marginTop: 0 }}>
        {lede}
      </p>
      {children}
    </section>
  )
}

export default function Explore() {
  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Coffee 101</h1>
          <p className="lede">
            Everything worth knowing about coffee, drawn rather than described. Poke at
            anything — the diagrams are all interactive.
          </p>
        </div>
        <Mascot mood="delighted" size={116} />
      </div>

      <Section
        title="It's a fruit"
        lede="A coffee bean is the seed of a cherry. Click through the layers — nearly every decision on a coffee farm is about how you get the fruit off the seed."
      >
        <CherryAnatomy />
      </Section>

      <Section
        title="How the fruit comes off"
        lede="Processing is the biggest driver of flavour after roast level, and the one most people have never heard of. All four are answering the same question."
      >
        <Processing />
      </Section>

      <Section
        title="Then it gets roasted"
        lede="Roast level trades origin character for roast character. The two move in opposite directions along one axis — which is the single most useful thing to understand about buying coffee."
      >
        <RoastSpectrum />
      </Section>

      <Section
        title="Then you grind it"
        lede="Drawn to scale. Espresso really is about twenty times finer than French press, and seeing that side by side explains why one grinder cannot casually do both."
      >
        <GrindSizes />
      </Section>

      <Section
        title="And it tastes of something"
        lede="Eight families, enough vocabulary to say what you actually taste. The full professional wheel has around a hundred descriptors and helps nobody on their first cup."
      >
        <FlavourWheel />
      </Section>

      <Section
        title="What's in the cup"
        lede="Every cafe menu assumes you know the difference between a flat white and a latte. It's just proportions — so here they are, to scale."
      >
        <MilkDrinks />
      </Section>

      <Section
        title="India grows it"
        lede="India is a coffee origin, not just a coffee market — around 70% robusta, but the arabica estates hold their own at any price. Buying local also means buying fresher."
      >
        <div className="tiles">
          {ORIGINS.map((o) => (
            <div key={o.name} className="card">
              <strong>{o.name}</strong>
              <div className="meta" style={{ marginBottom: '0.4rem' }}>
                {o.state}
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem' }}>{o.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
