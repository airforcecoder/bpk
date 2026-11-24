import './CateringPage.css'

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

      {/* BPK-133: the catering form goes here. */}
    </main>
  )
}

export default CateringPage