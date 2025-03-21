"use client"

import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const toast = useCallback(({ title, description, duration = 3000, variant = "default" }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, duration, variant }])

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Render toasts in a portal
  useEffect(() => {
    if (typeof document === "undefined") return

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
      document.body.appendChild(toastContainer)
    }

    // Render toasts
    toastContainer.innerHTML = ""
    toasts.forEach((toast) => {
      const toastEl = document.createElement("div")
      toastEl.className = `bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-2 transition-all transform translate-x-0 max-w-md ${
        toast.variant === "destructive" ? "border-l-4 border-red-500" : "border-l-4 border-primary"
      }`

      toastEl.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            ${toast.title ? `<h3 class="font-medium">${toast.title}</h3>` : ""}
            ${toast.description ? `<p class="text-sm text-gray-500 dark:text-gray-400">${toast.description}</p>` : ""}
          </div>
          <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" onclick="document.getElementById('${toast.id}').remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `

      toastEl.id = toast.id
      toastContainer.appendChild(toastEl)
    })

    return () => {
      // Clean up
      if (toastContainer && toastContainer.childNodes.length === 0) {
        document.body.removeChild(toastContainer)
      }
    }
  }, [toasts])

  return { toast, dismiss }
}

