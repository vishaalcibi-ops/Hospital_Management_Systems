/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 18: Ambulance & Emergency 1066 Dispatch Workspace
 * Visual Style: High-visibility operational interface with emergency trauma response.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { EmergencyAmbulanceCall } from '../../types';
import {
  Truck,
  PhoneCall,
  MapPin,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Activity,
  Radio
} from 'lucide-react';

interface AmbulancePortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const AmbulancePortal: React.FC<AmbulancePortalProps> = ({
  onLogout
}) => {
  const [calls, setCalls] = useState<EmergencyAmbulanceCall[]>(db.getAmbulanceCalls());
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  // New Dispatch Call State
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [emergencyType, setEmergencyType] = useState<EmergencyAmbulanceCall['emergencyType']>('Cardiac Arrest');
  const [vehicleNumber, setVehicleNumber] = useState('KA-01-MD-1066 (ICU ALS)');
  const [driverName, setDriverName] = useState('Manjunath Gowda');
  const [paramedicName, setParamedicName] = useState('Anthony Paul, EMT-P');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setCalls(db.getAmbulanceCalls());
    });
    return unsub;
  }, []);

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName.trim() || !pickupAddress.trim()) return;

    sound.playWarning();
    db.dispatchAmbulance({
      callTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callerName: callerName.trim(),
      callerPhone: callerPhone.trim() || '+91 98410 99881',
      pickupAddress: pickupAddress.trim(),
      emergencyType,
      vehicleNumber,
      driverName,
      paramedicName,
      etaMinutes: 8,
      triagePriority: emergencyType === 'Cardiac Arrest' || emergencyType === 'Severe Trauma' ? 'Red (Critical)' : 'Yellow (Urgent)'
    });

    setCallerName('');
    setPickupAddress('');
    setIsDispatchOpen(false);
  };

  const handleUpdateStatus = (id: string, status: EmergencyAmbulanceCall['status']) => {
    sound.playClick();
    db.updateAmbulanceStatus(id, status);
  };

  const activeDispatches = calls.filter(c => c.status !== 'Arrived at ER');

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      <header className="bg-white border-b border-orange-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Ambulance & 1066 Emergency Command</h2>
              <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full font-bold">Portal 18</span>
            </div>
            <p className="text-xs text-[#626B77]">24/7 Advanced Life Support (ALS) Fleet & Golden Hour Resuscitation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsDispatchOpen(true); }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
          >
            <Radio className="w-4 h-4" />
            <span>Dispatch Emergency Unit</span>
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
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Active En-Route Missions</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">{activeDispatches.length} Vehicles</div>
            <p className="text-[11px] text-slate-400 mt-1">Trauma center pre-notified</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Average Response ETA</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">7.4 Minutes</div>
            <p className="text-[11px] text-slate-400 mt-1">Metropolitan Golden Hour tier</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Fleet Availability</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">12 / 16 ALS Units</div>
            <p className="text-[11px] text-slate-400 mt-1">Stationed across 4 sectors</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Air Ambulance Status</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">Standby (Helipad 1)</div>
            <p className="text-[11px] text-slate-400 mt-1">ECMO equipped helicopter</p>
          </div>
        </div>

        {/* Live Emergency Calls Table */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F7F5EF]/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Real-Time Dispatch Ledger</h3>
            <span className="text-xs text-[#626B77]">{calls.length} emergency dispatches</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#626B77] uppercase tracking-wider font-semibold border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-4">Call Number</th>
                  <th className="py-3 px-4">Emergency Type & Priority</th>
                  <th className="py-3 px-4">Caller & Location</th>
                  <th className="py-3 px-4">Vehicle & Crew</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {calls.map(c => (
                  <tr key={c.id} className="hover:bg-orange-50/20 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                      {c.callNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">{c.callTime}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#29243A]">{c.emergencyType}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block mt-0.5 ${
                        c.triagePriority.includes('Red') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.triagePriority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-[#29243A]">{c.callerName} ({c.callerPhone})</div>
                      <div className="text-[11px] text-[#626B77] truncate max-w-xs">{c.pickupAddress}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="font-semibold text-[#29243A]">{c.vehicleNumber}</div>
                      <div className="text-[#626B77]">Paramedic: {c.paramedicName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'Patient Onboard'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : c.status === 'Dispatched'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {c.status === 'Dispatched' && (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'Patient Onboard')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold"
                        >
                          Patient Onboard
                        </button>
                      )}
                      {c.status === 'Patient Onboard' && (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'Arrived at ER')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Arrived at Trauma Bay
                        </button>
                      )}
                      {c.status === 'Arrived at ER' && (
                        <span className="text-[11px] text-emerald-600 font-semibold">In Resuscitation ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Dispatch Modal */}
      {isDispatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">STAT 1066 Emergency Ambulance Dispatch</h4>
              <button onClick={() => setIsDispatchOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Caller Contact Name *</label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="e.g. Rajesh Gopinath"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Caller Phone Number *</label>
                <input
                  type="tel"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Pickup Address / GPS Coordinates *</label>
                <textarea
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Full landmark, apartment/gate number..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A] resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Emergency Triage Category</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value as any)}
                  className="w-full px-2 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                >
                  <option value="Cardiac Arrest">Cardiac Arrest</option>
                  <option value="Severe Trauma">Severe Trauma / Accident</option>
                  <option value="Stroke Alert">Stroke Alert</option>
                  <option value="Respiratory Distress">Respiratory Distress</option>
                  <option value="Maternal Emergency">Maternal Emergency</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>Transmit STAT Dispatch Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
