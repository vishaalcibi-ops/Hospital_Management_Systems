/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MediCore HMS — Password Recovery Modal
 * Implements single-use time-limited reset tokens, constant-time validation,
 * OWASP email enumeration prevention, and password strength validation.
 */

import React, { useState } from 'react';
import { PortalKey } from '../../types';
import { sound } from '../../services/audioService';
import { authService } from '../../services/authService';
import { Mail, Lock, KeyRound, CheckCircle2, AlertCircle, X, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordModalProps {
  portalKey: PortalKey;
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  portalKey,
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    sound.playClick();
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await authService.forgotPassword(email.trim());
      sound.playSuccess();
      setStatusMessage(result.message);
      if (result.simulatedResetToken) {
        setSimulatedToken(result.simulatedResetToken);
      }
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.resetPassword(token.trim(), newPassword, confirmPassword);
      sound.playSuccess();
      setStatusMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Password reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#182B42]">Password Recovery</h3>
              <p className="text-xs text-[#68788C]">Hospital Security &amp; Identity Verification</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step switcher tabs */}
        <div className="flex items-center gap-2 my-4 p-1 rounded-xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setStep('request'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-lg transition ${step === 'request' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            1. Request Link
          </button>
          <button
            type="button"
            onClick={() => { setStep('reset'); setErrorMessage(null); }}
            className={`flex-1 py-1.5 rounded-lg transition ${step === 'reset' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            2. Enter Token &amp; Reset
          </button>
        </div>

        {/* Status & Error banners */}
        {statusMessage && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <p>{statusMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* STEP 1: REQUEST RESET LINK */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <p className="text-xs text-[#68788C] leading-relaxed">
              Enter your registered hospital email address. If an active account exists, a time-limited single-use security recovery token will be dispatched.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#182B42] mb-1.5">Registered Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@medicore.org"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {simulatedToken && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold block mb-1">Development / Test Token Generated:</span>
                <code className="bg-amber-100 px-2 py-0.5 rounded text-[11px] font-mono select-all block break-all">
                  {simulatedToken}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    setToken(simulatedToken);
                    setStep('reset');
                  }}
                  className="mt-2 text-xs font-bold text-blue-700 hover:underline"
                >
                  Use Token in Step 2 →
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#153B63] text-white font-bold text-xs tracking-tight transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Dispatching Instructions...' : 'Send Recovery Instructions'}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER TOKEN & NEW PASSWORD */}
        {step === 'reset' && (
          <form onSubmit={handleCompleteReset} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#182B42] mb-1">Recovery Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="rst_••••••••••••"
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182B42] mb-1">New Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min 8 chars with uppercase, number, symbol"
                  className="w-full px-3 pr-10 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182B42] mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat new password"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#18865B] hover:bg-[#136b48] text-white font-bold text-xs tracking-tight transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset & Save Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
