/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Specialist Portals Initial Seed Data
 * Covers Portals 6 through 20 with rich, realistic clinical records.
 */

import {
  ReceptionToken,
  RadiologyStudy,
  SurgeryCase,
  BloodBankUnit,
  ProcurementOrder,
  PatientFeedbackRecord,
  QualityComplianceAudit,
  DietaryPlan,
  EmergencyAmbulanceCall,
  HousekeepingFacilityTask,
  MrdArchivedRecord,
  AbhaProfile
} from '../types';

export const INITIAL_RECEPTION_TOKENS: ReceptionToken[] = [
  {
    id: 'tok-101',
    tokenNumber: 'OPD-A-01',
    patientId: 'pat-1',
    patientName: 'Magnus Stephenson',
    patientPhone: '+1 (555) 234-8901',
    department: 'Pulmonology',
    doctorId: 'doc-1',
    doctorName: 'Dr. Roger S., MD',
    visitType: 'Follow-up',
    status: 'In Consultation',
    checkInTime: '08:45 AM',
    estimatedWaitMins: 0,
    priority: 'Normal',
    roomNumber: 'OPD Suite 204'
  },
  {
    id: 'tok-102',
    tokenNumber: 'OPD-A-02',
    patientId: 'pat-2',
    patientName: 'Alexandro Sterling',
    patientPhone: '+1 (555) 345-6789',
    department: 'Cardiology',
    doctorId: 'doc-2',
    doctorName: 'Dr. Dulov G., MD',
    visitType: 'Appointment',
    status: 'Waiting',
    checkInTime: '09:05 AM',
    estimatedWaitMins: 12,
    priority: 'Senior Citizen',
    roomNumber: 'OPD Suite 108'
  },
  {
    id: 'tok-103',
    tokenNumber: 'OPD-A-03',
    patientId: 'pat-3',
    patientName: 'Elena Rostova',
    patientPhone: '+1 (555) 456-7890',
    department: 'Orthopaedics',
    doctorId: 'doc-3',
    doctorName: 'Dr. Tatiana M., MD',
    visitType: 'Walk-in',
    status: 'Waiting',
    checkInTime: '09:15 AM',
    estimatedWaitMins: 25,
    priority: 'Normal',
    roomNumber: 'OPD Suite 312'
  },
  {
    id: 'tok-104',
    tokenNumber: 'OPD-E-01',
    patientId: 'pat-4',
    patientName: 'Vikramaditya Sharma',
    patientPhone: '+91 98450 12345',
    department: 'Emergency & Trauma',
    doctorId: 'doc-4',
    doctorName: 'Dr. Sophia Chen, MD',
    visitType: 'Emergency Triage',
    status: 'In Consultation',
    checkInTime: '09:20 AM',
    estimatedWaitMins: 0,
    priority: 'Emergency',
    roomNumber: 'Resuscitation Bay 1'
  },
  {
    id: 'tok-105',
    tokenNumber: 'OPD-P-01',
    patientId: 'pat-5',
    patientName: 'Aarav Patel',
    patientPhone: '+91 97234 56789',
    department: 'Pediatrics',
    doctorId: 'doc-5',
    doctorName: 'Dr. Liam Alistair, MBBS',
    visitType: 'Appointment',
    status: 'Waiting',
    checkInTime: '09:30 AM',
    estimatedWaitMins: 15,
    priority: 'Pediatric',
    roomNumber: 'Pediatric Wing 102'
  }
];

export const INITIAL_RADIOLOGY_STUDIES: RadiologyStudy[] = [
  {
    id: 'rad-201',
    studyCode: 'RAD-CT-0941',
    patientId: 'pat-1',
    patientName: 'Magnus Stephenson',
    modality: 'CT Scan',
    bodyPart: 'High-Resolution Chest (Thorax)',
    orderedBy: 'Dr. Roger S., MD',
    orderDate: '2026-04-01',
    status: 'Verified',
    priority: 'Urgent',
    findings: 'Subsegmental bronchial wall thickening in lower left pulmonary lobe. No gross consolidation or pneumothorax.',
    impression: 'Atypical bronchial inflammatory process consistent with chronic bronchial spasm.',
    radiologistName: 'Dr. K. Swaminathan, MD, DMRD',
    verifiedAt: '2026-04-01 14:30',
    imageThumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop&q=80',
    pacsUid: '1.2.840.113619.2.55.3.283117822'
  },
  {
    id: 'rad-202',
    studyCode: 'RAD-MRI-1102',
    patientId: 'pat-3',
    patientName: 'Elena Rostova',
    modality: 'MRI',
    bodyPart: 'Right Knee Joint with Cartilage Mapping',
    orderedBy: 'Dr. Tatiana M., MD',
    orderDate: '2026-04-02',
    status: 'Reported',
    priority: 'Routine',
    findings: 'Grade II medial meniscus tear with localized joint effusion. Cruciate ligaments appear intact.',
    impression: 'Medial meniscal tear suitable for arthroscopic repair.',
    radiologistName: 'Dr. Priya Nambiar, MD (Radiodiagnosis)',
    verifiedAt: '2026-04-02 11:15',
    imageThumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&auto=format&fit=crop&q=80',
    pacsUid: '1.2.840.113619.2.55.3.394109281'
  },
  {
    id: 'rad-203',
    studyCode: 'RAD-XR-4409',
    patientId: 'pat-2',
    patientName: 'Alexandro Sterling',
    modality: 'X-Ray',
    bodyPart: 'Chest PA View (Daylight Digital)',
    orderedBy: 'Dr. Dulov G., MD',
    orderDate: '2026-04-03',
    status: 'In-Progress',
    priority: 'Urgent',
    radiologistName: 'Dr. K. Swaminathan, MD, DMRD',
    pacsUid: '1.2.840.113619.2.55.3.891230491'
  },
  {
    id: 'rad-204',
    studyCode: 'RAD-USG-5512',
    patientId: 'pat-4',
    patientName: 'Vikramaditya Sharma',
    modality: 'Ultrasound',
    bodyPart: 'Whole Abdomen & Renal Arterial Doppler',
    orderedBy: 'Dr. Sophia Chen, MD',
    orderDate: '2026-04-03',
    status: 'Requested',
    priority: 'STAT',
    pacsUid: '1.2.840.113619.2.55.3.441029381'
  }
];

export const INITIAL_SURGERY_CASES: SurgeryCase[] = [
  {
    id: 'surg-301',
    caseNumber: 'OT-SURG-2026-081',
    patientId: 'pat-3',
    patientName: 'Elena Rostova',
    procedureName: 'Robotic-Assisted Right Knee Arthroscopy & Meniscal Repair',
    department: 'Orthopaedics & Joint Reconstruction',
    otRoom: 'OT-1 (Robotic Suite DaVinci)',
    leadSurgeon: 'Dr. Tatiana M., MD (Chief Orthopaedic Surgeon)',
    anaesthetist: 'Dr. Ramesh Raman, MD (Anaesthesiology)',
    scheduledDate: '2026-04-04',
    scheduledTime: '08:30 AM',
    durationMinutes: 90,
    status: 'Pre-Op',
    preOpCleared: true,
    safetyChecklistDone: true,
    anaesthesiaType: 'Spinal',
    notes: 'Pre-operative cross-match 2 units PRBC confirmed. Antibiotic prophylaxis scheduled 30 mins prior to incision.'
  },
  {
    id: 'surg-302',
    caseNumber: 'OT-SURG-2026-082',
    patientId: 'pat-6',
    patientName: 'Harish Chandra',
    procedureName: 'Off-Pump Coronary Artery Bypass Grafting (CABG x 3)',
    department: 'Cardiac Sciences & Thoracic Surgery',
    otRoom: 'OT-3 (Cardiac Hybrid Theatre)',
    leadSurgeon: 'Dr. Roger S., MD (Chief Cardiac Surgeon)',
    anaesthetist: 'Dr. Ananya Roy, MD, DNB (Cardiac Anaesthesia)',
    scheduledDate: '2026-04-04',
    scheduledTime: '11:00 AM',
    durationMinutes: 240,
    status: 'Pre-Op',
    preOpCleared: true,
    safetyChecklistDone: false,
    anaesthesiaType: 'General',
    notes: 'Cardiopulmonary bypass standby verified. Blood bank reservation 4 units PRBC, 2 units FFP confirmed.'
  },
  {
    id: 'surg-303',
    caseNumber: 'OT-SURG-2026-083',
    patientId: 'pat-2',
    patientName: 'Alexandro Sterling',
    procedureName: 'Diagnostic Upper GI Endoscopy & Biopsy',
    department: 'Gastroenterology',
    otRoom: 'OT-4 (Endoscopy Suite)',
    leadSurgeon: 'Dr. Dulov G., MD',
    anaesthetist: 'Dr. Ramesh Raman, MD',
    scheduledDate: '2026-04-03',
    scheduledTime: '02:00 PM',
    durationMinutes: 45,
    status: 'Completed',
    preOpCleared: true,
    safetyChecklistDone: true,
    anaesthesiaType: 'Sedation',
    notes: 'Procedure uneventful. Biopsy specimens transferred to Histopathology lab.'
  }
];

export const INITIAL_BLOOD_UNITS: BloodBankUnit[] = [
  {
    id: 'bb-401',
    unitBarcode: 'BB-2026-A101',
    bloodGroup: 'O+',
    component: 'Packed Red Blood Cells (PRBC)',
    donorName: 'Rahul Deshmukh',
    donorId: 'D-8821',
    collectionDate: '2026-03-24',
    expiryDate: '2026-04-28',
    volumeMl: 350,
    status: 'Available',
    rhFactor: 'Positive'
  },
  {
    id: 'bb-402',
    unitBarcode: 'BB-2026-A102',
    bloodGroup: 'O-',
    component: 'Packed Red Blood Cells (PRBC)',
    donorName: 'Siddharth Varma',
    donorId: 'D-8835',
    collectionDate: '2026-03-28',
    expiryDate: '2026-05-02',
    volumeMl: 350,
    status: 'Available',
    rhFactor: 'Negative'
  },
  {
    id: 'bb-403',
    unitBarcode: 'BB-2026-A103',
    bloodGroup: 'A+',
    component: 'Packed Red Blood Cells (PRBC)',
    donorName: 'Pooja Hegde',
    donorId: 'D-8840',
    collectionDate: '2026-03-30',
    expiryDate: '2026-05-04',
    volumeMl: 350,
    status: 'Reserved',
    reservedForPatient: 'Elena Rostova (OT Meniscal Repair)',
    rhFactor: 'Positive'
  },
  {
    id: 'bb-404',
    unitBarcode: 'BB-2026-A104',
    bloodGroup: 'B+',
    component: 'Fresh Frozen Plasma (FFP)',
    donorName: 'Arjun Menon',
    donorId: 'D-8862',
    collectionDate: '2026-03-15',
    expiryDate: '2027-03-15',
    volumeMl: 220,
    status: 'Available',
    rhFactor: 'Positive'
  },
  {
    id: 'bb-405',
    unitBarcode: 'BB-2026-A105',
    bloodGroup: 'AB+',
    component: 'Platelet Concentrate',
    donorName: 'Devika Krishnan',
    donorId: 'D-8890',
    collectionDate: '2026-04-01',
    expiryDate: '2026-04-06',
    volumeMl: 70,
    status: 'Available',
    rhFactor: 'Positive'
  }
];

export const INITIAL_PROCUREMENT_ORDERS: ProcurementOrder[] = [
  {
    id: 'po-501',
    poNumber: 'PO-2026-041',
    vendorName: 'Siemens Healthineers India Ltd.',
    category: 'Biomedical Equipment',
    orderDate: '2026-03-20',
    expectedDate: '2026-04-10',
    totalAmount: 1850000,
    status: 'Dispatched',
    paymentStatus: 'Processing',
    itemsCount: 4
  },
  {
    id: 'po-502',
    poNumber: 'PO-2026-042',
    vendorName: 'Sun Pharma Distributors',
    category: 'Pharmaceuticals',
    orderDate: '2026-03-28',
    expectedDate: '2026-04-05',
    totalAmount: 425000,
    status: 'Delivered',
    paymentStatus: 'Paid',
    itemsCount: 38
  },
  {
    id: 'po-503',
    poNumber: 'PO-2026-043',
    vendorName: 'Johnson & Johnson Medical Devices',
    category: 'Surgical Consumables',
    orderDate: '2026-04-01',
    expectedDate: '2026-04-08',
    totalAmount: 680000,
    status: 'Approved',
    paymentStatus: 'Pending',
    itemsCount: 15
  }
];

export const INITIAL_PATIENT_FEEDBACK: PatientFeedbackRecord[] = [
  {
    id: 'fb-601',
    patientId: 'pat-1',
    patientName: 'Magnus Stephenson',
    patientCode: 'P-12563a',
    department: 'Pulmonology',
    rating: 5,
    category: 'Clinical Care',
    comment: 'Dr. Roger and the respiratory therapy team were outstanding. The 3D scan explanation was exceptionally helpful.',
    feedbackDate: '2026-04-02',
    status: 'Resolved',
    resolutionNotes: 'Compliment relayed to Dr. Roger S. and Pulmonology Nursing Lead.',
    satisfactionScore: 98
  },
  {
    id: 'fb-602',
    patientId: 'pat-2',
    patientName: 'Alexandro Sterling',
    patientCode: 'P-14980b',
    department: 'Cardiology Ward 3',
    rating: 4,
    category: 'Cleanliness',
    comment: 'Ward hygiene is immaculate. Discharge billing clearance took slightly longer than expected during shift change.',
    feedbackDate: '2026-04-02',
    status: 'Investigating',
    resolutionNotes: 'Auditing discharge billing workflow to ensure under 45-minute turnaround.',
    satisfactionScore: 88
  },
  {
    id: 'fb-603',
    patientId: 'pat-7',
    patientName: 'Sunita Rao',
    patientCode: 'P-17892c',
    department: 'Emergency & TPA Desk',
    rating: 5,
    category: 'Billing & TPA',
    comment: 'Cashless insurance approval with Star Health was approved in under 30 minutes without hassle.',
    feedbackDate: '2026-04-03',
    status: 'Resolved',
    resolutionNotes: 'Exemplary speed noted for TPA desk officer.',
    satisfactionScore: 100
  }
];

export const INITIAL_QUALITY_AUDITS: QualityComplianceAudit[] = [
  {
    id: 'qa-701',
    standardCode: 'NABH-COP-01',
    chapter: 'Care of Patients (COP)',
    objective: 'Initial Assessment and Emergency Resuscitation Protocols',
    complianceRate: 98.4,
    lastAuditDate: '2026-03-25',
    nextAuditDate: '2026-04-25',
    auditorName: 'Dr. Sunanda Bose (NABH Lead Assessor)',
    status: 'Fully Compliant',
    incidentsReported: 0,
    capaStatus: 'Verified & Closed'
  },
  {
    id: 'qa-702',
    standardCode: 'NABH-HIC-03',
    chapter: 'Hospital Infection Control (HIC)',
    objective: 'Surgical Site Infection (SSI) and Central Line Associated Bloodstream Infection (CLABSI) Surveillance',
    complianceRate: 99.2,
    lastAuditDate: '2026-03-28',
    nextAuditDate: '2026-04-28',
    auditorName: 'Sister Meera Nair, Infection Control Officer',
    status: 'Fully Compliant',
    incidentsReported: 1,
    capaStatus: 'Verified & Closed'
  },
  {
    id: 'qa-703',
    standardCode: 'NABL-ISO-15189',
    chapter: 'Medical Laboratories Quality & Competence',
    objective: 'Internal Quality Control (IQC) and External Quality Assurance Scheme (EQAS) Calibration',
    complianceRate: 97.8,
    lastAuditDate: '2026-03-15',
    nextAuditDate: '2026-04-15',
    auditorName: 'Dr. Anand Joshi, Pathologist',
    status: 'Fully Compliant',
    incidentsReported: 0,
    capaStatus: 'Verified & Closed'
  }
];

export const INITIAL_DIETARY_PLANS: DietaryPlan[] = [
  {
    id: 'diet-801',
    patientId: 'pat-2',
    patientName: 'Alexandro Sterling',
    wardName: 'Cardiology Ward 3',
    bedNumber: 'CW-304',
    dietType: 'Low Sodium / Cardiac',
    caloriesTarget: 1850,
    allergies: ['Latex'],
    meals: {
      breakfast: { item: 'Oatmeal Porridge, Steamed Idli with Sambar, Skimmed Milk', served: true },
      lunch: { item: 'Brown Rice, Steamed Dal, Boiled Vegetables, Greek Yogurt', served: true },
      eveningSnack: { item: 'Green Tea & Roasted Makhana (Fox Nuts)', served: false },
      dinner: { item: 'Multi-grain Roti (2), Clear Vegetable Soup, Grilled Paneer', served: false }
    },
    specialInstructions: 'Strict salt restriction (< 2g/day). Avoid fried or acidic foods.',
    dieticianName: 'Radhika Swaminathan, RD (Clinical Nutritionist)',
    updatedAt: 'Today 07:30 AM'
  },
  {
    id: 'diet-802',
    patientId: 'pat-1',
    patientName: 'Magnus Stephenson',
    wardName: 'Outpatient Clinic',
    bedNumber: 'OPD-N/A',
    dietType: 'High Protein Oncology',
    caloriesTarget: 2200,
    allergies: ['Penicillin', 'Sulfa Drugs'],
    meals: {
      breakfast: { item: 'Egg White Omelet, Whole Wheat Toast, Almond Milk', served: true },
      lunch: { item: 'Quinoa Bowl, Grilled Chicken Breast, Steamed Broccoli', served: true },
      eveningSnack: { item: 'Whey Protein Shake with Chia Seeds', served: false },
      dinner: { item: 'Lentil Soup with Sautéed Spinach, Steamed Fish', served: false }
    },
    specialInstructions: 'Hydration minimum 3.0 liters/day. High antioxidant dietary focus.',
    dieticianName: 'Radhika Swaminathan, RD',
    updatedAt: 'Yesterday'
  }
];

export const INITIAL_AMBULANCE_CALLS: EmergencyAmbulanceCall[] = [
  {
    id: 'amb-901',
    callNumber: 'EMERG-2026-118',
    callTime: '09:08 AM',
    callerName: 'Rajesh Gopinath',
    callerPhone: '+91 98410 99881',
    pickupAddress: 'Block 4, Palm Meadows, Whitefield, Metro Zone 4',
    emergencyType: 'Cardiac Arrest',
    vehicleNumber: 'KA-01-MD-1066 (ICU Advanced Life Support)',
    driverName: 'Manjunath Gowda',
    paramedicName: 'Paramedic Anthony Paul, EMT-P',
    etaMinutes: 4,
    status: 'Patient Onboard',
    triagePriority: 'Red (Critical)'
  },
  {
    id: 'amb-902',
    callNumber: 'EMERG-2026-119',
    callTime: '09:24 AM',
    callerName: 'Dr. Sumit Bansal (Clinic)',
    callerPhone: '+91 98100 44552',
    pickupAddress: 'Apollo Clinic Referral Wing, Indiranagar',
    emergencyType: 'Severe Trauma',
    vehicleNumber: 'KA-01-MD-1067 (ALS Trauma Fleet)',
    driverName: 'Suresh Kumar',
    paramedicName: 'Paramedic Divya R., EMT',
    etaMinutes: 11,
    status: 'Dispatched',
    triagePriority: 'Red (Critical)'
  }
];

export const INITIAL_HOUSEKEEPING_TASKS: HousekeepingFacilityTask[] = [
  {
    id: 'hk-1001',
    taskCode: 'HK-2026-301',
    facilityArea: 'ICU Ward 2 — Bed 04',
    taskType: 'Terminal Sterilization',
    priority: 'Immediate Stat',
    status: 'Cleaned & Inspected',
    assignedStaff: 'Ramesh Balan (Sanitation Lead)',
    requestedAt: '08:15 AM',
    completedAt: '08:50 AM',
    inspectorSignoff: 'Nurse Supervisor Sarah Jenkins, RN'
  },
  {
    id: 'hk-1002',
    taskCode: 'HK-2026-302',
    facilityArea: 'OT-1 (Robotic Suite)',
    taskType: 'Floor Decontamination',
    priority: 'Immediate Stat',
    status: 'Verified',
    assignedStaff: 'Manoj Pillai',
    requestedAt: '07:00 AM',
    completedAt: '07:45 AM',
    inspectorSignoff: 'OT Nurse In-Charge Anita Roy, RN'
  },
  {
    id: 'hk-1003',
    taskCode: 'HK-2026-303',
    facilityArea: 'Emergency Trauma Bay 3',
    taskType: 'Biomedical Waste Disposal',
    priority: 'Routine',
    status: 'In Progress',
    assignedStaff: 'Kishore Das',
    requestedAt: '09:10 AM'
  }
];

export const INITIAL_MRD_RECORDS: MrdArchivedRecord[] = [
  {
    id: 'mrd-1101',
    mrdFileNumber: 'MRD-2026-0842',
    patientId: 'pat-1',
    patientName: 'Magnus Stephenson',
    patientCode: 'P-12563a',
    admissionDate: '2026-03-27',
    dischargeDate: '2026-03-29',
    attendingDoctor: 'Dr. Roger S., MD',
    primaryDiagnosis: 'Cavitas Thoracis Atypical Infiltration & Bronchial Spasm',
    totalPages: 42,
    digitalScanned: true,
    physicalLocation: 'Archive Room A, Rack 04, Shelf 2',
    status: 'Archived',
    retentionYears: 10,
    destructionDueDate: '2036-03-29'
  },
  {
    id: 'mrd-1102',
    mrdFileNumber: 'MRD-2026-0814',
    patientId: 'pat-8',
    patientName: 'Chandrashekhar Rao',
    patientCode: 'P-11920x',
    admissionDate: '2026-03-12',
    dischargeDate: '2026-03-18',
    attendingDoctor: 'Dr. Dulov G., MD',
    primaryDiagnosis: 'Acute Coronary Syndrome, Post-PTCA Stenting',
    totalPages: 68,
    digitalScanned: true,
    physicalLocation: 'Archive Room A, Rack 02, Shelf 5',
    status: 'Archived',
    retentionYears: 10,
    destructionDueDate: '2036-03-18'
  }
];

export const INITIAL_ABHA_PROFILES: Record<string, AbhaProfile> = {
  'pat-1': {
    abhaNumber: '91-4589-2314-8765',
    abhaAddress: 'magnus.stephenson@abdm',
    fullName: 'Magnus Stephenson',
    gender: 'Male',
    dob: '1982-05-14',
    mobile: '+1 (555) 234-8901',
    verificationStatus: 'Verified with Aadhaar',
    consentGranted: true,
    linkedHospitalCount: 3
  },
  'pat-2': {
    abhaNumber: '91-3829-1092-4412',
    abhaAddress: 'alex.sterling@abdm',
    fullName: 'Alexandro Sterling',
    gender: 'Male',
    dob: '1988-08-22',
    mobile: '+1 (555) 345-6789',
    verificationStatus: 'Mobile OTP Verified',
    consentGranted: true,
    linkedHospitalCount: 2
  }
};
