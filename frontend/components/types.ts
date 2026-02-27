export type TabType = 'dashboard' | 'network' | 'simulator';

export interface BorrowerData {
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

export interface RiskAnalysis {
  score: number; // 0 - 100 
  rating: string; 
  shapValues: { feature: string; impact: number; description: string }[];
  recommendations: { title: string; impact: string; type: "positive" | "negative" | "neutral" }[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: "borrower" | "guarantor" | "employer" | "loan" | "asset";
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}
