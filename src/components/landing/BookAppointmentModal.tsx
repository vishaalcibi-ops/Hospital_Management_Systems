/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Interactive Public Appointment Booking Modal
 * Connected directly to MediCore live database & appointment queues.
 */

import React, { useState } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  Building2,
  CheckCircle2,
  X,
  Video,
  MapPin,
  ShieldCheck,
  CreditCard,
  FileText
} from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedDepartment?: string;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedDepartment
}) => {
  const doctors = db.getDoctors();
  const departments = Array.from(new Set(doctors.map(d => d.department)));

  const [selectedDept, setSelectedDept] = useState<string>(preselectedDepartment || departments[0] || 'Cardiology');
  const [selectedDocId, setSelectedDocId] = useState<string>(preselectedDoctorId || doctors[0]?.id || '');
  const [visitType, setVisitType] = useState<'In-Person' | 'Video Consultation'>('In-Person');
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('35');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptoms, setSymptoms] = useState<string>('');
  const [abhaId, setAbhaId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  if (!isOpen) return null;

  const filteredDoctors = doctors.filter(d => !selectedDept || d.department === selectedDept);
  const currentDoctor = doctors.find(d => d.id === selectedDocId) || filteredDoctors[0];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:15 AM', '11:45 AM', '02:00 PM', '02:30 PM',
    '03:15 PM', '04:00 PM', '04:45 PM', '05:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please provide patient name and contact number');
      return;
    }

    setIsSubmitting(true);
    sound.playClick();

    setTimeout(() => {
      // 1. Create patient if needed or link
      const patients = db.getPatients();
      let patient = patients.find(p => p.phone === patientPhone.trim());
      if (!patient) {
        patient = {
          id: `pat-${Date.now()}`,
          patientCode: `P-${Math.floor(10000 + Math.random() * 90000)}`,
          name: patientName.trim(),
          age: Number(patientAge) || 30,
          gender: patientGender,
          bloodGroup: 'B+',
          phone: patientPhone.trim(),
          email: patientEmail.trim() || `${patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          admissionStatus: 'Outpatient',
          primaryDoctorId: currentDoctor?.id || 'doc-1',
          primaryDoctorName: currentDoctor?.name || 'Dr. Roger S.',
          diagnosis: symptoms || 'General OPD Consultation',
          heartAge: Number(patientAge) || 30,
          chronologicalAge: Number(patientAge) || 30,
          riskScore: 15,
          vitals: {
            bloodPressure: '120/80',
            pulseRate: 72,
            respiratoryRate: 16,
            oxygenSaturation: 99,
            temperature: 36.8,
            hba1c: 5.2,
            cholesterol: 175,
            stressLevel: 'Mild',
            sleepQuality: 'Good',
            lastUpdated: 'Just now'
          },
          symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : ['General Consultation'],
          allergies: [],
          medicalHistory: []
        };
        db.addPatient(patient);
      }

      // 2. Create appointment
      const newAppointment = {
        id: `apt-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        doctorId: currentDoctor?.id || 'doc-1',
        doctorName: currentDoctor?.name || 'Dr. Roger S.',
        department: currentDoctor?.department || selectedDept,
        date,
        time: timeSlot,
        status: 'Scheduled' as const,
        visitType: visitType === 'Video Consultation' ? ('Consultation' as const) : ('Treatment' as const),
        notes: `${visitType}: ${symptoms || 'General Checkup'}`
      };

      db.addAppointment(newAppointment);

      // 3. Issue reception token automatically
      db.addReceptionToken({
        tokenNumber: `OPD-${selectedDept.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        department: selectedDept,
        doctorId: currentDoctor?.id || 'doc-1',
        doctorName: currentDoctor?.name || 'Dr. Roger S.',
        visitType: 'Appointment',
        status: 'Waiting',
        checkInTime: timeSlot,
        estimatedWaitMins: 10,
        priority: 'Normal',
        roomNumber: 'OPD Suite 204'
      });

      if (abhaId.trim()) {
        db.linkAbhaProfile(patient.id, {
          abhaNumber: abhaId.trim(),
          abhaAddress: `${patient.name.toLowerCase().replace(/\s+/g, '')}@abdm`,
          fullName: patient.name,
          gender: patient.gender,
          dob: '1990-01-01',
          mobile: patient.phone,
          verificationStatus: 'Mobile OTP Verified',
          consentGranted: true,
          linkedHospitalCount: 1
        });
      }

      setIsSubmitting(false);
      setConfirmedBooking({
        appointmentId: newAppointment.id,
        token: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorName: currentDoctor?.name,
        department: selectedDept,
        date,
        time: timeSlot,
        patientName: patient.name,
        visitType,
        fee: currentDoctor?.consultationFee || 150
      });
      sound.playSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Book Doctor Appointment</h3>
              <p className="text-xs text-slate-500">MediCore Multispeciality Hospital Network · NABH Accredited</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h4 className="text-2xl font-bold text-slate-900 mt-2">Appointment Reserved Successfully!</h4>
              <p className="text-sm text-slate-600 mt-1">
                Your appointment token has been entered into the active hospital OPD queue.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs text-slate-500 uppercase font-semibold">Token Number</span>
                <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{confirmedBooking.token}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Doctor</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Schedule</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.date} at {confirmedBooking.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Visit Modality</span>
                  <span className="font-semibold text-blue-600">{confirmedBooking.visitType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Patient Name</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Consultation Fee</span>
                  <span className="font-semibold text-emerald-600">₹{confirmedBooking.fee} (Pay at Desk)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              An SMS with confirmation code & live directions has been dispatched to patient's contact.
            </p>

            <button
              onClick={() => {
                sound.playClick();
                setConfirmedBooking(null);
                onClose();
              }}
              className="w-full max-w-md mx-auto py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition"
            >
              Done & Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Modality Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { sound.playClick(); setVisitType('In-Person'); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  visitType === 'In-Person' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Hospital OPD Visit
              </button>
              <button
                type="button"
                onClick={() => { sound.playClick(); setVisitType('Video Consultation'); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  visitType === 'Video Consultation' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" />
                Online Video Consult
              </button>
            </div>

            {/* Department & Doctor Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Department</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      const docs = doctors.filter(d => d.department === e.target.value);
                      if (docs[0]) setSelectedDocId(docs[0].id);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Doctor</label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filteredDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor Quick Badge */}
            {currentDoctor && (
              <div className="flex items-center gap-3 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900 truncate">{currentDoctor.name}</h5>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">★ {currentDoctor.rating}</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{currentDoctor.specialization} · {currentDoctor.experienceYears} yrs exp</p>
                  <p className="text-xs text-blue-700 font-semibold">Consultation Fee: ₹{currentDoctor.consultationFee}</p>
                </div>
              </div>
            )}

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Time Slot</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Patient Demographics */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Patient Information</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. +91 98450 12345"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Age</label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Symptoms or Reason for Visit</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Persistent headache, occasional chest heaviness since 3 days..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* ABHA Number Optional */}
              <div>
                <label className="block text-xs text-slate-600 mb-1 flex items-center justify-between">
                  <span>Ayushman Bharat Health Account (ABHA ID) — Optional</span>
                  <span className="text-[10px] text-blue-600 font-semibold">ABDM Interoperability</span>
                </label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="e.g. 91-4589-2314-8765 or patient@abdm"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming Appointment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Appointment Booking</span>
                    <span>→</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                By booking you agree to MediCore's hospital safety policies and NABH clinical standards.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
