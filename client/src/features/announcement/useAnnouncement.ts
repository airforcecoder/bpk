import { createContext, useContext } from 'react'
import type { Announcement } from './announcementStore'

export type AnnouncementContextValue = {
  announcement: Announcement
  save: (message: string) => void
  activate: (message: string) => void
  deactivate: () => void
  clear: () => void
}

// Kept apart from the provider component so each file exports either a
// component or non-components (react-refresh/only-export-components).
export const AnnouncementContext = createContext<AnnouncementContextValue | null>(null)

export function useAnnouncement(): AnnouncementContextValue {
  const value = useContext(AnnouncementContext)
  if (!value) {
    throw new Error('useAnnouncement must be used inside AnnouncementProvider')
  }
  return value
}
