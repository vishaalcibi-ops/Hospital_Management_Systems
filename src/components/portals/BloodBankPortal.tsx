/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 13: Blood Bank & Transfusion Medicine Workspace
 * Visual Style: Clean clinical white with controlled red status indicators and barcode inventory.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { BloodBankUnit } from '../../types';
import {
  Droplet,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface BloodBankPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const BloodBankPortal: React.FC<BloodBankPortalProps> = ({
  onLogout
}) => {
  const [units, setUnits] = useState<BloodBankUnit[]>(db.getBloodUnits());
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Blood Unit State
  const [donorName, setDonorName] = useState('');
  const [donorId, setDonorId] = useState(`D-${Math.floor(1000 + Math.random() * 9000)}`);
  const [bloodGroup, setBloodGroup] = useState<BloodBankUnit['bloodGroup']>('O+');
  const [component, setComponent] = useState<BloodBankUnit['component']>('Packed Red Blood Cells (PRBC)');
  const [volumeMl, setVolumeMl] = useState(350);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setUnits(db.getBloodUnits());
    });
    return unsub;
  }, []);

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) return;

    sound.playSuccess();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 35);

    db.addBloodUnit({
      bloodGroup,
      component,
      donorName: donorName.trim(),
      donorId,
      collectionDate: new Date().toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      volumeMl: Number(volumeMl) || 350,
      status: 'Available',
      rhFactor: bloodGroup.includes('+') ? 'Positive' : 'Negative'
    });

    setDonorName('');
    setIsRegisterOpen(false);
  };

  const handleStatusChange = (id: string, status: BloodBankUnit['status']) => {
    sound.playClick();
    db.updateBloodStatus(id, status);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredUnits = units.filter(u => {
    const matchesGroup = selectedGroup === 'All' || u.bloodGroup === selectedGroup;
    const matchesSearch =
      u.unitBarcode.toLowerCase().includes(search.toLowerCase()) ||
      u.donorName.toLowerCase().includes(search.toLowerCase()) ||
      u.component.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-red-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/20">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Blood Bank & Transfusion Medicine</h2>
              <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">Portal 13</span>
            </div>
            <p className="text-xs text-[#626B77]">Component Separation, Crossmatching & Cold-Chain Cryopreservation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsRegisterOpen(true); }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Blood Donation</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* Blood Inventory Matrix Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodGroups.map(bg => {
            const count = units.filter(u => u.bloodGroup === bg && u.status === 'Available').length;
            const isSelected = selectedGroup === bg;
            return (
              <div
                key={bg}
                onClick={() => { sound.playClick(); setSelectedGroup(isSelected ? 'All' : bg); }}
                className={`bg-white p-3.5 rounded-xl border cursor-pointer transition text-center shadow-sm ${
                  isSelected ? 'border-red-600 ring-2 ring-red-500/20 bg-red-50/40' : 'border-[#E7E4DC] hover:border-red-300'
                }`}
              >
                <div className="text-lg font-black text-red-600">{bg}</div>
                <div className="text-xs font-bold text-[#29243A] mt-0.5">{count} Units</div>
                <span className="text-[10px] text-slate-400">Available</span>
              </div>
            );
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E4DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search barcode, donor or component..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-xl text-xs text-[#29243A] focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Active Filter:</span>
            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg font-bold border border-red-200">
              {selectedGroup === 'All' ? 'All Blood Groups' : `Group ${selectedGroup}`}
            </span>
            {selectedGroup !== 'All' && (
              <button
                onClick={() => setSelectedGroup('All')}
                className="text-slate-400 hover:text-slate-600 underline text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Inventory Units Table */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F7F5EF]/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Cold Vault Blood Units Inventory</h3>
            <span className="text-xs text-[#626B77]">{filteredUnits.length} barcode units tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#626B77] uppercase tracking-wider font-semibold border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-4">Barcode ID</th>
                  <th className="py-3 px-4">Group & Rh</th>
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Collection / Expiry</th>
                  <th className="py-3 px-4">Status / Allocation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUnits.map(unit => (
                  <tr key={unit.id} className="hover:bg-red-50/20 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-700">
                      {unit.unitBarcode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#29243A] text-sm">
                      {unit.bloodGroup}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#29243A]">
                      {unit.component}
                    </td>
                    <td className="py-3.5 px-4">
                      {unit.volumeMl} mL
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      <div>Collected: {unit.collectionDate}</div>
                      <div className="text-red-600 font-semibold">Expires: {unit.expiryDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        unit.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : unit.status === 'Reserved'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {unit.status}
                      </span>
                      {unit.reservedForPatient && (
                        <div className="text-[10px] text-[#626B77] mt-1">{unit.reservedForPatient}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {unit.status === 'Available' && (
                        <button
                          onClick={() => handleStatusChange(unit.id, 'Reserved')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold"
                        >
                          Reserve
                        </button>
                      )}
                      {unit.status === 'Reserved' && (
                        <button
                          onClick={() => handleStatusChange(unit.id, 'Transfused')}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-semibold"
                        >
                          Issue Transfusion
                        </button>
                      )}
                      {unit.status === 'Transfused' && (
                        <span className="text-[11px] text-slate-400">Transfused ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Donation Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">Record Voluntary Blood Donation</h4>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Donor Full Name *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Rahul Deshmukh"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  >
                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Volume (mL)</label>
                  <input
                    type="number"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Blood Component</label>
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value as any)}
                  className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                >
                  <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                  <option value="Platelet Concentrate">Platelet Concentrate</option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-md shadow-red-600/20"
                >
                  Generate Barcode & Store in Cold Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
