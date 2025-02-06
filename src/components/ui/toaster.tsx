"use client"

import {
  ToastClose,
  ToastDescription,
  ToastTitle,
  } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ToastViewport, ToastProvider, Toast } from "@radix-ui/react-toast"


export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}