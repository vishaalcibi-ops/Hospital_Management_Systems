/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Enterprise Top Bar Navigation
 * Global Internal Design System: #153B63 Navy, #1769AA Medical Blue, #F5F8FC Canvas.
 * Breadcrumbs, Quick Portal Gateway launcher, Audio toggle & Role Status pill.
 */

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  ChevronRight,
  Menu,
  ShieldCheck,
  Command,
  Sparkles,
  Layers,
  Radio,
  Building,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { UserRole, ThemeMode, CriticalAlert } from '../../types';
import { Avatar, Badge } from '../ui';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';

interface TopBarProps {
  currentRole: UserRole;
  portalMode: string;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSearch?: () => void;
  onMobileMenuOpen?: () => void;
  pageTitle?: string;
  userName?: string;
  userAvatar?: string;
  onGoToLanding?: () => void;
  onOpenGateway?: () => void;
  onOpenCommandCenter?: () => void;
  onOpenDigitalTwin?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  portalMode,
  theme,
  onOpenSearch,
  onMobileMenuOpen,
  pageTitle = 'Dashboard',
  userName = 'Admin User',
  userAvatar,
  onGoToLanding,
  onOpenGateway,
  onOpenCommandCenter,
  onOpenDigitalTwin,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const alerts = db.getAlerts();
  const criticalCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const portalLabels: Record<string, { name: string; color: string; bg: string }> = {
    'super-admin': { name: 'Super Admin Command', color: '#153B63', bg: '#EAF4FC' },
    admin: { name: 'Executive Operations', color: '#1769AA', bg: '#EAF4FC' },
    management: { name: 'Management', color: '#1769AA', bg: '#EAF4FC' },
    doctor: { name: 'Clinical Consultation', color: '#0D9488', bg: '#F0FDFA' },
    nurse: { name: 'Head Nurse Station', color: '#18865B', bg: '#EAF7F1' },
    patient: { name: 'Patient Health Portal', color: '#287FC1', bg: '#EFF6FF' },
  };

  const currentPortalConfig = portalLabels[portalMode] || { name: 'Hospital Portal', color: '#1769AA', bg: '#EAF4FC' };

  return (
    <header className="h-16 bg-white border-b border-[#E1E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl text-[#68788C] hover:text-[#182B42] hover:bg-[#F5F8FC] transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Enterprise Breadcrumb */}
        <div className="flex items-center gap-2 text-xs min-w-0">
          <span className="font-extrabold text-[#153B63] tracking-tight shrink-0 hidden sm:inline">
            MediCore
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8E9BAE] shrink-0 hidden sm:inline" />
          <span
            className="font-bold px-2 py-0.5 rounded-full text-[11px] shrink-0"
            style={{ color: currentPortalConfig.color, backgroundColor: currentPortalConfig.bg }}
          >
            {currentPortalConfig.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8E9BAE] shrink-0 hidden md:inline" />
          <span className="font-semibold text-[#182B42] truncate hidden md:inline">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Shortcut */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            if (onOpenSearch) onOpenSearch();
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E1E8F0] bg-[#F5F8FC] hover:bg-white text-xs text-[#68788C] hover:text-[#182B42] transition-all shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-[#68788C]" />
          <span>Search records...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E1E8F0] font-mono text-[#68788C]">
            ⌘K
          </kbd>
        </button>

        {/* 20 Portals Quick Gateway */}
        {onOpenGateway && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenGateway();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 text-[#1769AA] bg-blue-50/70 hover:bg-blue-100 text-xs font-bold transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>20 Portals</span>
          </button>
        )}

        {/* Command Center & Digital Twin quick jumps */}
        {onOpenCommandCenter && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCommandCenter();
            }}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Command Center</span>
          </button>
        )}

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-xl text-[#68788C] hover:text-[#182B42] hover:bg-[#F5F8FC] transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1769AA]" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setNotifOpen(!notifOpen);
            }}
            className="p-2 rounded-xl text-[#68788C] hover:text-[#182B42] hover:bg-[#F5F8FC] transition-colors relative"
            title="Critical Clinical Alerts"
          >
            <Bell className="w-4 h-4" />
            {criticalCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D64C4C] animate-ping" />
            )}
          </button>

          {/* Notification Popover */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#E1E8F0] p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F0]">
                <h4 className="text-xs font-bold text-[#182B42] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1769AA]" />
                  <span>Clinical System Alerts</span>
                </h4>
                <button onClick={() => setNotifOpen(false)} className="text-[#8E9BAE] hover:text-[#182B42]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 4).map((al) => (
                  <div key={al.id} className="p-2.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#182B42]">{al.title || 'Emergency Alert'}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        al.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {al.severity}
                      </span>
                    </div>
                    <p className="text-[#68788C] text-[11px] mt-1">{al.actionRequired || al.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Public Website Button */}
        {onGoToLanding && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onGoToLanding();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E1E8F0] text-xs font-bold text-[#153B63] bg-[#F5F8FC] hover:bg-white transition-all shadow-2xs"
          >
            <span>← Public Website</span>
          </button>
        )}

        {/* MediCore AI Quick Trigger */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            window.dispatchEvent(new CustomEvent('medicore:open-ai'));
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold bg-[#1769AA] hover:bg-[#153B63] transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>MediCore AI</span>
        </button>

        {/* User Mini Avatar */}
        <div className="pl-1 border-l border-[#E1E8F0] flex items-center gap-2">
          <Avatar name={userName} src={userAvatar} size="sm" />
        </div>
      </div>
    </header>
  );
};
