"use server"

import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["contact", "quote", "subscription"]),
})

type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the form data
    const validatedData = contactSchema.parse(data)

    // In a real implementation, you would send an email here
    // The recipient email is kept server-side and not exposed to the client
    const recipientEmail = process.env.CONTACT_EMAIL || "josh@copperheadcci.com"

    // For now, we'll simulate the email sending
    // In production, you'd use a service like Resend, SendGrid, or similar
    console.log("[v0] Contact form submission:", {
      to: recipientEmail,
      from: validatedData.email,
      subject:
        validatedData.type === "quote"
          ? "New Quote Request"
          : validatedData.type === "subscription"
            ? "Newsletter Subscription"
            : "Contact Form Submission",
      data: validatedData,
    })

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, message: "Thank you for your message. We'll get back to you soon!" }
  } catch (error) {
    console.error("[v0] Contact form error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: error.errors,
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}
