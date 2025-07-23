"use client"

import { useState } from "react"

// Global error state management
let globalError: string | null = null
let errorListeners: ((error: string | null) => void)[] = []

export function setError(error: string | null) {
  globalError = error
  errorListeners.forEach((listener) => listener(error))
}

export function getError(): string | null {
  return globalError
}

export function clearError() {
  setError(null)
}

export function useError() {
  const [error, setErrorState] = useState<string | null>(globalError)

  // Subscribe to error changes
  useState(() => {
    const listener = (newError: string | null) => {
      setErrorState(newError)
    }
    errorListeners.push(listener)

    return () => {
      errorListeners = errorListeners.filter((l) => l !== listener)
    }
  })

  return {
    error,
    setError,
    clearError,
  }
}

export function handleApiError(error: any): string {
  if (error?.message) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}
