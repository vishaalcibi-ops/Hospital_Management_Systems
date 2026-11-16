/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MediCore HMS — Authorized Staff Patient Registration Modal
 * Enforces staff-only patient onboarding, duplicate contact prevention,
 * backend UHID generation, and automated activation token + mobile OTP dispatch.
 */

import React, { useState } from 'react';
import { sound } from '../../services/audioService';
import { authService, PatientRegistrationResult } from '../../services/authService';
import {
  UserPlus,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffName?: string;
  defaultDepartment?: string;
  onPatientRegistered?: (patientResult: PatientRegistrationResult) => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose,
  staffName = 'Authorized Hospital Staff',
  defaultDepartment = 'General Medicine',
  onPatientRegistered
}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(defaultDepartment);
  const [hospital, setHospital] = useState('MediCore Central Hospital (Flagship)');
  const [registrationSource, setRegistrationSource] = useState('Reception Desk');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationResult, setRegistrationResult] = useState<PatientRegistrationResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Full Name, Mobile Number, and Email Address are mandatory.');
      return;
    }

    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.registerPatient({
        name: name.trim(),
        dob,
        gender,
        bloodGroup,
        address: address.trim(),
        emergencyContactName: emergencyName.trim(),
        emergencyContactPhone: emergencyPhone.trim(),
        phone: phone.trim(),
        email: email.trim(),
        department,
        hospital,
        registrationSource,
        staffName
      });

      sound.playSuccess();
      setRegistrationResult(result);
      if (onPatientRegistered) {
        onPatientRegistered(result);
      }
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Patient registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyActivationLink = () => {
    if (registrationResult?.notificationStatus.simulatedActivationLink) {
      navigator.clipboard.writeText(registrationResult.notificationStatus.simulatedActivationLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1769AA] to-[#153B63] p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200 block">
                Staff Controlled Onboarding
              </span>
              <h2 className="text-lg font-black text-white">Register New Patient Record</h2>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Registration Halted</p>
                <p className="text-[11px] font-normal text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* SUCCESS DISPATCH SCREEN */}
          {registrationResult ? (
            <div className="space-y-4 py-2 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-[#182B42]">
                  Patient Registration Complete
                </h3>
                <p className="text-xs text-[#68788C] mt-0.5">
                  Record created with status <strong className="text-amber-600">PENDING_VERIFICATION</strong>.
                </p>
              </div>

              {/* UHID Card */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Generated UHID / Patient ID:</span>
                  <span className="font-mono font-black text-sm text-blue-900 bg-white px-2.5 py-0.5 rounded-md border border-blue-200">
                    {registrationResult.uhid}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Full Name:</span>
                  <strong className="text-slate-800">{name}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Contact Email:</span>
                  <span className="text-slate-800">{email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Contact Mobile:</span>
                  <span className="text-slate-800">{phone}</span>
                </div>
              </div>

              {/* Dispatch Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Mobile SMS OTP Dispatch:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px] font-bold">
                    {registrationResult.notificationStatus.smsProvider}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Email Activation Dispatch:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px] font-bold">
                    {registrationResult.notificationStatus.emailProvider}
                  </span>
                </div>

                {/* Dev Test Quick Link & OTP */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-blue-900 block">
                    ⚡ Quick Testing Link &amp; OTP (For Local Verification):
                  </span>
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                    <span className="text-slate-500 font-semibold">Simulated 6-Digit OTP:</span>
                    <strong className="text-blue-700 font-mono text-sm tracking-wider">
                      {registrationResult.notificationStatus.simulatedOtp}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyActivationLink}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-1.5 transition"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Activation Link'}</span>
                    </button>
                    <a
                      href={registrationResult.notificationStatus.simulatedActivationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 rounded-xl bg-[#1769AA] hover:bg-[#153B63] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <span>Open Activation Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          ) : (
            /* REGISTRATION INPUT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SECTION A: PERSONAL INFORMATION */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#153B63] pb-1.5 mb-2.5 border-b border-slate-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>1. Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Devika Krishnan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Blood Group (Optional)</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 42 Sunrise Avenue, Kochi, Kerala"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Arun Krishnan (Spouse)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="e.g. +91 98450 12345"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: CONTACT INFORMATION */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#153B63] pb-1.5 mb-2.5 border-b border-slate-100 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>2. Contact Information (Used for Activation)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number (Receives OTP) *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address (Receives Link) *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="patient.email@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: HOSPITAL INFORMATION */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#153B63] pb-1.5 mb-2.5 border-b border-slate-100 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>3. Hospital Logistics</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Attending Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopaedics">Orthopaedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Oncology">Oncology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hospital Node</label>
                    <input
                      type="text"
                      value={hospital}
                      readOnly
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Intake Source</label>
                    <select
                      value={registrationSource}
                      onChange={(e) => setRegistrationSource(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white"
                    >
                      <option value="Reception Desk">Reception Desk</option>
                      <option value="Emergency Trauma">Emergency Trauma</option>
                      <option value="OPD Specialist Clinic">OPD Specialist Clinic</option>
                      <option value="Executive Referral">Executive Referral</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1769AA] hover:bg-[#153B63] text-white font-bold text-xs tracking-tight shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Generating UHID & Dispatching OTP...' : 'Register Patient & Generate Activation Token'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
