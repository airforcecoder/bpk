import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useAnnouncement } from '../announcement/AnnouncementContext'

/**
 * Development-only evidence that route changes keep the shared announcement
 * in memory without a full page reload. Render this inside HashRouter.
 */
export default function AnnouncementRouteLogger() {
  const location = useLocation()
  const { announcement } = useAnnouncement()

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[announcement] route changed without reload', {
        path: location.pathname,
        announcement,
      })
    }
  }, [location.pathname, announcement])

  return null
}
