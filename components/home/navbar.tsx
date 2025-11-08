"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 fade-in-up">
            <div className="w-10 h-10 bg-gradient-blue-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₹</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline">WealthMind</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
            >
              Contact Us
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button className="px-6 py-2.5 bg-blue-500 text-black rounded-lg hover:shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all duration-300 font-semibold text-sm">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in-up duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            <button className="w-full mt-2 px-4 py-2.5 bg-gradient-blue-accent text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm">
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
