/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 7: Clinical Pathology & Laboratory Information System (LIS)
 * NABL Accredited diagnostic suite with HL7 analyzer integration and panic alert monitoring.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { LabManager } from '../laboratory/LabManager';
import {
  FlaskConical,
  QrCode,
  AlertTriangle,
  Activity,
  CheckCircle2,
  FileCheck,
  Search,
  Printer,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';

interface LaboratoryPortalProps {
  onLogout: () => void;
  onSwitchPortal?: (portal: any) => void;
}

export const LaboratoryPortal: React.FC<LaboratoryPortalProps> = ({
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'lis' | 'accession' | 'analyzer' | 'critical'>('lis');
  const [labOrders, setLabOrders] = useState(() => db.getLabOrders());
  const [accessionBarcode, setAccessionBarcode] = useState('');
  const [accessionStatus, setAccessionStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setLabOrders([...db.getLabOrders()]);
    });
    return unsub;
  }, []);

  const totalOrders = labOrders.length;
  const pendingOrders = labOrders.filter(o => o.status === 'Ordered' || o.status === 'Sample Collected' || o.status === 'Analyzing').length;
  const completedOrders = labOrders.filter(o => o.status === 'Completed').length;
  const criticalOrders = labOrders.filter(o => o.interpretation === 'Critical');

  const handleQuickAccession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessionBarcode.trim()) return;
    sound.playSuccess();
    setAccessionStatus(`Specimen ${accessionBarcode.toUpperCase()} received & barcoded at Central Accessioning Desk. Routed to Roche Cobas 8000 analyzer track.`);
    setAccessionBarcode('');
    setTimeout(() => setAccessionStatus(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-lg font-bold text-[#29243A]">MediCore Central Pathology & LIS</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> NABL ISO 15189:2022
              </span>
            </div>
            <p className="text-xs text-[#626B77]">Automated Clinical Chemistry, Hematology, Microbiology & Molecular Diagnostics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
            <Zap className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>HL7 / ASTM Bidirectional Link Active</span>
          </div>
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
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Total Worklist</p>
              <p className="text-base font-bold text-[#29243A]">{totalOrders} Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Pending Tests</p>
              <p className="text-base font-bold text-amber-700">{pendingOrders} In Progress</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Pathologist Signed</p>
              <p className="text-base font-bold text-emerald-700">{completedOrders} Completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Critical / STAT</p>
              <p className="text-base font-bold text-rose-700">{criticalOrders.length} Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E7E4DC] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('lis')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'lis'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            LIS Diagnostic Workstation
          </button>
          <button
            onClick={() => setActiveTab('accession')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'accession'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Specimen Accessioning & Barcodes
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'analyzer'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Automated Analyzers (Cobas / Sysmex)
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'critical'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            STAT & Critical Panic Alerts ({criticalOrders.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'lis' && (
          <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm p-4">
            <LabManager theme="mint" />
          </div>
        )}

        {activeTab === 'accession' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
              <h2 className="font-serif font-bold text-base font-bold text-[#29243A] mb-2">Specimen Accessioning & Barcode Intake</h2>
              <p className="text-xs text-[#626B77] mb-6">Scan incoming EDTA / Serum / Citrate vacutainer tubes to log collection timestamp and route to appropriate testing benches.</p>

              <form onSubmit={handleQuickAccession} className="flex flex-col sm:flex-row gap-3 max-w-xl mb-4">
                <div className="relative flex-1">
                  <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={accessionBarcode}
                    onChange={(e) => setAccessionBarcode(e.target.value)}
                    placeholder="Scan vacutainer barcode (e.g., LAB-2026-9842)..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Log Accession
                </button>
              </form>

              {accessionStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{accessionStatus}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-sm font-bold text-[#29243A] mb-4">Recent Accession Queue</h3>
              <div className="divide-y divide-slate-100">
                {labOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700">{order.id}</span>
                        <span className="text-xs font-semibold text-[#29243A]">{order.patientName}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {order.testName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Order Ref: {order.doctorId || 'Consultant'} • Status: {order.status}</p>
                    </div>
                    <button
                      onClick={() => sound.playClick()}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-lg border border-[#E7E4DC] hover:bg-[#F7F5EF]"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#626B77]" /> Print Label
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analyzer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800">ONLINE</span>
                <span className="text-[11px] text-slate-400 font-mono">ASTM 1394</span>
              </div>
              <h3 className="font-serif font-bold font-bold text-[#29243A] text-sm">Roche Cobas 8000</h3>
              <p className="text-xs text-[#626B77] mb-4">Clinical Chemistry & Immunoassay Modality</p>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="font-semibold text-[#29243A]">840 tests/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Reagent Health:</span>
                  <span className="font-semibold text-emerald-600">Optimal (94%)</span>
                </div>
                <div className="flex justify-between">
                  <span>QC Status:</span>
                  <span className="font-semibold text-emerald-600">Westgard Rule Valid</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800">ONLINE</span>
                <span className="text-[11px] text-slate-400 font-mono">HL7 v2.5</span>
              </div>
              <h3 className="font-serif font-bold font-bold text-[#29243A] text-sm">Sysmex XN-3100</h3>
              <p className="text-xs text-[#626B77] mb-4">Automated 5-Part Differential Hematology</p>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="font-semibold text-[#29243A]">120 samples/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>CBC/Diff Track:</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Smear Maker:</span>
                  <span className="font-semibold text-[#29243A]">Ready</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">STANDBY</span>
                <span className="text-[11px] text-slate-400 font-mono">Bio-Rad CFX</span>
              </div>
              <h3 className="font-serif font-bold font-bold text-[#29243A] text-sm">Bio-Rad Real-Time PCR</h3>
              <p className="text-xs text-[#626B77] mb-4">Molecular Diagnostic & Viral Load System</p>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Assay Cycle:</span>
                  <span className="font-semibold text-[#29243A]">GeneXpert 96-well</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermocycle:</span>
                  <span className="font-semibold text-slate-600">Idle / Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>Calibration:</span>
                  <span className="font-semibold text-emerald-600">Certified Valid</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'critical' && (
          <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
            <h2 className="font-serif font-bold text-base font-bold text-rose-900 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> STAT Panic Value Alert System
            </h2>
            <p className="text-xs text-[#626B77] mb-6">
              Critical laboratory findings requiring immediate clinical notification within 15 minutes as per NABH standard COP.6.
            </p>

            <div className="space-y-3">
              {criticalOrders.map((o) => (
                <div key={o.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">STAT NOTIFY</span>
                      <span className="font-bold text-[#29243A] text-sm">{o.patientName}</span>
                      <span className="text-xs font-mono text-[#626B77]">({o.patientId})</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      Test: <span className="font-semibold">{o.testName}</span> • Ordering Physician: Dr. {o.doctorId || 'On Duty'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sound.playSuccess()}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-sm transition-colors"
                    >
                      Acknowledge & Notify Doctor
                    </button>
                  </div>
                </div>
              ))}
              {criticalOrders.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active critical panic alerts. All specimen results within safe limits.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
