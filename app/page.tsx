// import Navbar from "@/components/home/navbar"
import Hero from "@/components/home/hero"
import About from "@/components/home/about"
import Features from "@/components/home/features"
import HowItWorks from "@/components/home/how-it-works"
import Dashboard from "@/components/home/dashboard"
import Testimonials from "@/components/home/testimonials"
import Contact from "@/components/home/contact"
import Footer from "@/components/home/footer"
import GuestNavbar from "@/components/guest-navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full dark:bg-neutral-700">
      <GuestNavbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Dashboard />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
