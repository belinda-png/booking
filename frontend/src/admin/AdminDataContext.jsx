import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const seedVendors = [
  { id: 'v-101', name: 'Acacia Safaris', type: 'Tour operator', location: 'Kampala', email: 'hello@acaciasafaris.ug', status: 'approved', sectors: ['Tours', 'Wildlife'], joined: 'Sep 14, 2026' },
  { id: 'v-102', name: 'Lake Victoria Lodge', type: 'Hotel', location: 'Entebbe', email: 'reservations@lakevictoria.ug', status: 'pending', sectors: ['Accommodation'], joined: 'Sep 17, 2026' },
  { id: 'v-103', name: 'Swift Wheels Uganda', type: 'Car rental', location: 'Kampala', email: 'bookings@swiftwheels.ug', status: 'approved', sectors: ['Car rental'], joined: 'Sep 09, 2026' },
  { id: 'v-104', name: 'Pearl Air', type: 'Airline', location: 'Entebbe', email: 'partners@pearlair.ug', status: 'suspended', sectors: ['Flights'], joined: 'Aug 28, 2026' },
]

const seedBookings = [
  { id: 'b-201', reference: 'BK-48391', guest: 'Amina Nansubuga', service: 'Murchison Falls Safari', vendor: 'Acacia Safaris', date: 'Sep 21, 2026', amount: '$840', status: 'approved', replies: [] },
  { id: 'b-202', reference: 'BK-48390', guest: 'Daniel Okello', service: 'Lake Victoria Lodge', vendor: 'Lake Victoria Lodge', date: 'Sep 23, 2026', amount: '$320', status: 'pending', replies: [] },
  { id: 'b-203', reference: 'BK-48377', guest: 'Grace Atim', service: 'Toyota RAV4 rental', vendor: 'Swift Wheels Uganda', date: 'Sep 19, 2026', amount: '$180', status: 'completed', replies: [] },
  { id: 'b-204', reference: 'BK-48365', guest: 'Moses Kato', service: 'Entebbe to Nairobi', vendor: 'Pearl Air', date: 'Sep 18, 2026', amount: '$245', status: 'rejected', replies: [] },
]

const AdminDataContext = createContext(null)

export function AdminDataProvider({ children }) {
  const [vendors, setVendors] = useState(seedVendors)
  const [bookings, setBookings] = useState(seedBookings)
  const [notice, setNotice] = useState('')
  const notify = useCallback((message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2500)
  }, [])
  const setVendorStatus = useCallback((vendorId, status) => { setVendors((current) => current.map((vendor) => vendor.id === vendorId ? { ...vendor, status } : vendor)); notify(`Vendor ${status}`) }, [notify])
  const deleteVendor = useCallback((vendorId) => { setVendors((current) => current.filter((vendor) => vendor.id !== vendorId)); notify('Vendor removed from the marketplace') }, [notify])
  const updateVendorSectors = useCallback((vendorId, sectors) => { setVendors((current) => current.map((vendor) => vendor.id === vendorId ? { ...vendor, sectors } : vendor)); notify('Vendor sectors updated') }, [notify])
  const setBookingStatus = useCallback((bookingId, status) => { setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status } : booking)); notify(`Booking ${status}`) }, [notify])
  const replyToBooking = useCallback((bookingId, message) => { setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, replies: [...booking.replies, { id: Date.now(), message, author: 'Admin' }] } : booking)); notify('Reply sent to client') }, [notify])
  const value = useMemo(() => ({ vendors, bookings, notice, setVendorStatus, deleteVendor, updateVendorSectors, setBookingStatus, replyToBooking }), [vendors, bookings, notice, setVendorStatus, deleteVendor, updateVendorSectors, setBookingStatus, replyToBooking])
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (!context) throw new Error('useAdminData must be used inside AdminDataProvider')
  return context
}