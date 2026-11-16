/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Grid-Based Application Launcher Modal
 * Editorial Healthcare Architecture: Fast, desktop-style grid launcher
 * for jumping between all hospital portals and clinical modules.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ShieldCheck,
  Building2,
  Stethoscope,
  Activity,
  Heart,
  Users,
  Calendar,
  Bed,
  FileText,
  Pill,
  Sparkles,
  Sliders,
  Settings,
  Radio,
  ExternalLink,
  ChevronRight,
  Command,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../services/audioService';
import { HeaderPortalMode } from './EnterpriseHorizontalNav';
import { PortalKey } from '../../types';

interface LauncherApp {
  id: string;
  name: string;
  category: 'core' | 'clinical' | 'services' | 'operations';
  description: string;
  icon: React.ElementType;
  portalTarget?: HeaderPortalMode;
  tabTarget?: string;
  badge?: string;
  color: string;
}

const APPS: LauncherApp[] = [
  // Core Portals
  { id: 'super-admin', name: 'Super Admin Intelligence', category: 'core', description: 'Enterprise Command Center & root security', icon: ShieldCheck, portalTarget: 'super-admin', tabTarget: 'overview', badge: 'Tier-0', color: '#29243A' },
  { id: 'admin', name: 'Executive Hospital Operations', category: 'core', description: 'Bed occupancy, ward census & throughput', icon: Building2, portalTarget: 'admin', tabTarget: 'dashboard', color: '#174B78' },
  { id: 'doctor', name: 'Doctor Clinical Workspace', category: 'core', description: 'Patient consultations, EMR & e-prescriptions', icon: Stethoscope, portalTarget: 'doctor', tabTarget: 'doctor-consult', color: '#5551A6' },
  { id: 'nurse', name: 'Head Nurse Care Station', category: 'core', description: 'Shift allocations, vitals monitoring & tasks', icon: Activity, portalTarget: 'nurse', tabTarget: 'nurse-dashboard', color: '#829783' },
  { id: 'patient', name: 'Patient Personal Health Journal', category: 'core', description: 'Health passport, appointments & lab tests', icon: Heart, portalTarget: 'patient', tabTarget: 'patient-health', color: '#D58B72' },

  // Clinical Modules
  { id: 'patients', name: 'Patient Directory & EMR', category: 'clinical', description: 'Master patient index, demographics & charts', icon: Users, tabTarget: 'patients', color: '#5551A6' },
  { id: 'doctors', name: 'Doctor & Faculty Directory', category: 'clinical', description: 'Attending physicians, specialties & shifts', icon: Stethoscope, tabTarget: 'doctors', color: '#5551A6' },
  { id: 'appointments', name: 'Appointments & Scheduling', category: 'clinical', description: 'OPD slots, consultations & tele-visits', icon: Calendar, tabTarget: 'appointments', color: '#174B78' },
  { id: 'beds', name: 'Bed Management & Floorplan', category: 'clinical', description: 'Real-time bed availability & sanitization', icon: Bed, tabTarget: 'beds', color: '#829783' },
  { id: 'emr', name: 'Digital Medical Records', category: 'clinical', description: 'Clinical history, case files & 3D anatomy', icon: FileText, tabTarget: 'emr', color: '#29243A' },

  // Hospital Services
  { id: 'pharmacy', name: 'Inpatient & Retail Pharmacy', category: 'services', description: 'Formulary management & dispensing logs', icon: Pill, tabTarget: 'pharmacy', color: '#D58B72' },
  { id: 'lab', name: 'Diagnostic Laboratory', category: 'services', description: 'Pathology orders, specimen intake & results', icon: Sparkles, tabTarget: 'lab', color: '#5551A6' },
  { id: 'billing', name: 'Billing & Cashless Insurance', category: 'services', description: 'Invoices, payment receipts & TPA claims', icon: Sliders, tabTarget: 'billing', color: '#174B78' },
  { id: 'staff', name: 'Staff Management & Rosters', category: 'services', description: 'Shift scheduling, attendance & credentials', icon: Users, tabTarget: 'staff', color: '#829783' },

  // Operations & System
  { id: 'analytics', name: 'Advanced Healthcare Analytics', category: 'operations', description: 'Clinical KPIs, revenue & occupancy telemetry', icon: Activity, tabTarget: 'analytics', color: '#29243A' },
  { id: 'settings', name: 'System Settings & Security', category: 'operations', description: 'User roles, preferences & configuration', icon: Settings, tabTarget: 'settings', color: '#626B77' }
];

interface ApplicationLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (app: LauncherApp) => void;
  onOpenGateway: () => void;
  onOpenCommandCenter: () => void;
}

export const ApplicationLauncherModal: React.FC<ApplicationLauncherModalProps> = ({
  isOpen,
  onClose,
  onSelectApp,
  onOpenGateway,
  onOpenCommandCenter
}) => {
  const [search, setSearch] = useState('');

  const filteredApps = useMemo(() => {
    if (!search.trim()) return APPS;
    const q = search.toLowerCase();
    return APPS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#29243A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-4xl bg-[#F7F5EF] rounded-3xl border border-[#E7E4DC] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header Bar */}
        <div className="p-6 bg-white border-b border-[#E7E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29243A] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ☵
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#29243A] tracking-tight">
                Application &amp; Workspace Launcher
              </h2>
              <p className="text-xs text-[#626B77]">
                Quickly jump to any healthcare workspace, clinical module, or administrative service.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#626B77] absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC] text-xs text-[#29243A] focus:outline-none focus:border-[#5551A6] focus:bg-white transition"
              />
            </div>
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="p-2 rounded-xl text-[#626B77] hover:text-[#29243A] hover:bg-[#F7F5EF] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Grid Layout */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Core 5 Workspaces */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#626B77]">
                Primary Healthcare Workspaces (5 Core Portals)
              </span>
              <button
                onClick={() => { onClose(); onOpenGateway(); }}
                className="text-xs font-semibold text-[#5551A6] hover:underline flex items-center gap-1"
              >
                <span>View all 20 specialized portals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredApps.filter(a => a.category === 'core').map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => { sound.playClick(); onSelectApp(app); }}
                    className="p-4 rounded-2xl bg-white border border-[#E7E4DC] hover:border-[#5551A6] hover:shadow-md transition text-left group flex items-start gap-3.5 cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: app.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#29243A] truncate group-hover:text-[#5551A6] transition-colors">
                          {app.name}
                        </span>
                        {app.badge && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-[#29243A] ml-1">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#626B77] mt-0.5 leading-snug line-clamp-2">
                        {app.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Clinical & Operations Modules */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#626B77] block mb-3">
              Clinical Modules &amp; Hospital Operations
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredApps.filter(a => a.category !== 'core').map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => { sound.playClick(); onSelectApp(app); }}
                    className="p-3.5 rounded-2xl bg-white border border-[#E7E4DC] hover:border-[#5551A6] hover:shadow-xs transition text-left group flex items-start gap-3 cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: app.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-[#29243A] truncate block group-hover:text-[#5551A6] transition-colors">
                        {app.name}
                      </span>
                      <p className="text-[10px] text-[#626B77] mt-0.5 truncate">
                        {app.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#E7E4DC] flex flex-wrap items-center justify-between text-xs text-[#626B77] gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <kbd className="px-1.5 py-0.5 rounded bg-[#F7F5EF] border border-[#E7E4DC]">Esc</kbd> Close
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <kbd className="px-1.5 py-0.5 rounded bg-[#F7F5EF] border border-[#E7E4DC]">⌘K</kbd> Global Command
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { onClose(); onOpenCommandCenter(); }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Hospital Command Center</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
