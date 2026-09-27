import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  MapPin,
  Check,
  X,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';
import { ServiceItem } from '../types';

interface ServicesInventoryViewProps {
  state: AppState;
}

export const ServicesInventoryView: React.FC<ServicesInventoryViewProps> = ({ state }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'diving' as ServiceItem['category'],
    description: '',
    priceAdult: 65,
    priceChild: 40,
    currency: state.profile.currency || 'EUR (€)',
    durationHours: 8,
    departureTimes: '08:00 AM',
    meetingPoint: 'Hurghada Marina Pier 4 or Hotel Lobby',
    pickupAreasIncluded: 'Hurghada, Mamsha, Dahar',
    inclusions: 'Lunch buffet, Soft drinks, Gear, Transfers',
    exclusions: 'National Park Fee (€5)',
    minParticipants: 1,
    maxCapacity: 28,
    cancellationPolicy: 'Free cancellation up to 24 hours prior to departure.',
    childPolicy: 'Junior divers must be min 10 years old.',
    languagesOffered: 'English, German, Arabic',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      priceAdult: Number(form.priceAdult),
      priceChild: Number(form.priceChild),
      currency: form.currency,
      durationHours: Number(form.durationHours),
      departureTimes: form.departureTimes.split(',').map((t) => t.trim()),
      meetingPoint: form.meetingPoint,
      pickupAreasIncluded: form.pickupAreasIncluded.split(',').map((p) => p.trim()),
      inclusions: form.inclusions.split(',').map((i) => i.trim()),
      exclusions: form.exclusions.split(',').map((e) => e.trim()),
      minParticipants: Number(form.minParticipants),
      maxCapacity: Number(form.maxCapacity),
      cancellationPolicy: form.cancellationPolicy,
      childPolicy: form.childPolicy,
      languagesOffered: form.languagesOffered.split(',').map((l) => l.trim()),
      verificationSource: 'OWNER_VERIFIED' as const,
      isAvailable: true,
    };

    if (editingService) {
      appStore.updateService(editingService.id, payload);
      setEditingService(null);
    } else {
      appStore.addService(payload);
    }

    setShowAddModal(false);
  };

  const openEdit = (s: ServiceItem) => {
    setEditingService(s);
    setForm({
      title: s.title,
      category: s.category,
      description: s.description,
      priceAdult: s.priceAdult,
      priceChild: s.priceChild,
      currency: s.currency,
      durationHours: s.durationHours,
      departureTimes: s.departureTimes.join(', '),
      meetingPoint: s.meetingPoint,
      pickupAreasIncluded: s.pickupAreasIncluded.join(', '),
      inclusions: s.inclusions.join(', '),
      exclusions: s.exclusions.join(', '),
      minParticipants: s.minParticipants,
      maxCapacity: s.maxCapacity,
      cancellationPolicy: s.cancellationPolicy,
      childPolicy: s.childPolicy,
      languagesOffered: s.languagesOffered.join(', '),
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Compass className="h-4 w-4" />
            <span>Excursion & Tour Catalog (§6 & §16)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Verified Services & Capacities</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live inventory consulted by the AI Multilingual Sales Agent. Any changes to tariffs, inclusions, or
            cancellation rules are logged and immediately grounded.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService(null);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Excursion</span>
        </button>
      </div>

      {/* Services List */}
      {state.services.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Compass className="h-10 w-10 mx-auto text-slate-500" />
          <h3 className="text-base font-bold text-white">No Services Configured (Zero-Assumption Rule §5)</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Add your first excursion manually, run the Website Importer on divegohurghada.com, or 1-click load the
            verified Dive Go Hurghada profile.
          </p>
          <button
            onClick={() => appStore.loadDiveGoHurghadaProfile()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Load 5 Standard Red Sea Excursions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {state.services.map((srv) => (
            <div
              key={srv.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                    {srv.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-white">{srv.title}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-white">
                    €{srv.priceAdult}
                    <span className="text-xs font-normal text-slate-400"> / adult</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    €{srv.priceChild} / child
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{srv.description}</p>

              {/* Meta details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-800/60 p-3 rounded-2xl border border-slate-800 text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Duration: {srv.durationHours} hrs</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-400" />
                  <span>Max: {srv.maxCapacity} Pax</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Meeting: {srv.meetingPoint.slice(0, 16)}...</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Inclusions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {srv.inclusions.map((inc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
                    >
                      ✓ {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] text-slate-400">
                  Source: <strong className="text-cyan-400">{srv.verificationSource}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEdit(srv)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    title="Edit Service"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => appStore.deleteService(srv.id)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition"
                    title="Delete Service"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService ? 'Edit Excursion Service' : 'Add New Excursion Service'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Excursion Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Daily Boat Diving (2 Guided Dives)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="diving">Scuba Diving</option>
                    <option value="sea_trip">Boat / Snorkeling Trip</option>
                    <option value="desert_safari">Desert Safari & Quad</option>
                    <option value="transfer">Airport / Hotel Transfer</option>
                    <option value="city_tour">City Tour</option>
                    <option value="cruise">Cruise & Private Yacht</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail the experience, reefs, safety briefing, buffet meal..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Adult Price (€) *</label>
                  <input
                    type="number"
                    required
                    value={form.priceAdult}
                    onChange={(e) => setForm({ ...form, priceAdult: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Child Price (€)</label>
                  <input
                    type="number"
                    value={form.priceChild}
                    onChange={(e) => setForm({ ...form, priceChild: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={form.maxCapacity}
                    onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inclusions (Comma separated)</label>
                <input
                  type="text"
                  value={form.inclusions}
                  onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                  placeholder="2 Guided Dives, Tanks & Weights, Lunch Buffet, Soft Drinks"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Meeting & Pickup Points</label>
                <input
                  type="text"
                  value={form.meetingPoint}
                  onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })}
                  placeholder="Hurghada Marina Pier 4 or Hotel Lobby"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                {editingService ? 'Update Service' : 'Save Excursion'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
