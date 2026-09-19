import React from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { useAdminData } from './AdminDataContext.jsx'

const money = (value) => value.startsWith('$') ? value : `$${value}`

export function ApprovalQueue({ navigate }) {
  const { vendors, bookings, setVendorStatus, setBookingStatus } = useAdminData()
  const pendingVendors = vendors.filter((vendor) => vendor.status === 'pending').slice(0, 3)
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending').slice(0, 3)
  const totalPending = pendingVendors.length + pendingBookings.length

  return <section aria-labelledby="queue-heading" className="admin-panel approval-queue">
    <div className="queue-heading"><div><h2 id="queue-heading">Waiting on you</h2><p>{totalPending} items need a decision</p></div><span className="queue-count">{totalPending}</span></div>
    <QueueGroup title="Vendor applications" onViewAll={() => navigate('vendors')} empty="No vendors awaiting review.">
      {pendingVendors.map((vendor) => <li key={vendor.id} className="queue-row"><div className="queue-avatar">{vendor.name[0]}</div><div className="queue-copy"><strong>{vendor.name}</strong><p>{vendor.location} · applied {vendor.joined}</p></div><QuickActions onApprove={() => setVendorStatus(vendor.id, 'approved')} onReject={() => setVendorStatus(vendor.id, 'rejected')} approveLabel={`Approve ${vendor.name}`} rejectLabel={`Reject ${vendor.name}`} /></li>)}
    </QueueGroup>
    <QueueGroup title="Client bookings" onViewAll={() => navigate('bookings')} empty="No bookings awaiting a decision.">
      {pendingBookings.map((booking) => <li key={booking.id} className="queue-row"><div className="queue-avatar booking-avatar">{booking.guest.split(' ').map((name) => name[0]).join('')}</div><div className="queue-copy"><strong>{booking.guest} · {booking.reference}</strong><p>{booking.vendor} · {money(booking.amount)}</p></div><QuickActions onApprove={() => setBookingStatus(booking.id, 'approved')} onReject={() => setBookingStatus(booking.id, 'rejected')} approveLabel={`Approve booking ${booking.reference}`} rejectLabel={`Reject booking ${booking.reference}`} /></li>)}
    </QueueGroup>
  </section>
}

function QueueGroup({ title, onViewAll, empty, children }) {
  return <div className="queue-group"><div className="queue-group-heading"><h3>{title}</h3><button type="button" onClick={onViewAll}>View all <ArrowRight size={14} aria-hidden="true" /></button></div>{children.length > 0 ? <ul>{children}</ul> : <p className="queue-empty">{empty}</p>}</div>
}

function QuickActions({ onApprove, onReject, approveLabel, rejectLabel }) {
  return <div className="queue-actions"><button type="button" onClick={onApprove} aria-label={approveLabel} className="queue-approve"><Check size={15} aria-hidden="true" /></button><button type="button" onClick={onReject} aria-label={rejectLabel} className="queue-reject"><X size={15} aria-hidden="true" /></button></div>
}