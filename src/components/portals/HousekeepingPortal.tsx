/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 19: Housekeeping & Environmental Services
 * Facility hygiene, terminal sterilization signoffs, and Biomedical Waste (BMW 2016) log.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { HousekeepingFacilityTask } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  Flame,
  CheckSquare,
  RefreshCw
} from 'lucide-react';

interface HousekeepingPortalProps {
  onLogout: () => void;
  onSwitchPortal?: (portal: any) => void;
}

export const HousekeepingPortal: React.FC<HousekeepingPortalProps> = ({
  onLogout
}) => {
  const [tasks, setTasks] = useState<HousekeepingFacilityTask[]>(db.getHousekeepingTasks());
  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    facilityArea: 'OT-1 (Main Cardiac Suite)',
    taskType: 'Terminal Sterilization' as HousekeepingFacilityTask['taskType'],
    priority: 'Immediate Stat' as HousekeepingFacilityTask['priority'],
    assignedStaff: 'Ramesh Kumar (Team Lead)',
    status: 'In Progress' as HousekeepingFacilityTask['status']
  });

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setTasks(db.getHousekeepingTasks());
    });
    return unsub;
  }, []);

  const handleUpdateStatus = (id: string, status: HousekeepingFacilityTask['status']) => {
    sound.playSuccess();
    db.updateHousekeepingStatus(id, status, 'Dr. Sunita Rao (Infection Control)');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    db.addHousekeepingTask({
      facilityArea: newTask.facilityArea,
      taskType: newTask.taskType,
      priority: newTask.priority,
      assignedStaff: newTask.assignedStaff,
      status: newTask.status,
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setIsNewTaskOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.facilityArea.toLowerCase().includes(search.toLowerCase()) ||
      t.taskType.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedStaff.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || t.taskType === filterType;
    return matchesSearch && matchesType;
  });

  const pendingCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const verifiedCount = tasks.filter(t => t.status === 'Verified' || t.status === 'Cleaned & Inspected').length;
  const statCount = tasks.filter(t => t.priority === 'Immediate Stat' && t.status !== 'Verified').length;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-lg font-bold text-[#29243A]">MediCore Environmental Services & Facility Hygiene</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                NABH Infection Control Standard HIC.4
              </span>
            </div>
            <p className="text-xs text-[#626B77]">Terminal Decontamination, Rapid Bed Turnover & Biomedical Waste (BMW 2016) Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Request Sanitation
          </button>
          <button
            onClick={() => { sound.playClick(); onLogout(); }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-[#E7E4DC] px-6 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Active Tasks</p>
              <p className="text-base font-bold text-[#29243A]">{tasks.length} Total</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">In Progress</p>
              <p className="text-base font-bold text-amber-700">{pendingCount} Active</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Infection-Control Signed</p>
              <p className="text-base font-bold text-emerald-700">{verifiedCount} Cleared</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">STAT Priority</p>
              <p className="text-base font-bold text-rose-700">{statCount} Urgent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Biomedical Waste (BMW 2016) Overview Card */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif font-bold text-sm font-bold text-[#29243A]">Biomedical Waste (BMW) Management Protocol — 2016 Rules</h2>
              <p className="text-xs text-[#626B77]">Barcoded color-coded segregation with automated weight manifest before daily PCB collection.</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono">
              Manifest: BMW-2026-1116
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl border border-yellow-200 bg-yellow-50/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-900">🟡 Yellow Bin</span>
                <span className="text-[11px] font-mono font-bold text-yellow-800">42.4 kg</span>
              </div>
              <p className="text-[11px] text-yellow-800 mt-1">Anatomical, soiled swabs, expired meds</p>
            </div>

            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900">🔴 Red Bin</span>
                <span className="text-[11px] font-mono font-bold text-rose-800">28.1 kg</span>
              </div>
              <p className="text-[11px] text-rose-800 mt-1">Contaminated plastic, IV bottles, tubing</p>
            </div>

            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">🔵 Blue Box</span>
                <span className="text-[11px] font-mono font-bold text-blue-800">14.6 kg</span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1">Glassware, ampoules, metallic implants</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-300 bg-slate-100/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#29243A]">⚪ White Translucent</span>
                <span className="text-[11px] font-mono font-bold text-[#29243A]">6.2 kg</span>
              </div>
              <p className="text-[11px] text-slate-700 mt-1">Puncture-proof sharps, needles, scalpels</p>
            </div>
          </div>
        </div>

        {/* Task Management & Filters */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search area, task or staff..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Terminal Sterilization', 'Bed Linen Turnover', 'Biomedical Waste Disposal', 'Floor Decontamination'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterType === tab
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F5EF] text-slate-600 border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-3 font-semibold">Task ID & Area</th>
                  <th className="py-3 px-3 font-semibold">Task Type</th>
                  <th className="py-3 px-3 font-semibold">Priority</th>
                  <th className="py-3 px-3 font-semibold">Assigned Staff</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Signoff</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F7F5EF]">
                    <td className="py-3 px-3">
                      <div className="font-mono text-cyan-700 font-bold">{t.taskCode}</div>
                      <div className="font-semibold text-[#29243A]">{t.facilityArea}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{t.taskType}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.priority === 'Immediate Stat' ? 'bg-rose-100 text-rose-800' :
                        t.priority === 'Routine' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{t.assignedStaff}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'Cleaned & Inspected' ? 'bg-cyan-100 text-cyan-800' :
                        t.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#626B77] text-[11px]">
                      {t.inspectorSignoff ? (
                        <span className="text-emerald-700 font-semibold">{t.inspectorSignoff} ({t.completedAt})</span>
                      ) : (
                        <span className="text-slate-400">Awaiting Signoff</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {t.status !== 'Verified' ? (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'Verified')}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-sm"
                        >
                          Verify Clean
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-serif font-bold text-base font-bold text-[#29243A] mb-4">Request Facility Sanitation</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Area</label>
                <input
                  type="text"
                  required
                  value={newTask.facilityArea}
                  onChange={(e) => setNewTask({ ...newTask, facilityArea: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Type</label>
                <select
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Terminal Sterilization">Terminal Sterilization (OT / ICU)</option>
                  <option value="Bed Linen Turnover">Bed Linen Turnover & Surface Sanitization</option>
                  <option value="Biomedical Waste Disposal">Biomedical Waste Disposal</option>
                  <option value="Floor Decontamination">Floor Decontamination (Quaternary Ammonium)</option>
                  <option value="HVAC Air Filter Check">HVAC HEPA Filter Check</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Immediate Stat">Immediate Stat (High Urgency)</option>
                  <option value="Routine">Routine (Regular Shift)</option>
                  <option value="Scheduled Shift">Scheduled Shift Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Lead</label>
                <input
                  type="text"
                  required
                  value={newTask.assignedStaff}
                  onChange={(e) => setNewTask({ ...newTask, assignedStaff: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm"
                >
                  Create Sanitation Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
