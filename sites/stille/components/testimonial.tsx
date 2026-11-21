export function Testimonial() {
  return (
    <section className="py-32 px-6 bg-sage/5">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-sm uppercase tracking-widest text-muted-foreground mb-8 block">What people say</span>

        <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight tracking-tight mb-10 text-balance">
          "Stille changed my relationship with work. For the first time, I feel like I'm working with intention rather
          than just keeping busy."
        </blockquote>

        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
            <img src="/professional-woman-portrait--soft-lighting--neutra.jpg" alt="Emma Lindström" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-foreground font-medium">Emma Lindström</p>
            <p className="text-sm text-muted-foreground">Design Director, Copenhagen</p>
          </div>
        </div>
      </div>
    </section>
  )
}
