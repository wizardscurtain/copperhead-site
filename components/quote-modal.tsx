"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ContactForm } from "./contact-form"

interface QuoteModalProps {
  children: React.ReactNode
}

export function QuoteModal({ children }: QuoteModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Security Quote</DialogTitle>
        </DialogHeader>
        <ContactForm
          type="quote"
          description="Tell us about your security requirements and we'll provide a customized solution within 24 hours."
        />
      </DialogContent>
    </Dialog>
  )
}
