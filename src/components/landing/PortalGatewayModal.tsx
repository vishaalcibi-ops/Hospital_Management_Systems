/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — All 20 Portals Ecosystem Gateway Modal
 * Clean, organized access hub for all 20 clinical, operational and executive workspaces.
 */

import React, { useState } from 'react';
import { PortalKey } from '../../types';
import { sound } from '../../services/audioService';
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  Activity,
  User,
  Ticket,
  FlaskConical,
  Pill,
  Camera,
  Scissors,
  CreditCard,
  Users,
  Droplet,
  Package,
  HeartHandshake,
  Award,
  Apple,
  Truck,
  Sparkles,
  Archive,
  ArrowRight,
  X,
  Search
} from 'lucide-react';

interface PortalGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPortal: (portal: PortalKey) => void;
}

interface PortalDefinition {
  key: PortalKey;
  number: number;
  title: string;
  category: 'core' | 'clinical' | 'operations';
  description: string;
  icon: React.ElementType;
  badge: string;
  color: string;
  accent: string;
}

const ALL_PORTALS: PortalDefinition[] = [
  // Core 5 Portals (Preserved 100%)
  {
    key: 'super-admin',
    number: 1,
    title: 'Super Admin Portal',
    category: 'core',
    description: 'Enterprise multi-facility command, security logs, database telemetry & system configuration.',
    icon: ShieldCheck,
    badge: 'Enterprise',
    color: 'from-slate-800 to-slate-900',
    accent: '#1E293B'
  },
  {
    key: 'doctor',
    number: 2,
    title: 'Doctor Clinical Station',
    category: 'core',
    description: 'Patient consultations, SOAP clinical notes, E-Prescriptions, lab & radiology orders, tele-chat.',
    icon: Stethoscope,
    badge: 'Clinical',
    color: 'from-blue-700 to-blue-900',
    accent: '#1D4ED8'
  },
  {
    key: 'nurse',
    number: 3,
    title: 'Head Nurse Station',
    category: 'core',
    description: 'Ward rounds, bed census, MEWS deterioration triage algorithm, MAR medication administration.',
    icon: Activity,
    badge: 'Nursing',
    color: 'from-emerald-700 to-emerald-900',
    accent: '#047857'
  },
  {
    key: 'patient',
    number: 4,
    title: 'Patient Health Portal',
    category: 'core',
    description: 'Digital Health Card, 3D anatomical telemetry, prescriptions, appointments, bills, doctor chat.',
    icon: User,
    badge: 'Self-Service',
    color: 'from-indigo-600 to-indigo-800',
    accent: '#4F46E5'
  },
  {
    key: 'admin',
    number: 5,
    title: 'Executive Admin & Wards',
    category: 'core',
    description: 'Hospital operations, inpatient ward overview, admission/discharge, bed census, staff rosters.',
    icon: Building2,
    badge: 'Operations',
    color: 'from-sky-700 to-sky-900',
    accent: '#0369A1'
  },

  // 15 Additional Specialist Portals (Phase 5)
  {
    key: 'reception',
    number: 6,
    title: 'Reception & Front Desk',
    category: 'clinical',
    description: 'Patient onboarding, walk-in registration, OPD tokens, appointment check-in, live queue management.',
    icon: Ticket,
    badge: 'Front Desk',
    color: 'from-blue-600 to-blue-800',
    accent: '#2563EB'
  },
  {
    key: 'laboratory',
    number: 7,
    title: 'Laboratory Information (LIS)',
    category: 'clinical',
    description: 'Pathology worklist, specimen barcode tracking, abnormal result alarms, pathologist verification.',
    icon: FlaskConical,
    badge: 'Diagnostics',
    color: 'from-violet-600 to-violet-800',
    accent: '#7C3AED'
  },
  {
    key: 'pharmacy',
    number: 8,
    title: 'Pharmacy & Drug Formulary',
    category: 'clinical',
    description: 'E-Prescription queue, bedside dispensing, batch expiry tracking, reorder thresholds & vendor POS.',
    icon: Pill,
    badge: 'Pharmacy',
    color: 'from-teal-600 to-teal-800',
    accent: '#0D9488'
  },
  {
    key: 'radiology',
    number: 9,
    title: 'Radiology & PACS Imaging',
    category: 'clinical',
    description: 'X-Ray, CT, MRI, Ultrasound imaging requests, PACS boundary viewer, radiologist digital sign-off.',
    icon: Camera,
    badge: 'Imaging',
    color: 'from-cyan-700 to-cyan-900',
    accent: '#0E7490'
  },
  {
    key: 'surgery',
    number: 10,
    title: 'OT & Surgical Management',
    category: 'clinical',
    description: 'Operating suite scheduling, robotic OT allocation, WHO surgical safety checklists, anaesthesia logs.',
    icon: Scissors,
    badge: 'Surgical',
    color: 'from-rose-700 to-rose-900',
    accent: '#BE123C'
  },
  {
    key: 'bloodbank',
    number: 13,
    title: 'Blood Bank & Transfusion',
    category: 'clinical',
    description: 'Blood unit barcodes, donor registry, crossmatch verification, PRBC/FFP inventory & expiry alarms.',
    icon: Droplet,
    badge: 'Transfusion',
    color: 'from-red-700 to-red-900',
    accent: '#B91C1C'
  },
  {
    key: 'dietary',
    number: 17,
    title: 'Dietary & Clinical Nutrition',
    category: 'clinical',
    description: 'Patient clinical diet plans, low-sodium/diabetic regimens, calorie targets, ward meal distribution.',
    icon: Apple,
    badge: 'Nutrition',
    color: 'from-amber-600 to-amber-800',
    accent: '#D97706'
  },

  // Operations & Governance Portals
  {
    key: 'billing',
    number: 11,
    title: 'Billing & TPA Insurance',
    category: 'operations',
    description: 'GST-ready medical invoices, cashless insurance pre-auth, claim tracking, payment settlements.',
    icon: CreditCard,
    badge: 'Finance',
    color: 'from-emerald-700 to-emerald-900',
    accent: '#047857'
  },
  {
    key: 'hr',
    number: 12,
    title: 'HR & Staff Rostering',
    category: 'operations',
    description: 'Doctor & nurse credentials, shift rostering, daily attendance ledger, biometric tracking.',
    icon: Users,
    badge: 'HR / Staff',
    color: 'from-slate-700 to-slate-900',
    accent: '#334155'
  },
  {
    key: 'procurement',
    number: 14,
    title: 'Procurement & Inventory',
    category: 'operations',
    description: 'Vendor management, purchase orders, medical equipment registry, biomedical supplies receiving.',
    icon: Package,
    badge: 'Supply Chain',
    color: 'from-stone-700 to-stone-900',
    accent: '#44403C'
  },
  {
    key: 'patient-relations',
    number: 15,
    title: 'Patient Relations & Grievances',
    category: 'operations',
    description: 'Patient feedback tracking, grievance escalation, satisfaction analytics, post-discharge follow-ups.',
    icon: HeartHandshake,
    badge: 'Experience',
    color: 'from-pink-700 to-pink-900',
    accent: '#BE185D'
  },
  {
    key: 'quality',
    number: 16,
    title: 'Quality & NABH Readiness',
    category: 'operations',
    description: 'NABH / NABL compliance chapters, clinical safety audits, incident reporting, CAPA action tracking.',
    icon: Award,
    badge: 'NABH Standards',
    color: 'from-yellow-700 to-yellow-900',
    accent: '#A16207'
  },
  {
    key: 'ambulance',
    number: 18,
    title: 'Ambulance & Emergency Dispatch',
    category: 'operations',
    description: 'Emergency 1066 call center, GPS vehicle allocation, paramedic triage, trauma center pre-notification.',
    icon: Truck,
    badge: 'Emergency',
    color: 'from-orange-700 to-orange-900',
    accent: '#C2410C'
  },
  {
    key: 'housekeeping',
    number: 19,
    title: 'Housekeeping & Facility Ops',
    category: 'operations',
    description: 'Ward hygiene turnover, terminal sterilization signoff, biomedical waste logs, room readiness.',
    icon: Sparkles,
    badge: 'Facility',
    color: 'from-teal-700 to-teal-900',
    accent: '#0F766E'
  },
  {
    key: 'mrd',
    number: 20,
    title: 'Medical Records Dept (MRD)',
    category: 'operations',
    description: 'Document indexing, electronic scanning archive, physical shelf tracking, retention & audit retrieval.',
    icon: Archive,
    badge: 'Records Archive',
    color: 'from-zinc-700 to-zinc-900',
    accent: '#3F3F46'
  }
];

export const PortalGatewayModal: React.FC<PortalGatewayModalProps> = ({
  isOpen,
  onClose,
  onSelectPortal
}) => {
  const [filter, setFilter] = useState<'all' | 'core' | 'clinical' | 'operations'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredPortals = ALL_PORTALS.filter(p => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#1A2332] flex items-center justify-center shadow-lg shadow-blue-500/20 border border-slate-700/30 shrink-0">
              <img
                src="/assets/medicore-logo.png"
                alt="MediCore Logo"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif">MediCore Hospital Portal Gateway</h3>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">20 Portals</span>
              </div>
              <p className="text-xs text-slate-500">
                Seamless role-based workspace switcher for clinical staff, patients, and administrators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portals..."
                className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
              />
            </div>
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] mr-2">Filter Scope:</span>
          {[
            { id: 'all', label: 'All 20 Portals' },
            { id: 'core', label: 'Original 5 Portals (Preserved)' },
            { id: 'clinical', label: 'Clinical & Diagnostics' },
            { id: 'operations', label: 'Operations & Quality' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setFilter(tab.id as any); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portals Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50">
          {filteredPortals.map(portal => {
            const Icon = portal.icon;
            const isCore = portal.category === 'core';
            return (
              <div
                key={portal.key}
                onClick={() => {
                  sound.playClick();
                  onSelectPortal(portal.key);
                  onClose();
                }}
                className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition group-hover:scale-105"
                      style={{ backgroundColor: portal.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isCore && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          Core
                        </span>
                      )}
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        Portal #{portal.number}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mb-1">
                    {portal.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {portal.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span className="text-[11px] font-medium text-slate-400">{portal.badge}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Security Notice: All clinical entries are cryptographically audited and recorded under HIPAA & NABH standards.</span>
          <span className="font-semibold text-blue-700">MediCore Enterprise Information System</span>
        </div>
      </div>
    </div>
  );
};
