/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 12: HR & Staff Rostering Workspace
 * Visual Style: Professional white, slate and muted blue with daily attendance ledgers.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { Staff } from '../../types';
import {
  Users,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface HrStaffPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const HrStaffPortal: React.FC<HrStaffPortalProps> = ({
  onLogout
}) => {
  const [staffList, setStaffList] = useState<Staff[]>(db.getStaff());
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('All');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // New staff state
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Staff Nurse');
  const [department, setDepartment] = useState('Critical Care & ICU');
  const [shift, setShift] = useState<Staff['shift']>('Morning (07:00 - 15:00)');
  const [contact, setContact] = useState('+91 98450 11223');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setStaffList(db.getStaff());
    });
    return unsub;
  }, []);

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playSuccess();
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      role,
      department,
      shift,
      contact,
      status: 'On Duty'
    };

    // Add to staff list
    staffList.unshift(newStaff);
    db.logAudit('STAFF ROSTER ENTRY', 'HR & Rostering', `Staff ${newStaff.name} onboarded to ${newStaff.department}`);
    setIsAddStaffOpen(false);
    setName('');
  };

  const handleToggleStatus = (id: string) => {
    sound.playClick();
    const updated = staffList.map(s => {
      if (s.id === id) {
        const nextStatus: Staff['status'] = s.status === 'On Duty' ? 'On Break' : s.status === 'On Break' ? 'Off Duty' : 'On Duty';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setStaffList(updated);
  };

  const filtered = staffList.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchesShift = shiftFilter === 'All' || s.shift.toLowerCase().includes(shiftFilter.toLowerCase());
    return matchesSearch && matchesShift;
  });

  const onDutyCount = staffList.filter(s => s.status === 'On Duty').length;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-md shadow-slate-800/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">HR, Staff & Shift Rostering Station</h2>
              <span className="text-[10px] bg-slate-100 text-[#29243A] px-2 py-0.5 rounded-full font-bold">Portal 12</span>
            </div>
            <p className="text-xs text-[#626B77]">Biometric Attendance, Clinical Shift Handover & Credentials</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsAddStaffOpen(true); }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Personnel</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* KPI Staff Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Currently On Duty</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{onDutyCount} Staff</div>
            <p className="text-[11px] text-slate-400 mt-1">Biometrically checked in</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Total Active Roster</span>
            <div className="text-2xl font-bold text-[#29243A] mt-1">{staffList.length} Personnel</div>
            <p className="text-[11px] text-slate-400 mt-1">Nurses, techs, admins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Shift Fulfillment</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">98.2%</div>
            <p className="text-[11px] text-slate-400 mt-1">NABH staffing ratios met</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Credential Renewals Due</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">3 Personnel</div>
            <p className="text-[11px] text-slate-400 mt-1">BLS/ACLS certifications</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E4DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff name, role or department..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-xl text-xs text-[#29243A] focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Shift:</span>
            {['All', 'Morning', 'Evening', 'Night'].map(sh => (
              <button
                key={sh}
                onClick={() => { sound.playClick(); setShiftFilter(sh); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  shiftFilter === sh ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sh}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F7F5EF]/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Hospital Duty Roster</h3>
            <span className="text-xs text-[#626B77]">{filtered.length} staff records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#626B77] uppercase tracking-wider font-semibold border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Designation / Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Assigned Shift</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(st => (
                  <tr key={st.id} className="hover:bg-[#F7F5EF] transition">
                    <td className="py-3.5 px-4 font-bold text-[#29243A]">
                      {st.name}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {st.role}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {st.department}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] font-medium text-[#29243A]">
                      {st.shift}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#626B77]">
                      {st.contact}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        st.status === 'On Duty'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : st.status === 'On Break'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-[#626B77]'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(st.id)}
                        className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-[#29243A] transition"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Onboarding Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">Add Clinical Staff to Shift Roster</h4>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Staff Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nurse Divya Menon, RN"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Role / Designation</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                >
                  <option value="Critical Care & ICU">Critical Care & ICU</option>
                  <option value="Cardiology Ward">Cardiology Ward</option>
                  <option value="Emergency Department">Emergency Department</option>
                  <option value="Operation Theatre">Operation Theatre</option>
                  <option value="Pathology Lab">Pathology Lab</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Shift Timing</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                >
                  <option value="Morning (07:00 - 15:00)">Morning (07:00 - 15:00)</option>
                  <option value="Evening (15:00 - 23:00)">Evening (15:00 - 23:00)</option>
                  <option value="Night (23:00 - 07:00)">Night (23:00 - 07:00)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition shadow-md"
                >
                  Confirm Staff Roster Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
