import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";

// Import components
import {
  TabType,
  BorrowerData,
  RiskAnalysis,
  GraphNode,
  GraphLink,
  DEFAULT_BORROWER,
  DEFAULT_ANALYSIS,
  DEFAULT_GRAPH_NODES,
  DEFAULT_GRAPH_LINKS,
  Sidebar,
  Header,
  DashboardView,
  NetworkView,
  SimulatorView,
} from "./components";

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [borrower, setBorrower] = useState<BorrowerData>(DEFAULT_BORROWER);
  const [analysis, setAnalysis] = useState<RiskAnalysis>(DEFAULT_ANALYSIS);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>(DEFAULT_GRAPH_NODES);
  const [graphLinks, setGraphLinks] = useState<GraphLink[]>(DEFAULT_GRAPH_LINKS);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [formState, setFormState] = useState(DEFAULT_BORROWER);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'employmentStatus' ? value : Number(value)
    }));
  };

  const runAnalysis = async () => {
    if (!process.env.API_KEY) return;
    
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are an expert loan underwriter and risk analyst AI. 
        Analyze the following loan application data and provide a JSON response.
        
        Applicant Data:
        Name: ${formState.name}
        Income: $${formState.income}
        Loan Amount: $${formState.loanAmount}
        Loan Term: ${formState.loanTerm} months
        Credit Score: ${formState.creditScore}
        Employment: ${formState.employmentStatus}
        Calculated DTI: ${(formState.loanAmount / formState.loanTerm / (formState.income / 12)).toFixed(2)}

        Task:
        1. Calculate a Risk Score (0-100, where 100 is highest risk).
        2. Determine a Risk Rating (Low, Medium, High, Critical).
        3. Identify top 5 SHAP-style feature contributions (positive values increase risk, negative values decrease risk).
        4. Provide 3 specific recommendations to mitigate risk.
        5. Create a network graph representation of this person including hypothetical relationships (guarantors, employers, assets) that might be relevant for a "Knowledge Graph" view of their risk.
        
        Output JSON Schema:
        {
          "score": number,
          "rating": string,
          "shapValues": [{ "feature": string, "impact": number, "description": string }],
          "recommendations": [{ "title": string, "impact": string, "type": "positive"|"negative"|"neutral" }],
          "graph": {
             "nodes": [{ "id": string, "label": string, "type": "borrower"|"guarantor"|"employer"|"loan"|"asset" }],
             "links": [{ "source": string, "target": string, "label": string }]
          }
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });
      
      const responseText = response.text;
      if (!responseText) throw new Error("No response text");
      
      const data = JSON.parse(responseText);

      setBorrower(formState);
      setAnalysis({
        score: data.score,
        rating: data.rating,
        shapValues: data.shapValues,
        recommendations: data.recommendations
      });
      
      const nodes = data.graph.nodes;
      const links = data.graph.links;
      
      if (nodes && links) {
        setGraphNodes(nodes);
        setGraphLinks(links);
      }

    } catch (error) {
      console.error("AI Analysis Failed:", error);
      alert("Analysis failed. Please check API Key or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <Header activeTab={activeTab} borrowerId={borrower.id} />

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView 
              borrower={borrower}
              analysis={analysis}
              formState={formState}
              handleInputChange={handleInputChange}
              runAnalysis={runAnalysis}
              isAnalyzing={isAnalyzing}
              apiKeyMissing={apiKeyMissing}
              graphNodes={graphNodes}
              graphLinks={graphLinks}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'network' && (
            <NetworkView nodes={graphNodes} links={graphLinks} />
          )}

          {activeTab === 'simulator' && (
             <SimulatorView 
                formState={formState}
                handleInputChange={handleInputChange}
                runAnalysis={runAnalysis}
                isAnalyzing={isAnalyzing}
                apiKeyMissing={apiKeyMissing}
                analysis={analysis}
             />
          )}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
