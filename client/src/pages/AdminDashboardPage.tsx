import { useEffect, useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import { getDashboardSummary } from '../services/dashboardService'
import type { DashboardSummary, OrderStatus } from '../data/dashboardSummary'
import './AdminDashboardPage.css'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const statusLabels: Record<OrderStatus, string> = {
  received: 'Received',
  'in-progress': 'In progress',
  'ready-for-pickup': 'Ready for pickup',
  completed: 'Completed',
  canceled: 'Canceled',
}

function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrent = true

    getDashboardSummary()
      .then((data) => {
        if (isCurrent) setSummary(data)
      })
      .catch(() => {
        if (isCurrent) setHasError(true)
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <AdminLayout title="Admin Dashboard">
      {isLoading && <p>Loading dashboard...</p>}

      {hasError && <p>Sorry, the dashboard could not be loaded.</p>}

      {!isLoading && !hasError && summary && (
        <>
          <p className="admin-dashboard__note">
            Sample data for layout only. These are not live business numbers.
          </p>

          <section className="admin-dashboard__counts" aria-label="Summary counts">
            {summary.counts.map((item) => (
              <div key={item.label} className="admin-dashboard__card">
                <span className="admin-dashboard__card-value">{item.value}</span>
                <span className="admin-dashboard__card-label">{item.label}</span>
              </div>
            ))}
          </section>

          <section className="admin-dashboard__section">
            <h2 className="admin-dashboard__section-title">Recent orders</h2>
            {summary.recentOrders.length === 0 ? (
              <p>No recent orders yet.</p>
            ) : (
              <ul className="admin-dashboard__list">
                {summary.recentOrders.map((order) => (
                  <li key={order.id} className="admin-dashboard__row">
                    <span>
                      <strong>{order.id}</strong> · {order.customerName}
                    </span>
                    <span>
                      {priceFormatter.format(order.total)} · {order.pickupTime} ·{' '}
                      {statusLabels[order.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-dashboard__section">
            <h2 className="admin-dashboard__section-title">Recent products</h2>
            {summary.recentProducts.length === 0 ? (
              <p>No products yet.</p>
            ) : (
              <ul className="admin-dashboard__list">
                {summary.recentProducts.map((product) => (
                  <li key={product.id} className="admin-dashboard__row">
                    <span>{product.name}</span>
                    <span>
                      {product.availability === 'available'
                        ? 'Available'
                        : 'Unavailable'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  )
}

export default AdminDashboardPage