
import { HashRouter, Routes, Route } from 'react-router'
import PublicLayout from './layouts/PublicLayout'

import UITestPage from './pages/ui-test-page'
import ProtectedRoute from "./components/admin/ProtectedRoute";
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'

/* BPK-68: Keep Mona's announcement provider and demo page. */
import { AnnouncementProvider } from './features/announcement/AnnouncementContext'
import AnnouncementDemoPage from './features/announcement/AnnouncementDemoPage'

/* BPK-104: Keep the shared shopping cart across all pages. */
import { CartProvider } from './context/CartProvider'

function App() {
  return (
    <AnnouncementProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/announcement-demo" element={<AnnouncementDemoPage />} />
            </Route>

            <Route path="/ui-test" element={<UITestPage />} />
            <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          </Routes>
        </HashRouter>
      </CartProvider>
    </AnnouncementProvider>
  )
}

export default App
