/* Example page that shows the .tsx structure for the team:
   pages are functions --> return () --> main --> sections --> buttons, headers, components
*/

/* THIS IMPORT WILL BASICALLY LIVE IN OUR NAV COMPONENT I PUT IT HERE FOR TEST PURPOSED TO SHOW GROUP*/
import { Link } from 'react-router'

/* Function initialization */
function UITestPage() {

  /* React returns the JSX that should be displayed */
  return (
    
    /* page-container keeps content responsive, centered, consistently padded, and prevents excessive width on large screens */
    <main className="page-container">

        {/* Visual button examples only */}
  <section>
    <h2>Button Style Examples</h2>

    <button className="btn btn-primary">
      Primary Button
    </button>

    <button className="btn btn-primary" disabled>
      Disabled Button
    </button>

  </section>


  {/* Real routing examples */}
  {/* Inline spacing is only for the UI test page.
    Actual Navbar layout will be handled by the Navbar component. */}
  <section>
    <h2>Navigation Route Tests</h2>
    <Link to="/" style={{ marginRight: '16px' }}>Home</Link>
    <Link to="/menu" style={{ marginRight: '16px' }}>Menu</Link>
    <Link to="/about" style={{ marginRight: '16px' }}>About</Link>
    <Link to="/order" style={{ marginRight: '16px' }}>Order Online</Link>
    <Link to="/cart">Cart</Link>

  </section>

  {/* Combined button + routing examples */}
  <section>
  <h2>Routing + Button Examples</h2>

  <Link
    to="/"
    className="btn btn-primary"
    style={{ marginRight: '16px' }}
  >
    Home
  </Link>

  <Link
    to="/menu"
    className="btn btn-primary"
    style={{ marginRight: '16px' }}
  >
    Menu
  </Link>

  <Link
    to="/about"
    className="btn btn-primary"
    style={{ marginRight: '16px' }}
  >
    About
  </Link>

  <Link
    to="/order"
    className="btn btn-primary"
    style={{ marginRight: '16px' }}
  >
    Order Online
  </Link>

  <Link
    to="/cart"
    className="btn btn-primary"
  >
    Cart
  </Link>
</section>

      {/* End main */}
    </main>

  )
}

/* Makes this component available to other files */
export default UITestPage

/* WE then route the page in <route> in App.tsx */