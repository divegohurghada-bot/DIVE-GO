import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  CreditCard,
  Compass,
  ArrowRight,
  HardDrive,
} from 'lucide-react';
import { AppState, appStore } from '../../services/store';
import { Reservation, PaymentStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  saveVoucherToGoogleDrive,
  getCachedDriveToken,
  signInWithGoogleDrive,
} from '../../services/googleDrive';

interface BookingDrawerProps {
  state: AppState;
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  preselectedDate?: string;
  preselectedPax?: number;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  state,
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedDate,
  preselectedPax,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const tomorrowStr = preselectedDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const initialServiceId = preselectedServiceId || state.services[0]?.id || '';

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [serviceDate, setServiceDate] = useState(tomorrowStr);
  const [pickupTime, setPickupTime] = useState('08:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [adultsCount, setAdultsCount] = useState(preselectedPax || 2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('CASH_ON_ARRIVAL');
  const [specialRequests, setSpecialRequests] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [driveSaved, setDriveSaved] = useState(false);
  const [savingDrive, setSavingDrive] = useState(false);

  const selectedService = state.services.find((s) => s.id === serviceId) || state.services[0];
  const calculatedTotal = selectedService
    ? adultsCount * selectedService.priceAdult + childrenCount * selectedService.priceChild
    : 0;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || !hotelName.trim()) {
      setErrorMessage('Please fill in your name, WhatsApp phone number, and hotel name.');
      return;
    }

    const res = appStore.createReservation({
      serviceId,
      serviceDate,
      pickupTime,
      customerName,
      customerEmail: customerEmail || 'guest@divegohurghada.com',
      customerPhone,
      whatsappNumber: customerPhone,
      hotelName,
      roomNumber,
      adultsCount,
      childrenCount,
      paymentStatus,
      specialRequests,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create reservation.');
      return;
    }

    if (res.reservation) {
      setConfirmedBooking(res.reservation);
    }
  };

  const handleSendWhatsAppVoucher = () => {
    if (!confirmedBooking) return;
    const cleanPhone = (state.profile.whatsappNumber || '+2 0103 94 64 284').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Dive Go Hurghada! I just booked online.\n\nBooking Code: ${confirmedBooking.bookingCode}\nExcursion: ${confirmedBooking.serviceTitle}\nDate: ${confirmedBooking.serviceDate} @ ${confirmedBooking.pickupTime}\nGuest: ${confirmedBooking.customerName} (${confirmedBooking.adultsCount} Adults, ${confirmedBooking.childrenCount} Children)\nHotel: ${confirmedBooking.hotelName} (Room ${confirmedBooking.roomNumber || 'TBD'})\nTotal: €${confirmedBooking.totalAmount} (${confirmedBooking.paymentStatus})\n\nPlease confirm our hotel pickup schedule!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleSaveToDrive = async () => {
    if (!confirmedBooking) return;
    setSavingDrive(true);
    try {
      if (!getCachedDriveToken()) {
        await signInWithGoogleDrive();
      }
      await saveVoucherToGoogleDrive({
        bookingId: confirmedBooking.bookingCode,
        fullName: confirmedBooking.customerName,
        whatsapp: confirmedBooking.customerPhone,
        email: confirmedBooking.customerEmail,
        hotelName: confirmedBooking.hotelName,
        roomNumber: confirmedBooking.roomNumber,
        tripTitle: confirmedBooking.serviceTitle,
        date: confirmedBooking.serviceDate,
        pax: confirmedBooking.adultsCount + confirmedBooking.childrenCount,
        paymentMethod: confirmedBooking.paymentStatus,
        totalPrice: confirmedBooking.totalAmount,
      });
      setDriveSaved(true);
    } catch (e: any) {
      alert(`Google Drive: ${e.message}`);
    } finally {
      setSavingDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.booking.title}</h3>
              <p className="text-[11px] text-cyan-300">{t.booking.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Booking Confirmation State */
          <div className="p-6 text-center space-y-4">
            <div className="h-14 w-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white">{t.booking.successTitle}</h4>
              <p className="text-xs text-slate-300 mt-1">{t.booking.successDesc}</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-xs text-left space-y-2">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Voucher Code:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{confirmedBooking.bookingCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Excursion:</span>
                <strong className="text-white">{confirmedBooking.serviceTitle}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <strong className="text-white">
                  {confirmedBooking.serviceDate} @ {confirmedBooking.pickupTime}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hotel Pickup:</span>
                <span className="text-slate-200">
                  {confirmedBooking.hotelName} (Room {confirmedBooking.roomNumber || 'Lobby'})
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-700 pt-2">
                <span className="text-slate-400">Total:</span>
                <span className="text-base font-black text-emerald-400">
                  €{confirmedBooking.totalAmount}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleSendWhatsAppVoucher}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Send Voucher to WhatsApp Desk</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Google Drive Voucher Backup Button */}
              <button
                onClick={handleSaveToDrive}
                disabled={savingDrive || driveSaved}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <HardDrive className="h-4 w-4" />
                <span>
                  {driveSaved
                    ? '✓ Voucher Saved to Google Drive'
                    : savingDrive
                    ? 'Saving to Drive...'
                    : 'Backup Voucher to Google Drive'}
                </span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Trip & Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
                  <Compass className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Select Trip *</span>
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  {state.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} (€{s.priceAdult})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.booking.dateLabel} *</label>
                <input
                  type="date"
                  required
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Guest Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.booking.nameLabel} *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Thomas Becker"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.booking.phoneLabel} *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+49 176 12345678"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Hotel & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.booking.hotelLabel} *</label>
                <input
                  type="text"
                  required
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="e.g. Steigenberger ALDAU Beach"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.booking.roomLabel}</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 412 or TBA in lobby"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Pax counts & Payment */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Adults</label>
                <select
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} Adult{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Children (4-11)</label>
                <select
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} Child{n > 1 ? 'ren' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pickup Time</label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t.booking.payMethod}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('CASH_ON_ARRIVAL')}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition ${
                    paymentStatus === 'CASH_ON_ARRIVAL'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{t.booking.cashOnArrival}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('DEPOSIT_PAID')}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition ${
                    paymentStatus === 'DEPOSIT_PAID'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{t.booking.creditCard}</span>
                </button>
              </div>
            </div>

            {/* Total Calculation & CTA */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Tour Price:</span>
                <span className="text-2xl font-black text-white">€{calculatedTotal}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">✓ 24h Free Cancellation</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-cyan-600/30 transition flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01]"
            >
              <span>{t.booking.submitBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
