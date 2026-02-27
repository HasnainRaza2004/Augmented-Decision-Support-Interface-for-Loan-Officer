import React from "react";

interface RiskGaugeProps {
  score: number;
}

export function RiskGauge({ score }: RiskGaugeProps) {
  let color = "#22c55e";
  if (score > 20) color = "#eab308";
  if (score > 50) color = "#f97316";
  if (score > 80) color = "#ef4444";

  const radius = 80;
  const stroke = 12;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const fullCircumference = Math.PI * radius;
  const strokeDashoffset = fullCircumference - (normalizedScore / 100) * fullCircumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth={stroke} strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={fullCircumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <text x="100" y="90" textAnchor="middle" className="text-4xl font-bold fill-slate-800">{score}</text>
        <text x="100" y="110" textAnchor="middle" className="text-xs uppercase font-semibold fill-slate-500 tracking-wider">Risk Score</text>
      </svg>
    </div>
  );
}
