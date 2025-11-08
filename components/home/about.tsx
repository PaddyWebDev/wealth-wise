"use client"

import { CheckCircle2, Shield, Zap } from "lucide-react"
import Image from "next/image"

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Visual - Financial Image */}
          <div className="relative fade-in-up">
            <div className="relative h-80 sm:h-96">
              <div className="w-full h-full bg-gradient-blue-white rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden flex items-center justify-center">
                <Image
                  width={100}
                  height={100}
                  src="/home/financial-planning-investment-dashboard-portfolio-.jpg"
                  alt="Financial Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-lg blur-xl"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 fade-in-up">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Welcome to WealthMind</h2>
              <div className="w-12 h-1 bg-gradient-blue-accent rounded-full"></div>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>Your intelligent personal finance companion designed to simplify wealth management for everyone.</p>
              <p>
                Our system helps users make smarter financial decisions by analyzing income, spending patterns, and
                savings goals. Using advanced data analytics, we provide personalized suggestions for investments,
                mutual funds, and financial planning.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-6 bg-neutral-50 dark:bg-neutral-800 border-2 border-primary/20 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle2 className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Data-Driven</p>
                    <p className="text-sm text-muted-foreground">
                      Personalized insights based on your financial profile
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-6 bg-neutral-50 dark:bg-neutral-800 border-2 border-primary/20 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Secure</p>
                    <p className="text-sm text-muted-foreground">Bank-level encryption for your financial data</p>
                  </div>
                </div>
              </div>

              <div
                className="p-6 bg-neutral-50 dark:bg-neutral-800 border-2 border-primary/20 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Zap className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Easy to Use</p>
                    <p className="text-sm text-muted-foreground">Simple interface for complex financial planning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
