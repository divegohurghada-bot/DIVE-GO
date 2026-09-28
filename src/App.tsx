import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Brain,
  AlertTriangle,
  Compass,
  CreditCard,
  Calendar,
  MessageSquare,
  Smartphone,
  Share2,
  Globe,
  Activity,
  ShieldCheck,
  Lock,
  ExternalLink,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { appStore, AppState } from './services/store';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardOverview } from './components/DashboardOverview';
import { BusinessBrainView } from './components/BusinessBrainView';
import { ConflictsAndGapsView } from './components/ConflictsAndGapsView';
import { ServicesInventoryView } from './components/ServicesInventoryView';
import { ReservationEngineView } from './components/ReservationEngineView';
import { TomorrowsArrivalsView } from './components/TomorrowsArrivalsView';
import { MultilingualSalesAgentView } from './components/MultilingualSalesAgentView';
import { WhatsAppHubView } from './components/WhatsAppHubView';
import { SocialAutomationView } from './components/SocialAutomationView';
import { PlatformConnectorsView } from './components/PlatformConnectorsView';
import { SystemHealthView } from './components/SystemHealthView';
import { SecurityAndAuditView } from './components/SecurityAndAuditView';
import { AuditTestingSuiteView } from './components/AuditTestingSuiteView';
import { AuditReportModal } from './components/AuditReportModal';
import { WebsiteHome } from './components/website/WebsiteHome';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const [state, setState] = useState<AppState>(appStore.getState());
  // Mode: "website" (Public Website) vs "command_center" (Operations & Auditor Hub)
  const [viewMode, setViewMode] = useState<'website' | 'command_center'>('website');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuditReport, setShowAuditReport] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'brain', label: 'Business Brain', icon: Brain },
    {
      id: 'conflicts',
      label: 'Conflicts & Gaps',
      icon: AlertTriangle,
      badge:
        state.conflicts.filter((c) => c.status === 'OPEN').length +
        state.gaps.filter((g) => g.status === 'PENDING_OWNER_ANSWER').length,
    },
    { id: 'services', label: 'Services Catalog', icon: Compass },
    { id: 'reservations', label: 'Reservation Engine', icon: CreditCard },
    { id: 'arrivals', label: "Tomorrow's Arrivals", icon: Calendar, badge: appStore.getTomorrowsManifest().length },
    { id: 'chat', label: 'AI Sales Agent', icon: MessageSquare },
    { id: 'whatsapp', label: 'WhatsApp Hub', icon: Smartphone },
    { id: 'social', label: 'Social & Ads', icon: Share2 },
    { id: 'connectors', label: 'OTA Connectors', icon: Globe },
    { id: 'security', label: 'Security & Audit', icon: Lock },
    { id: 'health', label: 'System Health', icon: Activity },
    { id: 'testing', label: '20-Scenario Suite', icon: ShieldCheck },
  ];

  // If in Website Mode, render the full customer-facing commercial website
  if (viewMode === 'website') {
    return (
      <WebsiteHome
        state={state}
        onSwitchToCommandCenter={() => setViewMode('command_center')}
      />
    );
  }

  // Otherwise, render the Command Center & Operational Hub
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner with Quick Switch Back to Live Website */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-800/50 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-cyan-300 font-bold">OPERATIONS COMMAND CENTER & AUDITOR MODE</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Active Tenant: {state.profile.companyName || 'Dive Go Hurghada'}
          </span>
        </div>

        <button
          onClick={() => setViewMode('website')}
          className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Live Website</span>
        </button>
      </div>

      {/* Top Header */}
      <Header
        state={state}
        onOpenAuditReport={() => setShowAuditReport(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 shadow-xl sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Operations Menu</span>
              <button
                onClick={() => setViewMode('website')}
                className="text-cyan-400 hover:underline flex items-center space-x-0.5 text-[10px] cursor-pointer"
              >
                <span>Live Site</span>
                <Eye className="h-3 w-3" />
              </button>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white text-cyan-900'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Profile Info in Sidebar */}
            <div className="pt-3 mt-3 border-t border-slate-800/80 px-3 pb-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Target Business</span>
              <p className="text-xs font-bold text-slate-200 truncate">
                {state.profile.isBlank ? '⚪ Blank Initializer' : state.profile.companyName}
              </p>
              {state.profile.website && (
                <a
                  href={state.profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1 mt-0.5"
                >
                  <span>divegohurghada.com</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Tab Bar */}
          <div className="md:hidden flex overflow-x-auto space-x-2 pb-3 mb-4 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition ${
                    isActive ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'dashboard' && (
            <DashboardOverview
              state={state}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenOnboarding={() => setShowOnboarding(true)}
              onOpenAuditReport={() => setShowAuditReport(true)}
            />
          )}

          {activeTab === 'brain' && <BusinessBrainView state={state} />}

          {activeTab === 'conflicts' && <ConflictsAndGapsView state={state} />}

          {activeTab === 'services' && <ServicesInventoryView state={state} />}

          {activeTab === 'reservations' && <ReservationEngineView state={state} />}

          {activeTab === 'arrivals' && <TomorrowsArrivalsView state={state} />}

          {activeTab === 'chat' && <MultilingualSalesAgentView state={state} />}

          {activeTab === 'whatsapp' && <WhatsAppHubView state={state} />}

          {activeTab === 'social' && <SocialAutomationView state={state} />}

          {activeTab === 'connectors' && <PlatformConnectorsView state={state} />}

          {activeTab === 'security' && <SecurityAndAuditView state={state} />}

          {activeTab === 'health' && <SystemHealthView state={state} />}

          {activeTab === 'testing' && <AuditTestingSuiteView onOpenAuditReport={() => setShowAuditReport(true)} />}
        </main>
      </div>

      {/* Onboarding Structured Interview Modal (§6) */}
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      {/* Master Production Audit & Certification Report Modal (§62) */}
      <AuditReportModal isOpen={showAuditReport} onClose={() => setShowAuditReport(false)} state={state} />
    </div>
  );
}
