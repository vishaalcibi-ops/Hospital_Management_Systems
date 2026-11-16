/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeMode, ManagedUser, FacilityNode, EnterpriseSecurityConfig, AuditLog } from '../../types';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { downloadCsvFile } from '../../utils/exportUtils';
import {
  ShieldCheck,
  Building2,
  Users,
  Server,
  Activity,
  Lock,
  Unlock,
  AlertTriangle,
  Download,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Radio,
  Sliders,
  IndianRupee,
  TrendingUp,
  Cpu,
  Database,
  Globe,
  HardDrive,
  KeyRound,
  UserPlus,
  LogOut,
  Stethoscope,
  Heart,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';

interface SuperAdminDashboardProps {
  theme: ThemeMode;
  onLogout?: () => void;
  onSwitchToAdminPortal?: () => void;
  onSwitchToDoctorPortal?: () => void;
  onSwitchToNursePortal?: () => void;
  onSwitchToPatientPortal?: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  theme,
  onLogout,
  onSwitchToAdminPortal,
  onSwitchToDoctorPortal,
  onSwitchToNursePortal,
  onSwitchToPatientPortal
}) => {
  const isDark = theme === 'dark';

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac' | 'audit' | 'infrastructure' | 'financials'>('overview');
  const [facilities, setFacilities] = useState<FacilityNode[]>(() => db.getFacilities());
  const [users, setUsers] = useState<ManagedUser[]>(() => db.getSystemUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => db.getAuditLogs());
  const [securityConfig, setSecurityConfig] = useState<EnterpriseSecurityConfig>(() => db.getSecurityConfig());

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setFacilities(db.getFacilities());
      setUsers(db.getSystemUsers());
      setAuditLogs(db.getAuditLogs());
      setSecurityConfig(db.getSecurityConfig());
    });
    return unsub;
  }, []);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  // Modals state
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [lockdownModalOpen, setLockdownModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'DOCTOR' | 'NURSE' | 'PHARMACIST' | 'LAB_TECH' | 'ACCOUNTANT'>('HOSPITAL_ADMIN');
  const [newUserDept, setNewUserDept] = useState('Operations & Clinical Logistics');
  const [newUserFacility, setNewUserFacility] = useState('MediCore Central Hospital (Flagship)');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const showToast = (msg: string) => {
    sound.playSuccess();
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3800);
  };

  // Calculations
  const totalNetworkBeds = facilities.reduce((sum, f) => sum + f.totalBeds, 0);
  const totalOccupiedBeds = facilities.reduce((sum, f) => sum + f.occupiedBeds, 0);
  const totalPhysicians = facilities.reduce((sum, f) => sum + f.dutyPhysicians, 0);
  const networkOccupancyRate = Math.round((totalOccupiedBeds / totalNetworkBeds) * 100);

  // Handlers
  const handleToggleUserStatus = (id: string) => {
    sound.playClick();
    db.toggleUserStatus(id);
    setUsers(db.getSystemUsers());
    setAuditLogs(db.getAuditLogs());
    showToast('User security status updated.');
  };

  const handleToggleUserMfa = (id: string) => {
    sound.playClick();
    db.toggleUserMfa(id);
    setUsers(db.getSystemUsers());
    setAuditLogs(db.getAuditLogs());
    showToast('Multi-Factor Authentication policy updated.');
  };

  const handleResetCredentials = (id: string) => {
    sound.playClick();
    db.resetUserCredentials(id);
    setAuditLogs(db.getAuditLogs());
    showToast('Temporary security ticket issued and logged in audit trail.');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    sound.playClick();
    db.addSystemUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept,
      facility: newUserFacility,
      mfaEnabled: true,
      status: 'Active'
    });

    setUsers(db.getSystemUsers());
    setAuditLogs(db.getAuditLogs());
    setNewUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`Administrative account created for ${newUserName}`);
  };

  const handleTriggerBackup = () => {
    sound.playClick();
    const time = db.triggerSystemBackup();
    setSecurityConfig(db.getSecurityConfig());
    setAuditLogs(db.getAuditLogs());
    showToast(`Cold storage encrypted backup snapshot created (${time})`);
  };

  const handleToggleLockdown = () => {
    sound.playClick();
    db.triggerEmergencyLockdown('Super Admin Executive Protocol Override');
    setSecurityConfig(db.getSecurityConfig());
    setAuditLogs(db.getAuditLogs());
    setLockdownModalOpen(false);
    showToast(securityConfig.lockdownActive ? 'Facility lockdown cleared.' : '🚨 Multi-Facility Lockdown Protocol Engaged');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    sound.playClick();
    db.triggerBroadcastAlert(broadcastTitle.trim(), broadcastMessage.trim());
    setAuditLogs(db.getAuditLogs());
    setBroadcastModalOpen(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
    showToast('STAT Broadcast transmitted to all hospital nodes');
  };

  const handleExportAuditDossier = () => {
    sound.playClick();
    const filename = `MediCore_HIPAA_Audit_Dossier_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsvFile(filename, [
      ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Module', 'IP', 'Details'],
      ...auditLogs.map(a => [a.id, a.timestamp, a.userName, a.userRole, a.action, a.module, a.ipAddress, a.details]),
    ]);
    sound.playSuccess();
    showToast('HIPAA Audit Dossier exported as CSV');
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.department.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Audit Logs
  const filteredAudits = auditLogs.filter(a => 
    a.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.module.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-teal-600 text-white shadow-2xl animate-in slide-in-from-top-4 duration-200 text-xs font-bold border border-teal-400/40">
          <CheckCircle2 className="w-4 h-4 text-teal-200" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Emergency Lockdown Notice Banner if active */}
      {securityConfig.lockdownActive && (
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-600 text-white shadow-2xl border-2 border-rose-400 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white text-rose-600 rounded-2xl animate-bounce shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-widest uppercase bg-rose-800 px-2.5 py-0.5 rounded-md">
                  FACILITY LOCKDOWN ACTIVE
                </span>
                <span className="font-mono font-bold text-xs">ROOT SECURITY ENGAGED</span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-0.5">
                All external facility perimeters locked • Access restricted to Super Admin & Trauma Critical Response
              </h3>
            </div>
          </div>
          <button
            onClick={handleToggleLockdown}
            className="px-5 py-2.5 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs shadow-md transition-all cursor-pointer"
          >
            Disengage Lockdown Protocol ✓
          </button>
        </div>
      )}

      {/* ============================================================
          EDITORIAL HERO: ENTERPRISE INTELLIGENCE WELCOME BANNER
          ============================================================ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E4DC] shadow-xs text-[#29243A] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E7E4DC]/80">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#29243A] text-white">
                Tier-0 Super Admin
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF3ED] text-[#829783] border border-[#829783]/30">
                ● 4 Campus Nodes Synchronized
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0EC] text-[#D58B72] border border-[#D58B72]/30">
                Cryptographic Audit Log Active
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#29243A] tracking-tight leading-tight">
              Enterprise Health Governance &amp; Multi-Node Telemetry
            </h1>

            <p className="text-xs sm:text-sm text-[#626B77] leading-relaxed">
              Dr. Eleanor Vance, MD, CISSP • Continuous operational oversight across 4 tertiary hospital campuses, 1,280 active inpatient beds, high-availability PostgreSQL clusters, and real-time HIPAA compliance monitoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setNewUserModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#5551A6] hover:bg-[#433F8C] text-white flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Provision Admin</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setBroadcastModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D58B72] hover:bg-[#C27961] text-white flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>STAT Broadcast</span>
            </button>

            <button
              onClick={handleTriggerBackup}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F7F5EF] hover:bg-[#E7E4DC] text-[#29243A] border border-[#E7E4DC] flex items-center gap-2 transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#626B77]" />
              <span>Backup Snapshot</span>
            </button>
          </div>
        </div>

        {/* Micro Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-[10px] text-[#626B77] font-bold uppercase tracking-wider block">Network Census</span>
            <strong className="text-base font-serif font-black text-[#29243A]">
              {totalOccupiedBeds} <span className="text-xs text-[#626B77] font-sans font-normal">/ {totalNetworkBeds} Beds ({networkOccupancyRate}%)</span>
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-[#626B77] font-bold uppercase tracking-wider block">Attending Faculty</span>
            <strong className="text-base font-serif font-black text-[#5551A6]">
              {totalPhysicians} Physicians <span className="text-xs text-[#829783] font-sans font-normal">On Duty</span>
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-[#626B77] font-bold uppercase tracking-wider block">Quarterly Gross</span>
            <strong className="text-base font-serif font-black text-[#29243A]">
              ₹48.24 Cr <span className="text-xs text-[#829783] font-sans font-normal">+14.8% YoY</span>
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-[#626B77] font-bold uppercase tracking-wider block">API Cluster Health</span>
            <strong className="text-base font-serif font-black text-[#829783]">
              99.98% Uptime <span className="text-xs text-[#626B77] font-sans font-normal">18ms avg</span>
            </strong>
          </div>
        </div>
      </div>

      {/* ================= WORKSPACE SUB-TABS (MINIMAL EDITORIAL) ================= */}
      <div className="flex items-center gap-2 border-b border-[#E7E4DC] pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Enterprise Intelligence Canvas', icon: Building2 },
          { id: 'rbac', label: 'Role-Based Access (RBAC) Governance', icon: Users },
          { id: 'audit', label: 'HIPAA & Compliance Audit Trail', icon: FileText },
          { id: 'infrastructure', label: 'API & Infrastructure Telemetry', icon: Server },
          { id: 'financials', label: 'Financial Velocity & Intelligence', icon: IndianRupee },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#29243A] text-white shadow-xs'
                  : 'bg-white text-[#626B77] hover:text-[#29243A] hover:bg-[#FAF9F5] border border-[#E7E4DC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: ENTERPRISE INTELLIGENCE CANVAS (ASYMMETRICAL LAYOUT) ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* ASYMMETRIC ROW 1: Dominant Hospital Network Overview (8 cols) + Financial Velocity (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Dominant Hospital Network Overview */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E4DC]/80 gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5551A6] block">
                    Campus Telemetry
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#29243A] tracking-tight">
                    Multi-Facility Connected Hospital Nodes
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#829783] font-bold flex items-center gap-1.5 bg-[#EDF3ED] px-2.5 py-1 rounded-full border border-[#829783]/30">
                    <span className="w-2 h-2 rounded-full bg-[#829783] animate-pulse" />
                    <span>All 4 Campuses Live &amp; Synchronized</span>
                  </span>
                </div>
              </div>

              {/* 4 Connected Facility Nodes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {facilities.map(fac => {
                  const occRate = Math.round((fac.occupiedBeds / fac.totalBeds) * 100);
                  const icuRate = Math.round((fac.icusOccupied / fac.icusTotal) * 100);

                  return (
                    <div
                      key={fac.id}
                      className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E7E4DC] hover:border-[#5551A6] transition shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#29243A] leading-tight">{fac.name}</h4>
                          <p className="text-[11px] text-[#626B77] mt-0.5">{fac.city} • {fac.type}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${
                          fac.status === 'Optimal'
                            ? 'bg-[#EDF3ED] text-[#829783] border border-[#829783]/30'
                            : 'bg-[#FAF0EC] text-[#D58B72] border border-[#D58B72]/30'
                        }`}>
                          {fac.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#626B77]">Inpatient Bed Census:</span>
                            <strong className="text-[#29243A]">{fac.occupiedBeds} / {fac.totalBeds} ({occRate}%)</strong>
                          </div>
                          <div className="w-full bg-[#E7E4DC] h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${occRate}%` }} className={`h-full rounded-full ${occRate > 88 ? 'bg-[#D58B72]' : 'bg-[#5551A6]'}`} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-[#626B77]">ICU Capacity: <strong className="text-[#29243A]">{fac.icusOccupied}/{fac.icusTotal} ({icuRate}%)</strong></span>
                          <span className="text-[#626B77]">Faculty: <strong className="text-[#5551A6]">{fac.dutyPhysicians} Doctors</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E7E4DC]/70 text-[10px] text-[#626B77]">
                        <span>Director: <strong className="text-[#29243A]">{fac.director}</strong></span>
                        <button
                          onClick={() => showToast(`Synchronized with ${fac.name} telemetry node.`)}
                          className="font-bold text-[#5551A6] hover:underline"
                        >
                          Node Status →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Cols: Executive Financial Velocity & Macro Intelligence */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-[#E7E4DC]/80">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D58B72] block">
                  Executive Intelligence
                </span>
                <h3 className="font-serif text-lg font-bold text-[#29243A]">
                  Financial Velocity &amp; Cashflow
                </h3>
              </div>

              {/* Revenue Big Number & Sparkline */}
              <div className="p-4 rounded-2xl bg-[#FAF0EC] border border-[#D58B72]/20 space-y-2">
                <span className="text-xs text-[#626B77] font-semibold">Q1 Gross Hospital Revenue</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-black text-[#29243A]">₹48.24 Cr</span>
                  <span className="text-xs font-bold text-[#829783] bg-[#EDF3ED] px-1.5 py-0.5 rounded">+14.8% YoY</span>
                </div>
                {/* SVG Revenue Velocity Wave */}
                <div className="pt-2">
                  <svg className="w-full h-12 stroke-[#D58B72] fill-none" viewBox="0 0 200 40">
                    <path d="M 0,35 Q 30,10 60,25 T 120,15 T 170,28 T 200,8" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <div className="flex justify-between text-[10px] text-[#626B77] mt-1 font-mono">
                    <span>Oct (₹14.8 Cr)</span>
                    <span>Nov (₹16.1 Cr)</span>
                    <span>Dec (₹17.34 Cr)</span>
                  </div>
                </div>
              </div>

              {/* Macro Indicators */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#5551A6]" />
                    <span className="font-bold text-[#29243A]">Total Patient Census</span>
                  </div>
                  <strong className="font-mono text-sm text-[#29243A]">{totalOccupiedBeds} Beds ({networkOccupancyRate}%)</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#829783]" />
                    <span className="font-bold text-[#29243A]">Attending Physicians</span>
                  </div>
                  <strong className="font-mono text-sm text-[#829783]">{totalPhysicians} On Duty</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#5551A6]" />
                    <span className="font-bold text-[#29243A]">TPA Cashless Clearance</span>
                  </div>
                  <strong className="font-mono text-sm text-[#5551A6]">92.4% Approved</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ASYMMETRIC ROW 2: Bed Occupancy Heatmap (7 cols) + System Health & Telemetry (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Multi-Floor Bed Occupancy Heatmap */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E7E4DC]/80 gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#829783] block">
                    Spatial Intelligence
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#29243A]">
                    Multi-Floor Bed Occupancy Heatmap
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-[#29243A]"><span className="w-2 h-2 rounded bg-[#29243A]" /> Occupied</span>
                  <span className="flex items-center gap-1 text-[#829783]"><span className="w-2 h-2 rounded bg-[#829783]" /> Available</span>
                  <span className="flex items-center gap-1 text-[#D58B72]"><span className="w-2 h-2 rounded bg-[#D58B72]" /> Cleaning</span>
                  <span className="flex items-center gap-1 text-[#5551A6]"><span className="w-2 h-2 rounded bg-[#5551A6]" /> ICU/STAT</span>
                </div>
              </div>

              {/* Floor by floor heat grid */}
              <div className="space-y-3 pt-1">
                {[
                  { floor: 'Floor 4 • General Medicine', total: 48, occupied: 38, available: 6, cleaning: 4, icu: 0 },
                  { floor: 'Floor 3 • Oncology & Bone Marrow', total: 36, occupied: 30, available: 4, cleaning: 2, icu: 0 },
                  { floor: 'Floor 2 • Surgical Step-Down', total: 28, occupied: 22, available: 3, cleaning: 3, icu: 0 },
                  { floor: 'Floor 1 • Intensive Care (ICU & CCU)', total: 20, occupied: 16, available: 1, cleaning: 1, icu: 2 },
                ].map((fl, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E7E4DC] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-[#29243A]">
                      <span>{fl.floor}</span>
                      <span className="text-[11px] text-[#626B77]">{fl.occupied} Occupied / {fl.total} Total</span>
                    </div>

                    {/* Room Block Heatmap Grid */}
                    <div className="grid grid-cols-12 gap-1.5 pt-1">
                      {[...Array(fl.total)].map((_, bIdx) => {
                        let color = 'bg-[#29243A]'; // occupied
                        if (bIdx >= fl.occupied && bIdx < fl.occupied + fl.available) color = 'bg-[#829783]';
                        else if (bIdx >= fl.occupied + fl.available && bIdx < fl.occupied + fl.available + fl.cleaning) color = 'bg-[#D58B72]';
                        else if (bIdx >= fl.total - fl.icu) color = 'bg-[#5551A6]';

                        return (
                          <div
                            key={bIdx}
                            className={`h-4 rounded-md ${color} opacity-90 hover:opacity-100 hover:scale-110 transition-transform cursor-pointer`}
                            title={`Bed ${fl.floor.slice(0, 7)} #${bIdx + 1}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: System Health & Infrastructure Monitoring */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#E7E4DC]/80">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5551A6] block">
                  Infrastructure Telemetry
                </span>
                <h3 className="font-serif text-lg font-bold text-[#29243A]">
                  Core Database &amp; API Health
                </h3>
              </div>

              {/* Live Service Matrix */}
              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'PostgreSQL 16 Cluster', port: 'Port 5432', status: 'Optimal', ping: '4ms latency', color: 'text-[#829783]' },
                  { name: 'MySQL Master-Replica', port: 'Port 3306', status: 'Synchronized', ping: '8ms sync', color: 'text-[#829783]' },
                  { name: 'Redis In-Memory Session Cache', port: 'Port 6379', status: '99.8% hit rate', ping: '0.8ms', color: 'text-[#829783]' },
                  { name: 'FHIR R4 Interoperability API', port: 'Endpoint /fhir', status: 'ABDM Active', ping: '18ms', color: 'text-[#5551A6]' },
                  { name: 'Node.js Express REST Backend', port: 'Port 5000', status: 'Listening', ping: '200 OK', color: 'text-[#829783]' },
                ].map((srv, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC] flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-[#29243A] block">{srv.name}</strong>
                      <span className="text-[10px] text-[#626B77]">{srv.port} • {srv.ping}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-[#E7E4DC] ${srv.color}`}>
                      ● {srv.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hardware Telemetry Meters */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC]">
                  <span className="text-[10px] text-[#626B77] block">CPU Load</span>
                  <strong className="font-mono text-sm text-[#29243A]">18.4%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC]">
                  <span className="text-[10px] text-[#626B77] block">RAM Usage</span>
                  <strong className="font-mono text-sm text-[#5551A6]">4.2 / 32 GB</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E7E4DC]">
                  <span className="text-[10px] text-[#626B77] block">Disk IOPS</span>
                  <strong className="font-mono text-sm text-[#829783]">Optimal</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ASYMMETRIC ROW 3: Security Event Timeline (6 cols) + RBAC Quick Governance (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Cols: Security Event Timeline & HIPAA Audit Log */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DC]/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D58B72] block">
                    Security Governance
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#29243A]">
                    Recent Administrative &amp; HIPAA Timeline
                  </h3>
                </div>
                <button
                  onClick={handleExportAuditDossier}
                  className="px-3 py-1.5 rounded-xl bg-[#F7F5EF] hover:bg-[#E7E4DC] text-[#29243A] font-bold text-xs border border-[#E7E4DC] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Event Timeline List */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
                {auditLogs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E7E4DC] flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E7E4DC] text-[#5551A6] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[#29243A] truncate">{log.action}</strong>
                        <span className="text-[10px] text-[#626B77] shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#626B77] mt-0.5 leading-snug">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-[#626B77]">
                        <span>User: <strong className="text-[#29243A]">{log.userName}</strong></span>
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 6 Cols: Role-Based Access Control (RBAC) Quick Governance */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DC]/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5551A6] block">
                    Access Clearance
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#29243A]">
                    Administrative Credentials &amp; RBAC
                  </h3>
                </div>
                <button
                  onClick={() => { sound.playClick(); setNewUserModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl bg-[#5551A6] hover:bg-[#433F8C] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Provision</span>
                </button>
              </div>

              {/* User Governance Table */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {users.slice(0, 6).map((usr) => (
                  <div
                    key={usr.id}
                    className="p-3 rounded-2xl bg-[#F7F5EF] border border-[#E7E4DC] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E7E4DC] text-[#29243A] font-serif font-black flex items-center justify-center shrink-0">
                        {usr.name[0]}
                      </div>
                      <div className="truncate">
                        <strong className="text-xs font-bold text-[#29243A] block truncate">{usr.name}</strong>
                        <span className="text-[10px] text-[#626B77] block truncate">{usr.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#E7E4DC] text-[#5551A6]">
                        {usr.role.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={() => handleToggleUserStatus(usr.id)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded cursor-pointer ${
                          usr.status === 'Active'
                            ? 'bg-[#EDF3ED] text-[#829783] hover:bg-rose-100 hover:text-rose-700'
                            : 'bg-rose-100 text-rose-700 hover:bg-[#EDF3ED] hover:text-[#829783]'
                        }`}
                      >
                        {usr.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RBAC & USER GOVERNANCE ================= */}
      {activeTab === 'rbac' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Enterprise Role-Based Access Control (RBAC) & Identity
              </h3>
              <p className="text-xs text-slate-400">
                Grant, review, or suspend security clearance tiers across all hospital personnel
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user, email, department..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="LAB_TECH">Lab Technologist</option>
                <option value="ACCOUNTANT">Accountant</option>
              </select>

              <button
                onClick={() => setNewUserModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          <div className={`rounded-3xl border overflow-hidden ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDark ? 'border-slate-800 text-slate-400 bg-slate-800/40' : 'border-slate-100 text-slate-500 bg-slate-50'
                  }`}>
                    <th className="p-4">User Name & Identity</th>
                    <th className="p-4">Security Role</th>
                    <th className="p-4">Department & Facility</th>
                    <th className="p-4">MFA Policy</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : u.role === 'HOSPITAL_ADMIN'
                              ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
                              : u.role === 'DOCTOR'
                                ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30'
                                : 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <div className="font-semibold">{u.department}</div>
                        <div className="text-[10px] text-slate-400">{u.facility}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserMfa(u.id)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                            u.mfaEnabled
                              ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                          }`}
                        >
                          {u.mfaEnabled ? '✓ 2FA Enforced' : '✕ 2FA Disabled'}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleResetCredentials(u.id)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Generate new temporary security token"
                        >
                          Rotate Key
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                            u.status === 'Active'
                              ? 'border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: HIPAA COMPLIANCE & AUDIT TRAIL ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Immutable HIPAA Security Rule (§ 164.312) Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographically tracked clinical access, role switches, and emergency overrides
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter audit events..."
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <button
                onClick={handleExportAuditDossier}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier (CSV)</span>
              </button>
            </div>
          </div>

          <div className={`rounded-3xl border overflow-hidden ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDark ? 'border-slate-800 text-slate-400 bg-slate-800/40' : 'border-slate-100 text-slate-500 bg-slate-50'
                  }`}>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Admin User / Role</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Domain / Module</th>
                    <th className="p-4">Audit Details & Event Log</th>
                    <th className="p-4">Source IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {filteredAudits.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-4 font-sans font-bold text-slate-900 dark:text-white">
                        <div>{log.userName}</div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-normal">{log.userRole}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded font-black text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-sans text-teal-600 dark:text-teal-400 font-semibold">{log.module}</td>
                      <td className="p-4 font-sans text-slate-600 dark:text-slate-300 max-w-md">{log.details}</td>
                      <td className="p-4 text-slate-400">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: API & INFRASTRUCTURE TELEMETRY ================= */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-5 rounded-3xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Express REST Backend</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  PORT 5000 ONLINE
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Endpoint:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">http://localhost:5000/api</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Latency:</span>
                  <strong className="text-emerald-500">18 ms</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HTTP Success Rate:</span>
                  <strong className="text-slate-900 dark:text-white">99.98%</strong>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-3xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Database & Storage Engine</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  HEALTHY
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Persistence Engine:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">LocalStorage + REST Sync</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Encryption Standard:</span>
                  <strong className="text-slate-700 dark:text-slate-300">{securityConfig.encryptionStandard.split('/')[0]}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Cold Snapshot:</span>
                  <strong className="text-slate-700 dark:text-slate-300">{securityConfig.lastBackupTime}</strong>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-3xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Emergency Protocol Controls</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  ROOT CLEARANCE
                </span>
              </div>
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => setLockdownModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{securityConfig.lockdownActive ? 'Disengage Facility Lockdown' : 'Emergency Facility Lockdown'}</span>
                </button>
                <button
                  onClick={handleTriggerBackup}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Trigger Cold Vault Snapshot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: FINANCIALS & MACRO ANALYTICS ================= */}
      {activeTab === 'financials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payer Mix Breakdown</h4>
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Commercial Insurance (Aetna, BlueCross)</span>
                    <strong className="text-teal-500">46% (₹6.8 Cr)</strong>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full w-[46%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Medicare / Medicaid CMS</span>
                    <strong className="text-slate-700 dark:text-slate-300">42% (₹6.2 Cr)</strong>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 dark:bg-slate-400 rounded-full w-[42%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Private & Self-Pay</span>
                    <strong className="text-slate-500 dark:text-slate-400">12% (₹1.8 Cr)</strong>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Operating EBITDA Margin</h4>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-emerald-500">24.8%</span>
                <span className="text-xs text-slate-400 font-bold">Health System Margin</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Operating expenses tracked at ₹11.1 Cr with clinical pharmaceutical procurement optimized via central hospital formulary.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hospital Revenue Cycle</h4>
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Clean Claim Acceptance:</span>
                  <strong className="text-emerald-500">97.2%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Days in Accounts Receivable (A/R):</span>
                  <strong className="text-slate-900 dark:text-white">28.4 Days</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Denial Appeal Recovery:</span>
                  <strong className="text-teal-600">84.1%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROVISION NEW ADMIN USER ================= */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base">Provision New Administrative User</h3>
              </div>
              <button onClick={() => setNewUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Wright, MD"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Hospital Email / Login ID</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. arthur.w@medicore.org"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Security Role</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="DOCTOR">Attending Doctor</option>
                    <option value="NURSE">Head Charge Nurse</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="LAB_TECH">Lab Technologist</option>
                    <option value="ACCOUNTANT">Accountant</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Assigned Department</label>
                  <input
                    type="text"
                    required
                    value={newUserDept}
                    onChange={e => setNewUserDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Primary Facility Node</label>
                <select
                  value={newUserFacility}
                  onChange={e => setNewUserFacility(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                  <option value="MediCore Enterprise Health Network (All Facilities)">Enterprise Health Network (All Facilities)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]">
                ℹ️  <strong>HIPAA Security Notice:</strong> Account will be provisioned with mandatory 2FA enforcement and logged to the master audit dossier.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Provision User ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EMERGENCY LOCKDOWN CONFIRMATION ================= */}
      {lockdownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white border-2 border-rose-500">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
              <h3 className="font-black text-lg">
                {securityConfig.lockdownActive ? 'Disengage Facility Lockdown?' : 'Engage Emergency Multi-Facility Lockdown?'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {securityConfig.lockdownActive
                ? 'Disengaging lockdown will re-open standard perimeter badge readers and restore standard patient visitation.'
                : 'Engaging lockdown will immediately seal electronic facility doors, restrict network traffic, and transmit emergency notifications to trauma teams.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setLockdownModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleLockdown}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Confirm Protocol Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STAT EMERGENCY BROADCAST ================= */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white border border-rose-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Radio className="w-5 h-5 animate-pulse" />
                <h3 className="font-extrabold text-base">STAT Enterprise Broadcast</h3>
              </div>
              <button onClick={() => setBroadcastModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Broadcast Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surge Triage Protocol Activated"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Clinical Directive Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. All available surgical teams report to ICU Pavilion immediately."
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Broadcast to All Terminals 📡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
