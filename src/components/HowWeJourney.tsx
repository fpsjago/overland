const steps = [
  {
    number: '01',
    title: 'Brief & Match',
    description:
      'Every expedition begins with a conversation. We map your experience level, your physical condition, your aspirations, and your timeline. Then we match you to the journey — not the other way around.',
  },
  {
    number: '02',
    title: 'Prepare',
    description:
      'Twelve weeks before departure, you receive a detailed preparation protocol: training schedule, gear list with our specific recommendations, visa logistics, vaccination requirements, and a pre-expedition call with your guide.',
  },
  {
    number: '03',
    title: 'Journey',
    description:
      'In the field, our guides lead small groups — eight maximum. Every decision is made with weather, terrain, and group wellbeing as the only variables. We carry emergency equipment and maintain satellite communication throughout.',
  },
  {
    number: '04',
    title: 'Return',
    description:
      'The expedition does not end at the trailhead. We debrief with every group, share the photography, and maintain the connections formed in the field. Many of our clients have returned for a second, third, or fifth journey.',
  },
];

export function HowWeJourney() {
  return (
    <section className="py-32 bg-canvas">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Sticky left column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="coords text-xs mb-6 text-accent-ink">
              PROCESS / METHODOLOGY
            </p>
            <h2
              className="font-heading font-black italic leading-none mb-8 text-primary text-[length:clamp(2.5rem,5vw,4rem)]"
              data-reveal="slide-left"
            >
              How We
              <br />
              Journey
            </h2>
            <p className="font-body leading-relaxed text-muted text-[length:1.0625rem]">
              Four phases, built from eighteen years of experience leading people into places they have never been — and back again.
            </p>

            {/* Decorative line */}
            <div className="mt-12 w-px h-32 bg-accent opacity-40" />
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-8 group"
                data-reveal="slide-left"
              >
                <div className="font-heading font-black italic leading-none shrink-0 pt-1 text-hairline text-[length:clamp(2rem,4vw,3rem)] transition-colors duration-300 group-hover:text-accent-ink">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-heading font-bold mb-4 text-primary text-[length:1.25rem]">
                    {step.title}
                  </h3>
                  <p className="font-body leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
