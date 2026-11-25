export type CateringFormValues = {
  name: string
  email: string
  phone: string
  eventDate: string
  guestCount: string
  details: string
}

export type CateringField = keyof CateringFormValues
export type CateringErrors = Partial<Record<CateringField, string>>

export const fieldOrder: CateringField[] = [
  'name',
  'email',
  'phone',
  'eventDate',
  'guestCount',
  'details',
]

export const maxLengths = {
  name: 100,
  email: 254,
  phone: 20,
  details: 1000,
} as const

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function validateCateringForm(
  values: CateringFormValues,
): CateringErrors {
  const errors: CateringErrors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = 'Enter your full name.'
  } else if (name.length > maxLengths.name) {
    errors.name = `Name must be ${maxLengths.name} characters or fewer.`
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Enter your email address.'
  } else if (email.length > maxLengths.email) {
    errors.email = `Email must be ${maxLengths.email} characters or fewer.`
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }

  if (values.phone.trim().length > maxLengths.phone) {
    errors.phone = `Phone number must be ${maxLengths.phone} characters or fewer.`
  }

  if (!values.eventDate) {
    errors.eventDate = 'Choose your event date.'
  } else if (values.eventDate <= getTodayString()) {
    errors.eventDate = 'Choose a date after today.'
  }

  const guests = values.guestCount.trim()
  if (!guests) {
    errors.guestCount = 'Enter your estimated number of guests.'
  } else if (!/^\d+$/.test(guests) || Number(guests) < 1) {
    errors.guestCount = 'Enter a whole number of 1 or more, like 25.'
  }

  if (values.details.trim().length > maxLengths.details) {
    errors.details = `Details must be ${maxLengths.details} characters or fewer.`
  }

  return errors
}