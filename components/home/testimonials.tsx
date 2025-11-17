"use client"

import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software Engineer",
      content:
        "WealthMind completely transformed how I manage my finances. The personalized recommendations helped me save ₹50K in just 3 months!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Startup Founder",
      content:
        "Finally, a tool that understands my complex financial needs. The SIP recommendations were spot-on for my goals.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Business Owner",
      content:
        "The investment risk analysis helped me make better decisions. I feel much more confident about my portfolio now.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 sm:py-32 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Loved by Users</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {`Real feedback from real users who've transformed their financial lives`}
          </p>
          <div className="w-12 h-1 bg-gradient-blue-accent rounded-full mx-auto mt-4"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="scale-in bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-sm border border-border p-8 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 italic">{`"${testimonial.content}"`}</p>

              {/* Author */}
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
