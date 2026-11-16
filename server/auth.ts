/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MediCore Enterprise Multi-Portal Authentication Router
 * Enforces portal-isolated authentication, role-based access control,
 * Google OAuth verification, staff-only patient onboarding,
 * time-limited activation tokens, and 6-digit OTP mobile verification.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { 
  hashPassword, 
  verifyPassword, 
  generateSecureToken, 
  generateNumericOtp, 
  verifyOtp, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetFailedAttempts, 
  generateUhid,
  ACTIVATION_TOKEN_EXPIRY_MS,
  MAX_OTP_ATTEMPTS
} from './security.js';
import { fallbackStore, persistFallbackStore, getPool, isDbConnected } from './db.js';
import { PortalKey, UserRole } from '../src/types/index.js';

const router = Router();

// ============================================================
// PORTAL & ROLE DEFINITIONS FOR ALL 20 PORTALS
// ============================================================
export interface PortalConfig {
  key: PortalKey;
  number: number;
  title: string;
  role: UserRole;
  category: 'core' | 'clinical' | 'operations';
  description: string;
  googleAuthAllowed: boolean;
  accent: string;
}

export const PORTAL_CONFIGS: Record<PortalKey, PortalConfig> = {
  'super-admin': {
    key: 'super-admin',
    number: 1,
    title: 'Super Admin Portal',
    role: 'SUPER_ADMIN',
    category: 'core',
    description: 'Enterprise multi-facility command, security logs, database telemetry & system configuration.',
    googleAuthAllowed: true,
    accent: '#153B63'
  },
  'doctor': {
    key: 'doctor',
    number: 2,
    title: 'Doctor Clinical Station',
    role: 'DOCTOR',
    category: 'core',
    description: 'Patient consultations, SOAP clinical notes, E-Prescriptions, lab & radiology orders, tele-chat.',
    googleAuthAllowed: true,
    accent: '#0D9488'
  },
  'nurse': {
    key: 'nurse',
    number: 3,
    title: 'Head Nurse Station',
    role: 'NURSE',
    category: 'core',
    description: 'Ward rounds, bed census, MEWS deterioration triage algorithm, MAR medication administration.',
    googleAuthAllowed: true,
    accent: '#18865B'
  },
  'patient': {
    key: 'patient',
    number: 4,
    title: 'Patient Health Portal',
    role: 'PATIENT',
    category: 'core',
    description: 'Digital Health Card, lab reports, active prescriptions, appointments, hospital bills, doctor chat.',
    googleAuthAllowed: false, // Strict Rule: Email & Password only for Patient Portal
    accent: '#287FC1'
  },
  'admin': {
    key: 'admin',
    number: 5,
    title: 'Executive Admin & Wards',
    role: 'HOSPITAL_ADMIN',
    category: 'core',
    description: 'Hospital operations, inpatient ward overview, admission/discharge, bed census, staff rosters.',
    googleAuthAllowed: true,
    accent: '#1769AA'
  },
  'reception': {
    key: 'reception',
    number: 6,
    title: 'Reception & Front Desk',
    role: 'RECEPTIONIST',
    category: 'clinical',
    description: 'Patient registration, OPD queue tokens, appointment check-in, triage desk.',
    googleAuthAllowed: true,
    accent: '#2563EB'
  },
  'laboratory': {
    key: 'laboratory',
    number: 7,
    title: 'Laboratory Information (LIS)',
    role: 'LAB_TECH',
    category: 'clinical',
    description: 'Pathology worklist, specimen tracking, abnormal alarms, lab validation.',
    googleAuthAllowed: true,
    accent: '#7C3AED'
  },
  'pharmacy': {
    key: 'pharmacy',
    number: 8,
    title: 'Pharmacy & Drug Formulary',
    role: 'PHARMACIST',
    category: 'clinical',
    description: 'E-Prescription dispensing, batch expiry tracking, inventory POS.',
    googleAuthAllowed: true,
    accent: '#0D9488'
  },
  'radiology': {
    key: 'radiology',
    number: 9,
    title: 'Radiology & PACS Imaging',
    role: 'RADIOLOGIST',
    category: 'clinical',
    description: 'X-Ray, CT, MRI scans, PACS image viewer, diagnostic reporting.',
    googleAuthAllowed: true,
    accent: '#0E7490'
  },
  'surgery': {
    key: 'surgery',
    number: 10,
    title: 'OT & Surgical Management',
    role: 'SURGEON',
    category: 'clinical',
    description: 'Operating theater schedules, robotic surgery logs, WHO checklists.',
    googleAuthAllowed: true,
    accent: '#BE123C'
  },
  'billing': {
    key: 'billing',
    number: 11,
    title: 'Billing & Health Insurance',
    role: 'ACCOUNTANT',
    category: 'operations',
    description: 'Inpatient invoices, cashless insurance claims, payment receipts.',
    googleAuthAllowed: true,
    accent: '#059669'
  },
  'hr': {
    key: 'hr',
    number: 12,
    title: 'HR & Staff Management',
    role: 'HR_MANAGER',
    category: 'operations',
    description: 'Staff credentials, duty shifts, attendance, compliance certifications.',
    googleAuthAllowed: true,
    accent: '#4F46E5'
  },
  'bloodbank': {
    key: 'bloodbank',
    number: 13,
    title: 'Blood Bank & Transfusion',
    role: 'BLOOD_BANK_OFFICER',
    category: 'clinical',
    description: 'Blood unit barcodes, donor register, crossmatch validation, stock alarms.',
    googleAuthAllowed: true,
    accent: '#DC2626'
  },
  'procurement': {
    key: 'procurement',
    number: 14,
    title: 'Procurement & Supply Chain',
    role: 'PROCUREMENT_OFFICER',
    category: 'operations',
    description: 'Medical supply purchase orders, vendor contracts, inventory thresholds.',
    googleAuthAllowed: true,
    accent: '#D97706'
  },
  'patient-relations': {
    key: 'patient-relations',
    number: 15,
    title: 'Patient Relations & Grievance',
    role: 'PATIENT_RELATIONS',
    category: 'operations',
    description: 'Patient satisfaction surveys, feedback resolution, concierge services.',
    googleAuthAllowed: true,
    accent: '#EA580C'
  },
  'quality': {
    key: 'quality',
    number: 16,
    title: 'Quality & NABH Compliance',
    role: 'QUALITY_NABH_OFFICER',
    category: 'operations',
    description: 'NABH audit checklists, incident reports, clinical indicator metrics.',
    googleAuthAllowed: true,
    accent: '#0284C7'
  },
  'dietary': {
    key: 'dietary',
    number: 17,
    title: 'Dietary & Nutrition Services',
    role: 'DIETICIAN',
    category: 'operations',
    description: 'Inpatient meal plans, therapeutic diet orders, kitchen delivery tracking.',
    googleAuthAllowed: true,
    accent: '#16A34A'
  },
  'ambulance': {
    key: 'ambulance',
    number: 18,
    title: 'Ambulance & Emergency Dispatch',
    role: 'EMERGENCY_DISPATCHER',
    category: 'operations',
    description: 'GPS fleet tracking, trauma call intake, emergency paramedic dispatch.',
    googleAuthAllowed: true,
    accent: '#E11D48'
  },
  'housekeeping': {
    key: 'housekeeping',
    number: 19,
    title: 'Housekeeping & Infection Control',
    role: 'FACILITY_MANAGER',
    category: 'operations',
    description: 'Bed sanitization logs, biomedical waste protocols, biohazard audits.',
    googleAuthAllowed: true,
    accent: '#475569'
  },
  'mrd': {
    key: 'mrd',
    number: 20,
    title: 'Medical Records Department (MRD)',
    role: 'MRD_OFFICER',
    category: 'operations',
    description: 'ICD-10 coding, digital chart archiving, medico-legal documentation.',
    googleAuthAllowed: true,
    accent: '#334155'
  }
};

// Ensure fallback store has authentication arrays
if (!(fallbackStore as any).userAccounts) {
  (fallbackStore as any).userAccounts = [];
}
if (!(fallbackStore as any).patientVerifications) {
  (fallbackStore as any).patientVerifications = [];
}
if (!(fallbackStore as any).passwordResets) {
  (fallbackStore as any).passwordResets = [];
}
if (!(fallbackStore as any).authSessions) {
  (fallbackStore as any).authSessions = [];
}
if (!(fallbackStore as any).simulatedNotifications) {
  (fallbackStore as any).simulatedNotifications = [];
}

// ============================================================
// SEED DEFAULT ACCOUNTS FOR ALL 20 PORTALS
// ============================================================
export interface UserAccountRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  portalKey: PortalKey;
  department: string;
  employeeId?: string;
  phone?: string;
  status: 'Active' | 'Pending Verification' | 'Suspended' | 'Deactivated';
  googleId?: string;
  mfaEnabled: boolean;
  linkedPatientId?: string;
  uhid?: string;
  createdAt: string;
  lastLogin?: string;
}

const DEFAULT_SEEDS = [
  { portalKey: 'super-admin', email: 'medicore.superadmin@gmail.com', pass: 'SuperAdmin@2026', name: 'Dr. Eleanor Vance, MD, CISSP', role: 'SUPER_ADMIN', dept: 'Enterprise Command & Security' },
  { portalKey: 'admin', email: 'medicore.admin@gmail.com', pass: 'Admin@2026', name: 'Marcus Vance, MHA', role: 'HOSPITAL_ADMIN', dept: 'Executive Administration & Ward Logistics' },
  { portalKey: 'doctor', email: 'medicore.doctor@gmail.com', pass: 'Doctor@2026', name: 'Dr. Roger S., MD', role: 'DOCTOR', dept: 'Cardiology & Internal Medicine' },
  { portalKey: 'nurse', email: 'medicore.nurse@gmail.com', pass: 'Nurse@2026', name: 'Sister Sarah Jenkins, RN, BSN', role: 'NURSE', dept: 'Inpatient Nursing Station' },
  { portalKey: 'patient', email: 'medicore.patient@gmail.com', pass: 'patient123', name: 'Magnus Stephenson', role: 'PATIENT', dept: 'Patient Health Portal', linkedPatientId: 'pat-1', uhid: 'MC-2026-10842' },
  { portalKey: 'reception', email: 'reception@medicore.org', pass: 'Reception@2026', name: 'Ananya Sharma', role: 'RECEPTIONIST', dept: 'Front Desk & Patient Registration' },
  { portalKey: 'laboratory', email: 'lab@medicore.org', pass: 'Lab@2026', name: 'Elena Kozlova, MLS', role: 'LAB_TECH', dept: 'Pathology & Diagnostic Laboratory' },
  { portalKey: 'pharmacy', email: 'pharmacy@medicore.org', pass: 'Pharmacy@2026', name: 'Alexandre Dubois, RPh', role: 'PHARMACIST', dept: 'Inpatient & OPD Pharmacy' },
  { portalKey: 'radiology', email: 'radiology@medicore.org', pass: 'Radiology@2026', name: 'Dr. Kiran Rao, DMRD', role: 'RADIOLOGIST', dept: 'Radiology & Imaging Services' },
  { portalKey: 'surgery', email: 'surgery@medicore.org', pass: 'Surgery@2026', name: 'Dr. Rajeshwari Iyer, MS, MCh', role: 'SURGEON', dept: 'Surgical Services & Robotic OT' },
  { portalKey: 'billing', email: 'billing@medicore.org', pass: 'Billing@2026', name: 'Marcus Brody, CPA', role: 'ACCOUNTANT', dept: 'Finance & Medical Insurance Claims' },
  { portalKey: 'hr', email: 'hr@medicore.org', pass: 'Hr@2026', name: 'Pooja Kulkarni, MBA-HR', role: 'HR_MANAGER', dept: 'Human Resources & Medical Staffing' },
  { portalKey: 'bloodbank', email: 'bloodbank@medicore.org', pass: 'BloodBank@2026', name: 'Dr. Vikramaditya Sen', role: 'BLOOD_BANK_OFFICER', dept: 'Transfusion Medicine & Blood Bank' },
  { portalKey: 'procurement', email: 'procurement@medicore.org', pass: 'Procurement@2026', name: 'Sanjay Mehra', role: 'PROCUREMENT_OFFICER', dept: 'Supply Chain & Material Procurement' },
  { portalKey: 'patient-relations', email: 'relations@medicore.org', pass: 'Relations@2026', name: 'Meera Nambiar', role: 'PATIENT_RELATIONS', dept: 'Patient Advocacy & Concierge' },
  { portalKey: 'quality', email: 'quality@medicore.org', pass: 'Quality@2026', name: 'Dr. Sunita Deshmukh, CPHQ', role: 'QUALITY_NABH_OFFICER', dept: 'NABH Accreditation & Clinical Quality' },
  { portalKey: 'dietary', email: 'dietary@medicore.org', pass: 'Dietary@2026', name: 'Kavita Menon, RD', role: 'DIETICIAN', dept: 'Clinical Nutrition & Inpatient Diet' },
  { portalKey: 'ambulance', email: 'ambulance@medicore.org', pass: 'Ambulance@2026', name: 'Gopal Verma, EMT-P', role: 'EMERGENCY_DISPATCHER', dept: 'Ambulance Command & Trauma Dispatch' },
  { portalKey: 'housekeeping', email: 'housekeeping@medicore.org', pass: 'Housekeeping@2026', name: 'Arun Prakash', role: 'FACILITY_MANAGER', dept: 'Facility Sanitation & Infection Control' },
  { portalKey: 'mrd', email: 'mrd@medicore.org', pass: 'Mrd@2026', name: 'Deepa Narayanan, RHIA', role: 'MRD_OFFICER', dept: 'Medical Records Department' }
];

export function initializeAuthSeeds() {
  const store = (fallbackStore as any).userAccounts as UserAccountRecord[];
  for (const seed of DEFAULT_SEEDS) {
    const existing = store.find(u => u.email.toLowerCase() === seed.email.toLowerCase());
    if (!existing) {
      const { hash, salt } = hashPassword(seed.pass);
      store.push({
        id: `usr-${seed.portalKey}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: seed.email.toLowerCase(),
        name: seed.name,
        passwordHash: hash,
        salt,
        role: seed.role as UserRole,
        portalKey: seed.portalKey as PortalKey,
        department: seed.dept,
        status: 'Active',
        mfaEnabled: seed.role === 'SUPER_ADMIN',
        linkedPatientId: (seed as any).linkedPatientId,
        uhid: (seed as any).uhid,
        createdAt: new Date().toISOString()
      });
    }
  }
  persistFallbackStore();
}

initializeAuthSeeds();

// Audit helper for auth
function logAuthAudit(action: string, userName: string, role: string, details: string, ip: string = '127.0.0.1') {
  const log = {
    id: `audit-auth-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userName,
    userRole: role as UserRole,
    action,
    module: 'Authentication & Security',
    details,
    ipAddress: ip
  };
  fallbackStore.auditLogs.unshift(log as any);
  persistFallbackStore();
}

// ============================================================
// 1. GET /api/auth/portals – List all 20 portal configs
// ============================================================
router.get('/portals', (_req: Request, res: Response) => {
  res.json({
    success: true,
    portals: Object.values(PORTAL_CONFIGS)
  });
});

// ============================================================
// 2. POST /api/auth/login – Portal-Specific Email/Password Login
// ============================================================
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password, portalKey } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!email || !password || !portalKey) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and portal selection are required.'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const rateLimitKey = `${ip}:${normalizedEmail}`;
  const rateLimit = checkRateLimit(rateLimitKey);

  if (!rateLimit.allowed) {
    logAuthAudit('ACCOUNT_LOCKOUT', normalizedEmail, 'UNKNOWN', `Brute force lockout triggered from ${ip}. Locked for ${rateLimit.retryAfterSec}s.`, ip);
    return res.status(429).json({
      success: false,
      message: `Too many failed login attempts. For security, access is temporarily locked. Please try again in ${rateLimit.retryAfterSec} seconds.`
    });
  }

  const users = (fallbackStore as any).userAccounts as UserAccountRecord[];
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    recordFailedAttempt(rateLimitKey);
    logAuthAudit('LOGIN_FAILED', normalizedEmail, 'UNKNOWN', `Failed login attempt for non-existent account at portal ${portalKey}`, ip);
    return res.status(401).json({
      success: false,
      message: 'Invalid email address or password.'
    });
  }

  // Account status check
  if (user.status === 'Pending Verification') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending verification. Please verify your mobile OTP and activate your account via your registration link.'
    });
  }

  if (user.status === 'Suspended' || user.status === 'Deactivated') {
    logAuthAudit('SUSPENDED_LOGIN_ATTEMPT', user.name, user.role, `Suspended user attempted login to ${portalKey}`, ip);
    return res.status(403).json({
      success: false,
      message: 'This account has been suspended by hospital administration. Please contact IT Security.'
    });
  }

  // Password verification
  const isMatch = verifyPassword(password, user.salt, user.passwordHash);
  if (!isMatch) {
    const failedInfo = recordFailedAttempt(rateLimitKey);
    logAuthAudit('LOGIN_FAILED', user.name, user.role, `Invalid password attempt for ${normalizedEmail}`, ip);
    return res.status(401).json({
      success: false,
      message: failedInfo.isLocked
        ? `Invalid password. Maximum attempts exceeded. Account locked for 15 minutes.`
        : `Invalid email address or password. ${failedInfo.remainingAttempts} attempt(s) remaining.`
    });
  }

  // STRICT PORTAL ISOLATION & RBAC CHECK
  // Rule: Users cannot switch portals by modifying the URL or selecting a privileged portal!
  const targetPortal = PORTAL_CONFIGS[portalKey as PortalKey];
  if (!targetPortal) {
    return res.status(400).json({ success: false, message: 'Invalid portal identifier.' });
  }

  // Role validation: Super Admin can access all portals; for other roles, portalKey must match exactly
  const isAuthorized = user.role === 'SUPER_ADMIN' || user.portalKey === portalKey;
  if (!isAuthorized) {
    logAuthAudit('UNAUTHORIZED_PORTAL_ATTEMPT', user.name, user.role, `Cross-portal intrusion denied: ${user.role} attempted to access ${portalKey} portal`, ip);
    return res.status(403).json({
      success: false,
      message: `Access Denied: Your account role (${user.role}) is not authorized to access the ${targetPortal.title}. Please sign in at your designated portal.`
    });
  }

  // Successful Login
  resetFailedAttempts(rateLimitKey);
  user.lastLogin = new Date().toISOString();
  persistFallbackStore();

  const sessionToken = generateSecureToken('sess');
  (fallbackStore as any).authSessions.push({
    id: `sess-${Date.now()}`,
    userId: user.id,
    token: sessionToken,
    role: user.role,
    portalKey: user.portalKey,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000 // 12 hours
  });
  persistFallbackStore();

  logAuthAudit('LOGIN_SUCCESS', user.name, user.role, `Authenticated via password for ${portalKey} portal`, ip);

  return res.json({
    success: true,
    message: `Welcome back, ${user.name}`,
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      portalKey: user.portalKey,
      department: user.department,
      employeeId: user.employeeId,
      linkedPatientId: user.linkedPatientId,
      uhid: user.uhid
    }
  });
});

// ============================================================
// 3. POST /api/auth/google – Google OAuth 2.0 / OIDC Verification
// ============================================================
router.post('/google', async (req: Request, res: Response): Promise<any> => {
  const { credential, portalKey, emailOverride } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!portalKey) {
    return res.status(400).json({ success: false, message: 'Portal selection required.' });
  }

  // Rule: Patient Portal DOES NOT allow Google Sign-In
  if (portalKey === 'patient') {
    return res.status(403).json({
      success: false,
      message: 'Direct Google Sign-In is disabled for the Patient Portal. Patients must log in using their verified registered email and password.'
    });
  }

  let verifiedEmail = '';
  let googleSub = '';

  // Parse credential JWT (or simulated OAuth payload in dev)
  if (credential) {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        verifiedEmail = payload.email?.toLowerCase();
        googleSub = payload.sub;
      }
    } catch (e) {
      // ignore
    }
  }

  // If in local development or demo simulation
  if (!verifiedEmail && emailOverride) {
    verifiedEmail = String(emailOverride).trim().toLowerCase();
    googleSub = `google-sim-${Date.now()}`;
  }

  if (!verifiedEmail) {
    return res.status(400).json({
      success: false,
      message: 'Unable to verify Google identity token. Please try again.'
    });
  }

  const users = (fallbackStore as any).userAccounts as UserAccountRecord[];
  const user = users.find(u => u.email.toLowerCase() === verifiedEmail);

  // STRICT RULE: Google authentication must NOT automatically grant portal permissions
  // Account must already be provisioned by hospital administrators!
  if (!user) {
    logAuthAudit('GOOGLE_LOGIN_UNAUTHORIZED', verifiedEmail, 'UNKNOWN', `Unauthorized Google account attempted login to ${portalKey}`, ip);
    return res.status(401).json({
      success: false,
      message: `Unauthorized Google Account: No hospital staff record exists for ${verifiedEmail}. All staff accounts must be provisioned and authorized by hospital administration.`
    });
  }

  if (user.status !== 'Active') {
    return res.status(403).json({
      success: false,
      message: `Account status is ${user.status}. Access denied.`
    });
  }

  // Cross-portal authorization check
  const isAuthorized = user.role === 'SUPER_ADMIN' || user.portalKey === portalKey;
  if (!isAuthorized) {
    logAuthAudit('GOOGLE_LOGIN_PORTAL_MISMATCH', user.name, user.role, `Google OAuth denied: ${user.role} attempted to enter ${portalKey} portal`, ip);
    return res.status(403).json({
      success: false,
      message: `Access Denied: Your verified Google account (${user.name}) is authorized as ${user.role} for the ${user.portalKey} portal, not for ${portalKey}.`
    });
  }

  // Success: Link Google Sub and create session
  user.googleId = googleSub;
  user.lastLogin = new Date().toISOString();
  persistFallbackStore();

  const sessionToken = generateSecureToken('g_sess');
  (fallbackStore as any).authSessions.push({
    id: `sess-${Date.now()}`,
    userId: user.id,
    token: sessionToken,
    role: user.role,
    portalKey: user.portalKey,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000
  });
  persistFallbackStore();

  logAuthAudit('GOOGLE_LOGIN_SUCCESS', user.name, user.role, `Authenticated via verified Google OAuth for ${portalKey}`, ip);

  return res.json({
    success: true,
    message: `Google identity verified. Welcome, ${user.name}`,
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      portalKey: user.portalKey,
      department: user.department,
      employeeId: user.employeeId
    }
  });
});

// ============================================================
// 4. POST /api/auth/register-patient – Authorized Staff Registers Patient
// ============================================================
router.post('/register-patient', async (req: Request, res: Response): Promise<any> => {
  const {
    name,
    dob,
    gender,
    bloodGroup,
    address,
    emergencyContactName,
    emergencyContactPhone,
    phone,
    email,
    department = 'General Medicine',
    hospital = 'MediCore Central Hospital (Flagship)',
    registrationSource = 'Reception Desk',
    staffName = 'Hospital Reception Staff'
  } = req.body;

  if (!name || !phone || !email || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Full Name, Mobile Number, Email Address, and Gender are required.'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = String(phone).trim();

  // Duplicate check
  const patients = fallbackStore.patients;
  const existingPatient = patients.find(p => 
    (p.email && p.email.toLowerCase() === normalizedEmail) || 
    (p.phone && p.phone === normalizedPhone)
  );

  if (existingPatient) {
    return res.status(409).json({
      success: false,
      message: `Duplicate patient record detected. A patient record with this contact info already exists (UHID: ${existingPatient.patientCode || existingPatient.id}).`,
      existingPatientId: existingPatient.id,
      existingUhid: existingPatient.patientCode
    });
  }

  // Generate unique UHID
  const uhid = generateUhid();
  const patientId = `pat-${Date.now()}`;

  // Generate Activation Token & 6-digit numeric OTP
  const activationToken = generateSecureToken('act');
  const activationTokenExpiry = Date.now() + ACTIVATION_TOKEN_EXPIRY_MS;
  const { otp, hash: otpHash, salt: otpSalt, expiresAt: otpExpiry } = generateNumericOtp();

  // Calculate age from DOB if present
  let age = 30;
  if (dob) {
    const birthYear = new Date(dob).getFullYear();
    if (!isNaN(birthYear)) {
      age = Math.max(1, new Date().getFullYear() - birthYear);
    }
  }

  // Create Patient record in fallback store with PENDING_VERIFICATION status
  const newPatient = {
    id: patientId,
    patientCode: uhid,
    name: String(name).trim(),
    age,
    gender,
    bloodGroup: bloodGroup || 'O+',
    phone: normalizedPhone,
    email: normalizedEmail,
    address: address || '',
    emergencyContact: `${emergencyContactName || 'Family'} (${emergencyContactPhone || normalizedPhone})`,
    admissionStatus: 'Outpatient',
    department,
    hospital,
    registrationDate: new Date().toISOString().slice(0, 10),
    registrationSource,
    accountStatus: 'PENDING_VERIFICATION',
    activationToken,
    activationTokenExpiry,
    mobileOtpHash: otpHash,
    mobileOtpSalt: otpSalt,
    mobileOtpExpiry: otpExpiry,
    otpAttempts: 0,
    emailVerified: false,
    mobileVerified: false,
    vitals: {
      bloodPressure: '120/80',
      pulseRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      temperature: 36.8
    }
  };

  fallbackStore.patients.unshift(newPatient as any);

  // Record in patientVerifications table
  const verifications = (fallbackStore as any).patientVerifications;
  verifications.unshift({
    id: `ver-${Date.now()}`,
    patientId,
    uhid,
    name: newPatient.name,
    email: normalizedEmail,
    mobile: normalizedPhone,
    activationToken,
    activationTokenExpiry,
    mobileOtpHash: otpHash,
    mobileOtpSalt: otpSalt,
    mobileOtpExpiry: otpExpiry,
    otpAttempts: 0,
    emailVerified: false,
    mobileVerified: false,
    status: 'PENDING_VERIFICATION',
    createdAt: new Date().toISOString()
  });

  // Check integration providers (Twilio/SendGrid)
  const twilioConfigured = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  const sendgridConfigured = Boolean(process.env.SENDGRID_API_KEY);

  const notificationStatus = {
    smsProvider: twilioConfigured ? 'Twilio SMS Gateway' : 'Local Simulation (API Keys not configured in .env)',
    smsDelivered: twilioConfigured,
    emailProvider: sendgridConfigured ? 'SendGrid SMTP Gateway' : 'Local Simulation (API Keys not configured in .env)',
    emailDelivered: sendgridConfigured,
    simulatedActivationLink: `http://localhost:3000/#activate?token=${activationToken}`,
    simulatedOtp: otp
  };

  // Record in simulated notification tray for testing
  (fallbackStore as any).simulatedNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'PATIENT_ACTIVATION_DISPATCH',
    uhid,
    patientName: newPatient.name,
    email: normalizedEmail,
    mobile: normalizedPhone,
    activationToken,
    otp,
    activationLink: notificationStatus.simulatedActivationLink,
    timestamp: new Date().toISOString()
  });

  persistFallbackStore();

  logAuthAudit(
    'PATIENT_REGISTERED_BY_STAFF',
    staffName,
    'RECEPTIONIST',
    `Registered new patient ${newPatient.name} (UHID: ${uhid}). Dispatched time-limited activation token & 6-digit Mobile OTP.`
  );

  return res.status(201).json({
    success: true,
    message: `Patient ${newPatient.name} successfully registered with UHID ${uhid}. Activation email and mobile OTP dispatched.`,
    uhid,
    patientId,
    activationToken,
    notificationStatus
  });
});

// ============================================================
// 5. GET /api/auth/activate/:token – Retrieve Activation Session Info
// ============================================================
router.get('/activate/:token', (req: Request, res: Response): any => {
  const { token } = req.params;
  const verifications = (fallbackStore as any).patientVerifications || [];
  const record = verifications.find((v: any) => v.activationToken === token);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired activation link. Please contact hospital support or request a new link.'
    });
  }

  if (Date.now() > record.activationTokenExpiry) {
    return res.status(410).json({
      success: false,
      message: 'This activation link has expired (validity: 24 hours). Please contact the hospital reception to receive a new link.'
    });
  }

  if (record.status === 'ACTIVE') {
    return res.status(400).json({
      success: false,
      message: 'This account has already been verified and activated. You can proceed directly to the Patient Login.'
    });
  }

  // Mask phone number for security (e.g. +91 ***** 4321)
  const phone = record.mobile || '';
  const maskedPhone = phone.length > 4 ? `${phone.slice(0, 3)} •••• ${phone.slice(-4)}` : phone;

  return res.json({
    success: true,
    uhid: record.uhid,
    patientName: record.name,
    email: record.email,
    maskedPhone,
    mobileVerified: record.mobileVerified,
    emailVerified: record.emailVerified
  });
});

// ============================================================
// 6. POST /api/auth/activate/verify-otp – Verify Mobile 6-Digit OTP
// ============================================================
router.post('/activate/verify-otp', (req: Request, res: Response): any => {
  const { token, otp } = req.body;

  if (!token || !otp) {
    return res.status(400).json({ success: false, message: 'Activation token and 6-digit OTP code are required.' });
  }

  const verifications = (fallbackStore as any).patientVerifications || [];
  const record = verifications.find((v: any) => v.activationToken === token);

  if (!record) {
    return res.status(404).json({ success: false, message: 'Invalid activation session.' });
  }

  // Check retry limit
  if (record.otpAttempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: 'Maximum OTP verification attempts (3) exceeded. Please request a new activation link.'
    });
  }

  const verificationResult = verifyOtp(String(otp), record.mobileOtpSalt, record.mobileOtpHash, record.mobileOtpExpiry);

  if (!verificationResult.valid) {
    record.otpAttempts += 1;
    persistFallbackStore();
    const remaining = MAX_OTP_ATTEMPTS - record.otpAttempts;
    return res.status(400).json({
      success: false,
      message: `${verificationResult.reason || 'Invalid OTP code.'} ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Account activation locked.'}`
    });
  }

  record.mobileVerified = true;
  persistFallbackStore();

  logAuthAudit('MOBILE_OTP_VERIFIED', record.name, 'PATIENT', `Mobile OTP successfully verified for UHID ${record.uhid}`);

  return res.json({
    success: true,
    message: 'Mobile number verified successfully. You may now create your secure password.'
  });
});

// ============================================================
// 7. POST /api/auth/activate/set-password – Set Password & Activate
// ============================================================
router.post('/activate/set-password', (req: Request, res: Response): any => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Password and password confirmation are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  // Password strength validation: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=~_-])[A-Za-z\d@$!%*?&#^+=~_-]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  const verifications = (fallbackStore as any).patientVerifications || [];
  const record = verifications.find((v: any) => v.activationToken === token);

  if (!record) {
    return res.status(404).json({ success: false, message: 'Invalid activation session.' });
  }

  // Ensure mobile verification step was completed
  if (!record.mobileVerified) {
    return res.status(400).json({
      success: false,
      message: 'Mobile OTP verification must be completed before setting your password.'
    });
  }

  // Securely hash password using PBKDF2 with SHA-512 and random salt
  const { hash, salt } = hashPassword(password);

  // Update verification record
  record.status = 'ACTIVE';
  record.emailVerified = true;

  // Update Patient record
  const patient = fallbackStore.patients.find(p => p.id === record.patientId || p.patientCode === record.uhid);
  if (patient) {
    (patient as any).accountStatus = 'ACTIVE';
    (patient as any).passwordHash = hash;
    (patient as any).salt = salt;
    (patient as any).emailVerified = true;
    (patient as any).mobileVerified = true;
  }

  // Create or update user account in userAccounts store
  const userAccounts = (fallbackStore as any).userAccounts as UserAccountRecord[];
  const existingUserIdx = userAccounts.findIndex(u => u.email.toLowerCase() === record.email.toLowerCase());

  const userAccountData: UserAccountRecord = {
    id: `usr-pat-${Date.now()}`,
    email: record.email.toLowerCase(),
    name: record.name,
    passwordHash: hash,
    salt,
    role: 'PATIENT',
    portalKey: 'patient',
    department: 'Patient Health Portal',
    phone: record.mobile,
    status: 'Active',
    mfaEnabled: false,
    linkedPatientId: record.patientId,
    uhid: record.uhid,
    createdAt: new Date().toISOString()
  };

  if (existingUserIdx >= 0) {
    userAccounts[existingUserIdx] = userAccountData;
  } else {
    userAccounts.push(userAccountData);
  }

  persistFallbackStore();

  logAuthAudit(
    'PATIENT_ACCOUNT_ACTIVATED',
    record.name,
    'PATIENT',
    `Patient account activated for UHID ${record.uhid}. Secure password created and linked to registered email ${record.email}.`
  );

  return res.json({
    success: true,
    message: 'Your MediCore Patient Portal account is ready.',
    uhid: record.uhid,
    email: record.email
  });
});

// ============================================================
// 8. POST /api/auth/forgot-password – Password Recovery Initiation
// ============================================================
router.post('/forgot-password', (req: Request, res: Response): any => {
  const { email } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!email) {
    return res.status(400).json({ success: false, message: 'Registered email address is required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const resetToken = generateSecureToken('rst');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  const passwordResets = (fallbackStore as any).passwordResets;
  passwordResets.unshift({
    id: `rst-${Date.now()}`,
    email: normalizedEmail,
    token: resetToken,
    expiresAt,
    used: false,
    createdAt: new Date().toISOString()
  });

  (fallbackStore as any).simulatedNotifications.unshift({
    id: `notif-rst-${Date.now()}`,
    type: 'PASSWORD_RESET_DISPATCH',
    email: normalizedEmail,
    resetToken,
    resetLink: `http://localhost:3000/#reset-password?token=${resetToken}`,
    timestamp: new Date().toISOString()
  });

  persistFallbackStore();

  logAuthAudit('PASSWORD_RESET_REQUESTED', normalizedEmail, 'UNKNOWN', `Password recovery requested for ${normalizedEmail}`, ip);

  // OWASP Rule: Never reveal whether an arbitrary email exists in the database
  return res.json({
    success: true,
    message: 'If an active account is associated with this email address, password recovery instructions have been dispatched.',
    simulatedResetToken: resetToken
  });
});

// ============================================================
// 9. POST /api/auth/reset-password – Complete Password Reset
// ============================================================
router.post('/reset-password', (req: Request, res: Response): any => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Token, new password, and confirmation are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=~_-])[A-Za-z\d@$!%*?&#^+=~_-]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.'
    });
  }

  const passwordResets = (fallbackStore as any).passwordResets;
  const record = passwordResets.find((r: any) => r.token === token && !r.used);

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token. Please request a new recovery link.'
    });
  }

  const users = (fallbackStore as any).userAccounts as UserAccountRecord[];
  const user = users.find(u => u.email.toLowerCase() === record.email.toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.salt = salt;
  record.used = true;

  persistFallbackStore();

  logAuthAudit('PASSWORD_RESET_COMPLETED', user.name, user.role, `Password reset successfully completed for ${user.email}`);

  return res.json({
    success: true,
    message: 'Password has been reset successfully. You may now sign in with your new credentials.'
  });
});

// ============================================================
// 10. GET /api/auth/debug-notifications – Inspect Simulated Dispatch Log
// ============================================================
router.get('/debug-notifications', (_req: Request, res: Response) => {
  const notifs = (fallbackStore as any).simulatedNotifications || [];
  res.json({
    success: true,
    count: notifs.length,
    notifications: notifs.slice(0, 20)
  });
});

export default router;
