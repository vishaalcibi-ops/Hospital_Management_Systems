/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 15: Patient Relations & Grievance Desk
 * Visual Style: Soft rose/pink & clean white interface with patient feedback resolution tracking.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { PatientFeedbackRecord } from '../../types';
import {
  HeartHandshake,
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
  Smile,
  ShieldCheck
} from 'lucide-react';

interface PatientRelationsPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const PatientRelationsPortal: React.FC<PatientRelationsPortalProps> = ({
  onLogout
}) => {
  const [feedbacks, setFeedbacks] = useState<PatientFeedbackRecord[]>(db.getPatientFeedbacks());
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PatientFeedbackRecord | null>(feedbacks[0] || null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setFeedbacks(db.getPatientFeedbacks());
    });
    return unsub;
  }, []);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !resolutionNotes.trim()) return;

    sound.playSuccess();
    db.resolvePatientFeedback(selectedRecord.id, resolutionNotes.trim());
    setResolutionNotes('');
  };

  const filtered = feedbacks.filter(f =>
    f.patientName.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.comment.toLowerCase().includes(search.toLowerCase())
  );

  const avgSatisfaction = Math.round(
    feedbacks.reduce((sum, f) => sum + f.satisfactionScore, 0) / (feedbacks.length || 1)
  );

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      <header className="bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md shadow-pink-600/20">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Patient Relations & Grievance Station</h2>
              <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">Portal 15</span>
            </div>
            <p className="text-xs text-[#626B77]">Patient Satisfaction Analytics, Grievance Escalation & Post-Care Support</p>
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
        {/* KPI Satisfaction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Patient Satisfaction (CSAT)</span>
            <div className="text-2xl font-bold text-pink-600 mt-1">{avgSatisfaction}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Target benchmark &gt; 90%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Net Promoter Score (NPS)</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">+78</div>
            <p className="text-[11px] text-slate-400 mt-1">World-class clinical tier</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Open Grievances</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {feedbacks.filter(f => f.status === 'Investigating' || f.status === 'Open').length} Cases
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Resolution SLA: &lt; 24h</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Total Feedback Audited</span>
            <div className="text-2xl font-bold text-[#29243A] mt-1">{feedbacks.length} Reviews</div>
            <p className="text-[11px] text-slate-400 mt-1">Inpatient & OPD surveys</p>
          </div>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feedback List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Patient Reviews & Complaints</h3>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter comments..."
                  className="w-full pl-8 pr-2 py-1.5 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
              {filtered.map(fb => {
                const isSelected = selectedRecord?.id === fb.id;
                return (
                  <div
                    key={fb.id}
                    onClick={() => { sound.playClick(); setSelectedRecord(fb); }}
                    className={`p-4 cursor-pointer transition space-y-2 ${
                      isSelected ? 'bg-pink-50/70 border-l-4 border-pink-600' : 'hover:bg-[#F7F5EF]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#29243A]">{fb.patientName}</span>
                        <span className="text-[10px] text-slate-400">({fb.patientCode})</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {fb.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        ★ {fb.rating}/5
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic line-clamp-2">
                      "{fb.comment}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Category: <strong>{fb.category}</strong></span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        fb.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {fb.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grievance Resolution Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E7E4DC] shadow-sm p-6 space-y-5">
            {selectedRecord ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                    Feedback Dossier #{selectedRecord.id}
                  </span>
                  <h3 className="font-serif font-bold text-base font-bold text-[#29243A] mt-1">{selectedRecord.patientName}</h3>
                  <p className="text-xs text-[#626B77]">{selectedRecord.department} · {selectedRecord.feedbackDate}</p>
                </div>

                <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#E7E4DC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#626B77] font-semibold">Satisfaction Score:</span>
                    <strong className="text-emerald-700 font-bold">{selectedRecord.satisfactionScore}%</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#626B77] font-semibold">Feedback Category:</span>
                    <strong className="text-[#29243A]">{selectedRecord.category}</strong>
                  </div>
                  <div className="pt-2 border-t border-[#E7E4DC] text-xs text-slate-700 leading-relaxed italic">
                    "{selectedRecord.comment}"
                  </div>
                </div>

                {selectedRecord.status === 'Resolved' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Grievance Resolved & Documented</span>
                    </div>
                    <p className="text-emerald-900 mt-1">Resolution: {selectedRecord.resolutionNotes}</p>
                  </div>
                ) : (
                  <form onSubmit={handleResolve} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Action Plan & Resolution Notes *
                      </label>
                      <textarea
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Detail corrective actions taken with department supervisor..."
                        rows={4}
                        required
                        className="w-full p-2.5 bg-[#F7F5EF] border border-[#E7E4DC] rounded-xl text-[#29243A] resize-none text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition shadow-md shadow-pink-600/20"
                    >
                      Close Grievance & Dispatch Notification
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">Select a feedback item</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
