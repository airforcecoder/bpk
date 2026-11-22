import { useEffect, useState } from 'react'
import { useAnnouncement } from './AnnouncementContext'


export default function AnnouncementDemoPage() {
  const { announcement, save, activate, deactivate, clear } = useAnnouncement()
  const [message, setMessage] = useState(announcement.message)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setMessage(announcement.message)
  }, [announcement.message])

  const handleSave = () => {
    save(message)
    setFeedback('Announcement saved in this browser.')
  }

  const handleActivate = () => {
    if (!message.trim()) {
      setFeedback('Enter a message before activating the announcement.')
      return
    }

    // Save the current textarea value before activating it.
    save(message)
    activate()
    setFeedback('Announcement activated in this browser.')
  }

  const handleDeactivate = () => {
    deactivate()
    setFeedback('Announcement deactivated in this browser.')
  }

  const handleClear = () => {
    clear()
    setMessage('')
    setFeedback('Announcement cleared.')
  }

  return (
    <main aria-labelledby="announcement-demo-title">
      <h1 id="announcement-demo-title">Announcement Demo</h1>
      <p>DEMO ONLY — changes are visible in this browser only.</p>

      <label htmlFor="announcement-message">Announcement message</label>
      <textarea
        id="announcement-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={5}
      />

      <div role="group" aria-label="Announcement actions">
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={handleActivate}>Activate</button>
        <button type="button" onClick={handleDeactivate}>Deactivate</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>

      <p role="status" aria-live="polite">{feedback}</p>
      <p>Current status: {announcement.active ? 'Active' : 'Inactive'}</p>
    </main>
  )
}
