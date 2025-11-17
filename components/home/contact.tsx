"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import z from "zod"
import { contactFormSchema } from "@/lib/guest-form-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormItem, FormMessage, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import React from "react"
import { Textarea } from "../ui/textarea"


export type contactFormType = z.infer<typeof contactFormSchema>
export default function Contact() {
  const [isPending, startTransition] = React.useTransition()
  const contactForm = useForm<contactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  })

  async function handleFormSubmit(data: contactFormType) {
    startTransition(() => {
      console.log(data);
    })
  }
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
          <div className="fade-in-up dark:bg-neutral-800/60 shadow-md p-3 rounded-md">
            <Form {...contactForm}>
              <form className="space-y-8" onSubmit={contactForm.handleSubmit(handleFormSubmit)}>
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}

                />
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />

                    </FormItem>
                  )}

                />
                <FormField
                  control={contactForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Type your message here." disabled={isPending} {...field} />

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}

                />


                <Button
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
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
