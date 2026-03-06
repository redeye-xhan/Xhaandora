import '@/styles/globals.css'
import React from 'react'
import MenuBar from '@/components/MenuBar'
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp'
import ErrorNotificationProvider from '@/components/ErrorNotificationProvider'

export const metadata = {
  title: 'Xhaandora',
  description: 'Pomodoro productivity app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen flex flex-col bg-slate-900 text-slate-100">
        <ErrorNotificationProvider>
          <MenuBar />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
          <KeyboardShortcutsHelp />
        </ErrorNotificationProvider>
      </body>
    </html>
  )
}
