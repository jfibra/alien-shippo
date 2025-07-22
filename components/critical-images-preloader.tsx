"use client"

import { useEffect } from "react"
import Image from "next/image"

// List of critical images to preload
const criticalImages = [
  "/alien-shipper-logo.png",
  "/viking-delivery.png",
  // Add other critical images here
]

export function CriticalImagesPreloader() {
  useEffect(() => {
    criticalImages.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  return (
    <div className="hidden">
      {criticalImages.map((src) => (
        <Image key={src} src={src || "/placeholder.svg"} alt="" width={1} height={1} priority />
      ))}
    </div>
  )
}
