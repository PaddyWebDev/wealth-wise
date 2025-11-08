"use client"

import { BarChart3, TrendingUp, Zap, Target, Lock } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Get AI-powered suggestions tailored to your financial profile and goals.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "Expense Tracking & Analysis",
      description: "Monitor spending patterns and identify opportunities to save more.",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: TrendingUp,
      title: "SIP & Mutual Fund Suggestions",
      description: "Smart recommendations for systematic investment plans and fund allocation.",
      color: "from-green-400 to-green-600",
    },
    {
      icon: Zap,
      title: "Investment Risk Analysis",
      description: "Understand your risk profile and optimize portfolio accordingly.",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: Target,
      title: "Goal-Based Planning",
      description: "Create and track financial goals with personalized roadmaps.",
      color: "from-red-400 to-red-600",
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "Your financial data is encrypted and protected with top security standards.",
      color: "from-indigo-400 to-indigo-600",
    },
  ]

  return (
    <section id="features" className="py-16 sm:py-20 bg-gradient-blue-white grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to take control of your financial future
          </p>
          <div className="w-12 h-1 bg-gradient-blue-accent rounded-full mx-auto mt-4"></div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            return (
              <div
                key={i}
                className="scale-in p-8 bg-neutral-50 dark:bg-neutral-950 rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/50 dark:hover:border-neutral-950/50 transition-all duration-300 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
