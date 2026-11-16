/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 8: Central Hospital Pharmacy & Dispensing System
 * CDSCO & Schedule H1 compliant digital pharmacy with cold-chain monitoring and barcode dispensing.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { PharmacyManager } from '../pharmacy/PharmacyManager';
import {
  Pill,
  Package,
  AlertTriangle,
  CheckCircle2,
  ThermometerSnowflake,
  ShieldAlert,
  Search,
  Printer,
  QrCode,
  Clock,
  Sparkles
} from 'lucide-react';

interface PharmacyPortalProps {
  onLogout: () => void;
  onSwitchPortal?: (portal: any) => void;
}

export const PharmacyPortal: React.FC<PharmacyPortalProps> = ({
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'dispense' | 'coldchain' | 'scheduleH1'>('inventory');
  const [medicines, setMedicines] = useState(() => db.getMedicines());
  const [prescriptions, setPrescriptions] = useState(() => db.getPrescriptions());

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setMedicines([...db.getMedicines()]);
      setPrescriptions([...db.getPrescriptions()]);
    });
    return unsub;
  }, []);

  const lowStockCount = medicines.filter(m => m.stock <= m.minThreshold).length;
  const pendingRxCount = prescriptions.filter(p => p.status === 'Prescribed' || p.status === 'Partial').length;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-lg font-bold text-[#29243A]">MediCore Central Pharmacy & Formulary</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                DL: KA-B-2026-98124 / 21B
              </span>
            </div>
            <p className="text-xs text-[#626B77]">24/7 Inpatient Unit-Dose Dispensing, OPD Counter & Schedule H1 Narcotics Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
            <ThermometerSnowflake className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>Cold Storage: 4.2°C (Optimal)</span>
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
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Total Formulations</p>
              <p className="text-base font-bold text-[#29243A]">{medicines.length} SKUs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Pending Dispensing</p>
              <p className="text-base font-bold text-teal-700">{pendingRxCount} Prescriptions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Low Stock Reorder</p>
              <p className="text-base font-bold text-amber-700">{lowStockCount} Items</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Schedule H1 / Narcotic</p>
              <p className="text-base font-bold text-purple-700">100% Audited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E7E4DC] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'inventory'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Formulary & E-Prescription Dispensing
          </button>
          <button
            onClick={() => setActiveTab('dispense')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'dispense'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Barcode Dispensing Counter
          </button>
          <button
            onClick={() => setActiveTab('coldchain')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'coldchain'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Cold-Chain Refrigerator (2°C - 8°C)
          </button>
          <button
            onClick={() => setActiveTab('scheduleH1')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'scheduleH1'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Schedule H1 / Restricted Narcotics Log
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm p-4">
            <PharmacyManager theme="mint" />
          </div>
        )}

        {activeTab === 'dispense' && (
          <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
            <h2 className="font-serif font-bold text-base font-bold text-[#29243A] mb-2">Fast Dispensing Queue</h2>
            <p className="text-xs text-[#626B77] mb-6">Real-time doctor e-prescriptions queued for barcoded medication packaging and bedside delivery.</p>

            <div className="space-y-4">
              {prescriptions.slice(0, 6).map((rx) => (
                <div key={rx.id} className="p-4 rounded-xl border border-[#E7E4DC] bg-[#F7F5EF]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700">{rx.id}</span>
                      <span className="text-xs font-bold text-[#29243A]">{rx.patientName}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-medium">
                        {rx.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Doctor: <span className="font-medium">Dr. {rx.doctorName || 'Medical Officer'}</span> • Prescribed Items: {rx.items?.length || 0}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rx.items?.map((item, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-1 bg-white border border-[#E7E4DC] rounded text-slate-700">
                          💊 {item.medicineName} ({item.dosage} • {item.frequency})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sound.playSuccess()}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition-colors whitespace-nowrap"
                    >
                      Dispense & Label
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coldchain' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-1 rounded">Chamber A1</span>
                <h3 className="font-serif font-bold font-bold text-[#29243A] text-base mt-2">Insulin & Biologicals</h3>
                <p className="text-2xl font-black text-teal-600 mt-1">3.8°C</p>
                <p className="text-xs text-[#626B77] mt-2">Lantus, Humalog, NovoRapid, Epoetin Alfa</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-1 rounded">Chamber B2</span>
                <h3 className="font-serif font-bold font-bold text-[#29243A] text-base mt-2">Vaccines & Immunoglobulins</h3>
                <p className="text-2xl font-black text-teal-600 mt-1">4.5°C</p>
                <p className="text-xs text-[#626B77] mt-2">Rabies Immunoglobulin, Hepatitis B, Tetanus Toxoid</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E7E4DC] p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-1 rounded">Deep Freezer C3</span>
                <h3 className="font-serif font-bold font-bold text-[#29243A] text-base mt-2">Cryo Suspensions</h3>
                <p className="text-2xl font-black text-indigo-600 mt-1">-18.4°C</p>
                <p className="text-xs text-[#626B77] mt-2">Factor VIII, Platelet Rich Plasma Additives</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheduleH1' && (
          <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif font-bold text-base font-bold text-[#29243A] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-600" /> Schedule H1 / Narcotics Dispensing Register
                </h2>
                <p className="text-xs text-[#626B77]">Government mandated record of restricted antibiotics, anti-tubercular drugs & psychotropics.</p>
              </div>
              <button
                onClick={() => sound.playClick()}
                className="px-3.5 py-1.5 rounded-lg border border-[#E7E4DC] text-xs font-semibold hover:bg-[#F7F5EF] flex items-center gap-1.5 text-slate-700"
              >
                <Printer className="w-3.5 h-3.5 text-[#626B77]" /> Print Drug Inspector Register
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F5EF] text-slate-600 border-b border-[#E7E4DC]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                    <th className="py-2.5 px-3 font-semibold">Patient Name & ID</th>
                    <th className="py-2.5 px-3 font-semibold">Prescribing Doctor</th>
                    <th className="py-2.5 px-3 font-semibold">Drug Name & Batch</th>
                    <th className="py-2.5 px-3 font-semibold">Quantity Dispensed</th>
                    <th className="py-2.5 px-3 font-semibold">Dispensing Pharmacist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-[#F7F5EF]">
                    <td className="py-2.5 px-3 font-mono text-[#626B77]">2026-11-16 11:20</td>
                    <td className="py-2.5 px-3 font-semibold text-[#29243A]">Vikram Mehta (P-10003)</td>
                    <td className="py-2.5 px-3 text-slate-700">Dr. Rajesh Iyer (Reg: 48921)</td>
                    <td className="py-2.5 px-3">Fentanyl 50 mcg Inj (B-8924)</td>
                    <td className="py-2.5 px-3 font-bold text-purple-700">2 Ampoules</td>
                    <td className="py-2.5 px-3 text-slate-600">Pharm. Ananya Sen</td>
                  </tr>
                  <tr className="hover:bg-[#F7F5EF]">
                    <td className="py-2.5 px-3 font-mono text-[#626B77]">2026-11-16 09:45</td>
                    <td className="py-2.5 px-3 font-semibold text-[#29243A]">Arjun Verma (P-10002)</td>
                    <td className="py-2.5 px-3 text-slate-700">Dr. Priya Sharma (Reg: 51203)</td>
                    <td className="py-2.5 px-3">Meropenem 1g IV (B-4410)</td>
                    <td className="py-2.5 px-3 font-bold text-purple-700">6 Vials</td>
                    <td className="py-2.5 px-3 text-slate-600">Pharm. Ananya Sen</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
