/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Enterprise Internal Portal Authentication Gateway
 * Global Internal Design System: #153B63 Navy, #1769AA Medical Blue, #F5F8FC Canvas.
 * Distinct role profiles and 100% preservation of all 5 original login portals.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Patient, Doctor, ThemeMode } from '../../types';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Heart,
  Stethoscope,
  Activity,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Server,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  KeyRound
} from 'lucide-react';

export type AuthPortalCategory = 'patient' | 'doctor' | 'nurse' | 'admin' | 'super-admin';

interface UnifiedPortalAuthProps {
  theme: ThemeMode;
  initialCategory?: AuthPortalCategory;
  onLoginPatient: (patient: Patient) => void;
  onLoginDoctor: (doctor?: Doctor) => void;
  onLoginNurse: (nurseName?: string) => void;
  onLoginAdmin?: (adminName?: string) => void;
  onLoginSuperAdmin?: (superAdminName?: string) => void;
  onBackToLanding?: () => void;
}

interface AuthorizedStaffAccount {
  allowedEmails: string[];
  allowedPasswords: string[];
  role: 'DOCTOR' | 'NURSE' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN';
  portalCategory: Exclude<AuthPortalCategory, 'patient'>;
  name: string;
  doctorData?: (doctors: Doctor[]) => Doctor | undefined;
}

const AUTHORIZED_MANAGEMENT_ACCOUNTS: Record<Exclude<AuthPortalCategory, 'patient'>, AuthorizedStaffAccount[]> = {
  doctor: [
    {
      allowedEmails: ['medicore.doctor@gmail.com'],
      allowedPasswords: ['Doctor@2026'],
      role: 'DOCTOR',
      portalCategory: 'doctor',
      name: 'Dr. Roger Sterling, MD (Chief Cardiologist)',
      doctorData: (docs: Doctor[]) => docs.find(d => d.specialization?.toLowerCase().includes('cardio')) || docs[0]
    }
  ],
  nurse: [
    {
      allowedEmails: ['medicore.nurse@gmail.com'],
      allowedPasswords: ['Nurse@2026'],
      role: 'NURSE',
      portalCategory: 'nurse',
      name: 'Nurse Sarah Jenkins, RN, BSN (Head Nurse)',
    }
  ],
  admin: [
    {
      allowedEmails: ['medicore.admin@gmail.com'],
      allowedPasswords: ['Admin@2026'],
      role: 'HOSPITAL_ADMIN',
      portalCategory: 'admin',
      name: 'Executive Director David Vance (Operations & Wards)',
    }
  ],
  'super-admin': [
    {
      allowedEmails: ['medicore.superadmin@gmail.com'],
      allowedPasswords: ['SuperAdmin@2026'],
      role: 'SUPER_ADMIN',
      portalCategory: 'super-admin',
      name: 'Dr. Eleanor Vance, MD, CISSP (Enterprise Command)',
    }
  ]
};

const PORTAL_CONFIG: Record<AuthPortalCategory, {
  label: string;
  roleBadge: string;
  tagline: string;
  desc: string;
  icon: React.ElementType;
  primaryColor: string;
  accentColor: string;
  lightBg: string;
  demoEmail: string;
  demoPassword: string;
}> = {
  'super-admin': {
    label: 'Super Admin',
    roleBadge: 'Enterprise Governance',
    tagline: 'Multi-facility governance, security telemetry & failover command',
    desc: 'Access audit streams, server failovers, user roles & system architecture',
    icon: ShieldCheck,
    primaryColor: '#153B63',
    accentColor: '#1769AA',
    lightBg: '#EAF4FC',
    demoEmail: 'medicore.superadmin@gmail.com',
    demoPassword: 'SuperAdmin@2026',
  },
  admin: {
    label: 'Executive Admin',
    roleBadge: 'Hospital Operations',
    tagline: 'Hospital operations, bed management, ward status & ICU surge',
    desc: 'Manage inpatient admissions, discharges, OT scheduling & department flow',
    icon: Building2,
    primaryColor: '#1769AA',
    accentColor: '#287FC1',
    lightBg: '#EAF4FC',
    demoEmail: 'medicore.admin@gmail.com',
    demoPassword: 'Admin@2026',
  },
  doctor: {
    label: 'Doctor Station',
    roleBadge: 'Clinical Workspace',
    tagline: 'Clinical consultation desk, e-prescriptions, EMR & CDS alerts',
    desc: 'Review lab orders, author SOAP notes, and manage outpatient clinic rounds',
    icon: Stethoscope,
    primaryColor: '#0D9488',
    accentColor: '#1769AA',
    lightBg: '#F0FDFA',
    demoEmail: 'medicore.doctor@gmail.com',
    demoPassword: 'Doctor@2026',
  },
  nurse: {
    label: 'Head Nurse',
    roleBadge: 'Nursing Operations',
    tagline: 'Ward rounds, MEWS acuity tracking, eMAR & SBAR shift handovers',
    desc: 'Monitor bedside vitals, medication administration, and patient turnover',
    icon: Activity,
    primaryColor: '#18865B',
    accentColor: '#0D9488',
    lightBg: '#EAF7F1',
    demoEmail: 'medicore.nurse@gmail.com',
    demoPassword: 'Nurse@2026',
  },
  patient: {
    label: 'Patient Portal',
    roleBadge: 'Personal Health',
    tagline: 'Personal health passport, lab reports, e-Rx & appointment records',
    desc: 'View diagnostic scans, manage prescription reminders, and track billing',
    icon: Heart,
    primaryColor: '#287FC1',
    accentColor: '#7C3AED',
    lightBg: '#EFF6FF',
    demoEmail: 'medicore.patient@gmail.com',
    demoPassword: 'patient123',
  },
};

export const UnifiedPortalAuth: React.FC<UnifiedPortalAuthProps> = ({
  initialCategory = 'admin',
  onLoginPatient,
  onLoginDoctor,
  onLoginNurse,
  onLoginAdmin,
  onLoginSuperAdmin,
  onBackToLanding,
}) => {
  const [portalCategory, setPortalCategory] = useState<AuthPortalCategory>(initialCategory);

  React.useEffect(() => {
    localStorage.removeItem('medicore_authenticated');
  }, []);

  React.useEffect(() => {
    setPortalCategory(initialCategory);
  }, [initialCategory]);

  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1990-01-01');

  const existingPatients = db.getPatients();
  const existingDoctors = db.getDoctors();
  const config = PORTAL_CONFIG[portalCategory];

  const handleCategorySwitch = (cat: AuthPortalCategory) => {
    sound.playClick();
    setPortalCategory(cat);
    setAuthView('login');
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
  };

  const fillDemo = () => {
    sound.playClick();
    setEmail(config.demoEmail);
    setPassword(config.demoPassword);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputEmail) {
      setErrorMessage(portalCategory === 'patient' ? 'Please enter your email or Patient Code.' : 'Please enter your official authorized email.');
      return;
    }
    if (!inputPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    sound.playClick();

    setTimeout(() => {
      // 1. PATIENT PORTAL LOGIN
      if (portalCategory === 'patient') {
        const dbPatient = existingPatients.find(
          p => p.email?.toLowerCase() === inputEmail ||
               p.patientCode?.toLowerCase() === inputEmail ||
               p.id?.toLowerCase() === inputEmail
        );

        if (dbPatient || inputEmail === 'medicore.patient@gmail.com') {
          const targetPatient = dbPatient || existingPatients[0];
          
          let expectedPass = 'patient123';
          try {
            const registered = JSON.parse(localStorage.getItem('medicore_registered_patients') || '[]');
            const customReg = registered.find((p: any) => p.email?.toLowerCase() === inputEmail || p.id === targetPatient.id);
            if (customReg?.password) {
              expectedPass = customReg.password;
            } else if ((targetPatient as any).password) {
              expectedPass = (targetPatient as any).password;
            }
          } catch {}

          if (inputPass !== expectedPass) {
            setLoading(false);
            sound.playWarning();
            setErrorMessage('Invalid credentials. For demonstration, use password: patient123');
            return;
          }

          sound.playSuccess();
          setSuccessMessage(`Access Granted: Welcome, ${targetPatient.name}! Opening Patient Health Portal...`);
          setTimeout(() => onLoginPatient(targetPatient), 400);
          setLoading(false);
          return;
        }

        try {
          const registered = JSON.parse(localStorage.getItem('medicore_registered_patients') || '[]');
          const matched = registered.find((p: any) => p.email?.toLowerCase() === inputEmail || p.patientCode?.toLowerCase() === inputEmail);
          if (matched) {
            const expectedPass = matched.password || 'patient123';
            if (inputPass !== expectedPass) {
              setLoading(false);
              sound.playWarning();
              setErrorMessage('Invalid credentials. Please enter the valid password.');
              return;
            }
            sound.playSuccess();
            setSuccessMessage(`Access Granted: Welcome, ${matched.name}! Opening Patient Health Portal...`);
            setTimeout(() => onLoginPatient(matched), 400);
            setLoading(false);
            return;
          }
        } catch {}

        setLoading(false);
        sound.playWarning();
        setErrorMessage('No patient account found with this email. Please click "Quick Demo Fill" or register below.');
        return;
      } 
      // 2. MANAGEMENT ROLES (Doctor, Nurse, Admin, Super Admin)
      else {
        const categoryAccounts = AUTHORIZED_MANAGEMENT_ACCOUNTS[portalCategory];
        
        const matchedAccount = categoryAccounts.find(acc => 
          acc.allowedEmails.some(ae => ae.toLowerCase() === inputEmail)
        );

        if (!matchedAccount) {
          setLoading(false);
          sound.playWarning();
          setErrorMessage('Email not recognized. Click "Quick Demo Fill" to auto-load official test credentials.');
          return;
        }

        const passwordMatches = matchedAccount.allowedPasswords.some(ap => ap === inputPass);
        if (!passwordMatches) {
          setLoading(false);
          sound.playWarning();
          setErrorMessage('Password incorrect for this account. Please use the valid password.');
          return;
        }

        sound.playSuccess();
        if (portalCategory === 'doctor') {
          const doctorObj = (matchedAccount.doctorData && matchedAccount.doctorData(existingDoctors)) || existingDoctors[0];
          setSuccessMessage(`Access Granted: Welcome, ${matchedAccount.name}! Opening Doctor Clinical Station...`);
          setTimeout(() => onLoginDoctor(doctorObj), 400);
        } else if (portalCategory === 'nurse') {
          setSuccessMessage(`Access Granted: Welcome, ${matchedAccount.name}! Opening Head Nurse Station...`);
          setTimeout(() => onLoginNurse(matchedAccount.name), 400);
        } else if (portalCategory === 'admin') {
          setSuccessMessage(`Access Granted: Welcome, ${matchedAccount.name}! Opening Hospital Operations Portal...`);
          setTimeout(() => { if (onLoginAdmin) onLoginAdmin(matchedAccount.name); }, 400);
        } else if (portalCategory === 'super-admin') {
          setSuccessMessage(`Enterprise Clearance Verified: Welcome, ${matchedAccount.name}! Opening Command Center...`);
          setTimeout(() => { if (onLoginSuperAdmin) onLoginSuperAdmin(matchedAccount.name); }, 400);
        }
      }
      setLoading(false);
    }, 450);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setErrorMessage('Please enter your full name.'); return; }
    if (!email.trim()) { setErrorMessage('Please enter your email.'); return; }
    if (!password.trim() || password.length < 6) { setErrorMessage('Password must be at least 6 characters.'); return; }

    setLoading(true);
    sound.playClick();

    setTimeout(() => {
      const newPatient: Patient = {
        id: `pat-reg-${Date.now()}`,
        patientCode: `P-${Math.floor(10000 + Math.random() * 90000)}`,
        name: fullName.trim(),
        age: 34,
        gender: gender as any,
        bloodGroup: 'O+',
        phone: phone.trim() || '+91 98765 43210',
        email: email.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        admissionStatus: 'Outpatient',
        ward: 'Outpatient Clinic',
        bedNumber: 'OPD-102',
        primaryDoctorId: 'doc-1',
        primaryDoctorName: 'Dr. Roger Sterling, MD',
        diagnosis: 'Routine Preventive Examination',
        heartAge: 32,
        chronologicalAge: 34,
        riskScore: 15,
        vitals: {
          bloodPressure: '120/80',
          pulseRate: 72,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          temperature: 36.8,
          hba1c: 5.1,
          cholesterol: 185,
          stressLevel: 'Mild',
          sleepQuality: 'Good',
          lastUpdated: 'Just now',
        },
        symptoms: [],
        allergies: [],
        medicalHistory: [],
      };
      
      try {
        const existingReg = JSON.parse(localStorage.getItem('medicore_registered_patients') || '[]');
        localStorage.setItem('medicore_registered_patients', JSON.stringify([...existingReg, newPatient]));
      } catch {}

      db.addPatient(newPatient);
      sound.playSuccess();
      setSuccessMessage(`Account created for ${newPatient.name}! Redirecting to Patient Portal...`);
      setTimeout(() => onLoginPatient(newPatient), 500);
      setLoading(false);
    }, 600);
  };

  const portalTabs: AuthPortalCategory[] = ['super-admin', 'admin', 'doctor', 'nurse', 'patient'];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex text-[#182B42] font-sans antialiased">
      {/* ===== LEFT PANEL: Enterprise Hospital Operations & Trust Marks ===== */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[480px] xl:w-[520px] flex-shrink-0 relative overflow-hidden text-white shadow-2xl bg-gradient-to-br from-[#153B63] via-[#174A7C] to-[#0F2744]">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Top Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#1A2332] flex items-center justify-center font-bold text-white shadow-lg shadow-black/20 border border-white/20 shrink-0">
              <img
                src="/assets/medicore-logo.png"
                alt="MediCore Logo"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-2xl" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>MEDICORE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/15 text-blue-200 border border-white/10 uppercase tracking-widest">
                  OS 2.0
                </span>
              </div>
              <p className="text-xs text-blue-200/80">Enterprise Hospital Operating & Clinical Intelligence</p>
            </div>
          </div>
        </div>

        {/* Center Portal Context Card */}
        <motion.div
          key={portalCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 shadow-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${config.accentColor}40`, color: '#FFFFFF' }}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: config.accentColor }} />
            <span>{config.roleBadge}</span>
          </div>

          <h2 className="text-2xl font-bold text-white leading-snug">
            {config.tagline}
          </h2>

          <p className="text-xs text-blue-100/90 leading-relaxed">
            {config.desc}
          </p>

          <div className="pt-3 border-t border-white/15 grid grid-cols-2 gap-3 text-[11px] text-blue-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>NABH 5th Ed. Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-300" />
              <span>NABL ISO 15189 LIS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>ABDM Interoperable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              <span>HIPAA / 256-bit AES</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/70 border-t border-white/15 pt-4">
          <span>PostgreSQL & MySQL Dual-Engine</span>
          <span>1,000 Live Clinical Records</span>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Modern Authentication Form ===== */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        {/* Top return shortcut */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E1E8F0]">
          {onBackToLanding ? (
            <button
              onClick={() => { sound.playClick(); onBackToLanding(); }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1769AA] hover:text-[#153B63] transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-[#EAF4FC] flex items-center justify-center text-[#1769AA] group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
                ←
              </span>
              <span>Back to Public Hospital Website</span>
            </button>
          ) : <div />}

          <span className="text-xs font-semibold text-[#68788C]">
            Enterprise Gateway
          </span>
        </div>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#182B42] tracking-tight">
              Sign In to MediCore
            </h1>
            <p className="text-xs text-[#68788C] mt-1">
              Select your authorization portal to access operational tools and records.
            </p>
          </div>

          {/* 5-Portal Category Tabs */}
          <div className="mb-6 p-1.5 rounded-2xl bg-[#EAF4FC] border border-[#E1E8F0] grid grid-cols-5 gap-1">
            {portalTabs.map((tab) => {
              const cfg = PORTAL_CONFIG[tab];
              const TabIcon = cfg.icon;
              const isActive = portalCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleCategorySwitch(tab)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                    isActive
                      ? 'bg-white text-[#153B63] shadow-md font-bold'
                      : 'text-[#68788C] hover:text-[#182B42] hover:bg-white/50 font-medium'
                  }`}
                >
                  <TabIcon className="w-4 h-4 mb-1" style={{ color: isActive ? cfg.primaryColor : undefined }} />
                  <span className="text-[10px] leading-tight line-clamp-1">{cfg.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Portal Header & Demo Credentials Trigger */}
          <div className="mb-6 p-4 rounded-2xl border border-[#E1E8F0] bg-white shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: config.primaryColor }}>
                <config.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#182B42]">{config.label}</h3>
                <p className="text-[11px] text-[#68788C]">{config.roleBadge}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              style={{ backgroundColor: config.lightBg, color: config.primaryColor }}
              title="Click to fill test credentials"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Quick Demo Fill</span>
            </button>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#182B42] mb-1.5">
                  {portalCategory === 'patient' ? 'Email or Patient UHID' : 'Authorized Official Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#68788C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={config.demoEmail}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#182B42] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#182B42]">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="text-[11px] text-[#1769AA] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#68788C] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#182B42] shadow-2xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#68788C] hover:text-[#182B42]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                style={{ backgroundColor: config.primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating Clearance...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {config.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Patient Self-Registration View */}
          {authView === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#182B42] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#182B42] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#182B42] mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182B42] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182B42] mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182B42] mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E1E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-xs bg-[#1769AA] hover:bg-[#153B63] shadow-md transition-colors"
              >
                Create Health Account & Enter Portal
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="text-xs text-[#1769AA] font-bold hover:underline"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* Patient toggle at bottom */}
          {portalCategory === 'patient' && authView === 'login' && (
            <div className="mt-6 pt-4 border-t border-[#E1E8F0] text-center">
              <span className="text-xs text-[#68788C]">New patient at MediCore? </span>
              <button
                type="button"
                onClick={() => setAuthView('signup')}
                className="text-xs text-[#1769AA] font-bold hover:underline"
              >
                Create Digital Health Account
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#68788C] pt-6 border-t border-[#E1E8F0]">
          MediCore Enterprise Hospital Operating System · HIPAA & NABH Compliant · ISO 27001 Security
        </div>
      </div>
    </div>
  );
};
