import React from 'react';
import { Scale, Flame, Calculator, TrendingDown, Award, Calendar, CheckCircle2, Info, ArrowDownRight, ShieldCheck } from 'lucide-react';
import { UserProfile, DailySummary } from '../types';
import { PURE_FAT_KCAL_PER_LB, PURE_FAT_KCAL_PER_KG } from '../utils/calculations';

interface FatLossAnalyticsViewProps {
  summaries: DailySummary[];
  profile: UserProfile;
}

export const FatLossAnalyticsView: React.FC<FatLossAnalyticsViewProps> = ({
  summaries,
  profile,
}) => {
  // Sort summaries chronologically
  const sorted = [...summaries].sort((a, b) => a.date.localeCompare(b.date));

  const totalDeficitKcal = sorted.reduce((acc, s) => acc + s.deficitCalories, 0);
  const totalPureFatLbs = totalDeficitKcal / PURE_FAT_KCAL_PER_LB;
  const totalPureFatKg = totalPureFatLbs * 0.45359237;
  const totalPureFatGrams = Math.round(totalPureFatKg * 1000);

  const daysCount = sorted.length || 1;
  const avgDailyDeficit = Math.round(totalDeficitKcal / daysCount);
  const avgDailyFatLossLbs = avgDailyDeficit / PURE_FAT_KCAL_PER_LB;
  const weeklyFatLossLbs = avgDailyFatLossLbs * 7;

  // Actual scale weight change
  const scaleWeightLossLbs = Math.max(0, profile.startingWeightLbs - profile.currentWeightLbs);
  const waterAndGlycogenShiftLbs = Math.max(0, scaleWeightLossLbs - totalPureFatLbs);

  // Remaining to goal weight
  const remainingLbsToGoal = Math.max(0, profile.currentWeightLbs - profile.goalWeightLbs);
  const daysToGoal = avgDailyDeficit > 0 ? Math.round((remainingLbsToGoal * PURE_FAT_KCAL_PER_LB) / avgDailyDeficit) : 0;

  // Lean mass protection metric: Avg protein intake
  const avgProtein = Math.round(sorted.reduce((acc, s) => acc + s.proteinGrams, 0) / daysCount);
  const proteinPreservationScore = Math.min(100, Math.round((avgProtein / profile.targetDailyProteinGrams) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Pure Fat Loss Mathematical Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in thermodynamic energy balance: 1 lb pure human adipose tissue requires exactly 3,500 kcal caloric deficit.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500">Thermodynamic Baseline</span>
          <div className="text-xs font-mono font-bold text-emerald-800">
            3,500 kcal = 1.0 lb Fat · 7,716 kcal = 1.0 kg
          </div>
        </div>
      </div>

      {/* Hero Cards: Cumulative Deficit & Pure Fat Loss */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Pure Fat Loss */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Calculated Pure Fat Loss
              </span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="my-4">
              <div className="text-4xl font-extrabold tracking-tight text-white">
                {totalPureFatLbs >= 0 ? `-${totalPureFatLbs.toFixed(2)}` : `+${Math.abs(totalPureFatLbs).toFixed(2)}`}
                <span className="text-lg font-medium text-slate-300 ml-1.5">lbs</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {totalPureFatKg.toFixed(2)} kg ({totalPureFatGrams.toLocaleString()} grams) of pure adipose tissue
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Across {daysCount} days of monitored deficit
          </div>
        </div>

        {/* Total Cumulative Deficit */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Cumulative Energy Deficit
              </span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-4">
              <div className="text-4xl font-extrabold tracking-tight text-slate-900">
                {totalDeficitKcal.toLocaleString()}
                <span className="text-lg font-medium text-slate-500 ml-1.5">kcal</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Average Daily Deficit: <strong>{avgDailyDeficit} kcal/day</strong>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Adjusted TDEE minus total logged calories
          </div>
        </div>

        {/* Weekly Burn Velocity & Goal ETA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Fat Loss Velocity & Pace
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-4">
              <div className="text-4xl font-extrabold tracking-tight text-emerald-800">
                -{weeklyFatLossLbs.toFixed(2)}
                <span className="text-lg font-medium text-slate-600 ml-1.5">lbs/week</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Estimated Goal Arrival: <strong>~{daysToGoal} days</strong> ({Math.round(daysToGoal / 7)} weeks)
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Targeting {profile.goalWeightLbs} lbs ({remainingLbsToGoal.toFixed(1)} lbs remaining)
          </div>
        </div>
      </div>

      {/* Pure Fat Loss vs Scale Weight Decomposition */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Clinical Deconstruction: Pure Fat Loss vs Scale Weight
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Why scale weight loss differs from pure thermodynamic fat loss
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700">
            Scale Total: -{scaleWeightLossLbs.toFixed(1)} lbs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">1. Pure Adipose Fat Tissue</span>
              <span className="text-xs font-mono font-bold text-emerald-800">{totalPureFatLbs.toFixed(2)} lbs</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalPureFatLbs / (scaleWeightLossLbs || 1)) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              True subcutaneous and visceral lipid oxidation generated by your continuous {totalDeficitKcal.toLocaleString()} kcal deficit.
            </p>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">2. Water & Glycogen Depletion</span>
              <span className="text-xs font-mono font-bold text-blue-800">{waterAndGlycogenShiftLbs.toFixed(2)} lbs</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (waterAndGlycogenShiftLbs / (scaleWeightLossLbs || 1)) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              GLP-1 therapy reduces systemic inflammation and clears glycogen stores. Each 1g of stored glycogen holds 3-4g of cellular water.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">3. Lean Muscle Preservation</span>
              <span className="text-xs font-mono font-bold text-emerald-700">{proteinPreservationScore}% Guard</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${proteinPreservationScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Averaging {avgProtein}g protein/day protects skeletal muscle during rapid adipose mobilization.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>The Wishnofsky Standard:</strong> Scale weight fluctuates daily due to sodium intake, digestive stool transit (which slows on GLP-1), and water retention. By tracking exact calorie deficit against 3,500 kcal/lb, this mathematical model reveals your real fat loss regardless of scale noise!
          </p>
        </div>
      </div>

      {/* Historical Daily Deficit & Fat Burned Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daily Energy Deficit & Adipose Loss Ledger</h3>
            <p className="text-xs text-slate-500">Day-by-day thermodynamic calculations</p>
          </div>
          <span className="text-xs text-slate-500">{sorted.length} days recorded</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Daily Burn (TDEE)</th>
                <th className="pb-3 font-semibold">Food Intake</th>
                <th className="pb-3 font-semibold">Protein</th>
                <th className="pb-3 font-semibold">Net Deficit</th>
                <th className="pb-3 font-semibold">Pure Fat Loss (lbs)</th>
                <th className="pb-3 font-semibold text-right">Pure Fat (grams)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sorted.map((s) => {
                const isDef = s.deficitCalories >= 0;
                return (
                  <tr key={s.date} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-900 whitespace-nowrap">
                      {s.date}
                    </td>
                    <td className="py-3 font-mono text-slate-800">{s.totalBurnCalories} kcal</td>
                    <td className="py-3 font-mono text-slate-800">{s.intakeCalories} kcal</td>
                    <td className="py-3 font-semibold text-emerald-800">{s.proteinGrams}g</td>
                    <td className="py-3 font-bold">
                      <span className={isDef ? 'text-emerald-700' : 'text-rose-600'}>
                        {isDef ? `+${s.deficitCalories}` : s.deficitCalories} kcal
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {s.fatLossLbs >= 0 ? `-${s.fatLossLbs}` : `+${Math.abs(s.fatLossLbs)}`} lbs
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600">
                      {s.fatLossGrams} g
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
