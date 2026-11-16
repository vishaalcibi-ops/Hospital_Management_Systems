/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 14: Procurement & Medical Inventory Workspace
 * Visual Style: Professional stone/warm-slate interface with supplier purchase orders.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { ProcurementOrder } from '../../types';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Building2,
  FileText
} from 'lucide-react';

interface ProcurementPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const ProcurementPortal: React.FC<ProcurementPortalProps> = ({
  onLogout
}) => {
  const [orders, setOrders] = useState<ProcurementOrder[]>(db.getProcurementOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // New PO State
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<ProcurementOrder['category']>('Biomedical Equipment');
  const [totalAmount, setTotalAmount] = useState(250000);
  const [itemsCount, setItemsCount] = useState(6);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setOrders(db.getProcurementOrders());
    });
    return unsub;
  }, []);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    sound.playSuccess();
    const exp = new Date();
    exp.setDate(exp.getDate() + 10);

    db.addProcurementOrder({
      vendorName: vendorName.trim(),
      category,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: exp.toISOString().split('T')[0],
      totalAmount: Number(totalAmount) || 50000,
      status: 'Approved',
      paymentStatus: 'Pending',
      itemsCount: Number(itemsCount) || 1
    });

    setVendorName('');
    setIsNewOrderOpen(false);
  };

  const handleUpdateStatus = (id: string, status: ProcurementOrder['status']) => {
    sound.playClick();
    db.updateProcurementStatus(id, status);
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      o.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center font-bold shadow-md shadow-stone-800/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Procurement & Stores Inventory</h2>
              <span className="text-[10px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded-full font-bold">Portal 14</span>
            </div>
            <p className="text-xs text-[#626B77]">Biomedical Equipment, Surgical Consumables & Vendor PO Fulfillment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); setIsNewOrderOpen(true); }}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Purchase Order</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Committed PO Value</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">₹{totalValue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-1">Across approved suppliers</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Orders In Transit</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {orders.filter(o => o.status === 'Dispatched').length} Orders
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Expected within 48-72h</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Delivered & Stocked</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {orders.filter(o => o.status === 'Delivered').length} Orders
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Warehouse GRN verified</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Active Vendors</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">28 Partners</div>
            <p className="text-[11px] text-slate-400 mt-1">Siemens, J&J, Sun Pharma</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PO number or vendor..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#29243A] focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Status:</span>
            {['All', 'Approved', 'Dispatched', 'Delivered'].map(st => (
              <button
                key={st}
                onClick={() => { sound.playClick(); setStatusFilter(st); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === st ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Purchase Orders Registry</h3>
            <span className="text-xs text-[#626B77]">{filtered.length} PO records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[#626B77] uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Vendor Partner</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Order Date / Delivery</th>
                  <th className="py-3 px-4">Items / Total Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-700">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {order.poNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#29243A]">
                      {order.vendorName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {order.category}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#626B77]">
                      <div>Issued: {order.orderDate}</div>
                      <div>Expected: {order.expectedDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#29243A]">
                      ₹{order.totalAmount.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-normal block">{order.itemsCount} line items</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'Dispatched'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {order.status === 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Dispatched')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                        >
                          Mark Dispatched
                        </button>
                      )}
                      {order.status === 'Dispatched' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Receive (GRN)
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="text-[11px] text-emerald-600 font-semibold">Stocked ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New PO Modal */}
      {isNewOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h4 className="text-base font-bold text-[#29243A]">Issue Purchase Order (PO)</h4>
              <button onClick={() => setIsNewOrderOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Vendor Name *</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Siemens Healthineers"
                  required
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[#29243A]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[#29243A]"
                >
                  <option value="Biomedical Equipment">Biomedical Equipment</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                  <option value="Surgical Consumables">Surgical Consumables</option>
                  <option value="PPE & Hygiene">PPE & Hygiene</option>
                  <option value="Lab Reagents">Lab Reagents</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Total Value (₹)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[#29243A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Line Items Count</label>
                  <input
                    type="number"
                    value={itemsCount}
                    onChange={(e) => setItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[#29243A]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold transition shadow-md"
                >
                  Authorize Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
