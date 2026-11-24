import { useState } from 'react'
import { NavLink } from 'react-router'
import './Navbar.css'

/* BPK-107: I need the cart items to show
   the current quantity in the navbar. */
import { useCart } from '../context/CartContext'

type NavItem = {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Catering Request', path: '/catering' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Cart', path: '/cart' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

    /* BPK-107: Get the items from the shared cart. */
  const { items } = useCart()

  /* Add up the quantities of every item.
    I want the total number of puddings, not just
    the number of different products. */
  const cartQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  )


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
              {/* BPK-107: Show the total quantity next to Cart.
               The count updates whenever the shared cart changes. */}
              {item.label}
              {item.path === '/cart' && ` (${cartQuantity})`}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar