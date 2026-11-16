/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Enterprise Hospital Operating System
 * Complete enterprise transformation with Carewell Landing Page, 20 dedicated portals,
 * Hospital Command Center, 3D Digital Twin, and ABDM/ABHA integration.
 * Strictly preserves all original 5 portals, sub-routes, EMR, and clinical logic.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, ThemeMode, Patient, Doctor, PortalKey } from './types';
import { db } from './services/mockDatabase';
import { sound } from './services/audioService';

// Original Nav & Auth
import { Sidebar, NavTab } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { EnterpriseHorizontalNav } from './components/navigation/EnterpriseHorizontalNav';
import { EditorialUtilityHeader } from './components/navigation/EditorialUtilityHeader';
import { UnifiedPortalAuth, AuthPortalCategory } from './components/auth/UnifiedPortalAuth';
import { PortalLoginPage, PORTAL_METAS, AuthMode } from './components/auth/PortalLoginPage';
import { PatientActivationPage } from './components/auth/PatientActivationPage';
import { AuthUser } from './services/authService';

// Original Dashboards & Portals (Preserved 100%)
import { CityCareDashboard } from './components/dashboard/CityCareDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SuperAdminDashboard } from './components/super-admin/SuperAdminDashboard';
import { WardOverview } from './components/ward/WardOverview';
import { MediFlexView } from './components/dashboard/MediFlexView';
import { PatientDirectory } from './components/patients/PatientDirectory';
import { AppointmentManager } from './components/appointments/AppointmentManager';
import { DoctorDirectory } from './components/doctors/DoctorDirectory';
import { BedManagement } from './components/beds/BedManagement';
import { PharmacyManager } from './components/pharmacy/PharmacyManager';
import { LabManager } from './components/laboratory/LabManager';
import { BillingManager } from './components/billing/BillingManager';
import { MedicalRecords } from './components/emr/MedicalRecords';
import { StaffManagement } from './components/staff/StaffManagement';
import { AnalyticsReports } from './components/analytics/AnalyticsReports';
import { PatientPortal } from './components/patient-portal/PatientPortal';
import { DoctorPortal } from './components/doctor-portal/DoctorPortal';
import { HeadNursePortal } from './components/nurse-portal/HeadNursePortal';
import { SettingsView } from './components/settings/SettingsView';
import { CommandPalette } from './components/navigation/CommandPalette';
import { MediCoreAssistant } from './components/ai/MediCoreAssistant';

// Carewell Primary Landing Page & Public Modals
import { CarewellLandingPage } from './components/landing/CarewellLandingPage';
import { BookAppointmentModal } from './components/landing/BookAppointmentModal';
import { OnlineConsultModal } from './components/landing/OnlineConsultModal';
import { HomeSampleModal } from './components/landing/HomeSampleModal';
import { PortalGatewayModal } from './components/landing/PortalGatewayModal';
import { IndianHealthcareAbhaModal } from './components/landing/IndianHealthcareAbhaModal';

// Enterprise Innovations: Command Center & 3D Digital Twin
import { HospitalCommandCenter } from './components/dashboard/HospitalCommandCenter';
import { HospitalDigitalTwin3D } from './components/3d/HospitalDigitalTwin3D';

// Specialist Portals (Portals 6 - 20)
import { ReceptionPortal } from './components/portals/ReceptionPortal';
import { LaboratoryPortal } from './components/portals/LaboratoryPortal';
import { PharmacyPortal } from './components/portals/PharmacyPortal';
import { RadiologyPortal } from './components/portals/RadiologyPortal';
import { SurgeryPortal } from './components/portals/SurgeryPortal';
import { BillingInsurancePortal } from './components/portals/BillingInsurancePortal';
import { HrStaffPortal } from './components/portals/HrStaffPortal';
import { BloodBankPortal } from './components/portals/BloodBankPortal';
import { ProcurementPortal } from './components/portals/ProcurementPortal';
import { PatientRelationsPortal } from './components/portals/PatientRelationsPortal';
import { QualityNabhPortal } from './components/portals/QualityNabhPortal';
import { DietaryPortal } from './components/portals/DietaryPortal';
import { AmbulancePortal } from './components/portals/AmbulancePortal';
import { HousekeepingPortal } from './components/portals/HousekeepingPortal';
import { MrdPortal } from './components/portals/MrdPortal';

export type HeaderPortalMode = 'super-admin' | 'admin' | 'management' | 'doctor' | 'nurse' | 'patient';

// ============================================================
// PAGE TITLE MAP
// ============================================================
const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  overview: 'Enterprise Overview',
  ward: 'Ward Overview',
  monitoring: 'Continuous Telemetry & Monitoring',
  admissions: 'Inpatient Admissions',
  discharges: 'Patient Discharges',
  analytics: 'Analytics & Reports',
  patients: 'Patient Directory',
  doctors: 'Doctor Directory',
  appointments: 'Appointments',
  beds: 'Bed Management',
  pharmacy: 'Pharmacy',
  lab: 'Laboratory',
  billing: 'Billing & Finance',
  emr: 'Medical Records',
  staff: 'Staff Management',
  settings: 'Settings',
  'patient-health': 'Health Summary & Clinical Vitals',
  'patient-appointments': 'My Appointments & Telehealth',
  'patient-prescriptions': 'Active Prescriptions & Regimen',
  'patient-labs': 'Lab Reports & Diagnostic Scans',
  'patient-records': 'Clinical Journey & Medical Records',
  'patient-vaccines': 'Digital Immunization Passport',
  'patient-billing': 'Billing & Health Insurance',
  'patient-messages': 'Direct Doctor Communication',
  'patient-nutrition': 'Nutrition & Wellness Tracker',
  'patient-emergency': 'Emergency SOS Dispatch',
  'doctor-consult': 'Doctor Clinical Station',
  'doctor-chat': 'Patient Inquiries & Tele-Chat',
  'doctor-patients': 'Inpatient Rounds & Rosters',
  'doctor-rx': 'E-Prescriptions & Refills',
  'doctor-labs': 'Lab & Imaging Orders',
  'doctor-schedule': 'Clinic Schedule & Telehealth',
  'doctor-soap': 'SOAP Notes & EMR',
  'doctor-alerts': 'Critical Code Alerts',
  'nurse-rounds': 'Nursing Station',
};

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  // Navigation View State: 'landing' | 'auth' | 'app' | 'specialist' | 'command-center' | 'digital-twin' | 'login' | 'activation'
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app' | 'specialist' | 'command-center' | 'digital-twin' | 'login' | 'activation'>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#login/')) return 'login';
    if (hash.startsWith('#activate')) return 'activation';
    const isAuth = Boolean(localStorage.getItem('medicore_authenticated'));
    if (isAuth) return 'app';
    return 'landing';
  });

  const [activeLoginPortal, setActiveLoginPortal] = useState<PortalKey>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#login/') || hash.startsWith('#signup/') || hash.startsWith('#forgot/')) {
      const clean = hash.replace(/#(login|signup|forgot)\//, '').trim().toLowerCase() as PortalKey;
      return (clean in PORTAL_METAS) ? clean : 'super-admin';
    }
    return 'super-admin';
  });

  const [authInitialMode, setAuthInitialMode] = useState<AuthMode>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#signup/')) return 'signUp';
    if (hash.startsWith('#forgot/')) return 'forgot';
    return 'signIn';
  });

  const [activationToken, setActivationToken] = useState<string>(() => {
    const hash = window.location.hash;
    if (hash.includes('token=')) {
      return hash.split('token=')[1]?.split('&')[0] || '';
    }
    if (hash.startsWith('#activate/')) {
      return hash.replace('#activate/', '').trim();
    }
    return '';
  });

  const [activeSpecialistPortal, setActiveSpecialistPortal] = useState<PortalKey | null>(null);

  // Original Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    Boolean(localStorage.getItem('medicore_authenticated'))
  );

  const [portalMode, setPortalMode] = useState<HeaderPortalMode>(() => {
    const saved = localStorage.getItem('medicore_portal_mode') as HeaderPortalMode;
    return saved || 'admin';
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = localStorage.getItem('medicore_portal_mode');
    if (saved === 'super-admin') return 'overview';
    if (saved === 'patient') return 'patient-health';
    if (saved === 'doctor') return 'doctor-overview';
    if (saved === 'nurse') return 'nurse-dashboard';
    return 'dashboard';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('medicore_portal_mode');
    if (saved === 'super-admin') return 'SUPER_ADMIN';
    if (saved === 'admin' || saved === 'management') return 'HOSPITAL_ADMIN';
    if (saved === 'patient') return 'PATIENT';
    if (saved === 'doctor') return 'DOCTOR';
    if (saved === 'nurse') return 'NURSE';
    return db.getRole();
  });

  const [theme] = useState<ThemeMode>('mint');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(db.getSelectedPatient());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Landing Page Interactive Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isOnlineConsultOpen, setIsOnlineConsultOpen] = useState(false);
  const [isHomeSampleOpen, setIsHomeSampleOpen] = useState(false);
  const [isPortalGatewayOpen, setIsPortalGatewayOpen] = useState(false);
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);
  const [isDigitalTwinModalOpen, setIsDigitalTwinModalOpen] = useState(false);

  // Auth init portal category
  const [initAuthCategory, setInitAuthCategory] = useState<AuthPortalCategory>(() => {
    const saved = localStorage.getItem('medicore_portal_mode');
    if (saved === 'super-admin') return 'super-admin';
    if (saved === 'admin' || saved === 'management') return 'admin';
    if (saved === 'patient') return 'patient';
    if (saved === 'doctor') return 'doctor';
    if (saved === 'nurse') return 'nurse';
    return 'admin';
  });

  // Permanently enforce white / daylight mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = '#F4F7F8';
    localStorage.setItem('medicore_theme', 'mint');
    db.setTheme('mint');
  }, []);

  // Cmd+K global search & custom open-search trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    const handleOpenSearchEvent = () => {
      sound.playClick();
      setIsSearchOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('medicore:open-search', handleOpenSearchEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('medicore:open-search', handleOpenSearchEvent);
    };
  }, []);

  // Handle hash-based deep links (#login/:portalKey and #activate?token=...)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#login/')) {
        const p = hash.replace('#login/', '').trim().toLowerCase() as PortalKey;
        setActiveLoginPortal((p in PORTAL_METAS) ? p : 'super-admin');
        setAuthInitialMode('signIn');
        setViewMode('login');
      } else if (hash.startsWith('#signup/')) {
        const p = hash.replace('#signup/', '').trim().toLowerCase() as PortalKey;
        setActiveLoginPortal((p in PORTAL_METAS) ? p : 'super-admin');
        setAuthInitialMode('signUp');
        setViewMode('login');
      } else if (hash.startsWith('#forgot/')) {
        const p = hash.replace('#forgot/', '').trim().toLowerCase() as PortalKey;
        setActiveLoginPortal((p in PORTAL_METAS) ? p : 'super-admin');
        setAuthInitialMode('forgot');
        setViewMode('login');
      } else if (hash.startsWith('#activate')) {
        let tok = '';
        if (hash.includes('token=')) {
          tok = hash.split('token=')[1]?.split('&')[0] || '';
        } else if (hash.startsWith('#activate/')) {
          tok = hash.replace('#activate/', '').trim();
        }
        setActivationToken(tok);
        setViewMode('activation');
      } else if (hash === '#landing' || hash === '' || hash === '#') {
        if (!localStorage.getItem('medicore_authenticated')) {
          setViewMode('landing');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ============================================================
  // PORTAL SELECTOR ROUTER (Handles all 20 Dedicated Login Pages)
  // ============================================================
  const handleSelectAnyPortal = (portalKey: PortalKey) => {
    sound.playClick();
    setIsPortalGatewayOpen(false);
    setActiveLoginPortal(portalKey);
    window.location.hash = `#login/${portalKey}`;
    setViewMode('login');
  };

  const handleLoginSuccess = (user: AuthUser, token?: string) => {
    sound.playSuccess();
    localStorage.setItem('medicore_authenticated', 'true');
    localStorage.setItem('medicore_portal_mode', user.portalKey);
    localStorage.setItem('medicore_user', JSON.stringify(user));
    if (token) localStorage.setItem('medicore_token', token);
    setIsAuthenticated(true);

    if (user.role === 'SUPER_ADMIN') {
      setPortalMode('super-admin');
      setCurrentRole('SUPER_ADMIN');
      setCurrentTab('overview');
      setViewMode('app');
    } else if (user.role === 'HOSPITAL_ADMIN') {
      setPortalMode('admin');
      setCurrentRole('HOSPITAL_ADMIN');
      setCurrentTab('dashboard');
      setViewMode('app');
    } else if (user.role === 'DOCTOR') {
      setPortalMode('doctor');
      setCurrentRole('DOCTOR');
      setCurrentTab('doctor-consult');
      setViewMode('app');
    } else if (user.role === 'NURSE') {
      setPortalMode('nurse');
      setCurrentRole('NURSE');
      setCurrentTab('nurse-rounds');
      setViewMode('app');
    } else if (user.role === 'PATIENT') {
      if (user.patientId) {
        db.setSelectedPatient(user.patientId);
        const p = db.getPatients().find(pat => pat.id === user.patientId);
        if (p) setSelectedPatient(p);
      }
      setPortalMode('patient');
      setCurrentRole('PATIENT');
      setCurrentTab('patient-health');
      setViewMode('app');
    } else {
      setActiveSpecialistPortal(user.portalKey);
      setViewMode('specialist');
    }
  };

  const handleLogout = () => {
    sound.playClick();
    setIsAuthenticated(false);
    localStorage.removeItem('medicore_authenticated');
    localStorage.removeItem('medicore_portal_mode');
    localStorage.removeItem('medicore_user');
    localStorage.removeItem('medicore_token');
    window.location.hash = '';
    setViewMode('landing');
  };

  const handleSwitchPortal = (mode: HeaderPortalMode) => {
    sound.playClick();
    if (mode === 'doctor') {
      setPortalMode('doctor');
      setCurrentRole('DOCTOR');
      setCurrentTab('doctor-chat');
      localStorage.setItem('medicore_portal_mode', 'doctor');
      localStorage.setItem('medicore_authenticated', 'true');
      setIsAuthenticated(true);
      setViewMode('app');
      return;
    }
    if (mode === 'patient') {
      setPortalMode('patient');
      setCurrentRole('PATIENT');
      setCurrentTab('patient-messages');
      localStorage.setItem('medicore_portal_mode', 'patient');
      localStorage.setItem('medicore_authenticated', 'true');
      setIsAuthenticated(true);
      setViewMode('app');
      return;
    }
    setIsAuthenticated(false);
    setInitAuthCategory(mode as AuthPortalCategory);
    localStorage.removeItem('medicore_authenticated');
    setViewMode('auth');
  };

  const handleTabChange = (tab: NavTab | string) => {
    sound.playClick();
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const handleToggleTheme = () => {
    // Disabled - permanently in white mode
  };

  // User info from db
  const patients = db.getPatients();
  const doctors = db.getDoctors();
  const currentDoctor = doctors[0];

  const [profileVersion, setProfileVersion] = useState(0);

  const getProfile = () => {
    try {
      const saved = localStorage.getItem(`medicore_user_profile_${portalMode}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const getUserName = () => {
    const custom = getProfile();
    if (custom?.name) return custom.name;
    const userJson = localStorage.getItem('medicore_user');
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        if (u?.name) return u.name;
      } catch {}
    }
    if (portalMode === 'doctor') return currentDoctor?.name || 'Dr. Roger S., MD, FCCP';
    if (portalMode === 'patient') return selectedPatient?.name || patients[0]?.name || 'Magnus Stephenson';
    if (portalMode === 'super-admin') return 'Dr. Eleanor Vance, MD (Root Super Admin)';
    if (portalMode === 'nurse') return 'Sister Sarah Jenkins, RN (Head Nurse)';
    if (portalMode === 'admin' || portalMode === 'management') return 'David Vance, MHA (Executive Admin)';
    if (activeSpecialistPortal === 'laboratory') return 'Dr. Arthur Mitchell, MD (Chief Pathologist)';
    if (activeSpecialistPortal === 'pharmacy') return 'Kavitha Raman, PharmD (Chief Pharmacist)';
    if (activeSpecialistPortal === 'radiology') return 'Dr. Marcus Brody, MD (Chief Radiologist)';
    if (activeSpecialistPortal === 'surgery') return 'Dr. Robert Chen, MS, MCh (Head of Surgery)';
    if (activeSpecialistPortal === 'billing') return 'Ananya Deshmukh, CPA (Finance Director)';
    if (activeSpecialistPortal === 'reception') return 'Pooja Sundaram (Admitting Officer)';
    if (activeSpecialistPortal === 'hr') return 'Meera Krishnan (HR Director)';
    if (activeSpecialistPortal === 'bloodbank') return 'Dr. Samuel Vane, MD (Transfusion Officer)';
    if (activeSpecialistPortal === 'procurement') return 'Vikramaditya Rao (Supply Chain Head)';
    if (activeSpecialistPortal === 'patient-relations') return 'Sunita Reddy (Patient Concierge Head)';
    if (activeSpecialistPortal === 'quality') return 'Dr. Priya Nambiar (NABH Quality Director)';
    if (activeSpecialistPortal === 'dietary') return 'Fatima Zahra, RD (Chief Dietitian)';
    if (activeSpecialistPortal === 'ambulance') return 'Captain Rajesh Nair (Trauma Dispatch)';
    if (activeSpecialistPortal === 'housekeeping') return 'Arun Kumar (Facility & Safety Manager)';
    if (activeSpecialistPortal === 'mrd') return 'Dr. S. Rangarajan (Health Information Head)';
    return 'Chief Hospital Administrator David Vance';
  };

  const getUserAvatar = () => {
    const custom = getProfile();
    if (custom?.avatar) return custom.avatar;
    if (portalMode === 'doctor') return 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80';
    if (portalMode === 'patient') return selectedPatient?.avatar || patients[0]?.avatar;
    if (portalMode === 'super-admin') return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
    if (portalMode === 'nurse') return 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?w=150&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  };

  // ============================================================
  // 1. PUBLIC LANDING PAGE (CAREWELL PRIMARY VISUAL)
  // ============================================================
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        <CarewellLandingPage
          onOpenPortals={() => setIsPortalGatewayOpen(true)}
          onSelectPortal={handleSelectAnyPortal}
          onDirectLogin={(category) => {
            sound.playClick();
            setInitAuthCategory(category);
            setViewMode('auth');
          }}
          onOpenCommandCenter={() => setViewMode('command-center')}
          onOpenDigitalTwin={() => setViewMode('digital-twin')}
          onOpenAbhaModal={() => setIsAbhaModalOpen(true)}
        />

        {isAbhaModalOpen && (
          <IndianHealthcareAbhaModal onClose={() => setIsAbhaModalOpen(false)} />
        )}
      </div>
    );
  }

  // ============================================================
  // 2. ENTERPRISE INNOVATIONS VIEWS
  // ============================================================
  if (viewMode === 'command-center') {
    return (
      <HospitalCommandCenter
        onClose={() => setViewMode('landing')}
        onOpenDigitalTwin={() => setViewMode('digital-twin')}
      />
    );
  }

  if (viewMode === 'digital-twin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <HospitalDigitalTwin3D onClose={() => setViewMode('landing')} />
      </div>
    );
  }

  // ============================================================
  // 3. SPECIALIST PORTALS (PORTALS 6 - 20)
  // ============================================================
  if (viewMode === 'specialist' && activeSpecialistPortal) {
    const handleSpecialistExit = () => {
      sound.playClick();
      setViewMode('landing');
      setActiveSpecialistPortal(null);
    };

    return (
      <div className="docr-layout min-h-screen bg-[#F7F5EF] flex flex-col w-full selection:bg-[#5551A6] selection:text-white">
        <EditorialUtilityHeader
          portalMode={activeSpecialistPortal as any}
          currentRole={currentRole}
          currentTab="overview"
          onTabChange={() => {}}
          userName={getUserName()}
          userAvatar={getUserAvatar()}
          onLogout={handleSpecialistExit}
          onGoToLanding={handleSpecialistExit}
          onOpenGateway={() => setIsPortalGatewayOpen(true)}
          onOpenCommandCenter={() => setViewMode('command-center')}
          onOpenDigitalTwin={() => setViewMode('digital-twin')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)}
        />

        <div className="docr-main flex-1 w-full bg-[#F7F5EF]">
          <main className="docr-content w-full bg-[#F7F5EF]">
            {activeSpecialistPortal === 'reception' && <ReceptionPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'laboratory' && <LaboratoryPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'pharmacy' && <PharmacyPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'radiology' && <RadiologyPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'surgery' && <SurgeryPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'billing' && <BillingInsurancePortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'hr' && <HrStaffPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'bloodbank' && <BloodBankPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'procurement' && <ProcurementPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'patient-relations' && <PatientRelationsPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'quality' && <QualityNabhPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'dietary' && <DietaryPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'ambulance' && <AmbulancePortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'housekeeping' && <HousekeepingPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
            {activeSpecialistPortal === 'mrd' && <MrdPortal onLogout={handleSpecialistExit} onSwitchPortal={(p) => handleSelectAnyPortal(p as PortalKey)} />}
          </main>
        </div>

        {/* ===== ROLE-AWARE MEDICORE AI ASSISTANT (ALL SPECIALIST PORTALS) ===== */}
        <MediCoreAssistant
          portalMode={activeSpecialistPortal}
          currentRole={currentRole}
          currentTab="overview"
          userName={getUserName()}
          selectedPatient={selectedPatient}
          theme={theme}
          onNavigateTab={() => {}}
          onDataMutated={() => {
            db.syncWithBackend();
          }}
        />

        {isPortalGatewayOpen && (
          <PortalGatewayModal
            isOpen={isPortalGatewayOpen}
            onClose={() => setIsPortalGatewayOpen(false)}
            onSelectPortal={handleSelectAnyPortal}
          />
        )}
      </div>
    );
  }

  // ============================================================
  // 3.5 DEDICATED PORTAL LOGIN PAGE (All 20 Portals Independent)
  // ============================================================
  if (viewMode === 'login') {
    return (
      <div className="min-h-screen bg-slate-50">
        <PortalLoginPage
          portalKey={activeLoginPortal}
          initialMode={authInitialMode}
          onSuccessLogin={handleLoginSuccess}
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={() => {
            sound.playClick();
            window.location.hash = '';
            setViewMode('landing');
          }}
          onBackToLanding={() => {
            sound.playClick();
            window.location.hash = '';
            setViewMode('landing');
          }}
          onBackToPortals={() => setIsPortalGatewayOpen(true)}
          onOpenGateway={() => setIsPortalGatewayOpen(true)}
        />

        {isPortalGatewayOpen && (
          <PortalGatewayModal
            isOpen={isPortalGatewayOpen}
            onClose={() => setIsPortalGatewayOpen(false)}
            onSelectPortal={handleSelectAnyPortal}
          />
        )}
      </div>
    );
  }

  // ============================================================
  // 3.6 PATIENT ACCOUNT ACTIVATION (Mobile OTP & Password Setup)
  // ============================================================
  if (viewMode === 'activation') {
    return (
      <PatientActivationPage
        token={activationToken}
        onActivationSuccess={() => {
          sound.playSuccess();
          setActiveLoginPortal('patient');
          window.location.hash = '#login/patient';
          setViewMode('login');
        }}
        onBackToLanding={() => {
          sound.playClick();
          window.location.hash = '';
          setViewMode('landing');
        }}
      />
    );
  }

  // ============================================================
  // 4. AUTH GATE (FOR CORE 5 PORTALS - LEGACY FALLBACK)
  // ============================================================
  if (viewMode === 'auth' || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-medical-grid" style={{ background: 'var(--color-bg)' }}>
        <UnifiedPortalAuth
          theme={theme}
          initialCategory={initAuthCategory}
          onBackToLanding={() => setViewMode('landing')}
          onLoginPatient={(patient: Patient) => {
            db.setSelectedPatient(patient.id);
            setSelectedPatient(patient);
            setPortalMode('patient');
            setCurrentRole('PATIENT');
            setCurrentTab('patient-health');
            localStorage.setItem('medicore_portal_mode', 'patient');
            localStorage.setItem('medicore_authenticated', 'true');
            localStorage.setItem('medicore_patient_id', patient.id);
            setIsAuthenticated(true);
            setViewMode('app');
            sound.playClick();
          }}
          onLoginDoctor={(doctor?: Doctor) => {
            setPortalMode('doctor');
            setCurrentRole('DOCTOR');
            setCurrentTab('doctor-overview');
            localStorage.setItem('medicore_portal_mode', 'doctor');
            localStorage.setItem('medicore_authenticated', 'true');
            setIsAuthenticated(true);
            setViewMode('app');
            sound.playClick();
          }}
          onLoginNurse={() => {
            setPortalMode('nurse');
            setCurrentRole('NURSE');
            setCurrentTab('nurse-dashboard');
            localStorage.setItem('medicore_portal_mode', 'nurse');
            localStorage.setItem('medicore_authenticated', 'true');
            setIsAuthenticated(true);
            setViewMode('app');
            sound.playClick();
          }}
          onLoginAdmin={() => {
            setPortalMode('admin');
            setCurrentRole('HOSPITAL_ADMIN');
            setCurrentTab('dashboard');
            localStorage.setItem('medicore_portal_mode', 'admin');
            localStorage.setItem('medicore_authenticated', 'true');
            setIsAuthenticated(true);
            setViewMode('app');
            sound.playClick();
          }}
          onLoginSuperAdmin={() => {
            setPortalMode('super-admin');
            setCurrentRole('SUPER_ADMIN');
            setCurrentTab('overview');
            localStorage.setItem('medicore_portal_mode', 'super-admin');
            localStorage.setItem('medicore_authenticated', 'true');
            setIsAuthenticated(true);
            setViewMode('app');
            sound.playClick();
          }}
        />
      </div>
    );
  }

  // ============================================================
  // 5. AUTHENTICATED FIVE CORE PORTALS — EDITORIAL HEALTHCARE WORKSPACE
  // Minimal floating utility header + Grid-based Application Launcher.
  // Full-width asymmetrical canvas with zero permanent left sidebar.
  // ============================================================
  return (
    <div className="docr-layout min-h-screen bg-[#F7F5EF] flex flex-col w-full selection:bg-[#5551A6] selection:text-white">

      {/* ===== EDITORIAL UTILITY HEADER & APPLICATION LAUNCHER ===== */}
      <EditorialUtilityHeader
        portalMode={portalMode}
        currentRole={currentRole}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        userName={getUserName()}
        userAvatar={getUserAvatar()}
        onLogout={handleLogout}
        onGoToLanding={() => {
          sound.playClick();
          window.location.hash = '';
          setViewMode('landing');
        }}
        onOpenGateway={() => setIsPortalGatewayOpen(true)}
        onOpenCommandCenter={() => setViewMode('command-center')}
        onOpenDigitalTwin={() => setViewMode('digital-twin')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSwitchPortal={handleSwitchPortal}
      />

      {/* ===== MAIN CONTENT AREA (FULL SCREEN WIDTH) ===== */}
      <div className="docr-main flex-1 w-full bg-[#F7F5EF]">
        {/* ===== PAGE CONTENT ===== */}
        <main className="docr-content animate-fade-in w-full bg-[#F7F5EF]" key={currentTab}>

          {/* =========== ADMIN / MANAGEMENT ROUTES =========== */}
          {(portalMode === 'admin' || portalMode === 'management') && (
            <>
              {currentTab === 'dashboard' && (
                <AdminDashboard
                  theme={theme}
                  currentRole={currentRole}
                  onNavigateTab={handleTabChange}
                  onSelectPatient={(p: Patient) => {
                    db.setSelectedPatient(p.id);
                    setSelectedPatient(p);
                    setCurrentTab('patients');
                  }}
                />
              )}
              {currentTab === 'ward' && (
                <WardOverview theme={theme} currentRole={currentRole} initialView="ward-overview" onNavigateTab={handleTabChange} onOpenSearch={() => setIsSearchOpen(true)} />
              )}
              {currentTab === 'monitoring' && (
                <WardOverview theme={theme} currentRole={currentRole} initialView="monitoring" onNavigateTab={handleTabChange} onOpenSearch={() => setIsSearchOpen(true)} />
              )}
              {currentTab === 'admissions' && (
                <WardOverview theme={theme} currentRole={currentRole} initialView="admissions" onNavigateTab={handleTabChange} onOpenSearch={() => setIsSearchOpen(true)} />
              )}
              {currentTab === 'discharges' && (
                <WardOverview theme={theme} currentRole={currentRole} initialView="discharges" onNavigateTab={handleTabChange} onOpenSearch={() => setIsSearchOpen(true)} />
              )}
              {currentTab === 'analytics' && (
                <AnalyticsReports theme={theme} />
              )}
              {currentTab === 'patients' && (
                <PatientDirectory theme={theme} onSelectPatientFor3D={(p: Patient) => {
                  db.setSelectedPatient(p.id);
                  setSelectedPatient(p);
                }} />
              )}
              {currentTab === 'doctors' && (
                <DoctorDirectory theme={theme} />
              )}
              {currentTab === 'appointments' && (
                <AppointmentManager theme={theme} />
              )}
              {currentTab === 'beds' && (
                <BedManagement theme={theme} />
              )}
              {currentTab === 'pharmacy' && (
                <PharmacyManager theme={theme} />
              )}
              {currentTab === 'lab' && (
                <LabManager theme={theme} />
              )}
              {currentTab === 'billing' && (
                <BillingManager theme={theme} />
              )}
              {currentTab === 'emr' && (
                <MedicalRecords
                  theme={theme}
                  onOpen3DAnatomy={(p: Patient) => {
                    db.setSelectedPatient(p.id);
                    setSelectedPatient(p);
                  }}
                />
              )}
              {currentTab === 'staff' && (
                <StaffManagement theme={theme} />
              )}
              {currentTab === 'settings' && (
                <SettingsView
                  theme={theme}
                  onThemeToggle={handleToggleTheme}
                  portalMode={portalMode}
                  currentRole={currentRole}
                  selectedPatient={selectedPatient || undefined}
                  onLogout={handleLogout}
                  onProfileUpdate={() => setProfileVersion(v => v + 1)}
                />
              )}
            </>
          )}

          {/* =========== SUPER ADMIN ROUTES =========== */}
          {portalMode === 'super-admin' && (
            <>
              {currentTab === 'overview' && (
                <SuperAdminDashboard
                  theme={theme}
                  onLogout={handleLogout}
                  onSwitchToAdminPortal={() => handleSwitchPortal('admin')}
                  onSwitchToDoctorPortal={() => handleSwitchPortal('doctor')}
                  onSwitchToNursePortal={() => handleSwitchPortal('nurse')}
                />
              )}
              {currentTab === 'patients' && <PatientDirectory theme={theme} onSelectPatientFor3D={(p: Patient) => { db.setSelectedPatient(p.id); setSelectedPatient(p); }} />}
              {currentTab === 'doctors' && <DoctorDirectory theme={theme} />}
              {currentTab === 'appointments' && <AppointmentManager theme={theme} />}
              {currentTab === 'beds' && <BedManagement theme={theme} />}
              {currentTab === 'pharmacy' && <PharmacyManager theme={theme} />}
              {currentTab === 'lab' && <LabManager theme={theme} />}
              {currentTab === 'billing' && <BillingManager theme={theme} />}
              {currentTab === 'emr' && <MedicalRecords theme={theme} onOpen3DAnatomy={(p: Patient) => { db.setSelectedPatient(p.id); setSelectedPatient(p); }} />}
              {currentTab === 'staff' && <StaffManagement theme={theme} />}
              {currentTab === 'analytics' && <AnalyticsReports theme={theme} />}
              {currentTab === 'settings' && (
                <SettingsView
                  theme={theme}
                  onThemeToggle={handleToggleTheme}
                  portalMode={portalMode}
                  currentRole={currentRole}
                  selectedPatient={selectedPatient || undefined}
                  onLogout={handleLogout}
                  onProfileUpdate={() => setProfileVersion(v => v + 1)}
                />
              )}
            </>
          )}

          {/* =========== DOCTOR PORTAL ROUTES =========== */}
          {portalMode === 'doctor' && (
            <>
              {currentTab !== 'settings' && (
                <DoctorPortal
                  theme={theme}
                  activeSection={currentTab}
                  onSelectSection={handleTabChange}
                  onSwitchToPatientPortal={() => handleSwitchPortal('patient')}
                  onSwitchToAdminPortal={() => handleSwitchPortal('admin')}
                  onSwitchToNursePortal={() => handleSwitchPortal('nurse')}
                  onLogout={handleLogout}
                />
              )}
              {currentTab === 'settings' && (
                <SettingsView
                  theme={theme}
                  onThemeToggle={handleToggleTheme}
                  portalMode={portalMode}
                  currentRole={currentRole}
                  selectedPatient={selectedPatient || undefined}
                  onLogout={handleLogout}
                  onProfileUpdate={() => setProfileVersion(v => v + 1)}
                />
              )}
            </>
          )}

          {/* =========== NURSE PORTAL ROUTES =========== */}
          {portalMode === 'nurse' && (
            <>
              {currentTab.startsWith('nurse-') && (
                <HeadNursePortal
                  theme={theme}
                  activeSection={currentTab}
                  onSelectSection={handleTabChange}
                  onSwitchToDoctorPortal={() => handleSwitchPortal('doctor')}
                  onSwitchToAdminPortal={() => handleSwitchPortal('admin')}
                  onLogout={handleLogout}
                />
              )}
              {currentTab === 'patients' && <PatientDirectory theme={theme} onSelectPatientFor3D={(p: Patient) => { db.setSelectedPatient(p.id); setSelectedPatient(p); }} />}
              {currentTab === 'beds' && <BedManagement theme={theme} />}
              {currentTab === 'settings' && (
                <SettingsView
                  theme={theme}
                  onThemeToggle={handleToggleTheme}
                  portalMode={portalMode}
                  currentRole={currentRole}
                  selectedPatient={selectedPatient || undefined}
                  onLogout={handleLogout}
                  onProfileUpdate={() => setProfileVersion(v => v + 1)}
                />
              )}
            </>
          )}

          {/* =========== PATIENT PORTAL ROUTES =========== */}
          {portalMode === 'patient' && (
            <>
              {currentTab !== 'settings' && (
                <PatientPortal
                  theme={theme}
                  patient={selectedPatient || undefined}
                  activeSection={currentTab}
                  onSelectSection={handleTabChange}
                  onSwitchToDoctorPortal={() => handleSwitchPortal('doctor')}
                  onSwitchToNursePortal={() => handleSwitchPortal('nurse')}
                  onSwitchToAdminPortal={() => handleSwitchPortal('admin')}
                  onSwitchToSuperAdminPortal={() => handleSwitchPortal('super-admin')}
                  onLogout={handleLogout}
                />
              )}
              {currentTab === 'settings' && (
                <SettingsView
                  theme={theme}
                  onThemeToggle={handleToggleTheme}
                  portalMode={portalMode}
                  currentRole={currentRole}
                  selectedPatient={selectedPatient || undefined}
                  onLogout={handleLogout}
                  onProfileUpdate={() => setProfileVersion(v => v + 1)}
                />
              )}
            </>
          )}

        </main>

        {/* Footer */}
        <footer
          className="py-4 border-t text-xs flex items-center justify-between px-6 flex-shrink-0"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--color-brand-accent)', fontWeight: 700 }}>MediCore OS</span>
            <span>·</span>
            <span>Enterprise Hospital Operating & Clinical Intelligence System</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px]">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>K</kbd>
            <span>for Global Search</span>
          </div>
        </footer>
      </div>

      {/* ===== GLOBAL COMMAND PALETTE (CTRL+K / CMD+K) ===== */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        theme={theme}
        portalMode={portalMode}
        onSwitchPortal={handleSwitchPortal}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          const title = PAGE_TITLES[tab];
          if (title) document.title = `${title} | MediCore Healthcare`;
        }}
        onSelectPatient={(pat) => {
          setSelectedPatient(pat);
          db.setSelectedPatient(pat.id);
        }}
      />

      {/* ===== ROLE-AWARE MEDICORE AI ASSISTANT (ALL 5 PORTALS) ===== */}
      <MediCoreAssistant
        portalMode={portalMode}
        currentRole={currentRole}
        currentTab={currentTab}
        userName={getUserName()}
        selectedPatient={selectedPatient}
        theme={theme}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          const title = PAGE_TITLES[tab];
          if (title) document.title = `${title} | MediCore Healthcare`;
        }}
        onDataMutated={() => {
          db.syncWithBackend();
        }}
      />

      {/* Portal Gateway Modal */}
      {isPortalGatewayOpen && (
        <PortalGatewayModal
          isOpen={isPortalGatewayOpen}
          onClose={() => setIsPortalGatewayOpen(false)}
          onSelectPortal={handleSelectAnyPortal}
        />
      )}
    </div>
  );
}
