/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 9: Radiology & PACS Imaging Workspace
 * Visual Style: Clinical white with dark image-viewing workspace, DICOM PACS tool presets.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { RadiologyStudy } from '../../types';
import {
  Camera,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Eye,
  Sliders,
  ShieldCheck,
  Activity,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

interface RadiologyPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const RadiologyPortal: React.FC<RadiologyPortalProps> = ({
  onLogout
}) => {
  const [studies, setStudies] = useState<RadiologyStudy[]>(db.getRadiologyStudies());
  const [selectedStudy, setSelectedStudy] = useState<RadiologyStudy>(studies[0] || ({} as any));
  const [filterModality, setFilterModality] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Diagnostic report editor state
  const [findings, setFindings] = useState(selectedStudy?.findings || '');
  const [impression, setImpression] = useState(selectedStudy?.impression || '');
  const [radiologistName, setRadiologistName] = useState('Dr. K. Swaminathan, MD, DMRD');

  // PACS viewport controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [windowPreset, setWindowPreset] = useState<'Standard' | 'Bone' | 'Lung' | 'Soft Tissue'>('Standard');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      const updated = db.getRadiologyStudies();
      setStudies(updated);
      if (selectedStudy) {
        const found = updated.find(s => s.id === selectedStudy.id);
        if (found) setSelectedStudy(found);
      }
    });
    return unsub;
  }, [selectedStudy?.id]);

  const handleSelectStudy = (study: RadiologyStudy) => {
    sound.playClick();
    setSelectedStudy(study);
    setFindings(study.findings || '');
    setImpression(study.impression || '');
    setZoomLevel(1);
    setRotation(0);
  };

  const handleSignOffReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findings.trim() || !impression.trim()) return;

    sound.playSuccess();
    db.verifyRadiologyReport(selectedStudy.id, findings, impression, radiologistName);
  };

  const filteredStudies = studies.filter(s => {
    const matchesSearch =
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.studyCode.toLowerCase().includes(search.toLowerCase()) ||
      s.bodyPart.toLowerCase().includes(search.toLowerCase());
    const matchesModality = filterModality === 'All' || s.modality === filterModality;
    return matchesSearch && matchesModality;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base font-bold text-white">Radiology & PACS Diagnostic Suite</h2>
              <span className="text-[10px] bg-cyan-900/60 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded-full font-bold">
                Portal 9 · DICOM 3.0 Compliant
              </span>
            </div>
            <p className="text-[11px] text-slate-400">High-Resolution Multi-Modality Imaging Workstation</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline text-slate-400">Radiologist: <strong className="text-white">{radiologistName}</strong></span>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main PACS Layout: 3 Columns (Worklist, PACS Canvas, Diagnostic Report) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Worklist (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-900/80 flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#626B77] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient or study..."
                className="w-full pl-8 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-[11px]">
              {['All', 'CT Scan', 'MRI', 'X-Ray', 'Ultrasound'].map(m => (
                <button
                  key={m}
                  onClick={() => { sound.playClick(); setFilterModality(m); }}
                  className={`px-2 py-1 rounded whitespace-nowrap ${
                    filterModality === m ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredStudies.map(study => {
              const isSelected = selectedStudy?.id === study.id;
              return (
                <div
                  key={study.id}
                  onClick={() => handleSelectStudy(study)}
                  className={`p-3 cursor-pointer transition text-xs space-y-1 ${
                    isSelected ? 'bg-cyan-950/60 border-l-4 border-cyan-500' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-cyan-400">{study.studyCode}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      study.priority === 'STAT'
                        ? 'bg-rose-900/80 text-rose-300'
                        : study.priority === 'Urgent'
                        ? 'bg-amber-900/80 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {study.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-white">{study.patientName}</div>
                  <div className="text-[11px] text-slate-400">{study.modality} · {study.bodyPart}</div>
                  <div className="flex justify-between text-[10px] text-[#626B77] pt-1">
                    <span>Ordered: {study.orderDate}</span>
                    <span className={study.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}>
                      {study.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: PACS Viewport Canvas (6 cols) */}
        <div className="lg:col-span-6 flex flex-col bg-black relative overflow-hidden">
          {/* Tool Control Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 p-2 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sound.playClick(); setZoomLevel(z => Math.min(z + 0.2, 2.5)); }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => { sound.playClick(); setZoomLevel(z => Math.max(z - 0.2, 0.6)); }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => { sound.playClick(); setRotation(r => (r + 90) % 360); }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => { sound.playClick(); setZoomLevel(1); setRotation(0); }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
              >
                Reset
              </button>
            </div>

            {/* Window Presets */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-[#626B77] mr-1">Window:</span>
              {(['Standard', 'Bone', 'Lung', 'Soft Tissue'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => { sound.playClick(); setWindowPreset(w); }}
                  className={`px-2 py-0.5 rounded ${
                    windowPreset === w ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden select-none">
            {/* DICOM Header Overlay */}
            <div className="absolute top-4 left-4 text-[11px] font-mono text-cyan-400/80 pointer-events-none space-y-0.5">
              <div>STUDY: {selectedStudy?.studyCode}</div>
              <div>PATIENT: {selectedStudy?.patientName}</div>
              <div>MODALITY: {selectedStudy?.modality}</div>
              <div>WINDOW: {windowPreset}</div>
            </div>

            <div className="absolute top-4 right-4 text-[11px] font-mono text-[#626B77] pointer-events-none text-right">
              <div>MEDICORE PACS 3.0</div>
              <div>ZOOM: {Math.round(zoomLevel * 100)}%</div>
              <div>ROT: {rotation}°</div>
            </div>

            {/* Scanned Image Rendering with simulated window filters */}
            <div
              className="max-w-md max-h-full transition-transform duration-100 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                filter:
                  windowPreset === 'Bone'
                    ? 'contrast(180%) brightness(120%)'
                    : windowPreset === 'Lung'
                    ? 'contrast(140%) brightness(80%)'
                    : windowPreset === 'Soft Tissue'
                    ? 'contrast(110%) brightness(105%)'
                    : 'none'
              }}
            >
              <img
                src={selectedStudy?.imageThumbnail || '/assets/hospital-care.jpg'}
                alt="Radiology Study Scan"
                className="rounded-lg shadow-2xl max-h-[420px] object-contain border border-slate-800"
              />
            </div>

            {/* Bottom Telemetry HUD */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[10px] font-mono text-[#626B77] pointer-events-none">
              <span>PACS UID: {selectedStudy?.pacsUid}</span>
              <span>16-bit Grayscale Lossless</span>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Report & Radiologist Signoff (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800 bg-slate-900 p-4 flex flex-col justify-between overflow-y-auto">
          <form onSubmit={handleSignOffReport} className="space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Clinical Diagnostic Report
              </span>
              <h3 className="font-serif font-bold text-sm font-bold text-white mt-1">{selectedStudy?.bodyPart}</h3>
              <p className="text-[11px] text-slate-400">Ordered by {selectedStudy?.orderedBy}</p>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Radiological Findings *</label>
              <textarea
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Enter detailed radiological observation..."
                rows={5}
                required
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Clinical Impression / Diagnosis *</label>
              <textarea
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                placeholder="Diagnostic conclusion..."
                rows={3}
                required
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Reporting Radiologist</label>
              <input
                type="text"
                value={radiologistName}
                onChange={(e) => setRadiologistName(e.target.value)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
              />
            </div>

            <div className="pt-2">
              {selectedStudy?.status === 'Verified' ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Report Digitally Signed & Locked</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Verified at {selectedStudy.verifiedAt}</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Sign & Authorize Radiology Report</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
