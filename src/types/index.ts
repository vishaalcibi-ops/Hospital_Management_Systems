/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'HOSPITAL_ADMIN' 
  | 'DOCTOR' 
  | 'NURSE' 
  | 'RECEPTIONIST' 
  | 'PHARMACIST' 
  | 'LAB_TECH' 
  | 'ACCOUNTANT' 
  | 'PATIENT'
  | 'RADIOLOGIST'
  | 'SURGEON'
  | 'HR_MANAGER'
  | 'BLOOD_BANK_OFFICER'
  | 'PROCUREMENT_OFFICER'
  | 'PATIENT_RELATIONS'
  | 'QUALITY_NABH_OFFICER'
  | 'DIETICIAN'
  | 'EMERGENCY_DISPATCHER'
  | 'FACILITY_MANAGER'
  | 'MRD_OFFICER';

export type ThemeMode = 'mint' | 'dark';

export type AnatomicalSystem = 
  | 'cardiovascular' 
  | 'thoracic' 
  | 'digestive' 
  | 'skeletal' 
  | 'nervous' 
  | 'whole_body';

export interface AnatomicalHotspot {
  id: string;
  name: string;
  latinName: string;
  system: AnatomicalSystem;
  position: [number, number, number];
  description: string;
  clinicalSignificance: string;
  riskFactor?: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface Patient {
  id: string;
  patientCode: string; // e.g. "P-12563a"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  avatar: string;
  admissionStatus: 'Outpatient' | 'Admitted' | 'ICU' | 'Discharged';
  emergencyContact?: string;
  ward?: string;
  bedNumber?: string;
  roomNumber?: string;
  primaryDoctorId: string;
  primaryDoctorName: string;
  diagnosis: string;
  heartAge: number;
  chronologicalAge: number;
  riskScore: number; // 0 - 100
  vitals: {
    bloodPressure: string; // e.g. "120/80"
    pulseRate: number; // bpm
    respiratoryRate: number; // breaths/min
    oxygenSaturation: number; // %
    temperature: number; // Celsius
    hba1c: number; // %
    cholesterol: number; // mg/dL
    stressLevel: 'Mild' | 'Moderate' | 'High';
    sleepQuality: 'Good' | 'Fair' | 'Poor';
    lastUpdated: string;
  };
  symptoms: string[];
  allergies: string[];
  medicalHistory: {
    date: string;
    event: string;
    doctor: string;
    facility: string;
    notes: string;
  }[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  specialization: string;
  qualification: string;
  avatar: string;
  consultationFee: number;
  experienceYears: number;
  rating: number;
  patientsCount: number;
  availability: 'Available' | 'In Consultation' | 'In Surgery' | 'On Leave';
  schedule: {
    day: string;
    hours: string;
  }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'In-Progress' | 'Cancelled';
  visitType: 'Treatment' | 'Follow-up' | 'Diagnostic' | 'Consultation';
  notes: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  chiefComplaint: string;
  symptoms: string[];
  diagnosis: string;
  icdCode: string;
  treatmentPlan: string;
  vitalSigns: {
    bp: string;
    pulse: number;
    spo2: number;
    temp: number;
  };
  notes: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string; // "Tablet", "Syrup", "Injection", "Capsule"
  strength: string;
  batchNumber: string;
  stock: number;
  minThreshold: number;
  unitPrice: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Expired';
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  status: 'Prescribed' | 'Dispensed' | 'Partial' | 'Refilled' | 'Discontinued';
  items: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    dispensed: boolean;
  }[];
}

export interface LabTest {
  id: string;
  testName: string;
  category: string;
  price: number;
  durationHours: number;
  normalRange: string;
  unit: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  testId: string;
  testName: string;
  orderedDate: string;
  completedDate?: string;
  status: 'Ordered' | 'Sample Collected' | 'Analyzing' | 'Completed';
  resultValue?: string;
  unit?: string;
  interpretation?: 'Normal' | 'Borderline' | 'Abnormal' | 'Critical';
  reportUrl?: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  type: 'ICU' | 'General' | 'Surgical' | 'Pediatric' | 'Emergency' | 'Cardiac';
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  patientId?: string;
  patientName?: string;
  admittedDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue';
  paymentMethod?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: 'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Night (23:00 - 07:00)';
  contact: string;
  status: 'On Duty' | 'Off Duty' | 'On Break';
}

export interface CriticalAlert {
  id: string;
  title: string;
  department: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  actionRequired: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  facility: string;
  mfaEnabled: boolean;
  status: 'Active' | 'Suspended' | 'Pending Verification';
  lastLogin: string;
}

export interface FacilityNode {
  id: string;
  name: string;
  city: string;
  type: string;
  totalBeds: number;
  occupiedBeds: number;
  icusTotal: number;
  icusOccupied: number;
  dutyPhysicians: number;
  status: 'Optimal' | 'High Load' | 'Surge Alert';
  director: string;
}

export interface EnterpriseSecurityConfig {
  lockdownActive: boolean;
  maintenanceMode: boolean;
  strictMfaEnforced: boolean;
  lastBackupTime: string;
  backendApiStatus: 'Online' | 'Degraded' | 'Offline';
  encryptionStandard: string;
}

// ============================================================
// 20-PORTAL ECOSYSTEM PORTAL KEYS
// ============================================================
export type PortalKey = 
  | 'super-admin'
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'patient'
  | 'reception'
  | 'laboratory'
  | 'pharmacy'
  | 'radiology'
  | 'surgery'
  | 'billing'
  | 'hr'
  | 'bloodbank'
  | 'procurement'
  | 'patient-relations'
  | 'quality'
  | 'dietary'
  | 'ambulance'
  | 'housekeeping'
  | 'mrd';

// ============================================================
// SPECIALIST PORTALS DATA STRUCTURES
// ============================================================

export interface ReceptionToken {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  department: string;
  doctorId: string;
  doctorName: string;
  visitType: 'Walk-in' | 'Appointment' | 'Emergency Triage' | 'Follow-up';
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled';
  checkInTime: string;
  estimatedWaitMins: number;
  priority: 'Normal' | 'Senior Citizen' | 'Emergency' | 'Pediatric';
  roomNumber: string;
}

export interface RadiologyStudy {
  id: string;
  studyCode: string;
  patientId: string;
  patientName: string;
  modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'PET-CT';
  bodyPart: string;
  orderedBy: string;
  orderDate: string;
  status: 'Requested' | 'Scheduled' | 'In-Progress' | 'Reported' | 'Verified';
  priority: 'Routine' | 'Urgent' | 'STAT';
  findings?: string;
  impression?: string;
  radiologistName?: string;
  verifiedAt?: string;
  imageThumbnail?: string;
  pacsUid?: string;
}

export interface SurgeryCase {
  id: string;
  caseNumber: string;
  patientId: string;
  patientName: string;
  procedureName: string;
  department: string;
  otRoom: string; // e.g. "OT-1 (Robotic Suite)", "OT-3 (Cardiac)"
  leadSurgeon: string;
  anaesthetist: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'Pre-Op' | 'In Theatre' | 'Recovery' | 'Completed' | 'Postponed';
  preOpCleared: boolean;
  safetyChecklistDone: boolean;
  anaesthesiaType: 'General' | 'Spinal' | 'Epidural' | 'Local' | 'Sedation';
  notes?: string;
}

export interface BloodBankUnit {
  id: string;
  unitBarcode: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  component: 'Whole Blood' | 'Packed Red Blood Cells (PRBC)' | 'Fresh Frozen Plasma (FFP)' | 'Platelet Concentrate' | 'Cryoprecipitate';
  donorName: string;
  donorId: string;
  collectionDate: string;
  expiryDate: string;
  volumeMl: number;
  status: 'Available' | 'Crossmatched' | 'Reserved' | 'Transfused' | 'Expired';
  reservedForPatient?: string;
  rhFactor: 'Positive' | 'Negative';
}

export interface ProcurementOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  category: 'Pharmaceuticals' | 'Surgical Consumables' | 'Biomedical Equipment' | 'PPE & Hygiene' | 'Lab Reagents';
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  status: 'Draft' | 'Approved' | 'Dispatched' | 'Delivered' | 'Partially Received';
  paymentStatus: 'Pending' | 'Paid' | 'Processing';
  itemsCount: number;
}

export interface PatientFeedbackRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  department: string;
  rating: number; // 1 to 5
  category: 'Clinical Care' | 'Nursing Quality' | 'Admission & Discharge' | 'Billing & TPA' | 'Cleanliness' | 'Dietary';
  comment: string;
  feedbackDate: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Escalated';
  resolutionNotes?: string;
  satisfactionScore: number; // 0 - 100
}

export interface QualityComplianceAudit {
  id: string;
  standardCode: string; // e.g. "NABH-COP-01", "NABL-ISO-15189"
  chapter: string;
  objective: string;
  complianceRate: number; // %
  lastAuditDate: string;
  nextAuditDate: string;
  auditorName: string;
  status: 'Fully Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Action Plan Required';
  incidentsReported: number;
  capaStatus: 'Open' | 'In Progress' | 'Verified & Closed';
}

export interface DietaryPlan {
  id: string;
  patientId: string;
  patientName: string;
  wardName: string;
  bedNumber: string;
  dietType: 'Normal Daylight' | 'Diabetic' | 'Renal (Low Potassium)' | 'Low Sodium / Cardiac' | 'Clear Fluid' | 'High Protein Oncology';
  caloriesTarget: number;
  allergies: string[];
  meals: {
    breakfast: { item: string; served: boolean };
    lunch: { item: string; served: boolean };
    eveningSnack: { item: string; served: boolean };
    dinner: { item: string; served: boolean };
  };
  specialInstructions: string;
  dieticianName: string;
  updatedAt: string;
}

export interface EmergencyAmbulanceCall {
  id: string;
  callNumber: string;
  callTime: string;
  callerName: string;
  callerPhone: string;
  pickupAddress: string;
  emergencyType: 'Cardiac Arrest' | 'Road Traffic Accident' | 'Stroke Alert' | 'Severe Trauma' | 'Maternal Emergency' | 'Respiratory Distress';
  vehicleNumber: string;
  driverName: string;
  paramedicName: string;
  etaMinutes: number;
  status: 'Call Logged' | 'Dispatched' | 'At Scene' | 'Patient Onboard' | 'Arrived at ER';
  triagePriority: 'Red (Critical)' | 'Yellow (Urgent)' | 'Green (Stable)';
}

export interface HousekeepingFacilityTask {
  id: string;
  taskCode: string;
  facilityArea: string; // e.g. "ICU Ward 2", "Emergency Trauma Bay", "OT-2"
  taskType: 'Terminal Sterilization' | 'Bed Linen Turnover' | 'Biomedical Waste Disposal' | 'Floor Decontamination' | 'HVAC Air Filter Check';
  priority: 'Immediate Stat' | 'Routine' | 'Scheduled Shift';
  status: 'Pending' | 'In Progress' | 'Cleaned & Inspected' | 'Verified';
  assignedStaff: string;
  requestedAt: string;
  completedAt?: string;
  inspectorSignoff?: string;
}

export interface MrdArchivedRecord {
  id: string;
  mrdFileNumber: string; // e.g. "MRD-2026-0842"
  patientId: string;
  patientName: string;
  patientCode: string;
  admissionDate: string;
  dischargeDate: string;
  attendingDoctor: string;
  primaryDiagnosis: string;
  icdCode?: string;
  mlcStatus?: boolean;
  totalPages: number;
  digitalScanned: boolean;
  physicalLocation: string; // e.g. "Rack B4, Shelf 2"
  status: 'Archived' | 'Checked Out for Legal' | 'Audit Review' | 'Discharge Incomplete';
  retentionYears: number;
  destructionDueDate: string;
}

// Indian Healthcare (ABDM / ABHA) Profile
export interface AbhaProfile {
  abhaNumber: string; // "91-4589-2314-8765"
  abhaAddress: string; // "patient.name@abdm"
  fullName: string;
  gender: string;
  dob: string;
  mobile: string;
  verificationStatus: 'Verified with Aadhaar' | 'Mobile OTP Verified' | 'Pending';
  consentGranted: boolean;
  linkedHospitalCount: number;
}

