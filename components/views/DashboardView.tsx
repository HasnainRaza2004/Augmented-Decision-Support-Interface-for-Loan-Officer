import React from "react";
import { BorrowerData, RiskAnalysis, GraphNode, GraphLink, TabType } from "../types";
import { ApplicantProfile } from "../dashboard/ApplicantProfile";
import { RecommendationsCard } from "../dashboard/RecommendationsCard";
import { RiskGauge } from "../ui/RiskGauge";
import { ShapChart } from "../ui/ShapChart";
import { NetworkGraph } from "../ui/NetworkGraph";
import { CalculatorIcon, NetworkIcon } from "../icons";

interface DashboardViewProps {
  borrower: BorrowerData;
  analysis: RiskAnalysis;
  formState: BorrowerData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  runAnalysis: () => void;
  isAnalyzing: boolean;
  apiKeyMissing: boolean;
  graphNodes: GraphNode[];
  graphLinks: GraphLink[];
  onNavigate: (tab: TabType) => void;
}

export function DashboardView({ 
  borrower, 
  analysis, 
  formState, 
  handleInputChange, 
  runAnalysis, 
  isAnalyzing, 
  apiKeyMissing, 
  graphNodes, 
  graphLinks, 
  onNavigate 
}: DashboardViewProps) {
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <ApplicantProfile borrower={borrower} />

        {/* Risk Score */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 text-sm uppercase font-semibold text-slate-500">Predicted Risk</h3>
          <RiskGauge score={analysis.score} />
          <div className={`mt-[-20px] px-3 py-1 rounded-full text-sm font-bold border ${
            analysis.rating === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
            analysis.rating === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
            'bg-red-50 text-red-700 border-red-200'
          }`}>
            {analysis.rating} Risk
          </div>
        </div>

        <RecommendationsCard recommendations={analysis.recommendations} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SHAP */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase font-semibold text-slate-500">Key Risk Drivers</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">Global SHAP</span>
          </div>
          <ShapChart values={analysis.shapValues} />
        </div>

        {/* Simulator Preview */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase font-semibold text-slate-500 flex items-center gap-2">
                <CalculatorIcon className="w-4 h-4" />
                Quick Simulator
              </h3>
              <button onClick={() => onNavigate('simulator')} className="text-xs text-blue-500 hover:underline">Full View &rarr;</button>
          </div>
          <div className="space-y-4">
              <div>
                <label className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Loan Amount</span>
                    <span>${formState.loanAmount.toLocaleString()}</span>
                </label>
                <input 
                    type="range" name="loanAmount" min="5000" max="100000" step="1000" 
                    value={formState.loanAmount} onChange={handleInputChange}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
              </div>
              <div className="text-xs text-center text-slate-400">Use Simulator tab for advanced controls</div>
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing || apiKeyMissing}
                className={`w-full py-2 mt-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all
                  ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}
                `}
              >
                {isAnalyzing ? "Analyzing..." : "Update Score"}
              </button>
          </div>
        </div>

        {/* Network Preview */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase font-semibold text-slate-500 flex items-center gap-2">
                <NetworkIcon className="w-4 h-4" />
                Network Preview
              </h3>
                <button onClick={() => onNavigate('network')} className="text-xs text-blue-500 hover:underline">Full View &rarr;</button>
          </div>
          <div className="flex-1 min-h-[200px] relative">
              <NetworkGraph nodes={graphNodes} links={graphLinks} />
          </div>
        </div>
      </div>
    </>
  );
}
