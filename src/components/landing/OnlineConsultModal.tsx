/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Practo / Apollo 24/7-Inspired Online Tele-Consultation Studio
 * High-fidelity interactive teleconsultation with video interface, chat, vitals and e-Rx.
 */

import React, { useState } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  FileText,
  User,
  ShieldCheck,
  Send,
  X,
  Sparkles,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface OnlineConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId?: string;
}

export const OnlineConsultModal: React.FC<OnlineConsultModalProps> = ({
  isOpen,
  onClose,
  doctorId
}) => {
  const doctors = db.getDoctors();
  const doctor = doctors.find(d => d.id === doctorId) || doctors[0];

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'chat'>('video');
  const [messages, setMessages] = useState<{ sender: 'doc' | 'user'; text: string; time: string }[]>([
    {
      sender: 'doc',
      text: `Hello! I am ${doctor.name}. I have reviewed your latest vitals. How are you feeling right now?`,
      time: '10:02 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [prescriptionSent, setPrescriptionSent] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = {
      sender: 'user' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    sound.playClick();

    setTimeout(() => {
      const docReply = {
        sender: 'doc' as const,
        text: `Understood. I am recording these symptoms in your clinical EMR. I will issue an e-prescription with your dosage regimen immediately.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, docReply]);
      sound.playMessage();
    }, 1200);
  };

  const handleIssuePrescription = () => {
    sound.playSuccess();
    setPrescriptionSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-white font-bold text-base">{doctor.name}</h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Secure HD Telehealth
                </span>
              </div>
              <p className="text-xs text-slate-400">{doctor.title} · {doctor.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-bit Encrypted Consultation</span>
            </div>
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden bg-slate-950">
          {/* Main Video Screen (2 cols) */}
          <div className="lg:col-span-2 relative flex flex-col justify-between p-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
            {/* Doctor Primary Video View */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Doctor Details Overlay */}
              <div className="absolute bottom-4 left-4 text-white z-10">
                <span className="text-[11px] font-semibold bg-blue-600/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                  Attending Physician: {doctor.name}
                </span>
                <p className="text-xs text-slate-300 mt-1">Live from MediCore Digital OPD Station 3</p>
              </div>

              {/* Patient Self Video Inset PIP */}
              <div className="absolute top-4 right-4 w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden border-2 border-blue-500/80 shadow-2xl bg-slate-800">
                {isVideoOn ? (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-2 text-[10px] text-white/90 bg-slate-900/70 px-1 rounded">
                      You (Patient)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-xs">
                    <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                    <span>Camera Off</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Call Controls Bar */}
            <div className="flex items-center justify-center gap-3 py-3 mt-2">
              <button
                onClick={() => { sound.playClick(); setIsMicOn(!isMicOn); }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => { sound.playClick(); setIsVideoOn(!isVideoOn); }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg ${
                  isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-14 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition font-bold"
                title="End Consultation"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Clinical Sidebar (Chat & e-Rx) */}
          <div className="border-l border-slate-800 bg-slate-900/95 flex flex-col h-full">
            {/* Tab selector */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => { sound.playClick(); setActiveTab('chat'); }}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === 'chat' ? 'border-blue-500 text-blue-400 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Live Chat
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveTab('notes'); }}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === 'notes' ? 'border-blue-500 text-blue-400 bg-slate-800/40' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Prescription & EMR
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'chat' ? (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type symptom or question to doctor..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
                    <Activity className="w-4 h-4" />
                    <span>Real-Time Clinical Vitals</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>BP: <strong className="text-white">122/80 mmHg</strong></div>
                    <div>Pulse: <strong className="text-white">74 bpm</strong></div>
                    <div>SpO2: <strong className="text-white">99%</strong></div>
                    <div>Temp: <strong className="text-white">98.4°F</strong></div>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <h6 className="text-xs font-bold text-white mb-2">Doctor's SOAP Evaluation</h6>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Patient reports mild recurrent symptoms. Heart rhythm regular with normal S1/S2. Recommended course of symptomatic therapy and review in 7 days.
                  </p>
                </div>

                {prescriptionSent ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h5 className="text-sm font-bold text-white">E-Prescription Generated!</h5>
                    <p className="text-xs text-emerald-200">
                      Dispatched to MediCore Digital Pharmacy & stored in your Patient Health Card.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleIssuePrescription}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Authorize & Issue Digital E-Prescription</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
