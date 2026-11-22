
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  clearAnnouncement,
  readAnnouncement,
  subscribeToAnnouncement,
  type Announcement,
  writeAnnouncement,
} from './announcementStore'

type AnnouncementContextValue = {
  announcement: Announcement
  save: (message: string) => void
  activate: () => void
  deactivate: () => void
  clear: () => void
}

const AnnouncementContext = createContext<AnnouncementContextValue | null>(null)

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState<Announcement>(() => readAnnouncement())

  useEffect(() => subscribeToAnnouncement(() => setAnnouncement(readAnnouncement())), [])

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[announcement] state changed', announcement)
    }
  }, [announcement])

  const save = useCallback((message: string) => {
    const next = { message, active: false }

    if (import.meta.env.DEV) {
      console.log('[announcement] save', message)
    }

    writeAnnouncement(next)
    setAnnouncement(next)
  }, [])

  const activate = useCallback(() => {
    const message = announcement.message.trim()
    if (!message) return

    const next = { message: announcement.message, active: true }

    if (import.meta.env.DEV) {
      console.log('[announcement] activate')
    }

    writeAnnouncement(next)
    setAnnouncement(next)
  }, [announcement])

  const deactivate = useCallback(() => {
    const next = { ...announcement, active: false }

    if (import.meta.env.DEV) {
      console.log('[announcement] deactivate')
    }

    writeAnnouncement(next)
    setAnnouncement(next)
  }, [announcement])

  const clear = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('[announcement] clear')
    }

    clearAnnouncement()
    setAnnouncement({ message: '', active: false })
  }, [])

  return (
    <AnnouncementContext.Provider value={{ announcement, save, activate, deactivate, clear }}>
      {children}
    </AnnouncementContext.Provider>
  )
}

export function useAnnouncement(): AnnouncementContextValue {
  const value = useContext(AnnouncementContext)
  if (!value) {
    throw new Error('useAnnouncement must be used inside AnnouncementProvider')
  }
  return value
}