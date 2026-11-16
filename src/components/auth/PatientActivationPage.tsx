/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MediCore HMS — Dedicated Patient Account Activation Page
 * Two-stage cryptographic verification: 6-digit mobile OTP verification
 * followed by patient-created secure password hashing and UHID account activation.
 */

import React, { useState, useEffect } from 'react';
import { sound } from '../../services/audioService';
import { authService, ActivationInfo } from '../../services/authService';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Smartphone,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  FileCheck2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PatientActivationPageProps {
  token: string;
  onGoToPatientLogin?: () => void;
  onActivationSuccess?: () => void;
  onGoToLanding?: () => void;
  onBackToLanding?: () => void;
}

export const PatientActivationPage: React.FC<PatientActivationPageProps> = ({
  token,
  onGoToPatientLogin,
  onActivationSuccess,
  onGoToLanding,
  onBackToLanding
}) => {
  const handleSuccess = () => {
    if (onGoToPatientLogin) onGoToPatientLogin();
    if (onActivationSuccess) onActivationSuccess();
  };

  const handleLanding = () => {
    if (onGoToLanding) onGoToLanding();
    if (onBackToLanding) onBackToLanding();
  };
  const [activationInfo, setActivationInfo] = useState<ActivationInfo | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Step 1: Mobile OTP state
  const [otp, setOtp] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Step 2: Password setup state
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Step 3: Success state
  const [isActivated, setIsActivated] = useState<boolean>(false);

  // Fetch activation session details
  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        const info = await authService.getActivationInfo(token);
        if (isMounted) {
          setActivationInfo(info);
          if (info.mobileVerified) {
            setOtpVerified(true);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setLoadError(err.message || 'Invalid or expired activation link.');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    if (token) {
      fetchSession();
    } else {
      setLoadError('No activation token provided. Please use the link provided by hospital staff.');
      setInitialLoading(false);
    }

    return () => { isMounted = false; };
  }, [token]);

  // Live password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&#^+=~_-]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong (HIPAA Recommended)', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  // Submit Mobile OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setOtpError('Please enter the 6-digit numeric OTP sent to your phone.');
      return;
    }

    sound.playClick();
    setOtpLoading(true);
    setOtpError(null);

    try {
      await authService.verifyMobileOtp(token, otp.trim());
      sound.playSuccess();
      setOtpVerified(true);
    } catch (err: any) {
      sound.playWarning();
      setOtpError(err.message || 'OTP verification failed. Please check the code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit Password creation and complete activation
  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setPasswordError('Please enter and confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (strength.score < 2) {
      setPasswordError('Please choose a stronger password (at least 8 chars with mixed case, number, and symbol).');
      return;
    }

    if (!termsAccepted) {
      setPasswordError('You must agree to the Terms of Service & Healthcare Privacy Consent.');
      return;
    }

    sound.playClick();
    setPasswordLoading(true);
    setPasswordError(null);

    try {
      await authService.activatePatient(token, password, confirmPassword);
      sound.playSuccess();
      setIsActivated(true);
    } catch (err: any) {
      sound.playWarning();
      setPasswordError(err.message || 'Activation failed. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-between selection:bg-[#1769AA] selection:text-white font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E1E8F0] px-6 sm:px-10 py-3.5 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => { sound.playClick(); handleLanding(); }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1769AA] to-[#287FC1] text-white flex items-center justify-center font-black shadow-md">
            ✚
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-serif font-black tracking-tight text-[#153B63]">
                MEDICORE
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                PATIENT ACTIVATION
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => { sound.playClick(); handleLanding(); }}
          className="text-xs font-semibold text-[#68788C] hover:text-[#182B42] flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>
      </header>

      {/* Main Activation Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E1E8F0] shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#1769AA] to-[#153B63] p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Patient Account Activation
              </span>
              <span className="text-xs text-blue-200 font-bold">• Step-by-Step Onboarding</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Activate Your MediCore Health Passport
            </h1>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
              Verify your mobile number and create your confidential password to access your longitudinal medical records, lab reports, and doctor consultations.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Loading Skeleton */}
            {initialLoading && (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Verifying activation token...</p>
              </div>
            )}

            {/* Load Error */}
            {loadError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Activation Link Invalid or Expired</span>
                </div>
                <p className="text-[11px] text-rose-700">{loadError}</p>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); handleLanding(); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Return to Home Page
                </button>
              </div>
            )}

            {/* ACTIVATION COMPLETE SUCCESS STATE */}
            {isActivated && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#182B42]">
                    Your MediCore Patient Portal account is ready.
                  </h2>
                  <p className="text-xs text-[#68788C] mt-1">
                    Your password has been securely hashed and your Patient ID has been linked.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E1E8F0] max-w-sm mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#68788C]">Patient ID / UHID:</span>
                    <strong className="text-[#1769AA] font-mono font-black">{activationInfo?.uhid}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68788C]">Registered Email:</span>
                    <strong className="text-[#182B42] font-semibold">{activationInfo?.email}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68788C]">Account Status:</span>
                    <strong className="text-emerald-700 font-bold">Active &amp; Verified ✓</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { sound.playClick(); handleSuccess(); }}
                  className="w-full py-3 px-4 rounded-xl bg-[#287FC1] hover:bg-[#153B63] text-white font-bold text-sm tracking-tight shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Patient Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ACTIVE FORM FLOW */}
            {!initialLoading && !loadError && !isActivated && activationInfo && (
              <div className="space-y-6">
                {/* Patient Information Card */}
                <div className="p-4 rounded-2xl bg-[#EAF4FC]/60 border border-[#287FC1]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 block">
                      Patient Identity Verified
                    </span>
                    <h3 className="font-extrabold text-sm text-[#182B42] mt-0.5">
                      {activationInfo.patientName}
                    </h3>
                    <p className="text-[#68788C] text-[11px] mt-0.5">
                      Registered Email: <strong className="text-[#182B42]">{activationInfo.email}</strong>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Hospital UHID</span>
                    <span className="font-mono font-black text-sm text-[#153B63] bg-white px-2.5 py-1 rounded-lg border border-blue-200 inline-block shadow-2xs">
                      {activationInfo.uhid}
                    </span>
                  </div>
                </div>

                {/* STEP 1: MOBILE OTP VERIFICATION */}
                <div className={`p-5 rounded-2xl border transition-all ${otpVerified ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-[#E1E8F0]'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${otpVerified ? 'bg-emerald-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                        {otpVerified ? '✓' : '1'}
                      </div>
                      <span className="font-bold text-xs text-[#182B42]">
                        Step 1: Mobile Phone Verification
                      </span>
                    </div>
                    {otpVerified && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified ✓
                      </span>
                    )}
                  </div>

                  {!otpVerified ? (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <p className="text-xs text-[#68788C]">
                        Enter the 6-digit OTP code sent to your registered phone number (<strong>{activationInfo.maskedPhone}</strong>):
                      </p>

                      {otpError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <p>{otpError}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          required
                          className="flex-1 px-4 py-2.5 text-center text-lg tracking-[0.4em] font-mono font-bold rounded-xl border border-[#E1E8F0] focus:border-[#1769AA] focus:ring-1 focus:ring-[#1769AA] outline-none"
                        />
                        <button
                          type="submit"
                          disabled={otpLoading || otp.length !== 6}
                          className="px-5 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#153B63] text-white font-bold text-xs transition shadow-sm disabled:opacity-40 cursor-pointer"
                        >
                          {otpLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-xs text-emerald-800 font-medium">
                      Mobile number confirmed. Please proceed to create your password below.
                    </p>
                  )}
                </div>

                {/* STEP 2: CREATE SECURE PASSWORD */}
                <div className={`p-5 rounded-2xl border transition-all ${!otpVerified ? 'opacity-40 pointer-events-none bg-slate-50 border-slate-200' : 'bg-white border-[#E1E8F0]'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">
                      2
                    </div>
                    <span className="font-bold text-xs text-[#182B42]">
                      Step 2: Create Confidential Password
                    </span>
                  </div>

                  <form onSubmit={handleActivateAccount} className="space-y-4">
                    {passwordError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <p>{passwordError}</p>
                      </div>
                    )}

                    {/* Password input */}
                    <div>
                      <label className="block text-xs font-bold text-[#182B42] mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Create at least 8 characters"
                          className="w-full px-3 pr-10 py-2.5 text-sm rounded-xl border border-[#E1E8F0] focus:border-[#1769AA] focus:ring-1 focus:ring-[#1769AA] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#68788C] hover:text-[#182B42]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#68788C]">Strength:</span>
                            <span className="font-bold text-[#182B42]">{strength.label}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${strength.color}`}
                              style={{ width: `${(strength.score / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-[#182B42] mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E1E8F0] focus:border-[#1769AA] focus:ring-1 focus:ring-[#1769AA] outline-none"
                      />
                    </div>

                    {/* Terms & Consent */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#68788C] pt-1">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded border-[#E1E8F0] text-[#1769AA] focus:ring-[#1769AA]"
                      />
                      <span className="leading-tight">
                        I agree to the <strong>MediCore Patient Portal Terms of Service</strong> and consent to the secure electronic storage of my personal healthcare records in accordance with HIPAA standards.
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={passwordLoading || !otpVerified || !termsAccepted}
                      className="w-full py-3 rounded-xl bg-[#287FC1] hover:bg-[#153B63] text-white font-bold text-sm tracking-tight shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      {passwordLoading ? (
                        <span>Activating Patient Account...</span>
                      ) : (
                        <>
                          <span>Activate Account &amp; Access Health Passport</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#8E9BAE] border-t border-[#E1E8F0] bg-white">
        MediCore Healthcare Information Systems • Patient Identity Security Standard • Call 1800-MEDICORE
      </footer>
    </div>
  );
};
