import { BorrowerData, RiskAnalysis, GraphNode, GraphLink } from './types';

export const DEFAULT_BORROWER: BorrowerData = {
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

export const DEFAULT_ANALYSIS: RiskAnalysis = {
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

export const DEFAULT_GRAPH_NODES: GraphNode[] = [
  { id: "B1", label: "Alex Rivera", type: "borrower" },
  { id: "E1", label: "TechSolutions Inc", type: "employer" },
  { id: "L1", label: "Prev Loan #9921", type: "loan" },
  { id: "G1", label: "Maria Rivera", type: "guarantor" },
  { id: "A1", label: "2018 Honda Civic", type: "asset" },
];

export const DEFAULT_GRAPH_LINKS: GraphLink[] = [
  { source: "E1", target: "B1", label: "Employs" },
  { source: "B1", target: "L1", label: "Held" },
  { source: "G1", target: "B1", label: "Sister" },
  { source: "B1", target: "A1", label: "Owns" },
];
