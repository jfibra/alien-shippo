"use client"

import { toast } from "@/components/ui/use-toast"

// Simple toast-based replacement for SweetAlert
export const Swal = {
  fire: (options: {
    title?: string
    text?: string
    icon?: "success" | "error" | "warning" | "info"
    confirmButtonText?: string
    showCancelButton?: boolean
    cancelButtonText?: string
  }) => {
    const { title, text, icon } = options

    toast({
      title: title || "",
      description: text || "",
      variant: icon === "error" ? "destructive" : "default",
    })

    // Return a promise that resolves immediately for compatibility
    return Promise.resolve({ isConfirmed: true })
  },
}

export default Swal
