import './Footer.css'

type BusinessInfo = {
  name: string
  instagramUrl: string
  facebookUrl: string
}

// TODO(BPK-37): remove this fallback and import the shared object from '../data/businessInfo'
const fallbackInfo: BusinessInfo = {
  name: 'Banana Pudding Krazy',
  instagramUrl: 'https://www.instagram.com/',
  facebookUrl: 'https://www.facebook.com/',
}

type FooterProps = {
  info?: BusinessInfo
}

function Footer({ info = fallbackInfo }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">{info.name}</p>

        <nav className="footer__social" aria-label="Social media">
          <a
            href={info.instagramUrl}
            className="footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href={info.facebookUrl}
            className="footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </nav>

        <p className="footer__copy">
          &copy; {year} {info.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer