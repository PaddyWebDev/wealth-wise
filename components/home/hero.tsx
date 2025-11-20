"use client"

import { ArrowRight, TrendingUp, PieChart, BarChart3, Wallet } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
export default function Hero() {
  const router = useRouter();
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-blue-white grid-pattern py-8 sm:py-14 lg:py-18">

      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="absolute top-32 left-20 animate-bounce" style={{ animationDelay: "0s" }}>
        <div className="p-3 bg-white  rounded-full shadow-lg border border-border">
          <TrendingUp className=" dark:text-neutral-950" size={24} />
        </div>
      </div>
      <div className="absolute top-48 right-32 animate-bounce" style={{ animationDelay: "0.5s" }}>
        <div className="p-3 bg-white rounded-full shadow-lg border border-border">
          <PieChart className="dark:text-neutral-950" size={24} />
        </div>
      </div>
      <div className="absolute bottom-32 left-1/4 animate-bounce" style={{ animationDelay: "1s" }}>
        <div className="p-3 bg-white rounded-full shadow-lg border border-border">
          <Wallet className="dark:text-neutral-950" size={24} />
        </div>
      </div>
      <div className="absolute bottom-40 right-20 animate-bounce" style={{ animationDelay: "0.3s" }}>
        <div className="p-3 bg-white rounded-full shadow-lg border border-border">
          <BarChart3 className="text-accent" size={24} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8 slide-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Smart Financial Planning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground leading-tight">
              Your Intelligent Personal Finance Companion
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Make smarter financial decisions with AI-powered personalized recommendations, expense tracking, and
              investment planning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="px-8 py-5 dark:text-neutral-950 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 group" onClick={() => router.push("/guest/Register")}>
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button  variant={"secondary"} onClick={() => router.push("/guest/Login")} className="px-8 py-5  rounded-lg font-semibold ">
                Already Registered
              </Button>
            </div>

            <div className="flex gap-6 pt-8 text-sm flex-wrap">
              <div
                className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-border hover:shadow-lg transition-all animate-in fade-in-up hover:scale-105 transform duration-300"
                style={{ animationDelay: "200ms" }}
              >
                <p className="font-bold text-primary dark:text-neutral-100 text-lg ">100K+</p>
                <p className="text-muted-foreground text-sm">Users Empowered</p>
              </div>
              <div
                className="p-5 bg-neutral-50 dark:bg-neutral-900  rounded-lg border border-border hover:shadow-lg transition-all animate-in fade-in-up hover:scale-105 transform duration-300"
                style={{ animationDelay: "300ms" }}
              >
                <p className="font-bold text-primary dark:text-neutral-100 text-lg">₹1.5Cr+</p>
                <p className="text-muted-foreground text-sm">Wealth Managed</p>
              </div>
              <div
                className="p-5 bg-neutral-50 dark:bg-neutral-900  rounded-lg border border-border hover:shadow-lg transition-all animate-in fade-in-up hover:scale-105 transform duration-300"
                style={{ animationDelay: "400ms" }}
              >
                <p className="font-bold text-primary dark:text-neutral-100 text-lg">99.8%</p>
                <p className="text-muted-foreground text-sm">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Financial Image */}
          <div className="slide-in-right relative h-80 sm:h-96">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-full bg-gradient-blue-white rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden flex items-center justify-center">
                <Image
                  width={500}
                  height={500}
                  src="/home/financial-dashboard-analytics-charts-investment-po.jpg"
                  alt="Financial Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
