import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  fieldOrder,
  maxLengths,
  validateCateringForm,
} from '../utils/cateringValidation'
import type {
  CateringErrors,
  CateringField,
  CateringFormValues,
} from '../utils/cateringValidation'
import './CateringForm.css'

const emptyValues: CateringFormValues = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  guestCount: '',
  details: '',
}

const fieldIds: Record<CateringField, string> = {
  name: 'catering-name',
  email: 'catering-email',
  phone: 'catering-phone',
  eventDate: 'catering-date',
  guestCount: 'catering-guests',
  details: 'catering-details',
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
  const [errors, setErrors] = useState<CateringErrors>({})
  const [showPreview, setShowPreview] = useState(false)
  const previewHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (showPreview) previewHeadingRef.current?.focus()
  }, [showPreview])

  const errorCount = Object.keys(errors).length

  function errorProps(field: CateringField) {
    return errors[field]
      ? {
          'aria-invalid': true as const,
          'aria-describedby': `${fieldIds[field]}-error`,
        }
      : {}
  }

  function renderError(field: CateringField) {
    return errors[field] ? (
      <p id={`${fieldIds[field]}-error`} className="catering-form__error">
        {errors[field]}
      </p>
    ) : null
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    const field = name as CateringField
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCateringForm(values)
    setErrors(nextErrors)

    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(fieldIds[firstInvalid])?.focus()
      return
    }

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
            <dd>{values.name.trim()}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Email</dt>
            <dd>{values.email.trim()}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Phone</dt>
            <dd>{values.phone.trim() || 'Not provided'}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Event date</dt>
            <dd>{formatEventDate(values.eventDate)}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Estimated guests</dt>
            <dd>{values.guestCount.trim()}</dd>
          </div>
          <div className="catering-form__summary-row">
            <dt>Special requests</dt>
            <dd>{values.details.trim() || 'None'}</dd>
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

      {errorCount > 0 && (
        <div className="catering-form__error-summary" role="alert">
          Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below
          before reviewing your request.
        </div>
      )}

      <div className="catering-form__field">
        <label htmlFor={fieldIds.name}>
          Full name{' '}
          <span className="catering-form__required">(required)</span>
        </label>
        <input
          id={fieldIds.name}
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          maxLength={maxLengths.name}
          autoComplete="name"
          aria-required="true"
          {...errorProps('name')}
        />
        {renderError('name')}
      </div>

      <div className="catering-form__field">
        <label htmlFor={fieldIds.email}>
          Email <span className="catering-form__required">(required)</span>
        </label>
        <input
          id={fieldIds.email}
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          maxLength={maxLengths.email}
          autoComplete="email"
          aria-required="true"
          {...errorProps('email')}
        />
        {renderError('email')}
      </div>

      <div className="catering-form__field">
        <label htmlFor={fieldIds.phone}>Phone (optional)</label>
        <input
          id={fieldIds.phone}
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          maxLength={maxLengths.phone}
          autoComplete="tel"
          {...errorProps('phone')}
        />
        {renderError('phone')}
      </div>

      <div className="catering-form__row">
        <div className="catering-form__field">
          <label htmlFor={fieldIds.eventDate}>
            Event date{' '}
            <span className="catering-form__required">(required)</span>
          </label>
          <input
            id={fieldIds.eventDate}
            name="eventDate"
            type="date"
            value={values.eventDate}
            onChange={handleChange}
            aria-required="true"
            {...errorProps('eventDate')}
          />
          {renderError('eventDate')}
        </div>

        <div className="catering-form__field">
          <label htmlFor={fieldIds.guestCount}>
            Estimated guests{' '}
            <span className="catering-form__required">(required)</span>
          </label>
          <input
            id={fieldIds.guestCount}
            name="guestCount"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={values.guestCount}
            onChange={handleChange}
            aria-required="true"
            {...errorProps('guestCount')}
          />
          {renderError('guestCount')}
        </div>
      </div>

      <div className="catering-form__field">
        <label htmlFor={fieldIds.details}>
          Special requests or event details (optional)
        </label>
        <textarea
          id={fieldIds.details}
          name="details"
          rows={5}
          value={values.details}
          onChange={handleChange}
          maxLength={maxLengths.details}
          {...errorProps('details')}
        />
        {renderError('details')}
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