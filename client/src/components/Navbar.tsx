import { useState } from 'react'
import { NavLink } from 'react-router'
import './Navbar.css'

type NavItem = {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Order Online', path: '/order' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Cart', path: '/cart' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setIsOpen(false)}>
          Banana Pudding Krazy
        </NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <nav className={isOpen ? 'navbar__links navbar__links--open' : 'navbar__links'}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar