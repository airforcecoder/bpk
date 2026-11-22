




export type Announcement = {
  message: string
  active: boolean
}

const STORAGE_KEY = 'bpk:announcement-demo'
const ANNOUNCEMENT_CHANGED_EVENT = 'bpk:announcement-changed'

const EMPTY_ANNOUNCEMENT: Announcement = {
  message: '',
  active: false,
}

function isAnnouncement(value: unknown): value is Announcement {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  return typeof candidate.message === 'string' && typeof candidate.active === 'boolean'
}

export function readAnnouncement(): Announcement {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return EMPTY_ANNOUNCEMENT

    const parsed: unknown = JSON.parse(stored)
    return isAnnouncement(parsed) ? parsed : EMPTY_ANNOUNCEMENT
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[announcement] could not read from localStorage', error)
    }

    return EMPTY_ANNOUNCEMENT
  }
}

function publishChange(): void {
  window.dispatchEvent(new Event(ANNOUNCEMENT_CHANGED_EVENT))
}

export function writeAnnouncement(announcement: Announcement): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(announcement))

    if (import.meta.env.DEV) {
      console.log('[announcement] wrote to localStorage', announcement)
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[announcement] could not write to localStorage', error)
    }
  }

  publishChange()
}

export function clearAnnouncement(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)

    if (import.meta.env.DEV) {
      console.log('[announcement] cleared localStorage')
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[announcement] could not clear localStorage', error)
    }
  }

  publishChange()
}

export function subscribeToAnnouncement(listener: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener()
  }

  const handleSameTabChange = () => listener()

  window.addEventListener('storage', handleStorage)
  window.addEventListener(ANNOUNCEMENT_CHANGED_EVENT, handleSameTabChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(ANNOUNCEMENT_CHANGED_EVENT, handleSameTabChange)
  }
}