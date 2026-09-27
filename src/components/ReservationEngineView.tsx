import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  Hotel,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';
import { Reservation, PaymentStatus, BookingStatus } from '../types';

interface ReservationEngineViewProps {
  state: AppState;
}

export const ReservationEngineView: React.FC<ReservationEngineViewProps> = ({ state }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Booking form
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [bookingForm, setBookingForm] = useState({
    serviceId: state.services[0]?.id || '',
    serviceDate: tomorrowStr,
    pickupTime: '08:00 AM',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    whatsappNumber: '',
    hotelName: '',
    roomNumber: '',
    adultsCount: 2,
    childrenCount: 0,
    paymentStatus: 'CASH_ON_ARRIVAL' as PaymentStatus,
    specialRequests: '',
  });

  const filteredReservations = state.reservations.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = appStore.createReservation({
      serviceId: bookingForm.serviceId,
      serviceDate: bookingForm.serviceDate,
      pickupTime: bookingForm.pickupTime,
      customerName: bookingForm.customerName,
      customerEmail: bookingForm.customerEmail,
      customerPhone: bookingForm.customerPhone,
      whatsappNumber: bookingForm.whatsappNumber || bookingForm.customerPhone,
      hotelName: bookingForm.hotelName,
      roomNumber: bookingForm.roomNumber,
      adultsCount: Number(bookingForm.adultsCount),
      childrenCount: Number(bookingForm.childrenCount),
      paymentStatus: bookingForm.paymentStatus,
      specialRequests: bookingForm.specialRequests,
      sourceChannel: 'MANUAL_DESK',
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to create booking.');
      return;
    }

    setShowCreateModal(false);
    setBookingForm({
      serviceId: state.services[0]?.id || '',
      serviceDate: tomorrowStr,
      pickupTime: '08:00 AM',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      whatsappNumber: '',
      hotelName: '',
      roomNumber: '',
      adultsCount: 2,
      childrenCount: 0,
      paymentStatus: 'CASH_ON_ARRIVAL',
      specialRequests: '',
    });
  };

  const handleCancelBooking = (id: string) => {
    if (confirm('Cancel this reservation? This frees capacity and updates audit trail.')) {
      appStore.updateReservationStatus(id, 'CANCELLED');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="h-4 w-4" />
            <span>Reservation Engine & Invoicing (§16 & §33)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Bookings & Dispatch Vouchers</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time capacity tracking, duplicate booking guard (idempotency key protection), hotel room logging, and
            automated WhatsApp notification dispatch.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search booking code (DGH-2026-XXXX), customer name, hotel, or excursion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>

      {/* Bookings Table / Cards */}
      {filteredReservations.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Calendar className="h-10 w-10 mx-auto text-slate-500" />
          <h3 className="text-base font-bold text-white">No Reservations Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Bookings created by customers via WhatsApp, AI chat, or manual entry appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition ${
                res.bookingStatus === 'CANCELLED'
                  ? 'border-slate-800 opacity-60 bg-slate-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sm text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-800">
                    {res.bookingCode}
                  </span>
                  <span className="font-bold text-white text-base">{res.customerName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      res.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {res.bookingStatus}
                  </span>
                  <span className="text-[11px] text-slate-400">via {res.sourceChannel}</span>
                </div>

                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    Excursion: <strong className="text-white">{res.serviceTitle}</strong>
                  </span>
                  <span>
                    Date: <strong className="text-white">{res.serviceDate}</strong> @ {res.pickupTime}
                  </span>
                  <span>
                    Guests:{' '}
                    <strong className="text-white">
                      {res.adultsCount} Adults{res.childrenCount > 0 ? `, ${res.childrenCount} Children` : ''}
                    </strong>
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>📍 Hotel: {res.hotelName} (Room {res.roomNumber || 'TBA'})</span>
                  <span>📞 Phone / WA: {res.customerPhone}</span>
                  {res.specialRequests && <span>💬 Notes: {res.specialRequests}</span>}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col lg:items-end space-y-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <div className="text-lg font-extrabold text-white">
                  €{res.totalAmount}
                  <span className="text-xs font-normal text-slate-400"> ({res.currency})</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    res.paymentStatus === 'PAID_FULL'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : res.paymentStatus === 'DEPOSIT_PAID'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  Payment: {res.paymentStatus.replace(/_/g, ' ')}
                </span>

                {res.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(res.id)}
                    className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Reservation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateBooking}
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Verified Reservation</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Excursion *</label>
                <select
                  required
                  value={bookingForm.serviceId}
                  onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {state.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — €{s.priceAdult} Adult / €{s.priceChild} Child
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Excursion Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.serviceDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, serviceDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={bookingForm.pickupTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    placeholder="e.g. Thomas Becker"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                    placeholder="+49 176 12345678"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.hotelName}
                    onChange={(e) => setBookingForm({ ...bookingForm, hotelName: e.target.value })}
                    placeholder="e.g. Steigenberger ALDAU Beach"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    value={bookingForm.roomNumber}
                    onChange={(e) => setBookingForm({ ...bookingForm, roomNumber: e.target.value })}
                    placeholder="e.g. 412"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Adults</label>
                  <input
                    type="number"
                    min={1}
                    value={bookingForm.adultsCount}
                    onChange={(e) => setBookingForm({ ...bookingForm, adultsCount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Children</label>
                  <input
                    type="number"
                    min={0}
                    value={bookingForm.childrenCount}
                    onChange={(e) => setBookingForm({ ...bookingForm, childrenCount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                  <select
                    value={bookingForm.paymentStatus}
                    onChange={(e) => setBookingForm({ ...bookingForm, paymentStatus: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CASH_ON_ARRIVAL">Cash on Arrival</option>
                    <option value="DEPOSIT_PAID">Deposit Paid</option>
                    <option value="PAID_FULL">Paid in Full</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                Confirm Reservation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
