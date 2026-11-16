/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — ABDM Ayushman Bharat Digital Mission (ABHA) Integration
 * 14-digit ABHA ID generator, Aadhaar OTP simulation & printable National Digital Health Card.
 */

import React, { useState } from 'react';
import { sound } from '../../services/audioService';
import { AbhaProfile } from '../../types';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Printer,
  Sparkles,
  X,
  CreditCard,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface IndianHealthcareAbhaModalProps {
  onClose: () => void;
  onSuccess?: (abha: AbhaProfile) => void;
}

export const IndianHealthcareAbhaModal: React.FC<IndianHealthcareAbhaModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'input' | 'otp' | 'card'>('input');
  const [aadhaarOrMobile, setAadhaarOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1988-06-15');
  const [gender, setGender] = useState('Male');
  const [abhaAddressPrefix, setAbhaAddressPrefix] = useState('');

  const [generatedCard, setGeneratedCard] = useState<AbhaProfile | null>(null);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarOrMobile.trim()) return;
    sound.playSuccess();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const card: AbhaProfile = {
      abhaNumber: randomAbha,
      abhaAddress: `${(abhaAddressPrefix || fullName || 'patient').toLowerCase().replace(/\s+/g, '')}@abdm`,
      fullName: fullName || 'Rajesh Ramesh Kumar',
      gender: gender,
      dob: dob,
      mobile: aadhaarOrMobile.length === 10 ? aadhaarOrMobile : '+91 98765 43210',
      verificationStatus: 'Verified with Aadhaar',
      consentGranted: true,
      linkedHospitalCount: 3
    };

    setGeneratedCard(card);
    setStep('card');
    if (onSuccess) onSuccess(card);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0F2744] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Ayushman Bharat Digital Mission</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/30">
                  ABHA / ABDM
                </span>
              </div>
              <p className="text-xs text-slate-300">National Health Authority (NHA) • 14-Digit Digital Health ID</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Create or link your 14-digit ABHA ID to share digital health records seamlessly across Indian hospitals.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">12-Digit Aadhaar or Mobile Number</label>
                <input
                  type="text"
                  required
                  value={aadhaarOrMobile}
                  onChange={(e) => setAadhaarOrMobile(e.target.value)}
                  placeholder="Enter 12-digit Aadhaar or 10-digit mobile..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred ABHA Handle (e.g., name@abdm)</label>
                <div className="flex">
                  <input
                    type="text"
                    value={abhaAddressPrefix}
                    onChange={(e) => setAbhaAddressPrefix(e.target.value)}
                    placeholder="rajesh.kumar"
                    className="flex-1 px-3.5 py-2 text-xs rounded-l-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 text-slate-600 text-xs font-semibold rounded-r-xl">
                    @abdm
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-colors flex items-center justify-center gap-2"
                >
                  Request Aadhaar OTP Verification <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs">
                <p className="font-semibold">OTP Sent Successfully</p>
                <p className="text-slate-600 mt-1">A 6-digit one-time password has been simulated and sent to your registered mobile linked to {aadhaarOrMobile}.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4 5 6"
                  className="w-full tracking-widest text-center font-mono text-lg py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Didn't receive code?</span>
                <button type="button" onClick={() => sound.playClick()} className="text-blue-600 font-semibold hover:underline">
                  Resend OTP
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2"
                >
                  Verify & Issue Official ABHA Card
                </button>
              </div>
            </form>
          )}

          {step === 'card' && generatedCard && (
            <div className="space-y-4">
              {/* Official ABHA Card Visual */}
              <div className="relative rounded-2xl p-5 text-white shadow-xl overflow-hidden bg-gradient-to-br from-[#0F2744] via-[#1E3A8A] to-[#1E293B] border border-blue-900">
                <div className="flex items-center justify-between border-b border-blue-400/20 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-black text-xs">
                      AB
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Ayushman Bharat</p>
                      <p className="text-xs font-bold text-white leading-tight">Digital Health Card</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold">
                    ACTIVE • VERIFIED
                  </span>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider">Cardholder Name</p>
                    <p className="text-base font-bold text-white tracking-wide">{generatedCard.fullName}</p>
                    <p className="text-xs font-mono text-cyan-300 mt-1">{generatedCard.abhaAddress}</p>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-400">DOB:</span> {generatedCard.dob}
                      </div>
                      <div>
                        <span className="text-slate-400">Gender:</span> {generatedCard.gender}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl text-slate-900 shadow-md">
                    <QrCode className="w-16 h-16 text-slate-900" />
                    <p className="text-[8px] font-mono font-bold text-center mt-1 text-slate-500">SCAN ABHA</p>
                  </div>
                </div>

                <div className="border-t border-blue-400/20 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-400">ABHA Number (14-Digit)</p>
                    <p className="text-sm font-mono font-black text-white tracking-wider">{generatedCard.abhaNumber}</p>
                  </div>
                  <span className="text-[9px] text-slate-400">Govt. of India</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => sound.playSuccess()}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-500" /> Print Digital Card
                </button>
                <button
                  onClick={() => { sound.playClick(); onClose(); }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Done & Link to MediCore
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
