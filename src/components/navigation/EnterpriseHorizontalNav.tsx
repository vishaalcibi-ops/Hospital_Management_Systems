/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Enterprise Horizontal Navigation System
 * Replaces the traditional dark vertical sidebar completely.
 * Full-width, multi-tier horizontal navigation with role-specific mega menus,
 * breadcrumbs, global search, critical alerts, and quick actions.
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
  Compass,
  ArrowRight,
  Shield,
  HelpCircle,
  Clock,
  Printer,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, ThemeMode, CriticalAlert, PortalKey } from '../../types';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';

export type HeaderPortalMode = 'super-admin' | 'admin' | 'management' | 'doctor' | 'nurse' | 'patient';

interface NavDropdownItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  badge?: string;
  isAction?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  badge?: string;
  items?: NavDropdownItem[];
}

export interface EnterpriseHorizontalNavProps {
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

export const EnterpriseHorizontalNav: React.FC<EnterpriseHorizontalNavProps> = ({
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Portal Branding Specification
  const portalBranding: Record<string, {
    title: string;
    badge: string;
    accent: string;
    lightBg: string;
    border: string;
    icon: React.ElementType;
  }> = {
    'super-admin': {
      title: 'Super Admin Command Center',
      badge: 'Portal 1 • Tier-0 Root Access',
      accent: '#174B78',
      lightBg: '#EAF4FC',
      border: 'border-[#174B78]/20',
      icon: ShieldCheck
    },
    'admin': {
      title: 'Hospital Operations Control Center',
      badge: 'Portal 2 • Executive Operations',
      accent: '#174B78',
      lightBg: '#EAF4FC',
      border: 'border-[#174B78]/20',
      icon: Building2
    },
    'management': {
      title: 'Hospital Operations Control Center',
      badge: 'Portal 2 • Executive Operations',
      accent: '#174B78',
      lightBg: '#EAF4FC',
      border: 'border-[#174B78]/20',
      icon: Building2
    },
    'doctor': {
      title: 'Doctor Clinical Workspace',
      badge: 'Portal 3 • Physician Station',
      accent: '#287EB5',
      lightBg: '#F0FDFA',
      border: 'border-[#287EB5]/20',
      icon: Stethoscope
    },
    'nurse': {
      title: 'Head Nurse Station',
      badge: 'Portal 4 • Inpatient Nursing Care',
      accent: '#18865B',
      lightBg: '#EAF7F1',
      border: 'border-[#18865B]/20',
      icon: Activity
    },
    'patient': {
      title: 'Patient Health Portal',
      badge: 'Portal 5 • Personal Health Passport',
      accent: '#287EB5',
      lightBg: '#EFF6FF',
      border: 'border-[#287EB5]/20',
      icon: Heart
    }
  };

  const branding = portalBranding[portalMode] || portalBranding['admin'];
  const PortalIcon = branding.icon;

  // Navigation Items per Portal
  const getNavItems = (): NavItem[] => {
    switch (portalMode) {
      case 'super-admin':
        return [
          { id: 'overview', label: 'Command Center', icon: ShieldCheck },
          {
            id: 'clinical-ops',
            label: 'Clinical Operations',
            icon: Users,
            items: [
              { id: 'patients', title: 'Patient Directory', description: 'Patient records, demographics & census', icon: Users },
              { id: 'doctors', title: 'Doctors Directory', description: 'Faculty, specialties & active shifts', icon: Stethoscope },
              { id: 'appointments', title: 'Appointments & Scheduling', description: 'Consultations, OT & clinic slots', icon: Calendar },
              { id: 'beds', title: 'Bed Management & Wards', description: 'Census, real-time availability & turnover', icon: Bed }
            ]
          },
          {
            id: 'hospital-services',
            label: 'Hospital Services',
            icon: Building2,
            items: [
              { id: 'emr', title: 'Electronic Medical Records', description: 'Digital health charts, SOAP notes & 3D anatomy', icon: FileText },
              { id: 'pharmacy', title: 'Pharmacy & Drug Formulary', description: 'Medication inventory & dispense logs', icon: Pill },
              { id: 'lab', title: 'Diagnostic Laboratory', description: 'Pathology tests, specimen orders & results', icon: Sparkles },
              { id: 'billing', title: 'Billing & Revenue Cycle', description: 'Invoices, insurance claims & collections', icon: Sliders },
              { id: 'staff', title: 'Staff & Human Resources', description: 'Staff directory, shifts & credentials', icon: Users }
            ]
          },
          { id: 'analytics', label: 'Enterprise Analytics', icon: Activity },
          { id: 'settings', label: 'System Settings', icon: Settings }
        ];

      case 'admin':
      case 'management':
        return [
          { id: 'dashboard', label: 'Operations Dashboard', icon: Building2 },
          {
            id: 'wards-menu',
            label: 'Ward Operations',
            icon: Bed,
            items: [
              { id: 'ward', title: 'Ward Overview', description: 'Floor census, bed status & nurse allocations', icon: Bed },
              { id: 'beds', title: 'Bed Availability Map', description: 'Real-time interactive bed floorplan', icon: Bed },
              { id: 'monitoring', title: 'Continuous ICU Telemetry', description: 'Vital signs alarms & high-acuity monitoring', icon: Activity },
              { id: 'admissions', title: 'Inpatient Admissions Gate', description: 'Intake workflows & bed assignment', icon: Users },
              { id: 'discharges', title: 'Discharges & Transfers', description: 'Discharge clearance & room sanitization', icon: CheckCircle2 }
            ]
          },
          {
            id: 'patient-care',
            label: 'Patient Care',
            icon: Users,
            items: [
              { id: 'patients', title: 'Patient Directory', description: 'Master patient index & digital records', icon: Users },
              { id: 'appointments', title: 'Appointments & OPD', description: 'Daily clinic roster & check-ins', icon: Calendar },
              { id: 'emr', title: 'Medical Records', description: 'Clinical documentation & case histories', icon: FileText }
            ]
          },
          {
            id: 'hospital-resources',
            label: 'Resources & Services',
            icon: Sliders,
            items: [
              { id: 'doctors', title: 'Doctors on Duty', description: 'Attending physicians & specialty rosters', icon: Stethoscope },
              { id: 'staff', title: 'Staff Management', description: 'Shift scheduling & attendance', icon: Users },
              { id: 'pharmacy', title: 'Inpatient Pharmacy', description: 'Medication supplies & stock alerts', icon: Pill },
              { id: 'lab', title: 'Diagnostic Labs', description: 'Test turnaround & STAT order tracking', icon: Sparkles },
              { id: 'billing', title: 'Billing & Insurance', description: 'Cashier desk, TPA approvals & payments', icon: Sliders }
            ]
          },
          { id: 'analytics', label: 'Operations Analytics', icon: Activity },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];

      case 'doctor':
        return [
          { id: 'doctor-consult', label: 'Clinical Workspace', icon: Stethoscope },
          { id: 'doctor-overview', label: 'Practice Overview', icon: Activity },
          {
            id: 'clinical-tasks',
            label: 'Clinical Station',
            icon: Users,
            items: [
              { id: 'doctor-patients', title: 'Inpatient Ward Rounds', description: 'Assigned inpatients, acuity & bed locations', icon: Bed },
              { id: 'doctor-rx', title: 'E-Prescriptions & Refills', description: 'Medication composer with allergy checks', icon: Pill },
              { id: 'doctor-labs', title: 'Lab & Imaging Orders', description: 'Diagnostic orders, bloodwork & PACS scans', icon: Sparkles },
              { id: 'doctor-chat', title: 'Patient Inquiries & Telehealth', description: 'Secure tele-consultation & patient chat', icon: Users },
              { id: 'doctor-schedule', title: 'Clinic Schedule', description: 'OPD calendar, slots & time management', icon: Calendar }
            ]
          },
          {
            id: 'records-lookup',
            label: 'Records & Directory',
            icon: FileText,
            items: [
              { id: 'patients', title: 'Global Patient Directory', description: 'Search any patient history & vitals', icon: Users },
              { id: 'appointments', title: 'All Appointments', description: 'Department-wide schedule view', icon: Calendar },
              { id: 'emr', title: 'Electronic Health Records', description: '3D anatomical viewer & full records', icon: FileText }
            ]
          },
          { id: 'settings', label: 'Doctor Settings', icon: Settings }
        ];

      case 'nurse':
        return [
          { id: 'nurse-dashboard', label: 'Nursing Station', icon: Activity },
          { id: 'nurse-rounds', label: 'Ward Rounds & Rosters', icon: Bed },
          {
            id: 'nursing-care',
            label: 'Patient Care & Meds',
            icon: Pill,
            items: [
              { id: 'patients', title: 'Inpatient Census Directory', description: 'Assigned patients & clinical summaries', icon: Users },
              { id: 'beds', title: 'Bed Sanitization & Status', description: 'Bed turnaround, transfers & cleaning', icon: Bed }
            ]
          },
          { id: 'settings', label: 'Station Settings', icon: Settings }
        ];

      case 'patient':
        return [
          { id: 'patient-health', label: 'Health Passport', icon: Heart },
          { id: 'patient-appointments', label: 'My Appointments', icon: Calendar },
          { id: 'patient-prescriptions', label: 'Prescriptions & Meds', icon: Pill },
          { id: 'patient-labs', label: 'Lab & Scans', icon: Sparkles },
          { id: 'patient-billing', label: 'Bills & Insurance', icon: Sliders },
          { id: 'patient-messages', label: 'Message Doctor', icon: Users },
          { id: 'settings', label: 'Account Settings', icon: Settings }
        ];

      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'patients', label: 'Patients', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: Calendar }
        ];
    }
  };

  const navItems = getNavItems();

  // Helper for Breadcrumb display
  const getBreadcrumbLabel = (tab: string) => {
    for (const item of navItems) {
      if (item.id === tab) return item.label;
      if (item.items) {
        const sub = item.items.find(s => s.id === tab);
        if (sub) return `${item.label} / ${sub.title}`;
      }
    }
    return tab.replace(/-/g, ' ').toUpperCase();
  };

  const handleSelectNav = (tabId: string) => {
    sound.playClick();
    onTabChange(tabId);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-[#E4EAF1] sticky top-0 z-40 shadow-xs font-sans">
      {/* ============================================================
          TIER 1: ENTERPRISE UTILITY & BRAND BAR
          ============================================================ */}
      <div className="w-full border-b border-[#E4EAF1]/80 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between bg-white">
        {/* Left: Brand Mark & Portal Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => { sound.playClick(); onGoToLanding(); }}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
            title="Return to Public Website"
          >
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-slate-700/20 bg-[#1A2332] shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/medicore-logo.png"
                alt="MediCore Logo"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-serif font-black tracking-tight text-[#1C2B3A]">
                  MEDICORE
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 hidden sm:inline">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[10px] text-[#718096] font-semibold tracking-wide hidden md:block">
                Multispeciality Medical Network
              </p>
            </div>
          </button>

          <div className="h-6 w-px bg-[#E4EAF1] hidden sm:block" />

          {/* Role Status Pill */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors shadow-2xs"
              style={{
                backgroundColor: branding.lightBg,
                color: branding.accent,
                borderColor: `${branding.accent}30`
              }}
            >
              <PortalIcon className="w-3.5 h-3.5" />
              <span>{branding.title}</span>
            </span>
            <span className="relative flex h-2 w-2" title="Live Database Synchronization Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Center: Global Search Quick-Launcher */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <button
            type="button"
            onClick={() => { sound.playClick(); onOpenSearch(); }}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#F6F9FC] border border-[#E4EAF1] text-xs text-[#718096] hover:border-blue-400 hover:bg-white hover:text-[#1C2B3A] transition shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#718096]" />
              <span>Search patients, records, doctors, or codes...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-white border border-[#E4EAF1] text-[#718096]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-white border border-[#E4EAF1] text-[#718096]">K</kbd>
            </div>
          </button>
        </div>

        {/* Right: Quick Action Controls & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
          {/* Audio Mute Button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl text-[#718096] hover:text-[#1C2B3A] hover:bg-[#F6F9FC] border border-transparent hover:border-[#E4EAF1] transition"
            title={isMuted ? 'Unmute Audio Chimes' : 'Mute Audio Chimes'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#174B78]" />}
          </button>

          {/* Switch Portal Selector */}
          <button
            onClick={() => { sound.playClick(); onOpenGateway(); }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4EAF1] hover:border-blue-400 bg-white hover:bg-blue-50/50 text-[#174B78] text-xs font-bold transition shadow-2xs cursor-pointer"
            title="Switch between all 20 specialized hospital portals"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">All 20 </span>
            <span>Portals</span>
          </button>

          {/* Command Center & 3D Twin Shortcuts */}
          <button
            onClick={() => { sound.playClick(); onOpenCommandCenter(); }}
            className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#718096] hover:text-[#1C2B3A] hover:bg-[#F6F9FC] border border-transparent hover:border-[#E4EAF1] transition"
            title="Open Hospital Command Center"
          >
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Command</span>
          </button>

          {/* Critical Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
              className="relative p-2 rounded-xl text-[#718096] hover:text-[#1C2B3A] hover:bg-[#F6F9FC] border border-transparent hover:border-[#E4EAF1] transition cursor-pointer"
              title="Hospital Critical Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {criticalCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
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
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E4EAF1] shadow-xl z-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E4EAF1]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-bold text-[#1C2B3A]">Hospital Telemetry Alerts</h4>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      {criticalCount} Active STAT
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                          alert.severity === 'critical'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : alert.severity === 'high'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px]">{alert.title || alert.department}</span>
                          <span className="text-[10px] text-slate-500">{alert.time || 'Just now'}</span>
                        </div>
                        <p className="text-[11px] leading-tight text-slate-600">
                          {alert.actionRequired}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E4EAF1] text-center">
                    <button
                      onClick={() => { setNotifOpen(false); onTabChange('overview'); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      View All Hospital Logs →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-[#F6F9FC] border border-transparent hover:border-[#E4EAF1] transition cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-[#1C2B3A] block leading-tight">{userName}</span>
                <span className="text-[10px] text-[#718096] uppercase font-semibold">{currentRole.replace(/_/g, ' ')}</span>
              </div>
              <img
                src={userAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                alt={userName}
                className="w-8 h-8 rounded-lg object-cover border border-[#E4EAF1]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#718096]" />
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E4EAF1] shadow-xl z-50 p-2 space-y-1 text-xs"
                >
                  <div className="p-3 bg-[#F6F9FC] rounded-xl border border-[#E4EAF1]/70 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block">Hospital Account</span>
                    <strong className="text-sm font-extrabold text-[#1C2B3A] block mt-0.5">{userName}</strong>
                    <span className="text-[11px] text-blue-700 font-bold block mt-0.5">{branding.badge}</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Facility: MediCore Central Flagship</span>
                  </div>

                  <button
                    onClick={() => { setUserMenuOpen(false); onTabChange('settings'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1C2B3A] hover:bg-slate-100 transition text-left font-semibold"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Account &amp; Security Settings</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onOpenGateway(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1C2B3A] hover:bg-slate-100 transition text-left font-semibold"
                  >
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Switch Portal (20 Portals)</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onGoToLanding(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1C2B3A] hover:bg-slate-100 transition text-left font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>← Public Website</span>
                  </button>

                  <div className="h-px bg-[#E4EAF1] my-1" />

                  <button
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition text-left font-bold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out of Session</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#718096] hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ============================================================
          TIER 2: HORIZONTAL NAVIGATION TABS & MEGA DROPDOWNS
          ============================================================ */}
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-[#F6F9FC] border-b border-[#E4EAF1] flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-2 py-1.5">
          {navItems.map((item) => {
            const hasSubmenu = Boolean(item.items && item.items.length > 0);
            const isDirectActive = currentTab === item.id;
            const isSubActive = hasSubmenu && item.items?.some(s => s.id === currentTab);
            const isActive = isDirectActive || isSubActive;
            const isDropdownOpen = activeDropdown === item.id;
            const ItemIcon = item.icon;

            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (hasSubmenu) {
                      sound.playClick();
                      setActiveDropdown(isDropdownOpen ? null : item.id);
                    } else {
                      handleSelectNav(item.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#174B78] shadow-xs border border-[#E4EAF1]'
                      : 'text-[#718096] hover:text-[#1C2B3A] hover:bg-white/60 border border-transparent'
                  }`}
                  style={isActive ? { borderBottomColor: branding.accent, borderBottomWidth: '2px' } : {}}
                >
                  {ItemIcon && (
                    <ItemIcon
                      className={`w-3.5 h-3.5 ${isActive ? 'text-[#174B78]' : 'text-[#718096]'}`}
                      style={isActive ? { color: branding.accent } : {}}
                    />
                  )}
                  <span>{item.label}</span>
                  {hasSubmenu && (
                    <ChevronDown
                      className={`w-3 h-3 text-[#718096] transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-extrabold ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Submenu Dropdown */}
                {hasSubmenu && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-[#E4EAF1] shadow-xl z-50 p-2 space-y-1"
                      >
                        <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#718096] border-b border-[#E4EAF1]/70 mb-1">
                          {item.label} Modules
                        </div>

                        {item.items?.map((sub) => {
                          const isCurrent = currentTab === sub.id;
                          const SubIcon = sub.icon;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelectNav(sub.id)}
                              className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition text-left cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#EAF4FC] text-[#174B78] font-bold border border-blue-200'
                                  : 'hover:bg-slate-50 text-[#1C2B3A] border border-transparent'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold truncate">{sub.title}</span>
                                  {sub.badge && (
                                    <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                {sub.description && (
                                  <p className="text-[10px] text-[#718096] truncate mt-0.5">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Quick Action context button */}
        <div className="hidden lg:flex items-center gap-2 py-1.5 pl-4">
          {portalMode === 'doctor' && (
            <button
              onClick={() => handleSelectNav('doctor-consult')}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Patient Consult</span>
            </button>
          )}

          {portalMode === 'nurse' && (
            <button
              onClick={() => handleSelectNav('nurse-rounds')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Shift Handover Log</span>
            </button>
          )}

          {portalMode === 'patient' && (
            <button
              onClick={() => handleSelectNav('patient-appointments')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          )}

          {(portalMode === 'admin' || portalMode === 'super-admin' || portalMode === 'management') && (
            <button
              onClick={() => handleSelectNav('patients')}
              className="px-3 py-1.5 rounded-xl bg-[#174B78] hover:bg-[#153B63] text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================
          TIER 3: CONTEXTUAL BREADCRUMBS & SECTION STATUS
          ============================================================ */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2 bg-white flex items-center justify-between text-xs text-[#718096] border-b border-[#E4EAF1]/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGoToLanding()}
            className="hover:text-[#174B78] transition font-semibold"
          >
            MediCore
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-[#1C2B3A]">{branding.title}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#174B78]" style={{ color: branding.accent }}>
            {getBreadcrumbLabel(currentTab)}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] font-semibold text-[#718096]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>High-Availability Cluster • Node 01</span>
          </span>
          <span>•</span>
          <span>Encrypted TLS 1.3 • HIPAA Verified</span>
        </div>
      </div>

      {/* ============================================================
          MOBILE DRAWER NAVIGATION
          ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#E4EAF1] bg-white p-4 space-y-3"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#718096] tracking-wider px-2">Navigation Menu</span>
              {navItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleSelectNav(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold text-xs hover:bg-slate-100 text-[#1C2B3A]"
                  >
                    <span>{item.label}</span>
                    {item.items && <span className="text-[10px] text-slate-400">({item.items.length})</span>}
                  </button>

                  {item.items && (
                    <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3">
                      {item.items.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectNav(sub.id)}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenGateway(); }}
                className="w-full py-2 px-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Switch Portal (20 Portals)</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
