import { useEffect, useState } from 'react'

const serviceConfig = {
  hotel: { label: 'Hotels', endpoint: 'hotels', icon: '▥', description: 'Manage your hotel listings, rooms, and availability.' },
  airline: { label: 'Flights', endpoint: 'flights', icon: '✈', description: 'Manage your airline routes, schedules, and seats.' },
  car_rental: { label: 'Cars', endpoint: 'cars', icon: '▰', description: 'Manage your rental cars, locations, and availability.' },
  tour_operator: { label: 'Tours', endpoint: 'tours', icon: '◈', description: 'Manage your tours, schedules, and available places.' },
  transport: { label: 'Transport', endpoint: 'cars', icon: '↔', description: 'Manage your transport vehicles and availability.' },
  other: { label: 'Services', endpoint: 'destinations', icon: '◇', description: 'Manage the services connected to your vendor profile.' },
}

function VendorDashboard({ onNavigate }) {
  const [profile] = useState(() => JSON.parse(localStorage.getItem('vendorProfile') || 'null'))
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const config = serviceConfig[profile?.vendor_type] || serviceConfig.other

  useEffect(() => {
    const loadListings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${apiUrl}/api/v1/${config.endpoint}/`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
        if (!response.ok) throw new Error('We could not load your listings.')
        const data = await response.json()
        setItems(Array.isArray(data) ? data : data.results || [])
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [config.endpoint])

  const signOut = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('vendorProfile')
    onNavigate('#home')
  }

  if (!profile) return <div className="vendor-empty"><h1>Vendor session not found</h1><button className="primary-button" onClick={() => onNavigate('#vendor-signin')}>Vendor sign in</button></div>

  return <div className="vendor-shell"><aside className="vendor-sidebar"><div className="admin-brand"><span className="admin-brand-mark">B</span><span><strong>Booking</strong><small>Partner portal</small></span></div><div className="vendor-company"><div className="vendor-company-mark">{profile.business_name?.[0] || 'V'}</div><div><strong>{profile.business_name}</strong><small>{config.label} partner</small></div></div><p className="admin-nav-label">Workspace</p><nav className="vendor-nav"><button className="active">{config.icon} <span>{config.label}</span></button><button onClick={() => onNavigate('#home')}>⌂ <span>Public marketplace</span></button></nav><button className="vendor-signout" onClick={signOut}>↪ Sign out</button></aside><main className="vendor-main"><header className="vendor-topbar"><div><p className="admin-kicker">Vendor workspace</p><h1>{config.label}</h1></div><span className={`vendor-approval ${profile.is_approved ? 'approved' : 'pending'}`}>{profile.is_approved ? 'Approved partner' : 'Pending approval'}</span></header><section className="vendor-content"><div className="vendor-welcome"><div><p className="admin-kicker">{profile.address || 'Your partner account'}</p><h2>Manage your {config.label.toLowerCase()}</h2><p>{config.description}</p></div><button className="primary-button">+ Add {config.label.slice(0, -1) || 'service'}</button></div><div className="vendor-stat-grid"><article><span>Active listings</span><strong>{items.length}</strong></article><article><span>Bookings this month</span><strong>0</strong></article><article><span>Profile status</span><strong>{profile.is_approved ? 'Live' : 'Review'}</strong></article></div><section className="vendor-list-panel"><div className="vendor-list-heading"><div><h2>Your {config.label.toLowerCase()}</h2><p>Only {config.label.toLowerCase()} belonging to your account are shown here.</p></div><button className="filter-button">≡ Filters</button></div>{loading ? <p className="vendor-state">Loading your {config.label.toLowerCase()}...</p> : error ? <p className="vendor-state error">{error}</p> : items.length === 0 ? <div className="vendor-state"><strong>No {config.label.toLowerCase()} yet</strong><p>Start by adding your first listing to the marketplace.</p><button className="primary-button">+ Add listing</button></div> : <div className="vendor-items">{items.map((item) => <article className="vendor-item" key={item.id}><div className="vendor-item-icon">{config.icon}</div><div><strong>{item.name || item.title || item.airline_name || `${item.brand || ''} ${item.model || ''}`.trim() || 'Untitled listing'}</strong><p>{item.address || item.location || item.departure_city && `${item.departure_city} to ${item.arrival_city}` || 'Listing details available'}</p></div><span className="item-status">{item.is_active === false ? 'Inactive' : 'Active'}</span></article>)}</div>}</section></section></main></div>
}

export default VendorDashboard