'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'

interface Notification {
  id: string
  message: string
  type: 'error' | 'success' | 'info'
  duration?: number
}

interface ErrorContextType {
  notifications: Notification[]
  showError: (message: string, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  removeNotification: (id: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    return {
      showError: (msg: string) => console.error(msg),
      showSuccess: (msg: string) => console.log(msg),
      showInfo: (msg: string) => console.log(msg),
      removeNotification: () => {},
      notifications: [],
    }
  }
  return context
}

export default function ErrorNotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'info' = 'error', duration = 5000) => {
      const id = String(Date.now())
      setNotifications((prev) => [...prev, { id, message, type, duration }])

      if (duration > 0) {
        setTimeout(() => removeNotification(id), duration)
      }
    },
    [removeNotification]
  )

  const showError = useCallback(
    (message: string, duration?: number) => addNotification(message, 'error', duration),
    [addNotification]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => addNotification(message, 'success', duration),
    [addNotification]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => addNotification(message, 'info', duration),
    [addNotification]
  )

  return (
    <ErrorContext.Provider
      value={{
        notifications,
        showError,
        showSuccess,
        showInfo,
        removeNotification,
      }}
    >
      {children}

      {}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -10, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10, x: 20 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <div
                className={`p-3 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 ${
                  notification.type === 'error'
                    ? 'bg-red-500/90 text-white'
                    : notification.type === 'success'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-blue-500/90 text-white'
                }`}
              >
                {notification.type === 'error' && <span>❌</span>}
                {notification.type === 'success' && <span>✅</span>}
                {notification.type === 'info' && <span>ℹ️</span>}
                <span>{notification.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ErrorContext.Provider>
  )
}
