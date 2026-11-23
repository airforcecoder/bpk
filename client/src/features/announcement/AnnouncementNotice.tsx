import { useAnnouncement } from './useAnnouncement'
import './AnnouncementNotice.css'

// BPK-68 subtask 2: public announcement / closure notice, rendered in PublicLayout
// directly under the Navbar. Renders nothing (no gap) unless active and non-blank.
export default function AnnouncementNotice() {
  const { announcement } = useAnnouncement()
  const message = announcement.message.trim()

  if (!announcement.active || !message) return null

  return (
    <div className="announcement-notice" role="status" aria-label="Announcement">
      <p className="announcement-notice__text">{message}</p>
    </div>
  )
}
