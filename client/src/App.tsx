
import { HashRouter, Routes, Route } from 'react-router'
import PublicLayout from './layouts/PublicLayout'

import UITestPage from './pages/ui-test-page'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        <Route path="/ui-test" element={<UITestPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
