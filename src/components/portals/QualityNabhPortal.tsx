/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 16: Quality Management & NABH Readiness Workspace
 * Visual Style: Professional white, slate and structured compliance audit interface.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { QualityComplianceAudit } from '../../types';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Plus,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface QualityNabhPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const QualityNabhPortal: React.FC<QualityNabhPortalProps> = ({
  onLogout
}) => {
  const [audits, setAudits] = useState<QualityComplianceAudit[]>(db.getQualityAudits());
  const [search, setSearch] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<QualityComplianceAudit | null>(audits[0] || null);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setAudits(db.getQualityAudits());
    });
    return unsub;
  }, []);

  const handleUpdateCompliance = (id: string, newRate: number) => {
    sound.playClick();
    db.updateAuditCompliance(id, newRate, newRate >= 95 ? 'Fully Compliant' : 'Partially Compliant');
  };

  const filtered = audits.filter(a =>
    a.standardCode.toLowerCase().includes(search.toLowerCase()) ||
    a.chapter.toLowerCase().includes(search.toLowerCase()) ||
    a.objective.toLowerCase().includes(search.toLowerCase())
  );

  const avgCompliance = (
    audits.reduce((sum, a) => sum + a.complianceRate, 0) / (audits.length || 1)
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Quality, Clinical Safety & NABH Audit</h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Portal 16</span>
            </div>
            <p className="text-xs text-[#626B77]">National Accreditation Board for Hospitals & Healthcare Providers (NABH 5th Edition)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Overall NABH Compliance</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{avgCompliance}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Level-3 Tertiary Accreditation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Core Chapters Audited</span>
            <div className="text-2xl font-bold text-[#29243A] mt-1">10 Chapters</div>
            <p className="text-[11px] text-slate-400 mt-1">COP, MOM, HIC, FMS, PRE</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">CAPA Resolution Rate</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">100%</div>
            <p className="text-[11px] text-slate-400 mt-1">Zero overdue action items</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Hospital Infection Rate</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">&lt; 0.2%</div>
            <p className="text-[11px] text-slate-400 mt-1">Below international benchmark</p>
          </div>
        </div>

        {/* Audits Table */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F7F5EF]/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">NABH Standards & Accreditation Checklists</h3>
            <span className="text-xs text-[#626B77]">{filtered.length} standards active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#626B77] uppercase tracking-wider font-semibold border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-4">Standard Code</th>
                  <th className="py-3 px-4">NABH Chapter</th>
                  <th className="py-3 px-4">Objective Element</th>
                  <th className="py-3 px-4">Compliance %</th>
                  <th className="py-3 px-4">Lead Auditor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Calibrate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(audit => (
                  <tr key={audit.id} className="hover:bg-[#F7F5EF] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      {audit.standardCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#29243A]">
                      {audit.chapter}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600">
                      {audit.objective}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${audit.complianceRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#29243A]">{audit.complianceRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#626B77]">
                      {audit.auditorName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {audit.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleUpdateCompliance(audit.id, 99.5)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        Set 99.5%
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
