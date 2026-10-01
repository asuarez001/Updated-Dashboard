import React, { useState } from 'react';
import { Settings as SettingsIcon, Syringe, Scale, Activity, CheckCircle2, User } from 'lucide-react';
import { UserProfile, MedicationType, BrandName, ActivityLevel } from '../types';
import { ACTIVITY_LABELS } from '../utils/calculations';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const MEDICATIONS: Array<{ med: MedicationType; brands: BrandName[] }> = [
  { med: 'Tirzepatide', brands: ['Zepbound', 'Mounjaro', 'Compounded', 'Other'] },
  { med: 'Semaglutide', brands: ['Wegovy', 'Ozempic', 'Rybelsus', 'Compounded', 'Other'] },
  { med: 'Liraglutide', brands: ['Saxenda', 'Other'] },
  { med: 'Retatrutide', brands: ['Other'] },
];

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const selectedMedObj = MEDICATIONS.find((m) => m.med === formData.medication) || MEDICATIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">User Protocol & Algorithm Settings</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* User Profile Details */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Biometric Profile</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Biological Sex (for BMR Math)</label>
                <select
                  value={formData.biologicalSex}
                  onChange={(e) => setFormData({ ...formData, biologicalSex: e.target.value as 'male' | 'female' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="male">Male (+5 kcal Mifflin baseline)</option>
                  <option value="female">Female (-161 kcal Mifflin baseline)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Current Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeightLbs}
                  onChange={(e) => setFormData({ ...formData, currentWeightLbs: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">Starting Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.startingWeightLbs}
                  onChange={(e) => setFormData({ ...formData, startingWeightLbs: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">Goal Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.goalWeightLbs}
                  onChange={(e) => setFormData({ ...formData, goalWeightLbs: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold text-emerald-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Height (inches, e.g. 71 = 5'11")</label>
                <input
                  type="number"
                  value={formData.heightInches}
                  onChange={(e) => setFormData({ ...formData, heightInches: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* GLP-1 Protocol */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Syringe className="w-3.5 h-3.5 text-emerald-600" />
              <span>GLP-1 Medication Protocol</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Active Medication</label>
                <select
                  value={formData.medication}
                  onChange={(e) => {
                    const newMed = e.target.value as MedicationType;
                    const matched = MEDICATIONS.find((m) => m.med === newMed);
                    setFormData({
                      ...formData,
                      medication: newMed,
                      brandName: matched?.brands[0] || 'Other',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
                >
                  {MEDICATIONS.map((m) => (
                    <option key={m.med} value={m.med}>
                      {m.med}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Brand Name / Formulation</label>
                <select
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value as BrandName })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  {selectedMedObj.brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Current Dose (mg)</label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.doseMg}
                  onChange={(e) => setFormData({ ...formData, doseMg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Weekly Shot Day</label>
                <select
                  value={formData.shotDayOfWeek}
                  onChange={(e) => setFormData({ ...formData, shotDayOfWeek: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Level & Daily Targets */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daily Activity Level & Targets</span>
            </h4>

            <div>
              <label className="text-slate-600 block mb-1">Physical Activity Level</label>
              <select
                value={formData.defaultActivityLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultActivityLevel: e.target.value as ActivityLevel,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                {(['sedentary', 'light', 'moderate', 'very_active'] as ActivityLevel[]).map((level) => (
                  <option key={level} value={level}>
                    {ACTIVITY_LABELS[level].label} — {ACTIVITY_LABELS[level].desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-slate-600 block mb-1">Target Daily Calories (kcal)</label>
                <input
                  type="number"
                  value={formData.targetDailyCalories}
                  onChange={(e) => setFormData({ ...formData, targetDailyCalories: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Target Daily Protein (g)</label>
                <input
                  type="number"
                  value={formData.targetDailyProteinGrams}
                  onChange={(e) =>
                    setFormData({ ...formData, targetDailyProteinGrams: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold text-emerald-800"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-xs"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
