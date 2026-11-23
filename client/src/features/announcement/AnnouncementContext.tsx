import { type ReactNode, useCallback, useEffect, useState } from 'react'
import {
  clearAnnouncement,
  readAnnouncement,
  subscribeToAnnouncement,
  type Announcement,
  writeAnnouncement,
} from './announcementStore'
import { AnnouncementContext } from './useAnnouncement'

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState<Announcement>(() => readAnnouncement())

  useEffect(() => subscribeToAnnouncement(() => setAnnouncement(readAnnouncement())), [])

  // Save keeps the current active state, so the editor's toggle and Save stay independent.
  // A blank message can never stay active.
  const save = useCallback(
    (message: string) => {
      const next = { message, active: announcement.active && message.trim() !== '' }

      writeAnnouncement(next)
      setAnnouncement(next)
    },
    [announcement.active],
  )

  const activate = useCallback(() => {
    const message = announcement.message.trim()
    if (!message) return

    const next = { message: announcement.message, active: true }

    writeAnnouncement(next)
    setAnnouncement(next)
  }, [announcement])

  const deactivate = useCallback(() => {
    const next = { ...announcement, active: false }

    writeAnnouncement(next)
    setAnnouncement(next)
  }, [announcement])

  const clear = useCallback(() => {
    clearAnnouncement()
    setAnnouncement({ message: '', active: false })
  }, [])

  return (
    <AnnouncementContext.Provider value={{ announcement, save, activate, deactivate, clear }}>
      {children}
    </AnnouncementContext.Provider>
  )
}
