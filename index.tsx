
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";

// --- Icons (SVG) ---
const LayoutDashboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);
const NetworkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="6" height="6" x="9" y="3" rx="1" /><rect width="6" height="6" x="2" y="15" rx="1" /><rect width="6" height="6" x="16" y="15" rx="1" /><line x1="12" x2="12" y1="9" y2="15" /><line x1="5" x2="9.6" y1="15" y2="10.8" /><line x1="19" x2="14.4" y1="15" y2="10.8" /></svg>
);
const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
);
const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
);
const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);
const BrainCircuitIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.97-3.284" /><path d="M17.97 14.716A4 4 0 0 1 16 18" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);
const ZoomInIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
);
const ZoomOutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
);
const MaximizeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
);
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);


// --- Types ---

type TabType = 'dashboard' | 'network' | 'simulator';

interface BorrowerData {
  id: string;
  name: string;
  age: number;
  income: number;
  loanAmount: number;
  loanTerm: number; // months
  creditScore: number;
  employmentStatus: string;
  dti: number; // Debt to Income
}

interface RiskAnalysis {
  score: number; // 0 - 100 
  rating: string; 
  shapValues: { feature: string; impact: number; description: string }[];
  recommendations: { title: string; impact: string; type: "positive" | "negative" | "neutral" }[];
}

interface GraphNode {
  id: string;
  label: string;
  type: "borrower" | "guarantor" | "employer" | "loan" | "asset";
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

// --- Defaults ---

const DEFAULT_BORROWER: BorrowerData = {
  id: "APP-2024-8921",
  name: "Alex Rivera",
  age: 34,
  income: 65000,
  loanAmount: 25000,
  loanTerm: 36,
  creditScore: 680,
  employmentStatus: "Employed (3 yrs)",
  dti: 0.32,
};

const DEFAULT_ANALYSIS: RiskAnalysis = {
  score: 42,
  rating: "Medium",
  shapValues: [
    { feature: "Credit Score (680)", impact: -15, description: "Above average score reduces risk." },
    { feature: "DTI Ratio (32%)", impact: 12, description: "Moderate debt burden adds risk." },
    { feature: "Loan Term (36m)", impact: 5, description: "Standard term length." },
    { feature: "Employment", impact: -8, description: "Stable employment history." },
    { feature: "Loan Amount", impact: 8, description: "Amount is high relative to savings." },
  ],
  recommendations: [
    { title: "Request Co-Signer", impact: "Reduces Risk Score by ~15 pts", type: "positive" },
    { title: "Extend Term to 48m", impact: "Reduces Monthly Payment, lowers DTI impact", type: "positive" },
    { title: "Verify Cash Reserves", impact: "Confirmation required for final approval", type: "neutral" },
  ],
};

const DEFAULT_GRAPH_NODES: GraphNode[] = [
  { id: "B1", label: "Alex Rivera", type: "borrower" },
  { id: "E1", label: "TechSolutions Inc", type: "employer" },
  { id: "L1", label: "Prev Loan #9921", type: "loan" },
  { id: "G1", label: "Maria Rivera", type: "guarantor" },
  { id: "A1", label: "2018 Honda Civic", type: "asset" },
];

const DEFAULT_GRAPH_LINKS: GraphLink[] = [
  { source: "E1", target: "B1", label: "Employs" },
  { source: "B1", target: "L1", label: "Held" },
  { source: "G1", target: "B1", label: "Sister" },
  { source: "B1", target: "A1", label: "Owns" },
];

// --- Leaf Components ---

function RiskGauge({ score }: { score: number }) {
  let color = "#22c55e";
  if (score > 20) color = "#eab308";
  if (score > 50) color = "#f97316";
  if (score > 80) color = "#ef4444";

  const radius = 80;
  const stroke = 12;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const circumference = normalizedScore * Math.PI * (radius/100); 
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

function ShapChart({ values }: { values: { feature: string; impact: number; description: string }[] }) {
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

function NetworkGraph({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    handleReset();
  }, [nodes, links]); // Reset when data changes

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.2, transform.k + delta), 5);

    if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const scaleRatio = newScale / transform.k;
        const newX = cursorX - (cursorX - transform.x) * scaleRatio;
        const newY = cursorY - (cursorY - transform.y) * scaleRatio;
        setTransform({ k: newScale, x: newX, y: newY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setIsDragging(true);
    hasDraggedRef.current = false;
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePosition.x;
    const dy = e.clientY - lastMousePosition.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        hasDraggedRef.current = true;
    }
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = () => {
    if (!hasDraggedRef.current) setSelectedNode(null);
  };
  
  const handleNodeClick = (e: React.MouseEvent, node: GraphNode) => {
      e.stopPropagation();
      if (hasDraggedRef.current) return;
      setSelectedNode(node);
  };

  const handleZoom = (direction: 'in' | 'out') => {
      const factor = direction === 'in' ? 1.2 : 0.8;
      const newScale = Math.min(Math.max(0.2, transform.k * factor), 5);
      if (svgRef.current) {
         const rect = svgRef.current.getBoundingClientRect();
         const centerX = rect.width / 2;
         const centerY = rect.height / 2;
         const scaleRatio = newScale / transform.k;
         const newX = centerX - (centerX - transform.x) * scaleRatio;
         const newY = centerY - (centerY - transform.y) * scaleRatio;
         setTransform({ k: newScale, x: newX, y: newY });
      }
  };

  const handleReset = () => {
     if (svgRef.current) {
         const rect = svgRef.current.getBoundingClientRect();
         const newX = (rect.width / 2) - 200;
         const newY = (rect.height / 2) - 150;
         setTransform({ k: 1, x: newX, y: newY });
     } else {
         setTransform({ k: 1, x: 0, y: 0 });
     }
  };

  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 100;

  const layoutNodes = nodes.map((node, i) => {
    if (node.type === 'borrower') {
      return { ...node, x: centerX, y: centerY };
    }
    const others = nodes.filter(n => n.type !== 'borrower');
    const indexInOthers = others.findIndex(n => n.id === node.id);
    const angle = (indexInOthers / others.length) * 2 * Math.PI;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodeColor = (type: string) => {
    switch(type) {
      case 'borrower': return '#3b82f6';
      case 'guarantor': return '#10b981';
      case 'employer': return '#6366f1';
      case 'loan': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative group">
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className={`cursor-grab active:cursor-grabbing touch-none ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
          </marker>
        </defs>
        
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {links.map((link, i) => {
            const source = layoutNodes.find(n => n.id === link.source);
            const target = layoutNodes.find(n => n.id === link.target);
            if (!source || !target) return null;
            return (
                <g key={i}>
                <line
                    x1={source.x} y1={source.y}
                    x2={target.x} y2={target.y}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                />
                <text
                    x={(source.x! + target.x!) / 2}
                    y={(source.y! + target.y!) / 2 - 5}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    className="bg-white/80 px-1 rounded"
                    style={{ fontSize: '10px' }}
                >
                    {link.label}
                </text>
                </g>
            );
            })}
            {layoutNodes.map((node, i) => (
            <g 
                key={i} 
                onClick={(e) => handleNodeClick(e, node)}
                className="cursor-pointer transition-transform hover:scale-110"
            >
                {selectedNode?.id === node.id && (
                     <circle cx={node.x} cy={node.y} r={(node.type === 'borrower' ? 25 : 18) + 4} fill="none" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.5" />
                )}
                <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === 'borrower' ? 25 : 18}
                    fill={getNodeColor(node.type)}
                    strokeWidth="3"
                    className={`transition-all duration-300 hover:brightness-105 ${selectedNode?.id === node.id ? 'stroke-blue-200' : 'stroke-white'}`}
                />
                <text
                    x={node.x}
                    y={node.y! + (node.type === 'borrower' ? 35 : 28)}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-700 uppercase"
                    style={{ fontSize: '10px' }}
                >
                    {node.label}
                </text>
                <text
                    x={node.x}
                    y={node.y}
                    dy=".3em"
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-white pointer-events-none"
                    style={{ fontSize: '10px' }}
                >
                    {node.type.substring(0, 1).toUpperCase()}
                </text>
            </g>
            ))}
        </g>
      </svg>
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 bg-white shadow-md rounded-lg border border-slate-200 p-1">
        <button onClick={() => handleZoom('in')} className="p-2 hover:bg-slate-100 text-slate-600 rounded" title="Zoom In">
            <ZoomInIcon className="w-4 h-4" />
        </button>
        <button onClick={() => handleZoom('out')} className="p-2 hover:bg-slate-100 text-slate-600 rounded" title="Zoom Out">
             <ZoomOutIcon className="w-4 h-4" />
        </button>
        <div className="h-[1px] bg-slate-200 my-0.5"></div>
         <button onClick={handleReset} className="p-2 hover:bg-slate-100 text-slate-600 rounded" title="Reset View">
             <MaximizeIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-2 right-2 text-xs text-slate-400 bg-white/80 p-1 rounded border border-slate-100 pointer-events-none">
        Scroll to Zoom • Drag to Pan
      </div>

      {selectedNode && (
          <div className="absolute top-4 left-4 w-64 bg-white/95 backdrop-blur shadow-lg rounded-xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{selectedNode.label}</h4>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600">
                      <XIcon className="w-4 h-4" />
                  </button>
              </div>
              <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                      <span className="text-slate-500">Type</span>
                      <span className="font-medium capitalize text-slate-800">{selectedNode.type}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-slate-500">ID</span>
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded text-slate-600">{selectedNode.id}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 mt-2">
                      <p className="text-xs text-slate-500 leading-relaxed">
                          {selectedNode.type === 'borrower' && "Primary applicant. Risk assessment heavily weighted on this node's attributes."}
                          {selectedNode.type === 'guarantor' && "Secondary repayment source. High asset coverage reduces overall default risk."}
                          {selectedNode.type === 'employer' && "Source of income stability. Long-term employment history detected."}
                          {selectedNode.type === 'asset' && "Liquid collateral. Value coverage ratio estimated at 120%."}
                          {selectedNode.type === 'loan' && "Historical financial obligation. Consistent repayment behavior observed."}
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

// --- Layout & Feature Components ---

const Sidebar = ({ activeTab, onTabChange }: { activeTab: TabType, onTabChange: (tab: TabType) => void }) => {
  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
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
        <TabButton id="dashboard" label="Dashboard" icon={LayoutDashboardIcon} />
        <TabButton id="network" label="Network Graph" icon={NetworkIcon} />
        <TabButton id="simulator" label="Simulator" icon={CalculatorIcon} />
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
};

const Header = ({ activeTab, borrowerId }: { activeTab: TabType, borrowerId: string }) => {
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
};

// --- Sub-Components for Views ---

const ApplicantProfile = ({ borrower }: { borrower: BorrowerData }) => (
  <div className="col-span-12 md:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 className="text-sm uppercase font-semibold text-slate-500 mb-4">Applicant Profile</h3>
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-400">Full Name</label>
        <div className="font-medium text-lg">{borrower.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-400">Credit Score</label>
            <div className="font-medium text-slate-800">{borrower.creditScore}</div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Age</label>
            <div className="font-medium text-slate-800">{borrower.age}</div>
          </div>
      </div>
      <div>
        <label className="text-xs text-slate-400">Employment</label>
        <div className="font-medium text-slate-800 truncate">{borrower.employmentStatus}</div>
      </div>
    </div>
  </div>
);

const RecommendationsCard = ({ recommendations }: { recommendations: RiskAnalysis['recommendations'] }) => (
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

// --- Main Views ---

const DashboardView = ({ 
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
}: any) => {
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
};

const NetworkView = ({ nodes, links }: { nodes: GraphNode[], links: GraphLink[] }) => {
  return (
    <div className="h-full flex flex-col">
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <NetworkIcon className="w-5 h-5 text-blue-500" />
                Borrower Relationship Graph
              </h2>
              <p className="text-sm text-slate-500">Analyzing 1st and 2nd degree connections for contagion risk.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Borrower</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-green-500"></div>Guarantor</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>Employer</span>
            </div>
          </div>
          <div className="flex-1 border border-slate-100 rounded-lg bg-slate-50 p-4">
            <NetworkGraph nodes={nodes} links={links} />
          </div>
       </div>
    </div>
  );
};

const SimulatorView = ({ 
  formState, 
  handleInputChange, 
  runAnalysis, 
  isAnalyzing, 
  apiKeyMissing, 
  analysis 
}: any) => {
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
};

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
