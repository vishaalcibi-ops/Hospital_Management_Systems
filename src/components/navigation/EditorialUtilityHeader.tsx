/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Minimal Floating Editorial Utility Header
 * Replaces traditional bloated navbar with a clean desktop-class utility bar
 * and grid-based Application Launcher.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  ChevronDown,
  Layers,
  Radio,
  Building2,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  Stethoscope,
  Activity,
  Heart,
  Pill,
  FileText,
  Calendar,
  Users,
  Bed,
  Sparkles,
  Command,
  ChevronRight,
  Menu,
  ExternalLink,
  Plus,
  Sliders,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, ThemeMode, CriticalAlert, PortalKey } from '../../types';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { ApplicationLauncherModal } from './ApplicationLauncherModal';
import { HeaderPortalMode } from './EnterpriseHorizontalNav';
import { PORTAL_METAS } from '../auth/PortalLoginPage';

export interface EditorialUtilityHeaderProps {
  portalMode: HeaderPortalMode;
  currentRole: UserRole;
  currentTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  userAvatar?: string;
  onLogout: () => void;
  onGoToLanding: () => void;
  onOpenGateway: () => void;
  onOpenCommandCenter: () => void;
  onOpenDigitalTwin: () => void;
  onOpenSearch: () => void;
  onSwitchPortal: (mode: HeaderPortalMode) => void;
}

export const EditorialUtilityHeader: React.FC<EditorialUtilityHeaderProps> = ({
  portalMode,
  currentRole,
  currentTab,
  onTabChange,
  userName,
  userAvatar,
  onLogout,
  onGoToLanding,
  onOpenGateway,
  onOpenCommandCenter,
  onOpenDigitalTwin,
  onOpenSearch,
  onSwitchPortal
}) => {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const headerRef = useRef<HTMLDivElement>(null);

  const alerts = db.getAlerts();
  const criticalCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K for search, ⌘M for launcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        sound.playClick();
        setIsLauncherOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Editorial Portal Metadata & Accent Palette
  const portalThemes: Record<string, {
    title: string;
    subtitle: string;
    tag: string;
    accent: string;
    surfaceBg: string;
    icon: React.ElementType;
    contextPills: { id: string; label: string }[];
  }> = {
    'super-admin': {
      title: 'Enterprise Intelligence Canvas',
      subtitle: 'Global Health Governance & Telemetry',
      tag: 'Super Admin • Tier-0',
      accent: '#29243A',
      surfaceBg: '#FAF9F5',
      icon: ShieldCheck,
      contextPills: [
        { id: 'overview', label: 'Intelligence Canvas' },
        { id: 'patients', label: 'Patient Master Index' },
        { id: 'doctors', label: 'Clinical Faculty' },
        { id: 'analytics', label: 'Revenue Telemetry' },
        { id: 'settings', label: 'Governance & Security' }
      ]
    },
    'admin': {
      title: 'Hospital Operations Canvas',
      subtitle: 'Real-Time Facility Census & Logistics',
      tag: 'Executive Operations',
      accent: '#174B78',
      surfaceBg: '#FAF9F5',
      icon: Building2,
      contextPills: [
        { id: 'dashboard', label: 'Operations Canvas' },
        { id: 'ward', label: 'Ward Visualization' },
        { id: 'beds', label: 'Bed Heatmap' },
        { id: 'monitoring', label: 'ICU Telemetry' },
        { id: 'admissions', label: 'Patient Movement' }
      ]
    },
    'management': {
      title: 'Hospital Operations Canvas',
      subtitle: 'Real-Time Facility Census & Logistics',
      tag: 'Executive Operations',
      accent: '#174B78',
      surfaceBg: '#FAF9F5',
      icon: Building2,
      contextPills: [
        { id: 'dashboard', label: 'Operations Canvas' },
        { id: 'ward', label: 'Ward Visualization' },
        { id: 'beds', label: 'Bed Heatmap' },
        { id: 'analytics', label: 'Operational Analytics' }
      ]
    },
    'doctor': {
      title: 'Clinical Consultation Workspace',
      subtitle: 'Split-Screen EMR & Prescription Desk',
      tag: 'Physician Workstation',
      accent: '#5551A6',
      surfaceBg: '#FAF9F5',
      icon: Stethoscope,
      contextPills: [
        { id: 'doctor-consult', label: 'Clinical Workspace' },
        { id: 'doctor-overview', label: 'Appointment Queue' },
        { id: 'doctor-patients', label: 'Inpatient Rounds' },
        { id: 'doctor-chat', label: 'Telehealth Messages' },
        { id: 'emr', label: 'Health Records & 3D' }
      ]
    },
    'nurse': {
      title: 'Care Operations Board',
      subtitle: 'Shift Allocation & Medication Administration',
      tag: 'Nursing Station',
      accent: '#829783',
      surfaceBg: '#EDF3ED',
      icon: Activity,
      contextPills: [
        { id: 'nurse-dashboard', label: 'Care Operations Board' },
        { id: 'nurse-rounds', label: 'Ward Rounds & MAR' },
        { id: 'patients', label: 'Assigned Patients' },
        { id: 'beds', label: 'Bed Sanitization' }
      ]
    },
    'patient': {
      title: 'Personal Health Journal',
      subtitle: 'Digital Health Passport & Consultation History',
      tag: 'Patient Journal',
      accent: '#D58B72',
      surfaceBg: '#FAF0EC',
      icon: Heart,
      contextPills: [
        { id: 'patient-health', label: 'Health Journal' },
        { id: 'patient-appointments', label: 'Consultations' },
        { id: 'patient-prescriptions', label: 'Medicines & Refills' },
        { id: 'patient-labs', label: 'Lab Reports' },
        { id: 'patient-billing', label: 'Billing & TPA' }
      ]
    }
  };

  const meta = (PORTAL_METAS as any)[portalMode];
  const theme = portalThemes[portalMode] || {
    title: meta?.title || 'Hospital Operations Canvas',
    subtitle: meta?.subtitle || 'Clinical Logistics',
    tag: meta?.badge || 'Specialist Portal',
    accent: meta?.accent || '#174B78',
    surfaceBg: '#FAF9F5',
    icon: meta?.icon || Building2,
    contextPills: []
  };
  const PortalIcon = theme.icon;

  return (
    <header className="w-full sticky top-0 z-40 bg-[#F7F5EF] border-b border-[#E7E4DC] font-sans transition-all selection:bg-[#5551A6] selection:text-white" ref={headerRef}>
      {/* Tier 1: Floating Utility Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-[#E7E4DC]/60 bg-[#F7F5EF]">
        {/* Left: Brand + Portal Tag */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => { sound.playClick(); onGoToLanding(); }}
            className="flex items-center gap-2 group cursor-pointer text-left"
            title="Return to Public Website"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-black text-white text-sm shadow-xs transition-transform group-hover:scale-105"
              style={{ backgroundColor: theme.accent }}
            >
              ✚
            </div>
            <div>
              <span className="font-serif text-base font-black tracking-tight text-[#29243A] block leading-none">
                MEDICORE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#626B77] font-bold block mt-0.5">
                EDITORIAL OS
              </span>
            </div>
          </button>

          {/* Active Portal Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors shadow-2xs"
              style={{
                backgroundColor: theme.surfaceBg,
                color: theme.accent,
                borderColor: `${theme.accent}30`
              }}
            >
              <PortalIcon className="w-3.5 h-3.5" />
              <span>{theme.title}</span>
            </span>
          </div>
        </div>

        {/* Center Middle: Global Search & MediCore AI Quick Launcher */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-lg mx-6 gap-3">
          <button
            type="button"
            onClick={() => { sound.playClick(); onOpenSearch(); }}
            className="flex-1 max-w-xs flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-[#E7E4DC] text-xs text-[#626B77] hover:border-[#5551A6] hover:text-[#29243A] transition shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#626B77]" />
              <span>Search records or commands...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#F7F5EF] border border-[#E7E4DC] text-[#626B77]">⌘K</kbd>
            </div>
          </button>

          {/* MediCore AI Center Middle Button */}
          <button
            onClick={() => {
              sound.playClick();
              window.dispatchEvent(new CustomEvent('medicore:open-ai'));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#29243A] to-[#403B58] hover:from-[#1E1B2B] hover:to-[#29243A] text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer shrink-0"
            title="Open MediCore AI (Ctrl+Shift+A)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>MediCore AI</span>
          </button>
        </div>

        {/* Right: Hospital Status + Notifications + Sound + User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile MediCore AI Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              window.dispatchEvent(new CustomEvent('medicore:open-ai'));
            }}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#29243A] to-[#403B58] text-white text-xs font-bold shadow-xs cursor-pointer"
            title="Open MediCore AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>MediCore AI</span>
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl text-[#626B77] hover:text-[#29243A] hover:bg-white border border-transparent hover:border-[#E7E4DC] transition cursor-pointer"
            title={isMuted ? 'Unmute Audio Chimes' : 'Mute Audio Chimes'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#5551A6]" />}
          </button>

          {/* Critical Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
              className="relative p-2 rounded-xl text-[#626B77] hover:text-[#29243A] hover:bg-white border border-transparent hover:border-[#E7E4DC] transition cursor-pointer"
              title="Hospital Critical Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {criticalCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D58B72] text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {criticalCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E7E4DC] shadow-xl z-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E4DC]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#D58B72]" />
                      <h4 className="text-xs font-bold text-[#29243A]">Hospital Telemetry Alarms</h4>
                    </div>
                    <span className="text-[10px] font-bold bg-[#FAF0EC] text-[#D58B72] px-2 py-0.5 rounded-full">
                      {criticalCount} Active STAT
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                          alert.severity === 'critical'
                            ? 'bg-[#FAF0EC] border-[#D58B72]/40 text-[#29243A]'
                            : 'bg-[#F7F5EF] border-[#E7E4DC] text-[#29243A]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px]">{alert.title || alert.department}</span>
                          <span className="text-[10px] text-[#626B77]">{alert.time || 'Just now'}</span>
                        </div>
                        <p className="text-[11px] leading-tight text-[#626B77]">
                          {alert.actionRequired}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E7E4DC] text-center">
                    <button
                      onClick={() => { setNotifOpen(false); onTabChange('overview'); }}
                      className="text-xs font-bold text-[#5551A6] hover:underline"
                    >
                      Open Full Intelligence Audit Trail →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Pill with Complete Legal Full Name Display */}
          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E7E4DC] hover:border-[#5551A6] transition cursor-pointer shadow-2xs"
            >
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-[#29243A] block leading-tight whitespace-nowrap">{userName}</span>
                <span className="text-[9px] text-[#626B77] uppercase font-bold tracking-wider block mt-0.5">{currentRole.replace(/_/g, ' ')}</span>
              </div>
              <img
                src={userAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                alt={userName}
                className="w-8 h-8 rounded-xl object-cover border border-[#E7E4DC] shadow-2xs"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#626B77]" />
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E7E4DC] shadow-xl z-50 p-2 space-y-1 text-xs"
                >
                  <div className="p-3 bg-[#F7F5EF] rounded-xl border border-[#E7E4DC] mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#626B77] block">Hospital Account</span>
                    <strong className="text-sm font-serif font-bold text-[#29243A] block mt-0.5">{userName}</strong>
                    <span className="text-[11px] text-[#5551A6] font-bold block mt-0.5">{theme.tag}</span>
                    <span className="text-[10px] text-[#626B77] block mt-1">Facility: MediCore Central Flagship</span>
                  </div>

                  <button
                    onClick={() => { setUserMenuOpen(false); onTabChange('settings'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#29243A] hover:bg-[#F7F5EF] transition text-left font-semibold cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#626B77]" />
                    <span>Workspace Settings &amp; Security</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onOpenGateway(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#29243A] hover:bg-[#F7F5EF] transition text-left font-semibold cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#5551A6]" />
                    <span>Switch Portal (20 Portals)</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onGoToLanding(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#29243A] hover:bg-[#F7F5EF] transition text-left font-semibold cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-[#626B77]" />
                    <span>← Public Website</span>
                  </button>

                  <div className="h-px bg-[#E7E4DC] my-1" />

                  <button
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition text-left font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out of Session</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tier 2: Contextual Workspace Sub-Navigation & Breadcrumbs */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Interactive Contextual Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-bold text-[#626B77] uppercase tracking-wider mr-1 hidden sm:inline">
            Workspace:
          </span>
          {theme.contextPills.map((pill) => {
            const isActive = currentTab === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => { sound.playClick(); onTabChange(pill.id); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white shadow-2xs'
                    : 'bg-[#F7F5EF] text-[#626B77] hover:bg-[#E7E4DC] hover:text-[#29243A]'
                }`}
                style={isActive ? { backgroundColor: theme.accent } : {}}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Right: Hospital Health Latency & Telemetry */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-semibold text-[#626B77]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#829783] animate-pulse" />
            <span>High-Availability Network Cluster</span>
          </span>
          <span>•</span>
          <span>98.4% Census • PostgreSQL Active</span>
        </div>
      </div>

      {/* Grid Application Launcher Modal */}
      <ApplicationLauncherModal
        isOpen={isLauncherOpen}
        onClose={() => setIsLauncherOpen(false)}
        onSelectApp={(app) => {
          setIsLauncherOpen(false);
          if (app.portalTarget && app.portalTarget !== portalMode) {
            onSwitchPortal(app.portalTarget);
          }
          if (app.tabTarget) {
            onTabChange(app.tabTarget);
          }
        }}
        onOpenGateway={onOpenGateway}
        onOpenCommandCenter={onOpenCommandCenter}
      />
    </header>
  );
};
