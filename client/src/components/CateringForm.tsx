import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './CateringForm.css'

type CateringFormValues = {
  name: string
  email: string
  phone: string
  eventDate: string
  guestCount: string
  details: string
}

const emptyValues: CateringFormValues = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  guestCount: '',
  details: '',
}

function formatEventDate(value: string): string {
  if (!value) return 'Not provided'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function CateringForm() {
  const [values, setValues] = useState<CateringFormValues>(emptyValues)
  const [showPreview, setShowPreview] = useState(false)
  const previewHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (showPreview) previewHeadingRef.current?.focus()
  }, [showPreview])

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // BPK-136 will check the values here before showing the preview.
    setShowPreview(true)
  }

  if (showPreview) {
    return (
      <section
        className="catering-form"
        aria-labelledby="catering-preview-title"
      >
        <p className="catering-form__demo-banner" role="status">
          <strong>Demo only — no request has been sent or saved.</strong>
        </p>

        <h2
          id="catering-preview-title"
          className="catering-form__heading"
          ref={previewHeadingRef}
          tabIndex={-1}
        >
          Review your request
        </h2>

        <p>
          This is only a preview of what you entered. Banana Pudding Krazy has
          not received it, and no pricing or availability is promised.
        </p>

        <dl className="catering-form__summary">
          <div className="catering-form__summary-row">
            <dt>Name</dt>
            <dd>{values.name || 'Not provided'}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Email</dt>
            <dd>{values.email || 'Not provided'}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Phone</dt>
            <dd>{values.phone || 'Not provided'}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Event date</dt>
            <dd>{formatEventDate(values.eventDate)}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Estimated guests</dt>
            <dd>{values.guestCount || 'Not provided'}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Special requests</dt>
            <dd>{values.details || 'None'}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="catering-form__button"
          onClick={() => setShowPreview(false)}
        >
          Edit details
        </button>
      </section>
    )
  }

  return (
    <form
      className="catering-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="catering-form-title"
    >
      <h2 id="catering-form-title" className="catering-form__heading">
        Tell us about your event
      </h2>

      <div className="catering-form__field">
        <label htmlFor="catering-name">
          Full name{' '}
          <span className="catering-form__required">(required)</span>
        </label>
        <input
          id="catering-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          maxLength={100}
          autoComplete="name"
          aria-required="true"
        />
      </div>

      <div className="catering-form__field">
        <label htmlFor="catering-email">
          Email <span className="catering-form__required">(required)</span>
        </label>
        <input
          id="catering-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          maxLength={254}
          autoComplete="email"
          aria-required="true"
        />
      </div>

      <div className="catering-form__field">
        <label htmlFor="catering-phone">Phone (optional)</label>
        <input
          id="catering-phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          maxLength={20}
          autoComplete="tel"
        />
      </div>

      <div className="catering-form__row">
        <div className="catering-form__field">
          <label htmlFor="catering-date">
            Event date{' '}
            <span className="catering-form__required">(required)</span>
          </label>
          <input
            id="catering-date"
            name="eventDate"
            type="date"
            value={values.eventDate}
            onChange={handleChange}
            aria-required="true"
          />
        </div>

        <div className="catering-form__field">
          <label htmlFor="catering-guests">
            Estimated guests{' '}
            <span className="catering-form__required">(required)</span>
          </label>
          <input
            id="catering-guests"
            name="guestCount"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={values.guestCount}
            onChange={handleChange}
            aria-required="true"
          />
        </div>
      </div>

      <div className="catering-form__field">
        <label htmlFor="catering-details">
          Special requests or event details (optional)
        </label>
        <textarea
          id="catering-details"
          name="details"
          rows={5}
          value={values.details}
          onChange={handleChange}
          maxLength={1000}
        />
      </div>

      <button type="submit" className="catering-form__button">
        Review request
      </button>
      <p className="catering-form__hint">
        Nothing is sent or saved when you review your request.
      </p>
    </form>
  )
}

export default CateringForm