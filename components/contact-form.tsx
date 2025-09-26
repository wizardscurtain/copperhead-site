"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { submitContactForm } from "@/app/actions/contact"

interface ContactFormProps {
  type?: "contact" | "quote" | "subscription"
  title?: string
  description?: string
  className?: string
}

export function ContactForm({ type = "contact", title, description, className = "" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        company: formData.get("company") as string,
        service: formData.get("service") as string,
        message: formData.get("message") as string,
        type,
      }

      const result = await submitContactForm(data)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        const form = document.getElementById("contact-form") as HTMLFormElement
        form?.reset()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTitle = type === "quote" ? "Get a Quote" : type === "subscription" ? "Stay Connected" : "Contact Us"

  const defaultDescription =
    type === "quote"
      ? "Tell us about your security needs and we'll provide a customized solution."
      : type === "subscription"
        ? "Subscribe to our newsletter for security insights and updates."
        : "Get in touch with our security experts."

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title || defaultTitle}</CardTitle>
        <CardDescription>{description || defaultDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="contact-form" action={handleSubmit} className="space-y-4">
          {type !== "subscription" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input name="name" placeholder="Full Name *" required disabled={isSubmitting} />
                </div>
                <div>
                  <Input name="email" type="email" placeholder="Email Address *" required disabled={isSubmitting} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input name="phone" type="tel" placeholder="Phone Number" disabled={isSubmitting} />
                </div>
                <div>
                  <Input name="company" placeholder="Company/Organization" disabled={isSubmitting} />
                </div>
              </div>

              {type === "quote" && (
                <div>
                  <Select name="service" disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service of Interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive-protection">Executive Protection</SelectItem>
                      <SelectItem value="private-investigation">Private Investigation</SelectItem>
                      <SelectItem value="k9-detection">K9 Detection Services</SelectItem>
                      <SelectItem value="surveillance">Surveillance & Counter-Surveillance</SelectItem>
                      <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                      <SelectItem value="security-consulting">Security Consulting</SelectItem>
                      <SelectItem value="training">Training Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Textarea
                  name="message"
                  placeholder={
                    type === "quote"
                      ? "Please describe your security requirements, timeline, and any specific concerns..."
                      : "Your message..."
                  }
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {type === "subscription" && (
            <div>
              <Input name="email" type="email" placeholder="Your email address" required disabled={isSubmitting} />
              <input type="hidden" name="name" value="Newsletter Subscriber" />
              <input type="hidden" name="message" value="Newsletter subscription request" />
            </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Sending..."
              : type === "quote"
                ? "Request Quote"
                : type === "subscription"
                  ? "Subscribe"
                  : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
