import { useState } from 'react'
import { useAnnouncement } from './useAnnouncement'
import './AnnouncementDemoPage.css'

export default function AnnouncementDemoPage() {
  const { announcement, save, activate, deactivate, clear } = useAnnouncement()
  // Unsaved textarea edits. null means "show the stored message".
  const [draft, setDraft] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  const message = draft ?? announcement.message

  const handleSave = () => {
    if (!message.trim()) {
      setFeedback('Enter a message before saving the announcement.')
      return
    }

    save(message)
    setDraft(null)
    setFeedback('Announcement saved in this browser.')
  }

  const handleToggle = (nextActive: boolean) => {
    if (!nextActive) {
      deactivate()
      setFeedback('Announcement deactivated in this browser.')
      return
    }

    if (!message.trim()) {
      setFeedback('Enter a message before activating the announcement.')
      return
    }

    // Activate the text currently in the textarea, saved or not.
    activate(message)
    setDraft(null)
    setFeedback('Announcement activated in this browser.')
  }

  const handleClear = () => {
    clear()
    setDraft(null)
    setFeedback('Announcement cleared.')
  }

  return (
    <main className="page-container announcement-demo" aria-labelledby="announcement-demo-title">
      <div className="announcement-demo__card">
        <h1 id="announcement-demo-title" className="announcement-demo__title">
          Announcement Demo
        </h1>
        <p className="announcement-demo__demo-note">
          DEMO ONLY — changes are visible in this browser only.
        </p>

        <div className="announcement-demo__field">
          <label htmlFor="announcement-message">Announcement message</label>
          <textarea
            id="announcement-message"
            value={message}
            onChange={(event) => setDraft(event.target.value)}
            rows={5}
          />
        </div>

        <div className="announcement-demo__toggle">
          <input
            id="announcement-active"
            type="checkbox"
            role="switch"
            checked={announcement.active}
            onChange={(event) => handleToggle(event.target.checked)}
          />
          <label htmlFor="announcement-active" className="announcement-demo__toggle-label">
            Active
          </label>
        </div>

        <div className="announcement-demo__actions" role="group" aria-label="Announcement actions">
          <button
            type="button"
            className="announcement-demo__button announcement-demo__button--primary"
            onClick={handleSave}
          >
            Save
          </button>
          <button type="button" className="announcement-demo__button" onClick={handleClear}>
            Clear
          </button>
        </div>

        <p className="announcement-demo__feedback" role="status" aria-live="polite">
          {feedback}
        </p>
        <p className="announcement-demo__state">
          Current status:{' '}
          <strong
            className={
              announcement.active
                ? 'announcement-demo__badge announcement-demo__badge--active'
                : 'announcement-demo__badge'
            }
          >
            {announcement.active ? 'Active' : 'Inactive'}
          </strong>
        </p>
      </div>
    </main>
  )
}
