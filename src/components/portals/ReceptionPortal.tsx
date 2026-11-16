/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 6: Reception & Front Desk Workspace
 * Visual Style: Clean appointment and queue-focused workspace in daylight blue & white.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { ReceptionToken } from '../../types';
import { PatientRegistrationModal } from '../auth/PatientRegistrationModal';
import {
  Ticket,
  UserPlus,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Phone,
  Building2,
  Stethoscope,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';

interface ReceptionPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const ReceptionPortal: React.FC<ReceptionPortalProps> = ({
  onLogout,
  onSwitchPortal
}) => {
  const [tokens, setTokens] = useState<ReceptionToken[]>(db.getReceptionTokens());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Waiting' | 'In Consultation' | 'Completed'>('All');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPatientRegistrationOpen, setIsPatientRegistrationOpen] = useState(false);

  // New registration form state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [department, setDepartment] = useState('Cardiology');
  const [doctorName, setDoctorName] = useState('Dr. Dulov G., MD');
  const [visitType, setVisitType] = useState<ReceptionToken['visitType']>('Walk-in');
  const [priority, setPriority] = useState<ReceptionToken['priority']>('Normal');
  const [roomNumber, setRoomNumber] = useState('OPD Suite 108');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setTokens(db.getReceptionTokens());
    });
    return unsub;
  }, []);

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    sound.playSuccess();
    const tokenNum = `OPD-${department.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;
    db.addReceptionToken({
      tokenNumber: tokenNum,
      patientId: `pat-${Date.now()}`,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      department,
      doctorId: 'doc-2',
      doctorName,
      visitType,
      status: 'Waiting',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMins: 15,
      priority,
      roomNumber
    });

    setPatientName('');
    setPatientPhone('');
    setIsRegisterOpen(false);
  };

  const handleStatusChange = (id: string, status: ReceptionToken['status']) => {
    sound.playClick();
    db.updateReceptionTokenStatus(id, status);
  };

  const filteredTokens = tokens.filter(t => {
    const matchesSearch =
      t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const waitingCount = tokens.filter(t => t.status === 'Waiting').length;
  const inConsultCount = tokens.filter(t => t.status === 'In Consultation').length;
  const completedCount = tokens.filter(t => t.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col">
      {/* Portal Top Navigation */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Reception & Front Desk Station</h2>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Portal 6</span>
            </div>
            <p className="text-xs text-[#626B77]">OPD Token Dispatch & Inpatient Admission Gate</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsPatientRegistrationOpen(true); }}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register Patient (UHID & Activation)</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setIsRegisterOpen(true); }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Walk-in Token</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Active Waiting Queue</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{waitingCount} Patients</div>
            <p className="text-[11px] text-slate-400 mt-1">Avg wait time: ~14 mins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">In Active Consultation</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">{inConsultCount} Patients</div>
            <p className="text-[11px] text-slate-400 mt-1">Across 8 OPD Suites</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Completed Today</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{completedCount} Patients</div>
            <p className="text-[11px] text-slate-400 mt-1">100% electronic billing linked</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Total Registered</span>
            <div className="text-2xl font-bold text-[#29243A] mt-1">{tokens.length} Tokens</div>
            <p className="text-[11px] text-slate-400 mt-1">ABDM ABHA Enabled</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E4DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, token code or department..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-xl text-xs text-[#29243A] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold mr-1">Status:</span>
            {(['All', 'Waiting', 'In Consultation', 'Completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => { sound.playClick(); setStatusFilter(st); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tokens Data Table */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F7F5EF]/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Live OPD Queue Tokens</h3>
            <span className="text-xs text-[#626B77]">{filteredTokens.length} records found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#626B77] uppercase tracking-wider font-semibold border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name & Contact</th>
                  <th className="py-3 px-4">Department & Doctor</th>
                  <th className="py-3 px-4">Room Suite</th>
                  <th className="py-3 px-4">Priority / Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTokens.map(tok => {
                  return (
                    <tr key={tok.id} className="hover:bg-[#F7F5EF]/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {tok.tokenNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#29243A]">{tok.patientName}</div>
                        <div className="text-[11px] text-slate-400">{tok.patientPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#29243A]">{tok.department}</div>
                        <div className="text-[11px] text-blue-600 font-semibold">{tok.doctorName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#29243A]">
                        {tok.roomNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tok.priority === 'Emergency'
                            ? 'bg-rose-100 text-rose-700'
                            : tok.priority === 'Senior Citizen'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tok.priority} · {tok.visitType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tok.status === 'Waiting'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : tok.status === 'In Consultation'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {tok.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {tok.status === 'Waiting' && (
                          <button
                            onClick={() => handleStatusChange(tok.id, 'In Consultation')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                          >
                            Call Patient
                          </button>
                        )}
                        {tok.status === 'In Consultation' && (
                          <button
                            onClick={() => handleStatusChange(tok.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                          >
                            Mark Done
                          </button>
                        )}
                        {tok.status === 'Completed' && (
                          <span className="text-[11px] text-emerald-600 font-semibold">Done ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Walk-in Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">Generate Front-Desk OPD Token</h4>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateToken} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Patient Full Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Mobile Phone Number *</label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="e.g. +91 98450 12345"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopaedics">Orthopaedics</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Pediatric">Pediatric</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md shadow-blue-500/20"
                >
                  Issue OPD Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPatientRegistrationOpen && (
        <PatientRegistrationModal
          isOpen={isPatientRegistrationOpen}
          onClose={() => setIsPatientRegistrationOpen(false)}
          onPatientRegistered={(patient) => {
            sound.playSuccess();
          }}
        />
      )}
    </div>
  );
};
