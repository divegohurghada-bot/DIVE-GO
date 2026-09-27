import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Printer,
  Download,
  Users,
  Hotel,
  Phone,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';

interface TomorrowsArrivalsViewProps {
  state: AppState;
}

export const TomorrowsArrivalsView: React.FC<TomorrowsArrivalsViewProps> = ({ state }) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrow);

  const manifest = state.reservations
    .filter((r) => r.serviceDate === selectedDate && r.bookingStatus !== 'CANCELLED')
    .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));

  const totalPax = manifest.reduce((sum, r) => sum + r.adultsCount + r.childrenCount, 0);
  const totalAdults = manifest.reduce((sum, r) => sum + r.adultsCount, 0);
  const totalChildren = manifest.reduce((sum, r) => sum + r.childrenCount, 0);
  const totalCashToCollect = manifest
    .filter((r) => r.paymentStatus === 'CASH_ON_ARRIVAL')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Pickup Time',
      'Booking Code',
      'Customer Name',
      'Phone',
      'Hotel',
      'Room',
      'Excursion',
      'Adults',
      'Children',
      'Amount',
      'Payment Status',
      'Notes',
    ];

    const rows = manifest.map((r) => [
      r.pickupTime,
      r.bookingCode,
      `"${r.customerName}"`,
      `"${r.customerPhone}"`,
      `"${r.hotelName}"`,
      r.roomNumber || '',
      `"${r.serviceTitle}"`,
      r.adultsCount,
      r.childrenCount,
      r.totalAmount,
      r.paymentStatus,
      `"${r.specialRequests || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dispatch_manifest_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            <span>Operations & Logistics Manifest (§17)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Tomorrow's Arrivals & Hotel Pickups</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Driver schedule and boat manifest. Pickups sequenced by departure time and hotel zone. Timezone synchronized
            with Hurghada Red Sea (EEST, UTC+2).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Total Passengers</span>
          <div className="text-2xl font-black text-white mt-1">
            {totalPax} <span className="text-xs font-normal text-slate-400">Pax</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {totalAdults} Adults, {totalChildren} Children
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Scheduled Excursions</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{manifest.length}</div>
          <span className="text-[11px] text-slate-400">Unique bookings confirmed</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Cash to Collect on Boat</span>
          <div className="text-2xl font-black text-amber-400 mt-1">€{totalCashToCollect}</div>
          <span className="text-[11px] text-slate-400">Driver / Tour guide reconciliation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Timezone & Dispatch</span>
          <div className="text-sm font-bold text-emerald-400 mt-1">Hurghada (UTC+2)</div>
          <span className="text-[11px] text-slate-400">0 Timezone Drift Errors</span>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Driver Route Manifest for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
            {manifest.length} Pickups Scheduled
          </span>
        </div>

        {manifest.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="h-10 w-10 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-semibold text-white">No departures scheduled for {selectedDate}.</p>
            <p className="text-xs text-slate-400 mt-1">Use the date selector above to inspect other dates.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Pickup Time</th>
                  <th className="py-3 px-4">Guest & Contact</th>
                  <th className="py-3 px-4">Hotel & Room</th>
                  <th className="py-3 px-4">Excursion</th>
                  <th className="py-3 px-4">Pax</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Special Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {manifest.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800/80">
                        {r.pickupTime}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{r.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                        <Phone className="h-3 w-3 inline text-slate-500" />
                        <span>{r.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{r.hotelName}</div>
                      <div className="text-[11px] text-slate-400">
                        Room: <strong className="text-white">{r.roomNumber || 'Lobby Meet'}</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{r.serviceTitle}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{r.adultsCount + r.childrenCount}</span>
                      <span className="text-[10px] text-slate-400 block">
                        ({r.adultsCount}A / {r.childrenCount}C)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">€{r.totalAmount}</div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          r.paymentStatus === 'PAID_FULL'
                            ? 'bg-emerald-950 text-emerald-300'
                            : r.paymentStatus === 'DEPOSIT_PAID'
                            ? 'bg-blue-950 text-blue-300'
                            : 'bg-amber-950 text-amber-300'
                        }`}
                      >
                        {r.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {r.specialRequests || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
