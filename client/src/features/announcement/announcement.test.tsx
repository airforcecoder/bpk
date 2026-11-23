// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import AnnouncementDemoPage from './AnnouncementDemoPage'
import AnnouncementNotice from './AnnouncementNotice'
import { AnnouncementProvider } from './AnnouncementContext'

function renderWithProvider(ui: ReactNode) {
  return render(<AnnouncementProvider>{ui}</AnnouncementProvider>)
}

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe('announcement editor and public notice', () => {
  it('saves and restores the message after the provider is remounted', () => {
    const firstRender = renderWithProvider(<AnnouncementDemoPage />)

    fireEvent.change(screen.getByLabelText('Announcement message'), {
      target: { value: 'Closing early today' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    firstRender.unmount()
    renderWithProvider(<AnnouncementDemoPage />)

    expect(screen.getByLabelText('Announcement message')).toHaveValue('Closing early today')
  })

  it('shows an active announcement in the public notice', () => {
    renderWithProvider(
      <>
        <AnnouncementDemoPage />
        <AnnouncementNotice />
      </>,
    )

    fireEvent.change(screen.getByLabelText('Announcement message'), {
      target: { value: 'We are closed for maintenance' },
    })
    fireEvent.click(screen.getByRole('switch', { name: 'Active' }))

    expect(screen.getByRole('status', { name: 'Announcement' })).toHaveTextContent(
      'We are closed for maintenance',
    )
  })

  it('hides the announcement when it is deactivated', () => {
    renderWithProvider(
      <>
        <AnnouncementDemoPage />
        <AnnouncementNotice />
      </>,
    )

    fireEvent.change(screen.getByLabelText('Announcement message'), {
      target: { value: 'Temporary closure' },
    })
    fireEvent.click(screen.getByRole('switch', { name: 'Active' }))
    expect(screen.getByRole('status', { name: 'Announcement' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: 'Active' }))

    expect(screen.queryByRole('status', { name: 'Announcement' })).not.toBeInTheDocument()
  })

  it('hides the announcement when it is cleared', () => {
    renderWithProvider(
      <>
        <AnnouncementDemoPage />
        <AnnouncementNotice />
      </>,
    )

    fireEvent.change(screen.getByLabelText('Announcement message'), {
      target: { value: 'Temporary closure' },
    })
    fireEvent.click(screen.getByRole('switch', { name: 'Active' }))
    expect(screen.getByRole('status', { name: 'Announcement' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.queryByRole('status', { name: 'Announcement' })).not.toBeInTheDocument()
  })

  it('does not activate a blank or whitespace-only message', () => {
    renderWithProvider(
      <>
        <AnnouncementDemoPage />
        <AnnouncementNotice />
      </>,
    )

    fireEvent.change(screen.getByLabelText('Announcement message'), {
      target: { value: '   ' },
    })
    fireEvent.click(screen.getByRole('switch', { name: 'Active' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Enter a message before activating the announcement.',
    )
    expect(screen.queryByRole('status', { name: 'Announcement' })).not.toBeInTheDocument()
  })
})
