/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Executive Hospital Command Center & Operations Room
 * Real-time hospital operational index, emergency code broadcaster, bed surge,
 * medical gas manifold, live OT monitoring & 3D digital twin launcher.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { HospitalDigitalTwin3D } from '../3d/HospitalDigitalTwin3D';
import {
  Activity,
  AlertTriangle,
  Flame,
  Radio,
  Building,
  Bed,
  HeartPulse,
  Syringe,
  Wind,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Users,
  Compass,
  Volume2,
  Printer
} from 'lucide-react';

interface HospitalCommandCenterProps {
  onClose?: () => void;
  onOpenDigitalTwin?: () => void;
}

export const HospitalCommandCenter: React.FC<HospitalCommandCenterProps> = ({
  onClose,
  onOpenDigitalTwin
}) => {
  const [beds, setBeds] = useState(() => db.getBeds());
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [codeBroadcastLog, setCodeBroadcastLog] = useState<string[]>([]);
  const [isDigitalTwinModalOpen, setIsDigitalTwinModalOpen] = useState(false);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setBeds([...db.getBeds()]);
    });
    return unsub;
  }, []);

  const totalBeds = beds.length || 450;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const icuBeds = beds.filter(b => b.type === 'ICU');
  const icuOccupied = icuBeds.filter(b => b.status === 'Occupied').length;
  const icuRate = icuBeds.length > 0 ? Math.round((icuOccupied / icuBeds.length) * 100) : 88;

  const handleBroadcastCode = (codeName: string, color: string) => {
    sound.playAlert();
    setActiveCode(codeName);
    const logEntry = `[${new Date().toLocaleTimeString()}] EMERGENCY BROADCAST: ${codeName} triggered hospital-wide across all PA zones and paging.`;
    setCodeBroadcastLog(prev => [logEntry, ...prev.slice(0, 4)]);
  };

  const handleClearCode = () => {
    sound.playSuccess();
    if (activeCode) {
      setCodeBroadcastLog(prev => [`[${new Date().toLocaleTimeString()}] ALL CLEAR: ${activeCode} standing down. Normal clinical ops resumed.`, ...prev.slice(0, 4)]);
    }
    setActiveCode(null);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 font-sans p-6">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-950/20">
            <Radio className="w-6 h-6 animate-pulse text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">MediCore Hospital Command Center</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> REAL-TIME MONITORING
              </span>
            </div>
            <p className="text-xs text-slate-500">Centralized Hospital Census, Critical Facility Telemetry & Mass Emergency Coordination</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenDigitalTwin) {
                onOpenDigitalTwin();
              } else {
                setIsDigitalTwinModalOpen(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors"
          >
            <Building className="w-4 h-4" /> 3D Digital Twin Viewer
          </button>
          {onClose && (
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100"
            >
              Exit Command Center
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Active Emergency Broadcast Banner */}
        {activeCode && (
          <div className="bg-rose-600 text-white p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-8 h-8 text-white shrink-0" />
              <div>
                <h2 className="text-lg font-black uppercase tracking-wide">EMERGENCY BROADCAST ACTIVE: {activeCode}</h2>
                <p className="text-xs text-rose-100">All available rapid response teams, crash cart leaders, and security teams deploy to assigned zones immediately.</p>
              </div>
            </div>
            <button
              onClick={handleClearCode}
              className="px-5 py-2.5 rounded-xl bg-white text-rose-700 text-xs font-bold shadow-md hover:bg-rose-50 shrink-0"
            >
              Issue "All Clear" Stand-Down
            </button>
          </div>
        )}

        {/* Emergency Code Trigger Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Hospital Emergency Codes (PA System & Pager Broadcast)</h2>
            </div>
            <span className="text-[11px] text-slate-400">Pressing code broadcasts instant alerts to all nursing stations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => handleBroadcastCode('CODE BLUE (Cardiac Arrest)', 'blue')}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-[10px] font-bold text-blue-800">CARDIAC</span>
              </div>
              <p className="font-bold text-xs text-blue-950 mt-1">CODE BLUE</p>
              <p className="text-[10px] text-blue-700">Adult / Pediatric Resuscitation</p>
            </button>

            <button
              onClick={() => handleBroadcastCode('CODE RED (Fire / Smoke)', 'red')}
              className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span className="text-[10px] font-bold text-rose-800">FIRE</span>
              </div>
              <p className="font-bold text-xs text-rose-950 mt-1">CODE RED</p>
              <p className="text-[10px] text-rose-700">Fire, Smoke & Evacuation</p>
            </button>

            <button
              onClick={() => handleBroadcastCode('CODE YELLOW (Mass Casualty)', 'amber')}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-amber-800">DISASTER</span>
              </div>
              <p className="font-bold text-xs text-amber-950 mt-1">CODE YELLOW</p>
              <p className="text-[10px] text-amber-700">Mass Casualty Influx</p>
            </button>

            <button
              onClick={() => handleBroadcastCode('CODE PINK (Infant Abduction)', 'pink')}
              className="p-3 rounded-xl border border-pink-200 bg-pink-50/70 hover:bg-pink-100 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-[10px] font-bold text-pink-800">SECURITY</span>
              </div>
              <p className="font-bold text-xs text-pink-950 mt-1">CODE PINK</p>
              <p className="text-[10px] text-pink-700">Infant / Child Security</p>
            </button>

            <button
              onClick={() => handleBroadcastCode('CODE VIOLET (Violent Person)', 'purple')}
              className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="text-[10px] font-bold text-purple-800">SECURITY</span>
              </div>
              <p className="font-bold text-xs text-purple-950 mt-1">CODE VIOLET</p>
              <p className="text-[10px] text-purple-700">Aggressive Person / Weapon</p>
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Inpatient Bed Capacity</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {occupiedBeds} <span className="text-sm font-normal text-slate-500">/ {totalBeds} Occupied</span>
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round((occupiedBeds / totalBeds) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex justify-between">
              <span>Available Beds: <strong className="text-emerald-700">{availableBeds}</strong></span>
              <span>{Math.round((occupiedBeds / totalBeds) * 100)}% Capacity</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">ICU & Critical Care Surge</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-700 mt-2">
              {icuRate}% <span className="text-sm font-normal text-slate-500">Surge Index</span>
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${icuRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex justify-between">
              <span>Cardiac & Neuro ICU</span>
              <span className="text-rose-600 font-bold">Surge Level 2</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Liquid Medical Oxygen (LMO)</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-teal-700 mt-2">
              4.3 Bar <span className="text-sm font-normal text-slate-500">(12.4 KL)</span>
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex justify-between">
              <span>Main LOX Cryogenic Tank</span>
              <span className="text-emerald-700 font-bold">96 Hours Autonomy</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Emergency Trauma Flow</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              7.8 min <span className="text-sm font-normal text-slate-500">Avg Door-to-Doctor</span>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">3 Red Triage</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">11 Yellow</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">24 Green</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">2 ALS Ambulances incoming (ETA &lt; 8 min)</p>
          </div>
        </div>

        {/* Operational Split: Live OT Grid + Broadcast Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Operation Theatres (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Operation Theatres Status (Surgical Complex F3)</h3>
                <p className="text-xs text-slate-500">Real-time monitoring of laminar airflow suites, ongoing procedures and surgical safety checklists.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
                4 / 6 Suites In Surgery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">OT-1 (Cardiac Suite)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">IN SURGERY</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-2">Coronary Artery Bypass Graft (CABG)</p>
                <p className="text-[11px] text-slate-600">Surgeon: Dr. Rajesh Iyer • Elapsed: 2h 45m</p>
                <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> WHO Checklist: Time-Out Verified
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">OT-2 (Orthopedic Suite)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">IN SURGERY</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-2">Robotic Total Knee Arthroplasty (TKA)</p>
                <p className="text-[11px] text-slate-600">Surgeon: Dr. Priya Sharma • Elapsed: 1h 10m</p>
                <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MAKO Robotic Arm Calibrated
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">OT-3 (General & Laparoscopic)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">POST-OP CLEANING</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-2">Laparoscopic Cholecystectomy</p>
                <p className="text-[11px] text-slate-600">Completed. Turnover to Next Case: 15 mins</p>
                <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terminal UV Decontamination Active
                </div>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">OT-4 (Neuro / Spine Suite)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-600 text-white">IN SURGERY</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-2">Microsurgical Lumbar Discectomy</p>
                <p className="text-[11px] text-slate-600">Surgeon: Dr. Sanjay Mukherjee • Elapsed: 50m</p>
                <div className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Zeiss Kinevo Intra-op Fluoroscopy
                </div>
              </div>
            </div>
          </div>

          {/* Broadcast & Operational Logs (1 Col) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Emergency Broadcast & Census Logs</h3>
            <p className="text-xs text-slate-500 mb-4">Official chronological activity record.</p>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px]">
              {codeBroadcastLog.map((log, i) => (
                <div key={i} className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-700">
                  {log}
                </div>
              ))}
              {codeBroadcastLog.length === 0 && (
                <div className="text-xs text-slate-400 italic py-6 text-center">
                  No emergency broadcasts logged today. Normal green hospital condition.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Hospital Census: 94.2%</span>
              <button
                onClick={() => sound.playClick()}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Export Census Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Digital Twin Modal */}
      {isDigitalTwinModalOpen && (
        <HospitalDigitalTwin3D onClose={() => setIsDigitalTwinModalOpen(false)} />
      )}
    </div>
  );
};
