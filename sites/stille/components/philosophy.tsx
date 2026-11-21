export function Philosophy() {
  return (
    <section id="philosophy" className="py-32 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image placeholder */}
          <div className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden">
            <img src="/minimal-scandinavian-workspace-with-natural-light-.jpg" alt="Serene workspace" className="w-full h-full object-cover" />
            {/* Decorative accent */}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/90 backdrop-blur-sm rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                "When life and work move in sync, the best ideas don't just happen—they flow."
              </p>
            </div>
          </div>

          {/* Right: Text content */}
          <div className="flex flex-col gap-8">
            <span className="text-sm uppercase tracking-widest text-sage">Our Philosophy</span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-tight text-balance">
              Dedicated to intentional work & quiet focus
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Stille was born from a simple observation: the most meaningful work rarely happens amid constant
                notifications and endless task lists. It emerges in moments of stillness.
              </p>
              <p>
                We've built a tool that honors the rhythm of deep work—creating space for concentration, reflection, and
                the kind of focused attention that transforms ordinary tasks into craft.
              </p>
            </div>
            <div className="pt-4">
              <a href="#features" className="inline-flex items-center gap-2 text-foreground group">
                <span className="border-b border-foreground pb-0.5">Explore our approach</span>
                <span className="text-terracotta group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
