/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 10: Operation Theatre & Surgery Management
 * Visual Style: High-focus clinical surgical suite with OT room telemetry and WHO safety checklist.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { SurgeryCase } from '../../types';
import {
  Scissors,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  User,
  Activity,
  ShieldCheck,
  Search,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';

interface SurgeryPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const SurgeryPortal: React.FC<SurgeryPortalProps> = ({
  onLogout
}) => {
  const [cases, setCases] = useState<SurgeryCase[]>(db.getSurgeryCases());
  const [selectedCase, setSelectedCase] = useState<SurgeryCase>(cases[0] || ({} as any));
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [search, setSearch] = useState('');

  // New Surgery Case State
  const [patientName, setPatientName] = useState('');
  const [procedureName, setProcedureName] = useState('');
  const [department, setDepartment] = useState('Orthopaedics');
  const [otRoom, setOtRoom] = useState('OT-1 (Robotic Suite DaVinci)');
  const [leadSurgeon, setLeadSurgeon] = useState('Dr. Tatiana M., MD');
  const [anaesthetist, setAnaesthetist] = useState('Dr. Ramesh Raman, MD');
  const [scheduledTime, setScheduledTime] = useState('08:30 AM');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [anaesthesiaType, setAnaesthesiaType] = useState<SurgeryCase['anaesthesiaType']>('General');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      const updated = db.getSurgeryCases();
      setCases(updated);
      if (selectedCase) {
        const found = updated.find(c => c.id === selectedCase.id);
        if (found) setSelectedCase(found);
      }
    });
    return unsub;
  }, [selectedCase?.id]);

  const handleCreateSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !procedureName.trim()) return;

    sound.playSuccess();
    const newCase = db.addSurgeryCase({
      patientId: `pat-${Date.now()}`,
      patientName: patientName.trim(),
      procedureName: procedureName.trim(),
      department,
      otRoom,
      leadSurgeon,
      anaesthetist,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime,
      durationMinutes: Number(durationMinutes) || 60,
      status: 'Pre-Op',
      preOpCleared: true,
      safetyChecklistDone: false,
      anaesthesiaType,
      notes: 'Pre-op workup complete.'
    });

    setPatientName('');
    setProcedureName('');
    setIsScheduleOpen(false);
    setSelectedCase(newCase);
  };

  const handleStatusChange = (id: string, status: SurgeryCase['status']) => {
    sound.playClick();
    db.updateSurgeryStatus(id, status);
  };

  const handleToggleChecklist = (id: string) => {
    sound.playClick();
    db.toggleSurgicalSafetyChecklist(id);
  };

  const filteredCases = cases.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.procedureName.toLowerCase().includes(search.toLowerCase()) ||
    c.otRoom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/20">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Operation Theatre & Surgical Station</h2>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">Portal 10</span>
            </div>
            <p className="text-xs text-[#626B77]">14 Modular Suites · DaVinci Xi Robotic & Hybrid Cath Lab Scheduling</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsScheduleOpen(true); }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Surgical Case</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* KPI OT Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Active In Theatre</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">
              {cases.filter(c => c.status === 'In Theatre').length} Cases
            </div>
            <p className="text-[11px] text-slate-400 mt-1">OT Suites 1, 3 operating</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Pre-Op Ready Today</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {cases.filter(c => c.status === 'Pre-Op').length} Cases
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pre-anaesthesia cleared</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Procedures Completed</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {cases.filter(c => c.status === 'Completed').length} Cases
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Post-op PACU recovery</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">WHO Safety Adherence</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">100%</div>
            <p className="text-[11px] text-slate-400 mt-1">3-Stage Verification Locked</p>
          </div>
        </div>

        {/* Surgical List & Details Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Day's Operating Theatre Schedule</h3>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter cases..."
                  className="w-full pl-8 pr-2 py-1.5 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
              {filteredCases.map(sc => {
                const isSelected = selectedCase?.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => { sound.playClick(); setSelectedCase(sc); }}
                    className={`p-4 cursor-pointer transition flex items-start justify-between gap-4 ${
                      isSelected ? 'bg-rose-50/70 border-l-4 border-rose-600' : 'hover:bg-[#F7F5EF]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-700">{sc.caseNumber}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{sc.otRoom}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#29243A]">{sc.procedureName}</h4>
                      <p className="text-[11px] text-[#626B77]">Patient: <strong className="text-[#29243A]">{sc.patientName}</strong> · Lead: {sc.leadSurgeon}</p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sc.status === 'In Theatre'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : sc.status === 'Pre-Op'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sc.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{sc.scheduledTime} ({sc.durationMinutes}m)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Case Detail & WHO Surgical Safety Checklist (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E7E4DC] shadow-sm p-6 space-y-5">
            {selectedCase ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                    Surgical Case Detail #{selectedCase.caseNumber}
                  </span>
                  <h3 className="font-serif font-bold text-base font-bold text-[#29243A] mt-1">{selectedCase.procedureName}</h3>
                  <p className="text-xs text-[#626B77]">Patient: {selectedCase.patientName} ({selectedCase.department})</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#F7F5EF] p-3 rounded-xl border border-[#E7E4DC]/80">
                  <div>
                    <span className="text-slate-400 block">Lead Surgeon</span>
                    <strong className="text-[#29243A]">{selectedCase.leadSurgeon}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Anaesthetist</span>
                    <strong className="text-[#29243A]">{selectedCase.anaesthetist}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Anaesthesia Type</span>
                    <strong className="text-[#29243A]">{selectedCase.anaesthesiaType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">OT Suite Room</span>
                    <strong className="text-rose-700">{selectedCase.otRoom}</strong>
                  </div>
                </div>

                {/* WHO Surgical Safety Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#29243A] uppercase tracking-wide flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>WHO Surgical Safety Checklist</span>
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedCase.safetyChecklistDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedCase.safetyChecklistDone ? 'Verified ✓' : 'Pending Verification'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 bg-[#F7F5EF] p-3 rounded-xl border border-[#E7E4DC]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Stage 1: Sign In (Patient Identity & Site Marked)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Stage 2: Time Out (Antibiotic Prophylaxis & Team Briefing)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Stage 3: Sign Out (Instrument & Sponge Count Reconciled)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleChecklist(selectedCase.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#29243A] rounded-xl text-xs font-semibold transition"
                  >
                    Toggle WHO Checklist Verification: {selectedCase.safetyChecklistDone ? 'Revoke' : 'Confirm Sign-Off'}
                  </button>
                </div>

                {/* Procedure Workflow Progress Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-semibold text-[#626B77] block">Transition Operating Stage:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedCase.id, 'Pre-Op')}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        selectedCase.status === 'Pre-Op' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Pre-Op
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedCase.id, 'In Theatre')}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        selectedCase.status === 'In Theatre' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      In Theatre
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedCase.id, 'Completed')}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        selectedCase.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">Select a surgical case from the schedule</div>
            )}
          </div>
        </div>
      </main>

      {/* Schedule Surgery Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">Book Operating Theatre Suite</h4>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSurgery} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Patient Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Surgical Procedure Name *</label>
                <input
                  type="text"
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  placeholder="e.g. Robotic Assisted Meniscal Repair"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">OT Suite</label>
                  <select
                    value={otRoom}
                    onChange={(e) => setOtRoom(e.target.value)}
                    className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  >
                    <option value="OT-1 (Robotic Suite DaVinci)">OT-1 (Robotic Suite DaVinci)</option>
                    <option value="OT-2 (General Surgery)">OT-2 (General Surgery)</option>
                    <option value="OT-3 (Cardiac Hybrid Theatre)">OT-3 (Cardiac Hybrid Theatre)</option>
                    <option value="OT-4 (Endoscopy Suite)">OT-4 (Endoscopy Suite)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Anaesthesia Type</label>
                  <select
                    value={anaesthesiaType}
                    onChange={(e) => setAnaesthesiaType(e.target.value as any)}
                    className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  >
                    <option value="General">General</option>
                    <option value="Spinal">Spinal</option>
                    <option value="Epidural">Epidural</option>
                    <option value="Local">Local</option>
                    <option value="Sedation">Sedation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Lead Surgeon</label>
                  <input
                    type="text"
                    value={leadSurgeon}
                    onChange={(e) => setLeadSurgeon(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Anaesthetist</label>
                  <input
                    type="text"
                    value={anaesthetist}
                    onChange={(e) => setAnaesthetist(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 transition"
                >
                  Confirm OT Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
