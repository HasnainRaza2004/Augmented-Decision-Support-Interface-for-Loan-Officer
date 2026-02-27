import React from "react";
import { RiskAnalysis } from "../types";
import { BrainCircuitIcon, CheckCircleIcon, AlertTriangleIcon } from "../icons";

interface RecommendationsCardProps {
  recommendations: RiskAnalysis['recommendations'];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="col-span-12 md:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
      <h3 className="text-sm uppercase font-semibold text-slate-500 mb-4 flex items-center gap-2">
        <BrainCircuitIcon className="w-4 h-4" />
        AI Recommendations
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
            <div className="mt-1">
                {rec.type === 'positive' ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <AlertTriangleIcon className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800">{rec.title}</div>
              <div className="text-xs text-slate-500 mt-1">{rec.impact}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
