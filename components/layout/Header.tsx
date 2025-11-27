import React from "react";
import { TabType } from "../types";

interface HeaderProps {
  activeTab: TabType;
  borrowerId: string;
}

export function Header({ activeTab, borrowerId }: HeaderProps) {
  const titles = {
    dashboard: 'Loan Application Assessment',
    network: 'Entity Relationship Analysis',
    simulator: 'What-If Scenario Simulator'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
      <h1 className="text-xl font-bold text-slate-800">{titles[activeTab]}</h1>
      <div className="flex items-center gap-4">
        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">ID: {borrowerId}</span>
        <span className="text-sm text-slate-500">{new Date().toLocaleDateString()}</span>
      </div>
    </header>
  );
}
