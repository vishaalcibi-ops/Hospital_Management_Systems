/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 20: Medical Records Department (MRD) & Central Archives
 * ICD-10 clinical coding, physical compactus rack indexing, and Medico-Legal Case (MLC) management.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { MrdArchivedRecord } from '../../types';
import {
  Archive,
  Search,
  Plus,
  FileText,
  ShieldAlert,
  FolderLock,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Scale
} from 'lucide-react';

interface MrdPortalProps {
  onLogout: () => void;
  onSwitchPortal?: (portal: any) => void;
}

export const MrdPortal: React.FC<MrdPortalProps> = ({
  onLogout
}) => {
  const [records, setRecords] = useState<MrdArchivedRecord[]>(db.getMrdRecords());
  const [search, setSearch] = useState('');
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [checkOutReason, setCheckOutReason] = useState('Insurance TPA Dispute Verification');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setRecords(db.getMrdRecords());
    });
    return unsub;
  }, []);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId) return;
    sound.playSuccess();
    db.checkoutMrdRecord(selectedRecordId, checkOutReason);
    setIsCheckOutOpen(false);
    setSelectedRecordId(null);
  };

  const filteredRecords = records.filter(r =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.mrdFileNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.patientCode.toLowerCase().includes(search.toLowerCase()) ||
    r.primaryDiagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const mlcCount = records.filter(r => r.mlcStatus).length;
  const checkedOutCount = records.filter(r => r.status.includes('Checked Out')).length;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold shadow-md shadow-amber-700/20">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-lg font-bold text-[#29243A]">MediCore Medical Records Department (MRD)</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                MCI Act 2002 Retention Compliance
              </span>
            </div>
            <p className="text-xs text-[#626B77]">Inpatient Dossier Archival, WHO ICD-10 Coding, Physical Compactus Tracking & Medico-Legal Dossiers</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              <FolderLock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Archived Inpatient Dossiers</p>
              <p className="text-base font-bold text-[#29243A]">{records.length} Files</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Medico-Legal Cases (MLC)</p>
              <p className="text-base font-bold text-rose-700">{mlcCount} Dossiers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Checked Out Records</p>
              <p className="text-base font-bold text-amber-700">{checkedOutCount} Active Loans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#626B77]">Retention Standard</p>
              <p className="text-base font-bold text-emerald-700">10-Year Preserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by UHID, patient name, MRD file or ICD-10..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => sound.playClick()}
                className="px-3.5 py-2 rounded-lg border border-[#E7E4DC] text-xs font-semibold hover:bg-[#F7F5EF] flex items-center gap-1.5 text-slate-700"
              >
                <Printer className="w-3.5 h-3.5 text-[#626B77]" /> Export MRD Registry
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F5EF] text-slate-600 border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-3 font-semibold">MRD File #</th>
                  <th className="py-3 px-3 font-semibold">Patient Name & UHID</th>
                  <th className="py-3 px-3 font-semibold">Admission / Discharge</th>
                  <th className="py-3 px-3 font-semibold">ICD-10 & Diagnosis</th>
                  <th className="py-3 px-3 font-semibold">Physical Location</th>
                  <th className="py-3 px-3 font-semibold">Status / MLC</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F7F5EF]">
                    <td className="py-3 px-3">
                      <div className="font-mono text-amber-800 font-bold">{r.mrdFileNumber}</div>
                      <div className="text-[10px] text-slate-400">{r.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#29243A]">{r.patientName}</div>
                      <div className="font-mono text-[11px] text-[#626B77]">{r.patientCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>Adm: {r.admissionDate}</div>
                      <div>Dis: {r.dischargeDate}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#29243A]">{r.primaryDiagnosis}</div>
                      <div className="font-mono text-[11px] text-blue-700">{r.icdCode}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#E7E4DC]">
                        {r.physicalLocation}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'Archived' ? 'bg-emerald-100 text-emerald-800' :
                          r.status.includes('Checked Out') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.status}
                        </span>
                        {r.mlcStatus && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                            <Scale className="w-3 h-3" /> MLC Case
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {r.status === 'Archived' ? (
                        <button
                          onClick={() => {
                            setSelectedRecordId(r.id);
                            setIsCheckOutOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-sm"
                        >
                          Check Out File
                        </button>
                      ) : (
                        <span className="text-amber-700 font-semibold text-[11px]">
                          File on Loan
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

      {/* Checkout Modal */}
      {isCheckOutOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-serif font-bold text-base font-bold text-[#29243A] mb-2">Check Out Physical Record</h3>
            <p className="text-xs text-[#626B77] mb-4">Lending medical files outside the archive requires formal regulatory justification.</p>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Reason</label>
                <select
                  value={checkOutReason}
                  onChange={(e) => setCheckOutReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7E4DC] focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Insurance TPA Dispute Verification">Insurance TPA Dispute Verification</option>
                  <option value="Judicial Subpoena / Court Summons">Judicial Subpoena / Court Summons</option>
                  <option value="NABH Clinical Audit Committee">NABH Clinical Audit Committee</option>
                  <option value="Senior Consultant Re-admission Review">Senior Consultant Re-admission Review</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckOutOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm"
                >
                  Confirm Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
