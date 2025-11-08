"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { Button } from "../ui/button"

export default function Contact() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-blue-white grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {`Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.`}
          </p>
          <div className="w-12 h-1 bg-gradient-blue-accent rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-20">
          {/* Contact Form */}
          <div className="fade-in-up">
            <form className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full px-6 py-3  rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="fade-in-up space-y-12">
            <div>
              <div className="flex gap-4 mb-12">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">support@wealthmind.com</p>
                </div>
              </div>

              <div className="flex gap-4 mb-12">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <p className="text-muted-foreground">+91 (123) 456-7890</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Location</p>
                  <p className="text-muted-foreground">Bangalore, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-border">
              <p className="font-semibold text-foreground mb-4">Follow Us</p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Facebook"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-4 py-2 bg-secondary rounded-lg text-primary hover:bg-primary hover:text-white dark:hover:text-neutral-950 transition-all duration-300 text-sm font-medium"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
