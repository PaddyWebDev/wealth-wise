"use client"

import { UserPlus, BarChart3, Lightbulb, TrendingUp, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign up & Enter Basic Details",
      description: "Create your account and provide essential financial information like income, expenses, and goals.",
      animation: "from-blue-400 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "System Analyzes Your Data",
      description: "Our advanced algorithms analyze your financial profile to understand your situation and goals.",
      animation: "from-purple-400 to-purple-600",
    },
    {
      icon: Lightbulb,
      title: "Personalized Plan Generated",
      description: "Receive a customized financial plan with specific recommendations for your unique needs.",
      animation: "from-yellow-400 to-yellow-600",
    },
    {
      icon: TrendingUp,
      title: "Track & Optimize Over Time",
      description: "Monitor progress towards your goals and receive updated recommendations as your situation changes.",
      animation: "from-green-400 to-green-600",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-background relative overflow-hidden">
      <div className="absolute top-32 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to start your wealth-building journey
          </p>
          <div className="w-12 h-1 bg-gradient-blue-accent rounded-full mx-auto mt-4"></div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="fade-in-up relative" style={{ animationDelay: `${i * 150}ms` }}>
                {/* Step Card */}
                <div className="bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-700/50 rounded-xl shadow-sm border border-border p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 group">
                  {/* Step Number with animation */}
                  <div
                    className={`absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br ${step.animation} text-white rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-125 transition-transform`}
                  >
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${step.animation} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>

                {/* Connector Line with arrow animation */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 items-center justify-center">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                    <ArrowRight className="w-5 h-5 text-accent ml-1" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
