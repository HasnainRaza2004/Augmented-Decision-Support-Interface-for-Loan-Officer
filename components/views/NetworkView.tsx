import React from "react";
import { GraphNode, GraphLink } from "../types";
import { NetworkGraph } from "../ui/NetworkGraph";
import { NetworkIcon } from "../icons";

interface NetworkViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function NetworkView({ nodes, links }: NetworkViewProps) {
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
}
