import React, { useState, useEffect, useRef } from "react";
import { GraphNode, GraphLink } from "../types";
import { ZoomInIcon, ZoomOutIcon, MaximizeIcon, XIcon } from "../icons";

interface NetworkGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function NetworkGraph({ nodes, links }: NetworkGraphProps) {
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
