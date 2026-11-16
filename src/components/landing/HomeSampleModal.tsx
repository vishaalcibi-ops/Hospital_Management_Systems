/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Diagnostic Lab & Home Sample Collection Booking Modal
 * Inspired by Apollo 24/7 & Max Lab.
 */

import React, { useState } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import {
  FlaskConical,
  Calendar,
  Clock,
  Home,
  CheckCircle2,
  X,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Plus,
  Check
} from 'lucide-react';

interface HomeSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTestName?: string;
}

const AVAILABLE_TESTS = [
  { id: 't-1', name: 'Comprehensive Metabolic Panel (CMP)', category: 'Biochemistry', price: 650, fasting: '10-12 hrs fasting' },
  { id: 't-2', name: 'Complete Blood Count with ESR (CBC)', category: 'Haematology', price: 350, fasting: 'No fasting required' },
  { id: 't-3', name: 'Lipid Profile & Atherogenic Index', category: 'Cardiology', price: 750, fasting: '12 hrs fasting' },
  { id: 't-4', name: 'HbA1c & Fasting Blood Sugar', category: 'Diabetes Care', price: 500, fasting: '8-10 hrs fasting' },
  { id: 't-5', name: 'Thyroid Stimulating Hormone (TSH / Ultra)', category: 'Endocrinology', price: 450, fasting: 'Morning sample preferred' },
  { id: 't-6', name: 'Liver Function Test (LFT with GGT)', category: 'Gastroenterology', price: 700, fasting: 'No fasting' },
  { id: 't-7', name: 'Kidney Function Test (KFT / Creatinine)', category: 'Nephrology', price: 550, fasting: 'No fasting' },
  { id: 't-8', name: 'Vitamin D3 & B12 Vitality Duo', category: 'Wellness', price: 1200, fasting: 'No fasting required' }
];

export const HomeSampleModal: React.FC<HomeSampleModalProps> = ({
  isOpen,
  onClose,
  preselectedTestName
}) => {
  const [selectedTests, setSelectedTests] = useState<string[]>(() => {
    if (preselectedTestName) {
      const match = AVAILABLE_TESTS.find(t => t.name.toLowerCase().includes(preselectedTestName.toLowerCase()));
      return match ? [match.id] : ['t-2', 't-4'];
    }
    return ['t-2', 't-4'];
  });

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [slot, setSlot] = useState('07:00 AM - 08:00 AM');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    sound.playClick();
    setSelectedTests(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedTests.reduce((sum, tid) => {
    const t = AVAILABLE_TESTS.find(item => item.id === tid);
    return sum + (t?.price || 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim() || !address.trim() || selectedTests.length === 0) {
      alert('Please fill out all required details and choose at least one test.');
      return;
    }

    sound.playSuccess();
    // Add lab orders to DB
    const patients = db.getPatients();
    const patient = patients[0];
    selectedTests.forEach(tid => {
      const t = AVAILABLE_TESTS.find(item => item.id === tid);
      if (t) {
        db.orderLabTest({
          patientId: patient?.id || 'pat-1',
          patientName: patientName.trim(),
          doctorId: 'doc-1',
          testId: t.id,
          testName: t.name,
          interpretation: 'Normal'
        });
      }
    });

    setIsConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Book Diagnostic Tests</h3>
              <p className="text-xs text-slate-500">NABL Accredited MediCore Clinical Laboratory · Home Sample Collection</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isConfirmed ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900">Sample Collection Scheduled!</h4>
              <p className="text-sm text-slate-600 mt-1">
                A certified MediCore phlebotomist will arrive at your address on <strong>{date}</strong> between <strong>{slot}</strong>.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Tests:</span>
                <span className="font-semibold text-slate-800">{selectedTests.length} tests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Payable:</span>
                <span className="font-bold text-emerald-600 text-sm">₹{totalPrice} (Cashless or Card)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Digital Report Delivery:</span>
                <span className="text-slate-800">Same day by 06:00 PM on Patient Health Card</span>
              </div>
            </div>
            <button
              onClick={() => { sound.playClick(); setIsConfirmed(false); onClose(); }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-600/20"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Test Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Select Diagnostic Tests</label>
                <span className="text-xs text-emerald-600 font-semibold">{selectedTests.length} tests chosen</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {AVAILABLE_TESTS.map(t => {
                  const isChecked = selectedTests.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTest(t.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2 ${
                        isChecked ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                        <div className="text-[10px] text-slate-500">{t.fasting}</div>
                        <div className="text-xs font-bold text-emerald-700 mt-1">₹{t.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Estimated Lab Total:</span>
              <span className="text-base font-bold text-emerald-700">₹{totalPrice}</span>
            </div>

            {/* Address & Contact */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-700 uppercase">Collection Address & Schedule</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Home / Office Address *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House No, Building, Street, Landmark, Pin Code"
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Collection Date</label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Time Window</label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="06:30 AM - 07:30 AM">06:30 AM - 07:30 AM (Fasting)</option>
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM (Fasting)</option>
                    <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM</option>
                    <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              Confirm Home Sample Collection Request (₹{totalPrice})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
