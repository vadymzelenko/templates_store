import { Clock, Layers, Moon, Sparkles } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Unhurried scheduling",
    description: "Time blocks that respect your natural rhythms, with built-in breathing room between tasks.",
  },
  {
    icon: Layers,
    title: "Focused task layers",
    description: "Surface only what matters now. Everything else waits patiently until you're ready.",
  },
  {
    icon: Moon,
    title: "Quiet hours",
    description: "Automatic stillness periods that protect your deep work time from interruptions.",
  },
  {
    icon: Sparkles,
    title: "Gentle insights",
    description: "Thoughtful reflections on your patterns, never judgmental, always supportive.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-sm uppercase tracking-widest text-terracotta mb-4 block">Features</span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground text-balance">
            Tools that feel like calm
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-sage/30 transition-colors duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors duration-500">
                <feature.icon size={24} className="text-sage" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
