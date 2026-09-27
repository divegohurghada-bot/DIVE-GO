import React from 'react';
import {
  Compass,
  AlertTriangle,
  HelpCircle,
  Calendar,
  Users,
  CreditCard,
  Bell,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';

interface DashboardOverviewProps {
  state: AppState;
  onNavigate: (tab: string) => void;
  onOpenOnboarding: () => void;
  onOpenAuditReport: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  state,
  onNavigate,
  onOpenOnboarding,
  onOpenAuditReport,
}) => {
  const tomorrowsBookings = appStore.getTomorrowsManifest();
  const tomorrowsPax = tomorrowsBookings.reduce((sum, b) => sum + b.adultsCount + b.childrenCount, 0);

  const totalRevenue = state.reservations
    .filter((r) => r.bookingStatus !== 'CANCELLED')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const activeConflicts = state.conflicts.filter((c) => c.status === 'OPEN');
  const pendingGaps = state.gaps.filter((g) => g.status === 'PENDING_OWNER_ANSWER');
  const recentAlerts = state.alerts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner if Blank or Welcome */}
      {state.profile.isBlank ? (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-700/60 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="h-5 w-5" />
              <span>ZERO-ASSUMPTION RULE ACTIVE (§5)</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              System Is Currently In Blank State (No Hardcoded Assumptions)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Complete the structured operational onboarding interview or load verified business data from{' '}
              <strong>https://www.divegohurghada.com/</strong> to populate services, pricing, and policies.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => appStore.loadDiveGoHurghadaProfile()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition cursor-pointer"
            >
              1-Click Load divegohurghada.com
            </button>
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Start Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>AI Tourism Operating System Active</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {state.profile.companyName || 'Dive Go Hurghada'} — Operations Command
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Marina: {state.profile.location} • Base Currency: {state.profile.currency} • Multi-source Provenance Active
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Test AI Sales Agent</span>
            </button>
            <button
              onClick={() => onNavigate('testing')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Run 20 Audits</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tomorrow's Manifest */}
        <div
          onClick={() => onNavigate('arrivals')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tomorrow's Pickups</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{tomorrowsPax}</span>
            <span className="text-xs text-slate-400">Guests ({tomorrowsBookings.length} Trips)</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-blue-400 font-medium">
            <span>View Dispatch Schedule</span>
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Total Confirmed Bookings */}
        <div
          onClick={() => onNavigate('reservations')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{state.reservations.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">€{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
            <span>Open Reservation Engine</span>
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Knowledge Conflicts */}
        <div
          onClick={() => onNavigate('conflicts')}
          className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg transition cursor-pointer group ${
            activeConflicts.length > 0
              ? 'border-amber-700/60 hover:border-amber-500'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Price Conflicts</span>
            <div
              className={`p-2 rounded-xl group-hover:scale-110 transition ${
                activeConflicts.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{activeConflicts.length}</span>
            <span className="text-xs text-slate-400">
              {activeConflicts.length > 0 ? 'Requires Review' : 'Hierarchy Applied'}
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-amber-400 font-medium">
            <span>Precedence Engine Active</span>
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Knowledge Gaps */}
        <div
          onClick={() => onNavigate('conflicts')}
          className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg transition cursor-pointer group ${
            pendingGaps.length > 0
              ? 'border-purple-700/60 hover:border-purple-500'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Knowledge Gaps</span>
            <div
              className={`p-2 rounded-xl group-hover:scale-110 transition ${
                pendingGaps.length > 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{pendingGaps.length}</span>
            <span className="text-xs text-slate-400">Unknown Questions</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-purple-400 font-medium">
            <span>Owner Answer Workflow</span>
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Tomorrow's Dispatch Preview & Owner Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tomorrow's Arrivals Quick Schedule */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <span>Tomorrow's Operational Manifest Preview</span>
              </h2>
              <p className="text-xs text-slate-400">
                Sorted by scheduled hotel pickup time — driver route optimization
              </p>
            </div>
            <button
              onClick={() => onNavigate('arrivals')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
            >
              <span>Full Manifest ({tomorrowsBookings.length})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {tomorrowsBookings.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-400">
              <Calendar className="h-8 w-8 mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No scheduled departures for tomorrow yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Create a reservation or simulate customer booking in the Sales Agent chat.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tomorrowsBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/80">
                        {booking.pickupTime}
                      </span>
                      <span className="font-bold text-sm text-white">{booking.customerName}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({booking.bookingCode})</span>
                    </div>
                    <div className="text-slate-400">
                      <strong>{booking.serviceTitle}</strong> • {booking.adultsCount} Adults
                      {booking.childrenCount > 0 ? `, ${booking.childrenCount} Children` : ''}
                    </div>
                    <div className="text-slate-400">
                      📍 Hotel: <strong className="text-slate-200">{booking.hotelName}</strong> (Room{' '}
                      {booking.roomNumber || 'TBD'})
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end space-y-1">
                    <span className="font-bold text-white text-sm">
                      €{booking.totalAmount} ({booking.currency})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        booking.paymentStatus === 'PAID_FULL'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : booking.paymentStatus === 'DEPOSIT_PAID'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {booking.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Structured Owner Alert Feed (§18) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Bell className="h-5 w-5 text-indigo-400" />
              <span>Owner Alert Queue</span>
            </h2>
            <button
              onClick={() => onNavigate('whatsapp')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>WhatsApp Hub</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent alerts recorded in queue.</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition ${
                    alert.priority === 'P0_CRITICAL'
                      ? 'bg-red-950/30 border-red-800/80 text-red-200'
                      : alert.priority === 'P1_HIGH'
                      ? 'bg-blue-950/30 border-blue-800/80 text-blue-200'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-white">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{alert.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>To: {alert.recipientNumber}</span>
                    <span className="text-emerald-400 font-semibold">● {alert.deliveryStatus}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
