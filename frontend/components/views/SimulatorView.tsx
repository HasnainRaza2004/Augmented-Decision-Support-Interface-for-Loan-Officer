import React from "react";
import { BorrowerData, RiskAnalysis } from "../types";
import { RiskGauge } from "../ui/RiskGauge";
import { ShapChart } from "../ui/ShapChart";
import { CalculatorIcon, RefreshCwIcon, BrainCircuitIcon } from "../icons";

interface SimulatorViewProps {
  formState: BorrowerData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  runAnalysis: () => void;
  isAnalyzing: boolean;
  apiKeyMissing: boolean;
  analysis: RiskAnalysis;
}

export function SimulatorView({ 
  formState, 
  handleInputChange, 
  runAnalysis, 
  isAnalyzing, 
  apiKeyMissing, 
  analysis 
}: SimulatorViewProps) {
  return (
     <div className="grid grid-cols-12 gap-6 h-full">
        {/* Controls */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CalculatorIcon className="w-5 h-5 text-blue-500" />
              Scenario Controls
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Loan Amount</span>
                    <span className="text-blue-600 font-bold">${formState.loanAmount.toLocaleString()}</span>
                </label>
                <input 
                    type="range" name="loanAmount" min="5000" max="100000" step="1000" 
                    value={formState.loanAmount} onChange={handleInputChange}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$5k</span>
                  <span>$100k</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Annual Income</span>
                    <span className="text-blue-600 font-bold">${formState.income.toLocaleString()}</span>
                </label>
                <input 
                    type="range" name="income" min="20000" max="200000" step="5000" 
                    value={formState.income} onChange={handleInputChange}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
              </div>

                <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Credit Score</span>
                    <span className="text-blue-600 font-bold">{formState.creditScore}</span>
                </label>
                <input 
                    type="range" name="creditScore" min="300" max="850" step="10" 
                    value={formState.creditScore} onChange={handleInputChange}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Poor (300)</span>
                  <span>Excellent (850)</span>
                </div>
              </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Loan Term</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[12, 24, 36, 48, 60].map(term => (
                        <button
                          key={term}
                          onClick={() => handleInputChange({ target: { name: 'loanTerm', value: term } } as any)}
                          className={`px-3 py-2 text-sm rounded border ${
                            formState.loanTerm === term 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {term} Mo
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Employment</label>
                    <input 
                      type="text" 
                      name="employmentStatus" 
                      value={formState.employmentStatus}
                      onChange={handleInputChange}
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing || apiKeyMissing}
                  className={`w-full py-4 mt-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg
                    ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]'}
                  `}
                >
                  {isAnalyzing ? (
                    <><RefreshCwIcon className="w-5 h-5 animate-spin" /> Simulating...</>
                  ) : (
                    <><BrainCircuitIcon className="w-5 h-5" /> Run Simulation</>
                  )}
                </button>
            </div>
        </div>

        {/* Results Preview */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm uppercase font-semibold text-slate-500 mb-6">Simulated Outcome</h3>
               <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-1">{analysis.score}</div>
                    <div className="text-xs text-slate-500">Risk Score</div>
                  </div>
                  <RiskGauge score={analysis.score} />
                  <div className="text-center">
                    <div className={`text-xl font-bold ${
                       analysis.rating === 'Low' ? 'text-green-600' :
                       analysis.rating === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{analysis.rating}</div>
                    <div className="text-xs text-slate-500">Rating</div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
                <h3 className="text-sm uppercase font-semibold text-slate-500 mb-6">Feature Contribution (SHAP)</h3>
                <ShapChart values={analysis.shapValues} />
            </div>
        </div>
     </div>
  );
}
