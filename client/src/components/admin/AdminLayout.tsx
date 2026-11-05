import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import './AdminLayout.css'

type AdminNavItem = {
  label: string
  path: string
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Orders', path: '/admin/orders' },
]

type AdminLayoutProps = {
  title: string
  children: ReactNode
}

function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar" aria-label="Admin navigation">
        <p className="admin-layout__brand">Admin</p>
        <nav className="admin-layout__nav">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'admin-layout__link admin-layout__link--active'
                  : 'admin-layout__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-layout__content">
        <h1 className="admin-layout__title">{title}</h1>
        {children}
      </section>
    </div>
  )
}

export default AdminLayout