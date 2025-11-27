import React from "react";

interface ShapValue {
  feature: string;
  impact: number;
  description: string;
}

interface ShapChartProps {
  values: ShapValue[];
}

export function ShapChart({ values }: ShapChartProps) {
  const maxVal = Math.max(...values.map(v => Math.abs(v.impact)), 10);
  
  return (
    <div className="space-y-3">
      {values.map((v, i) => (
        <div key={i} className="group relative">
          <div className="flex items-center text-sm mb-1">
            <span className="w-1/3 truncate text-slate-600 font-medium" title={v.feature}>{v.feature}</span>
            <div className="flex-1 flex items-center h-4 bg-slate-100 rounded-full relative mx-2 overflow-hidden">
                <div className="absolute w-[1px] h-full bg-slate-300 left-1/2"></div>
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${v.impact > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{
                    width: `${(Math.abs(v.impact) / maxVal) * 50}%`,
                    marginLeft: v.impact > 0 ? '50%' : `calc(50% - ${(Math.abs(v.impact) / maxVal) * 50}%)`
                  }}
                />
            </div>
            <span className="w-12 text-right text-xs text-slate-500 font-mono">{v.impact > 0 ? '+' : ''}{v.impact}</span>
          </div>
          <div className="absolute z-10 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {v.description}
          </div>
        </div>
      ))}
      <div className="flex justify-between text-xs text-slate-400 px-2 mt-2">
        <span>Lowers Risk</span>
        <span>Increases Risk</span>
      </div>
    </div>
  );
}
