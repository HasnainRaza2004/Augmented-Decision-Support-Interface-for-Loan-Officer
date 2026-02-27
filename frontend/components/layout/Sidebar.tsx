import React from "react";
import { TabType } from "../types";
import { LayoutDashboardIcon, NetworkIcon, CalculatorIcon, BrainCircuitIcon } from "../icons";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabButton = ({ 
  id, 
  label, 
  icon: Icon, 
  activeTab, 
  onTabChange 
}: { 
  id: TabType; 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) => (
  <button 
    onClick={() => onTabChange(id)}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-colors ${
      activeTab === id 
        ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' 
        : 'border-transparent hover:bg-slate-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
          <BrainCircuitIcon className="w-8 h-8" />
          <span>RiskAI</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Augmented Decision Engine</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <TabButton id="dashboard" label="Dashboard" icon={LayoutDashboardIcon} activeTab={activeTab} onTabChange={onTabChange} />
        <TabButton id="network" label="Network Graph" icon={NetworkIcon} activeTab={activeTab} onTabChange={onTabChange} />
        <TabButton id="simulator" label="Simulator" icon={CalculatorIcon} activeTab={activeTab} onTabChange={onTabChange} />
      </nav>

      <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">JD</div>
            <div className="text-sm">
              <div className="text-white">John Doe</div>
              <div className="text-xs">Loan Officer</div>
            </div>
          </div>
      </div>
    </aside>
  );
}
