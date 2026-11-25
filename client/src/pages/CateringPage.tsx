import './CateringPage.css'
import CateringForm from '../components/CateringForm'

function CateringPage() {
  return (
    <main className="page-container catering-page">
      <h1 className="catering-page__title">Catering Request</h1>

      <p className="catering-page__intro">
        Planning an event? Use this form to prepare a catering inquiry for
        Banana Pudding Krazy.
      </p>

      <p className="catering-page__demo-note" role="note">
        <strong>Demo only:</strong> this form does not send or save anything
        yet. No request can be submitted to Banana Pudding Krazy at this time.
      </p>

      <CateringForm />
    </main>
  )
}

export default CateringPage