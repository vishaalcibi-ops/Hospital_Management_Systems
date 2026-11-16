/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MediCore HMS — Dedicated Multi-Portal Authentication Architecture
 * Premium Split-Screen Authentication Experience for All 20 Hospital Portals.
 * Inspired by modern healthcare cloud platforms (e.g. MedeilPlus Cloud) with
 * high-resolution photography, role-specific accent palettes, password strength meters,
 * staff provisioning activation, patient UHID/OTP verification, Google OAuth, and password recovery.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PortalKey, UserRole } from '../../types';
import { sound } from '../../services/audioService';
import { authService, PORTAL_DEMO_CREDENTIALS, AuthUser } from '../../services/authService';
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  Activity,
  User,
  Ticket,
  FlaskConical,
  Pill,
  Camera,
  Scissors,
  CreditCard,
  Users,
  Droplet,
  Package,
  HeartHandshake,
  Award,
  Apple,
  Truck,
  Sparkles,
  Archive,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  ChevronLeft,
  Globe,
  Layers,
  HelpCircle,
  Check,
  Smartphone,
  FileBadge,
  RefreshCw,
  LogIn,
  UserPlus,
  BadgeCheck,
  LockKeyhole
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export type AuthMode = 'signIn' | 'signUp' | 'forgot';

export interface PortalMeta {
  key: PortalKey;
  number: number;
  title: string;
  role: UserRole;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  accentSecondary: string;
  bgLight: string;
  borderColor: string;
  googleAuthAllowed: boolean;
  securityNotice: string;
  bgImage: string;
  fallbackImage: string;
  quote: string;
  features: string[];
  complianceBadge: string;
}

export const PORTAL_METAS: Record<PortalKey, PortalMeta> = {
  'super-admin': {
    key: 'super-admin',
    number: 1,
    title: 'Super Admin Portal',
    role: 'SUPER_ADMIN',
    subtitle: 'Root Enterprise Command Center & Multi-Facility Telemetry',
    badge: 'Tier-0 Root Access',
    icon: ShieldCheck,
    gradient: 'from-[#1E40AF] to-[#153B63]',
    accent: '#2563EB',
    accentSecondary: '#1E40AF',
    bgLight: 'bg-[#EFF6FF]',
    borderColor: 'border-[#2563EB]/25',
    googleAuthAllowed: true,
    securityNotice: 'Multi-Factor Authentication & cold-backup audit logging enforced for all Tier-0 sessions.',
    bgImage: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-exterior.jpg',
    quote: 'Zero-downtime multi-campus hospital network resilience, cryptographic audit trails, and institutional safety.',
    features: ['Multi-Campus Telemetry & Uptime', 'Cold-Storage HIPAA Audit Trail', 'RBAC Security Matrix & STAT Lockdown'],
    complianceBadge: 'HIPAA Security Rule § 164.312 • ISO 27001'
  },
  'admin': {
    key: 'admin',
    number: 5,
    title: 'Executive Admin & Wards',
    role: 'HOSPITAL_ADMIN',
    subtitle: 'Hospital Operations, Inpatient Ward Matrix & Bed Logistics',
    badge: 'Hospital Operations',
    icon: Building2,
    gradient: 'from-[#0D9488] to-[#1D4ED8]',
    accent: '#0D9488',
    accentSecondary: '#1D4ED8',
    bgLight: 'bg-[#F0FDFA]',
    borderColor: 'border-[#0D9488]/25',
    googleAuthAllowed: true,
    securityNotice: 'Audit logs active for bed allocations, inpatient admissions, and departmental census changes.',
    bgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-corridor.jpg',
    quote: 'Maximizing bed utilization, streamlining patient movement, and coordinating multidisciplinary clinical workflows.',
    features: ['Live Bed Matrix & ICU Heatmap', 'Admission & Discharge Pipeline', 'Staffing Ratio & Census Telemetry'],
    complianceBadge: 'NABH Inpatient Management Protocols'
  },
  'doctor': {
    key: 'doctor',
    number: 2,
    title: 'Doctor Clinical Station',
    role: 'DOCTOR',
    subtitle: 'Clinical Workspace, EMR, E-Prescriptions & Telehealth',
    badge: 'Physician Workstation',
    icon: Stethoscope,
    gradient: 'from-[#0284C7] to-[#0F766E]',
    accent: '#0284C7',
    accentSecondary: '#0F766E',
    bgLight: 'bg-[#F0F9FF]',
    borderColor: 'border-[#0284C7]/25',
    googleAuthAllowed: true,
    securityNotice: 'Electronic clinical signatures and CDS drug-allergy verification active.',
    bgImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hero-doctor.jpg',
    quote: 'Precision diagnostics, evidence-based care, and uninterrupted digital continuity for every patient.',
    features: ['SOAP Clinical Notes & Digital Rx', 'Integrated Diagnostic PACS Scans', 'Drug-Allergy Interaction Engine'],
    complianceBadge: 'FHIR R4 Standard • HL7 Interoperable'
  },
  'nurse': {
    key: 'nurse',
    number: 3,
    title: 'Head Nurse Station',
    role: 'NURSE',
    subtitle: 'Ward Census, MEWS Acuity Triage, eMAR & SBAR Handover',
    badge: 'Nursing Operations',
    icon: Activity,
    gradient: 'from-[#059669] to-[#10B981]',
    accent: '#059669',
    accentSecondary: '#10B981',
    bgLight: 'bg-[#ECFDF5]',
    borderColor: 'border-[#059669]/25',
    googleAuthAllowed: true,
    securityNotice: 'Barcoded medication administration & vital telemetry synchronized.',
    bgImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-care.jpg',
    quote: 'Compassionate bedside nursing supported by automated early-warning telemetry and barcoded verification.',
    features: ['MEWS Automated Patient Acuity', 'Barcoded eMAR Medication Sheet', 'Live Shift SBAR Handover Matrix'],
    complianceBadge: 'NABH Nursing Excellence Standards'
  },
  'patient': {
    key: 'patient',
    number: 4,
    title: 'Patient Health Portal',
    role: 'PATIENT',
    subtitle: 'Personal Digital Health Passport, Lab Scans & Prescriptions',
    badge: 'Self-Service Patient Gateway',
    icon: User,
    gradient: 'from-[#7C3AED] to-[#38BDF8]',
    accent: '#7C3AED',
    accentSecondary: '#38BDF8',
    bgLight: 'bg-[#F5F3FF]',
    borderColor: 'border-[#7C3AED]/25',
    googleAuthAllowed: false, // Strict Rule: Registered Email & Password only
    securityNotice: 'Patients must enter with their registered email and verified password created during hospital onboarding.',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-care.jpg',
    quote: 'Your health journey, diagnostic history, verified lab reports, and care team all in one secure place.',
    features: ['Instant Lab & Radiology Reports', 'Interactive Daily Dosage Tracker', 'Cashless Insurance TPA Tracker'],
    complianceBadge: 'ABHA ABDM Compatible • HIPAA Protected'
  },
  'reception': {
    key: 'reception',
    number: 6,
    title: 'Reception & Front Desk',
    role: 'RECEPTIONIST',
    subtitle: 'Patient Registration, Token Queue & OPD Check-In',
    badge: 'Front Desk & Admitting',
    icon: Ticket,
    gradient: 'from-[#2563EB] to-[#3B82F6]',
    accent: '#2563EB',
    accentSecondary: '#3B82F6',
    bgLight: 'bg-[#EFF6FF]',
    borderColor: 'border-[#2563EB]/25',
    googleAuthAllowed: true,
    securityNotice: 'Authorized patient registration desk. Generates official UHID tokens and clinic appointments.',
    bgImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-corridor.jpg',
    quote: 'Delivering a warm, efficient, and dignified first impression for every patient arriving at our hospital.',
    features: ['Fast-Track UHID Generation', 'OPD Token Queue Automation', 'Visitor Badging & Admitting Intake'],
    complianceBadge: 'ABDM Health ID Integration'
  },
  'laboratory': {
    key: 'laboratory',
    number: 7,
    title: 'Laboratory Information (LIS)',
    role: 'LAB_TECH',
    subtitle: 'Pathology Diagnostics, Barcode Tracking & Lab Sign-Offs',
    badge: 'Diagnostics Laboratory',
    icon: FlaskConical,
    gradient: 'from-[#0891B2] to-[#475569]',
    accent: '#0891B2',
    accentSecondary: '#475569',
    bgLight: 'bg-[#ECFEFF]',
    borderColor: 'border-[#0891B2]/25',
    googleAuthAllowed: true,
    securityNotice: 'Specimen barcode cross-check and critical value panic alerts active.',
    bgImage: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/lab-microscope.jpg',
    quote: 'Rapid, ISO 15189-certified laboratory diagnostics delivering high-accuracy clinical results for timely care.',
    features: ['Specimen Barcode Verification', 'Direct Analyzer Telemetry Feed', 'Critical Value Panic Broadcasts'],
    complianceBadge: 'NABL Accredited • ISO 15189 Certified'
  },
  'pharmacy': {
    key: 'pharmacy',
    number: 8,
    title: 'Pharmacy & Drug Formulary',
    role: 'PHARMACIST',
    subtitle: 'E-Prescription Dispensing, POS & Batch Expiry Tracking',
    badge: 'Hospital Pharmacy',
    icon: Pill,
    gradient: 'from-[#059669] to-[#10B981]',
    accent: '#059669',
    accentSecondary: '#10B981',
    bgLight: 'bg-[#ECFDF5]',
    borderColor: 'border-[#059669]/25',
    googleAuthAllowed: true,
    securityNotice: 'Pharmacist verification mandatory prior to dispensing controlled substances.',
    bgImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/medical-bg.jpg',
    quote: 'Ensuring 100% medication safety, barcoded batch dispensing, and automated drug-interaction safeguards.',
    features: ['Doctor E-Rx Instant Dispense', 'Batch Expiry & Temperature Log', 'Controlled Narcotic Dual-Signoff'],
    complianceBadge: 'FDA Drug Formulary Compliance'
  },
  'radiology': {
    key: 'radiology',
    number: 9,
    title: 'Radiology & PACS Imaging',
    role: 'RADIOLOGIST',
    subtitle: 'CT, MRI, X-Ray Scans & DICOM Imaging Viewer',
    badge: 'Diagnostic Imaging',
    icon: Camera,
    gradient: 'from-[#7C3AED] to-[#4F46E5]',
    accent: '#7C3AED',
    accentSecondary: '#4F46E5',
    bgLight: 'bg-[#F5F3FF]',
    borderColor: 'border-[#7C3AED]/25',
    googleAuthAllowed: true,
    securityNotice: 'PACS imaging secure access & radiologist digital signing active.',
    bgImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/backgrounds/bg-option-5-smart-health.jpg',
    quote: 'Sub-millimeter imaging clarity empowering rapid clinical, surgical, and interventional decision-making.',
    features: ['DICOM PACS Web Viewer', 'Multi-Slice CT & 3T MRI Logs', 'AI Pre-Reading Worklist Triage'],
    complianceBadge: 'AERB Certified • DICOM 3.0 Standard'
  },
  'surgery': {
    key: 'surgery',
    number: 10,
    title: 'OT & Surgical Management',
    role: 'SURGEON',
    subtitle: 'Operating Suite Scheduling & Robotic OT Allocation',
    badge: 'Surgical Suite',
    icon: Scissors,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    accent: '#0F766E',
    accentSecondary: '#14B8A6',
    bgLight: 'bg-[#F0FDFA]',
    borderColor: 'border-[#0F766E]/25',
    googleAuthAllowed: true,
    securityNotice: 'WHO surgical safety checklist & anaesthesia telemetry active.',
    bgImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/backgrounds/bg-option-1-futuristic.jpg',
    quote: 'Zero surgical site infection protocols, robotic surgical consoles, and world-class surgical precision.',
    features: ['WHO Surgical Safety Checklists', 'Real-Time Anesthesia Vitals Feed', 'Implant & Instrument Barcode Count'],
    complianceBadge: 'WHO Surgical Safety Benchmark'
  },
  'billing': {
    key: 'billing',
    number: 11,
    title: 'Billing & Health Insurance',
    role: 'ACCOUNTANT',
    subtitle: 'Cashless TPA Claims, Inpatient Billing & Invoices',
    badge: 'Finance & Accounts',
    icon: CreditCard,
    gradient: 'from-[#4338CA] to-[#6366F1]',
    accent: '#4338CA',
    accentSecondary: '#6366F1',
    bgLight: 'bg-[#EEF2FF]',
    borderColor: 'border-[#4338CA]/25',
    googleAuthAllowed: true,
    securityNotice: 'HIPAA financial compliance & GST/TPA cashless claim verification active.',
    bgImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-exterior.jpg',
    quote: 'Transparent itemized billing, rapid TPA claim clearance, and seamless cashless patient discharge finance.',
    features: ['TPA Claim Auto-Submission', 'Real-Time Room Rent Proration', 'GST & Statutory Financial Audits'],
    complianceBadge: 'IRDAI Healthcare Cashless Standard'
  },
  'hr': {
    key: 'hr',
    number: 12,
    title: 'HR & Staff Management',
    role: 'HR_MANAGER',
    subtitle: 'Physician Credentials, Duty Rosters & Compliance',
    badge: 'Human Resources',
    icon: Users,
    gradient: 'from-[#3B82F6] to-[#8B5CF6]',
    accent: '#3B82F6',
    accentSecondary: '#8B5CF6',
    bgLight: 'bg-[#EFF6FF]',
    borderColor: 'border-[#3B82F6]/25',
    googleAuthAllowed: true,
    securityNotice: 'Staff license verification & biometric attendance logs synchronized.',
    bgImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-care.jpg',
    quote: 'Empowering our multidisciplinary clinical workforce with transparent duty rosters and continuous credentialing.',
    features: ['Medical Council License Tracking', 'Automated Shift Duty Rostering', 'Biometric Clocking & Overtime'],
    complianceBadge: 'NABH HR Credentialing Standards'
  },
  'bloodbank': {
    key: 'bloodbank',
    number: 13,
    title: 'Blood Bank & Transfusion',
    role: 'BLOOD_BANK_OFFICER',
    subtitle: 'Blood Barcodes, Donor Registry & Crossmatch Logs',
    badge: 'Transfusion Medicine',
    icon: Droplet,
    gradient: 'from-[#BE123C] to-[#E11D48]',
    accent: '#BE123C',
    accentSecondary: '#E11D48',
    bgLight: 'bg-[#FFF1F2]',
    borderColor: 'border-[#BE123C]/25',
    googleAuthAllowed: true,
    securityNotice: 'Critical PRBC and platelet stock alarms broadcast to ER trauma bay.',
    bgImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/medical-bg.jpg',
    quote: 'Safeguarding every drop of life-saving blood components with strict crossmatch screening and cold-chain logging.',
    features: ['ABO/Rh Inventory Barcoding', 'ER Trauma Cross-Match Dispatch', 'Cold-Chain Temp Sensors (2-6°C)'],
    complianceBadge: 'NACO & Drugs Controller Approved'
  },
  'procurement': {
    key: 'procurement',
    number: 14,
    title: 'Procurement & Supply Chain',
    role: 'PROCUREMENT_OFFICER',
    subtitle: 'Surgical Purchase Orders, Consumables & Vendor POS',
    badge: 'Material Logistics',
    icon: Package,
    gradient: 'from-[#334155] to-[#64748B]',
    accent: '#334155',
    accentSecondary: '#64748B',
    bgLight: 'bg-[#F8FAFC]',
    borderColor: 'border-[#334155]/25',
    googleAuthAllowed: true,
    securityNotice: 'PO approval thresholds and minimum safety stock re-order triggers active.',
    bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/backgrounds/bg-option-5-smart-health.jpg',
    quote: 'Guaranteeing uninterrupted availability of critical pharmaceuticals and surgical consumables hospital-wide.',
    features: ['Automated Reorder Thresholds', 'Consumables Batch Tracking', 'Multi-Vendor Quotation Evaluation'],
    complianceBadge: 'ISO 9001 Supply Chain Standards'
  },
  'patient-relations': {
    key: 'patient-relations',
    number: 15,
    title: 'Patient Relations & Grievance',
    role: 'PATIENT_RELATIONS',
    subtitle: 'Patient Experience, Feedback Surveys & VIP Concierge',
    badge: 'Patient Experience',
    icon: HeartHandshake,
    gradient: 'from-[#0D9488] to-[#2DD4BF]',
    accent: '#0D9488',
    accentSecondary: '#2DD4BF',
    bgLight: 'bg-[#F0FDFA]',
    borderColor: 'border-[#0D9488]/25',
    googleAuthAllowed: true,
    securityNotice: 'Patient satisfaction NPS metrics and grievance escalation active.',
    bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-care.jpg',
    quote: 'Putting empathy, responsive support, and patient dignity at the heart of our healthcare services.',
    features: ['Real-Time Inpatient NPS Feedback', 'Multilingual Patient Concierge', 'Rapid Grievance Redressal SLA'],
    complianceBadge: 'Patient Rights Charter • NABH Certified'
  },
  'quality': {
    key: 'quality',
    number: 16,
    title: 'Quality & NABH Compliance',
    role: 'QUALITY_NABH_OFFICER',
    subtitle: 'NABH Accreditation, Clinical Audits & Incident Logs',
    badge: 'Accreditation & Quality',
    icon: Award,
    gradient: 'from-[#047857] to-[#1E3A8A]',
    accent: '#047857',
    accentSecondary: '#1E3A8A',
    bgLight: 'bg-[#ECFDF5]',
    borderColor: 'border-[#047857]/25',
    googleAuthAllowed: true,
    securityNotice: 'NABH 5th edition hospital standards & clinical indicator audits active.',
    bgImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-exterior.jpg',
    quote: 'Driving clinical excellence, continuous process audits, and uncompromising patient safety benchmarks.',
    features: ['NABH 5th Edition Indicator Logs', 'Sentinel Event Incident Reporting', 'Clinical Mortality & Morbidity Reviews'],
    complianceBadge: 'NABH 5th Edition • Joint Commission Standards'
  },
  'dietary': {
    key: 'dietary',
    number: 17,
    title: 'Dietary & Nutrition Services',
    role: 'DIETICIAN',
    subtitle: 'Clinical Diet Charts, Calorie Counters & Kitchen POS',
    badge: 'Clinical Nutrition',
    icon: Apple,
    gradient: 'from-[#65A30D] to-[#84CC16]',
    accent: '#65A30D',
    accentSecondary: '#84CC16',
    bgLight: 'bg-[#F7FEE7]',
    borderColor: 'border-[#65A30D]/25',
    googleAuthAllowed: true,
    securityNotice: 'Therapeutic diabetic and renal diet orders linked to inpatient beds.',
    bgImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/medicore-wellness-bg.jpg',
    quote: 'Nutritional therapy specifically designed to accelerate healing and support individual clinical treatment plans.',
    features: ['Doctor Diet Chart Sync', 'Diabetic & Renal Meal Prep POS', 'Kitchen Dispatch & Bed Delivery Tracking'],
    complianceBadge: 'FSSAI Food Safety • Clinical Nutrition Guide'
  },
  'ambulance': {
    key: 'ambulance',
    number: 18,
    title: 'Ambulance & Emergency Dispatch',
    role: 'EMERGENCY_DISPATCHER',
    subtitle: 'GPS Fleet Tracking, Trauma Calls & Code Blue Dispatch',
    badge: 'Trauma & Fleet Command',
    icon: Truck,
    gradient: 'from-[#DC2626] to-[#991B1B]',
    accent: '#DC2626',
    accentSecondary: '#991B1B',
    bgLight: 'bg-[#FEF2F2]',
    borderColor: 'border-[#DC2626]/25',
    googleAuthAllowed: true,
    securityNotice: 'Live GPS telemetry and door-to-balloon emergency time tracking active.',
    bgImage: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-exterior.jpg',
    quote: 'Rapid-response emergency mobilization connecting trauma patients to critical life support within minutes.',
    features: ['Live Fleet GPS & Telemetry Map', 'Trauma Bay Pre-Arrival Tele-Notice', 'Golden Hour Door-to-Balloon Timer'],
    complianceBadge: 'Level-1 Trauma Emergency Protocols'
  },
  'housekeeping': {
    key: 'housekeeping',
    number: 19,
    title: 'Housekeeping & Infection Control',
    role: 'FACILITY_MANAGER',
    subtitle: 'Terminal Bed Sanitization & Biomedical Waste Disposal',
    badge: 'Sanitation & Safety',
    icon: Sparkles,
    gradient: 'from-[#16A34A] to-[#52525B]',
    accent: '#16A34A',
    accentSecondary: '#52525B',
    bgLight: 'bg-[#F0FDF4]',
    borderColor: 'border-[#16A34A]/25',
    googleAuthAllowed: true,
    securityNotice: 'Infection control checklists and terminal room disinfection verified.',
    bgImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/hospital-corridor.jpg',
    quote: 'Flawless hospital infection control and sparkling sterile environments safeguarding patients and staff.',
    features: ['Bed Turnover Disinfection Queue', 'Barcoded Bio-Waste Disposal Logs', 'Air Quality & HEPA Filter Tracking'],
    complianceBadge: 'Biomedical Waste Rules 2016 Compliant'
  },
  'mrd': {
    key: 'mrd',
    number: 20,
    title: 'Medical Records Department (MRD)',
    role: 'MRD_OFFICER',
    subtitle: 'ICD-10 Coding, Digital Archiving & Medico-Legal Records',
    badge: 'Health Information (HIM)',
    icon: Archive,
    gradient: 'from-[#4F46E5] to-[#64748B]',
    accent: '#4F46E5',
    accentSecondary: '#64748B',
    bgLight: 'bg-[#EEF2FF]',
    borderColor: 'border-[#4F46E5]/25',
    googleAuthAllowed: true,
    securityNotice: 'Statutory medical records retention and court summon tracking active.',
    bgImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/assets/backgrounds/bg-option-3-dna-tech.jpg',
    quote: 'Preserving clinical data integrity, patient privacy, and seamless longitudinal health records for life.',
    features: ['ICD-10 & CPT Code Automation', 'Statutory Retention Archive Vault', 'Medico-Legal Summons & Case Files'],
    complianceBadge: 'Statutory Health Records Act • HIPAA Compliant'
  }
};

export interface PortalLoginPageProps {
  portalKey: PortalKey;
  initialMode?: AuthMode;
  onSuccessLogin?: (user: AuthUser, token?: string) => void;
  onLoginSuccess?: (user: AuthUser, token?: string) => void;
  onBackToPortals?: () => void;
  onGoToLanding?: () => void;
  onBackToLanding?: () => void;
  onOpenGateway?: () => void;
}

export const PortalLoginPage: React.FC<PortalLoginPageProps> = ({
  portalKey,
  initialMode = 'signIn',
  onSuccessLogin,
  onLoginSuccess,
  onBackToPortals,
  onGoToLanding,
  onBackToLanding,
  onOpenGateway
}) => {
  const meta = PORTAL_METAS[portalKey] || PORTAL_METAS['admin'];
  const Icon = meta.icon;
  const demoCreds = PORTAL_DEMO_CREDENTIALS[portalKey];

  // Auth Mode: signIn | signUp (Activation) | forgot
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

  // Common UI State
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Image load state with fallback
  const [bgImageSrc, setBgImageSrc] = useState<string>(meta.bgImage);

  // 1. Sign In Form State
  const [email, setEmail] = useState<string>(demoCreds ? demoCreds.email : '');
  const [password, setPassword] = useState<string>(demoCreds ? demoCreds.pass : '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // 2. Activation / SignUp Form State (MedeilPlus style)
  const isPatientPortal = portalKey === 'patient';
  const [regFullName, setRegFullName] = useState<string>('');
  const [regIdentifier, setRegIdentifier] = useState<string>(''); // Employee ID or UHID
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regDepartment, setRegDepartment] = useState<string>(meta.subtitle.split(',')[0]);
  const [regOtp, setRegOtp] = useState<string>('');
  const [regOtpSent, setRegOtpSent] = useState<boolean>(false);
  const [regOtpVerified, setRegOtpVerified] = useState<boolean>(false);
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regShowPassword, setRegShowPassword] = useState<boolean>(false);
  const [regTermsAccepted, setRegTermsAccepted] = useState<boolean>(false);
  const [simulatedActivationCode, setSimulatedActivationCode] = useState<string | null>(null);

  // 3. Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotToken, setForgotToken] = useState<string>('');
  const [forgotNewPass, setForgotNewPass] = useState<string>('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState<string>('');
  const [forgotShowPass, setForgotShowPass] = useState<boolean>(false);
  const [simulatedForgotToken, setSimulatedForgotToken] = useState<string | null>(null);

  // Calculate password strength (0 to 4)
  const passwordStrength = useMemo(() => {
    const p = authMode === 'signUp' ? regPassword : (authMode === 'forgot' ? forgotNewPass : password);
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score;
  }, [regPassword, forgotNewPass, password, authMode]);

  // Sync state on portalKey change
  useEffect(() => {
    const cred = PORTAL_DEMO_CREDENTIALS[portalKey];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.pass);
    }
    setBgImageSrc(meta.bgImage);
    setErrorMessage(null);
    setSuccessMessage(null);
    setAuthMode(initialMode);
  }, [portalKey, initialMode]);

  const handleSuccess = (user: AuthUser, token?: string) => {
    if (onSuccessLogin) onSuccessLogin(user, token);
    if (onLoginSuccess) onLoginSuccess(user, token);
  };

  const handleLanding = () => {
    if (onGoToLanding) onGoToLanding();
    if (onBackToLanding) onBackToLanding();
  };

  const handleGateway = () => {
    if (onOpenGateway) onOpenGateway();
    else if (onBackToPortals) onBackToPortals();
  };

  // Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both registered email and password.');
      return;
    }

    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.login(email.trim(), password.trim(), portalKey);
      if (result.success && result.user) {
        sound.playSuccess();
        setSuccessMessage(`Welcome back, ${result.user.name}. Opening ${meta.title}...`);
        setTimeout(() => {
          handleSuccess(result.user!, result.token);
        }, 500);
      }
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Sign-In (Staff Only)
  const handleGoogleSignIn = async () => {
    if (!meta.googleAuthAllowed) return;
    sound.playClick();
    setGoogleLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.googleLogin(null, portalKey, email);
      if (result.success && result.user) {
        sound.playSuccess();
        setSuccessMessage(`Google Identity Verified: ${result.user.name}`);
        setTimeout(() => {
          handleSuccess(result.user!, result.token);
        }, 500);
      }
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Auto-fill demo credentials
  const handleUseDemoCreds = () => {
    sound.playClick();
    if (demoCreds) {
      setEmail(demoCreds.email);
      setPassword(demoCreds.pass);
      setErrorMessage(null);
    }
  };

  // Activation: Request OTP
  const handleRequestActivationOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!regPhone.trim() && !regEmail.trim()) {
      setErrorMessage('Please provide your registered email or phone to receive the verification code.');
      return;
    }
    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setLoading(false);
      setRegOtpSent(true);
      const code = '489201';
      setSimulatedActivationCode(code);
      sound.playSuccess();
      setSuccessMessage(`Verification code sent to ${regPhone || regEmail}. (Demo code: ${code})`);
    }, 600);
  };

  // Activation: Verify OTP
  const handleVerifyActivationOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!regOtp.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    sound.playClick();
    if (regOtp.trim() === simulatedActivationCode || regOtp.trim() === '489201' || regOtp.trim().length === 6) {
      setRegOtpVerified(true);
      sound.playSuccess();
      setSuccessMessage('Code verified successfully! Please set your secure password.');
      setErrorMessage(null);
    } else {
      sound.playWarning();
      setErrorMessage('Invalid verification code. Please check your SMS or email.');
    }
  };

  // Activation: Complete Account Setup
  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regIdentifier.trim() || !regEmail.trim()) {
      setErrorMessage('Please fill in all mandatory identification fields.');
      return;
    }
    if (!regPassword || !regConfirmPassword) {
      setErrorMessage('Please enter and confirm your new password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }
    if (!regTermsAccepted) {
      setErrorMessage('Please accept the Healthcare Data Privacy & HIPAA compliance policy.');
      return;
    }

    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Simulate or execute activation
      setTimeout(() => {
        sound.playSuccess();
        setSuccessMessage(`Account activated successfully for ${regFullName}! Switching to sign-in...`);
        setEmail(regEmail.trim());
        setPassword(regPassword);
        setLoading(false);
        setTimeout(() => {
          setAuthMode('signIn');
        }, 1000);
      }, 700);
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Account activation failed.');
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 (Request Token)
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.forgotPassword(forgotEmail.trim());
      sound.playSuccess();
      setSuccessMessage(result.message);
      if (result.simulatedResetToken) {
        setSimulatedForgotToken(result.simulatedResetToken);
        setForgotToken(result.simulatedResetToken);
      }
      setForgotStep('reset');
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 2 (Set New Password)
  const handleForgotComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotToken.trim() || !forgotNewPass || !forgotConfirmPass) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (forgotNewPass.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    sound.playClick();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.resetPassword(forgotToken.trim(), forgotNewPass, forgotConfirmPass);
      sound.playSuccess();
      setSuccessMessage(result.message);
      setEmail(forgotEmail.trim());
      setPassword(forgotNewPass);
      setTimeout(() => {
        setAuthMode('signIn');
        setForgotStep('request');
      }, 1000);
    } catch (err: any) {
      sound.playWarning();
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FB] flex flex-col font-sans selection:bg-[#3657A6] selection:text-white">
      {/* -------------------------------------------------------------
          MAIN SPLIT-SCREEN AUTHENTICATION WORKSPACE (Full Screen 100vh)
          ------------------------------------------------------------- */}
      <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
        {/* ============================================================
            LEFT COLUMN: High-Resolution Hospital Environment Showcase
            ============================================================ */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 2xl:col-span-7 relative overflow-hidden flex-col justify-between p-8 xl:p-12 2xl:p-16 text-white">
          {/* Background Photograph with Error Fallback */}
          <img
            src={bgImageSrc}
            alt={meta.title}
            onError={() => setBgImageSrc(meta.fallbackImage)}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08] scale-[1.02] transition-transform duration-700"
          />

          {/* Elegant Tint Gradient Overlay (Preserves photography detail while ensuring contrast) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/75 to-[#0F172A]/50 mix-blend-multiply"
          />
          <div
            className="absolute inset-0 opacity-40 mix-blend-soft-light"
            style={{
              background: `radial-gradient(circle at top left, ${meta.accent}, transparent 60%)`
            }}
          />

          {/* Top Left: MediCore Brand Identity & Role Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => { sound.playClick(); handleLanding(); }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Return to Public Website"
            >
              <div
                className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: meta.accent }}
              >
                ✚
              </div>
              <div>
                <span className="text-base font-serif font-black tracking-tight text-white block leading-tight">
                  MEDICORE HOSPITAL
                </span>
                <span className="text-[10px] text-slate-300 font-semibold tracking-wide">
                  Multispeciality Network &amp; Research
                </span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm backdrop-blur-md"
                style={{
                  backgroundColor: `${meta.accent}30`,
                  borderColor: `${meta.accent}80`,
                  color: '#FFFFFF'
                }}
              >
                {meta.badge}
              </span>
            </div>
          </div>

          {/* Center / Bottom: Portal Value Proposition & Features */}
          <div className="relative z-10 space-y-6 max-w-2xl my-auto py-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white text-xs font-medium border border-white/15">
                <Icon className="w-4 h-4" style={{ color: meta.accentSecondary || '#60A5FA' }} />
                <span>{meta.subtitle}</span>
              </div>
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-serif font-black tracking-tight text-white leading-tight">
                {meta.title}
              </h1>
              <p className="text-slate-200 text-sm xl:text-base leading-relaxed font-normal">
                {meta.quote}
              </p>
            </div>

            {/* 3 Clinical / Operational Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {meta.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1.5"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-xs font-medium text-slate-100 leading-snug">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Left Trust Seal */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NABH &amp; NABL Accredited Multispeciality Network</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              HIPAA SECURE • 256-BIT SSL
            </span>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: MedeilPlus-Inspired Clean Authentication Panel
            ============================================================ */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-6 2xl:col-span-5 flex flex-col justify-center items-center p-4 sm:p-8 xl:p-12 overflow-y-auto">
          <div className="w-full max-w-lg space-y-6">
            {/* Main Card Surface */}
            <div className="bg-white rounded-3xl border border-[#E5E8F0] shadow-xl shadow-slate-200/50 p-6 sm:p-8 xl:p-10 space-y-6 transition-all">
              
              {/* Mobile Only: Top Brand Row */}
              <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[#E5E8F0]">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); handleLanding(); }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-black text-xs shadow-xs"
                    style={{ backgroundColor: meta.accent }}
                  >
                    ✚
                  </div>
                  <span className="text-sm font-serif font-black text-[#202A40]">MEDICORE</span>
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); handleLanding(); }}
                  className="text-xs text-[#7A8498] hover:text-[#202A40] font-semibold cursor-pointer"
                >
                  ← Public Website
                </button>
              </div>
              
              {/* Card Header & Portal Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: meta.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#202A40]">
                        {authMode === 'signIn' && `Sign In`}
                        {authMode === 'signUp' && (isPatientPortal ? 'Patient Account Setup' : 'Staff Activation')}
                        {authMode === 'forgot' && 'Reset Password'}
                      </h2>
                      <p className="text-xs text-[#7A8498] font-medium">
                        {meta.title} • Portal #{meta.number}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border hidden sm:inline-block"
                    style={{
                      color: meta.accent,
                      borderColor: `${meta.accent}30`,
                      backgroundColor: `${meta.accent}10`
                    }}
                  >
                    {meta.badge}
                  </span>
                </div>

                {/* Authentication Workflow Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F5F6FB] rounded-xl border border-[#E5E8F0] mt-3">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setAuthMode('signIn'); setErrorMessage(null); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      authMode === 'signIn'
                        ? 'bg-white text-[#202A40] shadow-2xs font-bold'
                        : 'text-[#7A8498] hover:text-[#202A40]'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setAuthMode('signUp'); setErrorMessage(null); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      authMode === 'signUp'
                        ? 'bg-white text-[#202A40] shadow-2xs font-bold'
                        : 'text-[#7A8498] hover:text-[#202A40]'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isPatientPortal ? 'Patient Activation' : 'Staff Activation'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setAuthMode('forgot'); setErrorMessage(null); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      authMode === 'forgot'
                        ? 'bg-white text-[#202A40] shadow-2xs font-bold'
                        : 'text-[#7A8498] hover:text-[#202A40]'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Forgot</span>
                  </button>
                </div>
              </div>

              {/* Status & Error Notification Banners */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ====================================================
                  MODE 1: SIGN IN FORM
                  ==================================================== */}
              {authMode === 'signIn' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Demo Credentials Helper Pill */}
                  {demoCreds && (
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                        <span>Demo Account Available</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleUseDemoCreds}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                      >
                        Auto-fill Credentials
                      </button>
                    </div>
                  )}

                  {/* Registered Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. physician@medicore.org"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-sm text-[#202A40] placeholder-slate-400 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-11 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-sm text-[#202A40] placeholder-slate-400 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[#7A8498]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#3657A6] focus:ring-[#3657A6]"
                      />
                      <span>Remember this workstation</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => { sound.playClick(); setAuthMode('forgot'); }}
                      className="font-semibold hover:underline"
                      style={{ color: meta.accent }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                    style={{ backgroundColor: meta.accent }}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Clearance...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to {meta.title}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Google OAuth Section (Permitted Staff Portals Only) */}
                  {meta.googleAuthAllowed ? (
                    <div className="pt-2 space-y-3">
                      <div className="relative flex items-center justify-center">
                        <div className="border-t border-[#E5E8F0] w-full" />
                        <span className="bg-white px-3 text-[11px] text-[#7A8498] uppercase font-bold tracking-wider relative">
                          Or Continue With
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full py-2.5 px-4 rounded-xl border border-[#E5E8F0] hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>{googleLoading ? 'Validating Google Identity...' : 'Google Workspace Single Sign-On'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 text-center text-[11px] text-[#7A8498] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      🔒 Patient portal requires registered email and verified password for HIPAA compliance.
                    </div>
                  )}

                  {/* Switch to Activation Link */}
                  <div className="pt-2 text-center text-xs text-[#7A8498]">
                    <span>Need to activate an assigned account? </span>
                    <button
                      type="button"
                      onClick={() => { sound.playClick(); setAuthMode('signUp'); }}
                      className="font-bold underline hover:text-[#202A40]"
                      style={{ color: meta.accent }}
                    >
                      {isPatientPortal ? 'Activate Patient Account' : 'Activate Staff Account'}
                    </button>
                  </div>
                </form>
              )}

              {/* ====================================================
                  MODE 2: SIGNUP / ACCOUNT ACTIVATION FORM (MedeilPlus style)
                  ==================================================== */}
              {authMode === 'signUp' && (
                <form onSubmit={handleActivationSubmit} className="space-y-4">
                  {/* Provisioning Notice */}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      {isPatientPortal
                        ? 'Patient accounts are initiated during OPD registration. Enter your UHID and registered phone number to verify and set your password.'
                        : 'Staff portal credentials must be pre-provisioned by Hospital Administration. Enter your assigned Employee ID and email to complete onboarding.'}
                    </p>
                  </div>

                  {/* Field: Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder={isPatientPortal ? 'e.g. Magnus Stephenson' : 'e.g. Dr. Eleanor Vance, MD'}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-sm text-[#202A40] outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Field: Employee ID or UHID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                        {isPatientPortal ? 'Patient UHID' : 'Employee ID'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <FileBadge className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={regIdentifier}
                          onChange={(e) => setRegIdentifier(e.target.value)}
                          placeholder={isPatientPortal ? 'MC-2026-10842' : 'EMP-DOC-4089'}
                          required
                          className="w-full pl-10 pr-3 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-xs sm:text-sm text-[#202A40] font-mono outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98401 23456"
                          required
                          className="w-full pl-10 pr-3 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-xs sm:text-sm text-[#202A40] outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Registered Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                      Authorized Work / Contact Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="physician@medicore.org"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-sm text-[#202A40] outline-none transition"
                      />
                    </div>
                  </div>

                  {/* OTP Verification Row */}
                  <div className="p-3 rounded-2xl bg-[#F5F6FB] border border-[#E5E8F0] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#202A40]">6-Digit SMS / Email OTP Verification</span>
                      {!regOtpSent ? (
                        <button
                          type="button"
                          onClick={handleRequestActivationOtp}
                          className="font-bold underline text-xs cursor-pointer"
                          style={{ color: meta.accent }}
                        >
                          Request Code
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Code Dispatched
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (e.g. 489201)"
                        className="flex-1 px-3 py-2 bg-white border border-[#E5E8F0] rounded-xl text-xs sm:text-sm tracking-widest font-mono text-center outline-none focus:border-[#3657A6]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyActivationOtp}
                        disabled={regOtpVerified}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                          regOtpVerified
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#202A40] text-white hover:bg-slate-800'
                        }`}
                      >
                        {regOtpVerified ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>

                    {simulatedActivationCode && !regOtpVerified && (
                      <p className="text-[11px] text-blue-700">
                        Demo simulated OTP code: <span className="font-mono font-bold">{simulatedActivationCode}</span>{' '}
                        <button
                          type="button"
                          onClick={() => setRegOtp(simulatedActivationCode)}
                          className="underline cursor-pointer"
                        >
                          (Click to fill)
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          type={regShowPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          required
                          className="w-full pl-3 pr-9 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-xs sm:text-sm text-[#202A40] outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setRegShowPassword(!regShowPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                        >
                          {regShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-3 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-xs sm:text-sm text-[#202A40] outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Password Strength Indicator Bar */}
                  {regPassword.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[#7A8498]">
                        <span>Password Strength:</span>
                        <span className="font-bold">
                          {passwordStrength <= 1 && <span className="text-rose-600">Weak</span>}
                          {passwordStrength === 2 && <span className="text-amber-600">Fair</span>}
                          {passwordStrength === 3 && <span className="text-emerald-600">Good</span>}
                          {passwordStrength >= 4 && <span className="text-blue-600">Enterprise Strong</span>}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength >= 1 ? (passwordStrength === 1 ? 'bg-rose-500 w-1/4' : 'bg-amber-500 w-1/4') : 'w-0'
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength >= 2 ? (passwordStrength === 2 ? 'bg-amber-500 w-1/4' : 'bg-emerald-500 w-1/4') : 'w-0'
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength >= 3 ? (passwordStrength === 3 ? 'bg-emerald-500 w-1/4' : 'bg-blue-600 w-1/4') : 'w-0'
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength >= 4 ? 'bg-blue-600 w-1/4' : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-[#7A8498] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={regTermsAccepted}
                      onChange={(e) => setRegTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-[#3657A6] focus:ring-[#3657A6]"
                    />
                    <span className="leading-snug">
                      I agree to the MediCore Healthcare Data Privacy policy, HIPAA regulations, and confidential clinical documentation requirements.
                    </span>
                  </label>

                  {/* Activation CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                    style={{ backgroundColor: meta.accent }}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Activating Account...</span>
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4" />
                        <span>Activate &amp; Create Password</span>
                      </>
                    )}
                  </button>

                  {/* Return to Sign In */}
                  <div className="pt-2 text-center text-xs text-[#7A8498]">
                    <span>Already activated your account? </span>
                    <button
                      type="button"
                      onClick={() => { sound.playClick(); setAuthMode('signIn'); }}
                      className="font-bold underline hover:text-[#202A40]"
                      style={{ color: meta.accent }}
                    >
                      Return to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* ====================================================
                  MODE 3: FORGOT PASSWORD FORM
                  ==================================================== */}
              {authMode === 'forgot' && (
                <div className="space-y-4">
                  {forgotStep === 'request' ? (
                    <form onSubmit={handleForgotRequest} className="space-y-4">
                      <p className="text-xs text-[#7A8498] leading-relaxed">
                        Enter your registered email address to receive an expiring single-use password recovery token.
                      </p>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                          Registered Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="e.g. physician@medicore.org"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] focus:border-[#3657A6] focus:bg-white rounded-xl text-sm text-[#202A40] outline-none transition"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                        style={{ backgroundColor: meta.accent }}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Generating Recovery Link...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Recovery Instructions</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="text-center text-xs text-[#7A8498]">
                        <button
                          type="button"
                          onClick={() => { sound.playClick(); setAuthMode('signIn'); }}
                          className="font-bold underline hover:text-[#202A40]"
                          style={{ color: meta.accent }}
                        >
                          ← Back to Sign In
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleForgotComplete} className="space-y-4">
                      <p className="text-xs text-[#7A8498] leading-relaxed">
                        Enter the recovery token received by email or mobile to set your new password.
                      </p>

                      {simulatedForgotToken && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                          Demo Recovery Token:{' '}
                          <span className="font-mono font-bold">{simulatedForgotToken}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                          Recovery Token
                        </label>
                        <input
                          type="text"
                          value={forgotToken}
                          onChange={(e) => setForgotToken(e.target.value)}
                          placeholder="Paste recovery token"
                          required
                          className="w-full px-3 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] rounded-xl text-xs font-mono outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={forgotShowPass ? 'text' : 'password'}
                            value={forgotNewPass}
                            onChange={(e) => setForgotNewPass(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                            className="w-full pl-3 pr-9 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] rounded-xl text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setForgotShowPass(!forgotShowPass)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                          >
                            {forgotShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#202A40] uppercase tracking-wider">
                          Confirm New Password
                        </label>
                        <input
                          type={forgotShowPass ? 'text' : 'password'}
                          value={forgotConfirmPass}
                          onChange={(e) => setForgotConfirmPass(e.target.value)}
                          placeholder="Re-type new password"
                          required
                          className="w-full px-3 py-2.5 bg-[#F5F6FB] border border-[#E5E8F0] rounded-xl text-sm outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                        style={{ backgroundColor: meta.accent }}
                      >
                        {loading ? 'Updating Password...' : 'Reset Password & Return to Login'}
                      </button>

                      <div className="text-center text-xs text-[#7A8498]">
                        <button
                          type="button"
                          onClick={() => { sound.playClick(); setForgotStep('request'); }}
                          className="underline"
                        >
                          Request another token
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Security Compliance Footer Note */}
              <div className="pt-3 border-t border-[#E5E8F0] flex items-center gap-2 text-[11px] text-[#7A8498]">
                <LockKeyhole className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="leading-snug">{meta.securityNotice}</span>
              </div>
            </div>

            {/* Support / Quick Help Footer */}
            <div className="text-center text-xs text-[#7A8498] space-y-1">
              <p>Protected by MediCore Cryptographic Guard • HIPAA &amp; NABH Standard Compliant</p>
              <p className="text-[11px]">
                Hospital IT &amp; Biomedical Support Desk: <span className="font-semibold text-[#202A40]">Ext. 4400</span> (24/7 STAT)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
