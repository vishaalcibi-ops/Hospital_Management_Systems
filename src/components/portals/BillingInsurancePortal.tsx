/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 11: Billing & TPA Cashless Insurance Workspace
 * Visual Style: White, slate and financial blue with GST tax invoice calculation.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { Invoice } from '../../types';
import {
  CreditCard,
  FileText,
  DollarSign,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer
} from 'lucide-react';

interface BillingInsurancePortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const BillingInsurancePortal: React.FC<BillingInsurancePortalProps> = ({
  onLogout
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>(db.getInvoices());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // New Invoice Form
  const [patientName, setPatientName] = useState('');
  const [itemDesc, setItemDesc] = useState('Inpatient Clinical Consultation & Bed Census');
  const [amount, setAmount] = useState(4500);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setInvoices(db.getInvoices());
    });
    return unsub;
  }, []);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    sound.playSuccess();
    const invNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = Number(amount) || 1000;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const grandTotal = subtotal + tax;

    db.addInvoice({
      patientId: `pat-${Date.now()}`,
      patientName: patientName.trim(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: [
        {
          description: itemDesc,
          quantity: 1,
          unitPrice: subtotal,
          total: subtotal
        }
      ],
      subtotal,
      tax,
      discount: 0,
      grandTotal,
      status: 'Pending',
      paymentMethod: 'Cashless TPA / Card'
    });

    setPatientName('');
    setIsNewInvoiceOpen(false);
  };

  const handlePayInvoice = (id: string) => {
    sound.playSuccess();
    db.updateInvoiceStatus(id, 'Paid');
  };

  const filtered = invoices.filter(inv => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.grandTotal : 0), 0);
  const totalPending = invoices.reduce((sum, inv) => sum + (inv.status === 'Pending' ? inv.grandTotal : 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Billing & Cashless Insurance (TPA) Desk</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Portal 11</span>
            </div>
            <p className="text-xs text-[#626B77]">GST Tax Invoices, Pre-Authorization Claims & Revenue Settlement</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsNewInvoiceOpen(true); }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Patient Invoice</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Realized Hospital Revenue</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-1">Settled & bank verified</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Outstanding / Pending Claims</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">₹{totalPending.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-1">Under TPA adjudication</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Total Invoices Issued</span>
            <div className="text-2xl font-bold text-[#29243A] mt-1">{invoices.length} Invoices</div>
            <p className="text-[11px] text-slate-400 mt-1">100% GST-ready with HSN codes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E4DC] shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Avg TPA Approval Time</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">26 Minutes</div>
            <p className="text-[11px] text-slate-400 mt-1">Star Health, Max Bupa, ICICI</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7E4DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number or patient name..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-xl text-xs text-[#29243A] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Status:</span>
            {(['All', 'Paid', 'Pending'] as const).map(st => (
              <button
                key={st}
                onClick={() => { sound.playClick(); setStatusFilter(st); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === st ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl border border-[#E7E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F7F5EF]/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Billing Ledger & GST Invoices</h3>
            <span className="text-xs text-[#626B77]">{filtered.length} invoices found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#626B77] uppercase tracking-wider font-semibold border-b border-[#E7E4DC]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Date / Due</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Subtotal + GST</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F7F5EF] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#29243A]">
                      {inv.patientName}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#626B77]">
                      <div>Issued: {inv.date}</div>
                      <div>Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] max-w-xs truncate text-slate-600">
                      {inv.items.map(i => i.description).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#29243A]">
                      ₹{inv.grandTotal.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-normal block">GST: ₹{inv.tax}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {inv.status === 'Pending' && (
                        <button
                          onClick={() => handlePayInvoice(inv.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Settle Payment
                        </button>
                      )}
                      <button
                        onClick={() => {
                          sound.playClick();
                          alert(`Printing GST Invoice #${inv.invoiceNumber} for ${inv.patientName}. Total: ₹${inv.grandTotal}`);
                        }}
                        className="px-2 py-1 border border-[#E7E4DC] rounded text-slate-600 hover:bg-slate-100 text-[11px]"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Invoice Modal */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E7E4DC] max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">Create Patient Clinical Invoice</h4>
              <button onClick={() => setIsNewInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Patient Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Magnus Stephenson"
                  required
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Billing Line Description</label>
                <input
                  type="text"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Base Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F5EF] border border-[#E7E4DC] rounded-lg text-[#29243A]"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{amount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5%):</span>
                  <span>₹{Math.round(amount * 0.05)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-emerald-200">
                  <span>Grand Total:</span>
                  <span>₹{amount + Math.round(amount * 0.05)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md shadow-emerald-600/20"
                >
                  Generate Tax Invoice & File TPA Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
