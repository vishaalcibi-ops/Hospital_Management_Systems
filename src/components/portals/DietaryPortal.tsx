/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Portal 17: Dietary & Clinical Nutrition Workspace
 * Visual Style: Soft green and warm white with patient diet plans and meal distribution.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { DietaryPlan } from '../../types';
import {
  Apple,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Calendar,
  Clock
} from 'lucide-react';

interface DietaryPortalProps {
  onLogout: () => void;
  onSwitchPortal: (portal: any) => void;
}

export const DietaryPortal: React.FC<DietaryPortalProps> = ({
  onLogout
}) => {
  const [plans, setPlans] = useState<DietaryPlan[]>(db.getDietaryPlans());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setPlans(db.getDietaryPlans());
    });
    return unsub;
  }, []);

  const handleToggleMeal = (planId: string, meal: 'breakfast' | 'lunch' | 'eveningSnack' | 'dinner') => {
    sound.playClick();
    db.toggleMealServed(planId, meal);
  };

  const filtered = plans.filter(p =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    p.dietType.toLowerCase().includes(search.toLowerCase()) ||
    p.wardName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#29243A] flex flex-col font-sans">
      <header className="bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg font-bold text-[#29243A]">Dietary & Clinical Nutrition Station</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Portal 17</span>
            </div>
            <p className="text-xs text-[#626B77]">Inpatient Nutrition Regimens, Salt/Carb Controls & Tray Distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Inpatient Meal Trays</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{plans.length * 4} Meals/Day</div>
            <p className="text-[11px] text-slate-400 mt-1">Breakfast, Lunch, Tea, Dinner</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Special Diets Active</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {plans.filter(p => p.dietType.includes('Renal') || p.dietType.includes('Diabetic') || p.dietType.includes('Sodium')).length} Regimens
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Prescribed by Dieticians</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Dietary Safety Audit</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">100%</div>
            <p className="text-[11px] text-slate-400 mt-1">Allergen checked</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs text-[#626B77] font-medium">Tray Delivery SLA</span>
            <div className="text-2xl font-bold text-[#29243A] mt-1">&lt; 15 Mins</div>
            <p className="text-[11px] text-slate-400 mt-1">Warming trolleys active</p>
          </div>
        </div>

        {/* Dietary Regimens Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-sm font-bold text-[#29243A]">Inpatient Clinical Diet Plans</h3>
            <span className="text-xs text-[#626B77]">{filtered.length} active diets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(plan => (
              <div key={plan.id} className="bg-white rounded-2xl border border-[#E7E4DC] p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#29243A]">{plan.patientName}</h4>
                    <p className="text-xs text-[#626B77]">{plan.wardName} · Bed {plan.bedNumber}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {plan.dietType}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Calories:</span>
                    <strong className="text-[#29243A]">{plan.caloriesTarget} kcal / day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Special Instructions:</span>
                    <span className="text-slate-700 italic">{plan.specialInstructions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Dietician:</span>
                    <span className="text-emerald-700 font-semibold">{plan.dieticianName}</span>
                  </div>
                </div>

                {/* Meals checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleToggleMeal(plan.id, 'breakfast')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      plan.meals.breakfast.served
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : 'bg-[#F7F5EF] border-[#E7E4DC] text-[#626B77]'
                    }`}
                  >
                    <div>Breakfast</div>
                    <div className="text-[10px] mt-0.5">{plan.meals.breakfast.served ? 'Served ✓' : 'Pending'}</div>
                  </button>

                  <button
                    onClick={() => handleToggleMeal(plan.id, 'lunch')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      plan.meals.lunch.served
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : 'bg-[#F7F5EF] border-[#E7E4DC] text-[#626B77]'
                    }`}
                  >
                    <div>Lunch</div>
                    <div className="text-[10px] mt-0.5">{plan.meals.lunch.served ? 'Served ✓' : 'Pending'}</div>
                  </button>

                  <button
                    onClick={() => handleToggleMeal(plan.id, 'eveningSnack')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      plan.meals.eveningSnack.served
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : 'bg-[#F7F5EF] border-[#E7E4DC] text-[#626B77]'
                    }`}
                  >
                    <div>Tea Snack</div>
                    <div className="text-[10px] mt-0.5">{plan.meals.eveningSnack.served ? 'Served ✓' : 'Pending'}</div>
                  </button>

                  <button
                    onClick={() => handleToggleMeal(plan.id, 'dinner')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      plan.meals.dinner.served
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : 'bg-[#F7F5EF] border-[#E7E4DC] text-[#626B77]'
                    }`}
                  >
                    <div>Dinner</div>
                    <div className="text-[10px] mt-0.5">{plan.meals.dinner.served ? 'Served ✓' : 'Pending'}</div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
