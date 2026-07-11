/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { EXPANSION_DATA, DEFICIT_DATA, CONGESTION_DATA, VULNERABILITY_DATA } from "../data";

interface InteractiveChartsProps {
  activeStep: string;
}

export default function InteractiveCharts({ activeStep }: InteractiveChartsProps) {
  // Common Dark Theme Tooltip styling
  const customTooltipStyle = {
    backgroundColor: "#0A0A0A",
    border: "1px solid #222",
    borderRadius: "0px",
    color: "#FFFFFF",
    fontFamily: "monospace",
    fontSize: "11px"
  };

  const renderChart = () => {
    switch (activeStep) {
      case "1":
        return (
          <div className="w-full h-full flex flex-col justify-between" id="chart-viz-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 mb-4 border-b border-zinc-900 pb-3">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Metric: Footprint Index (Base 100)</span>
                <span className="text-[10px] font-mono text-zinc-600 block mt-0.5">10-YEAR METROPOLITAN LAND SATURATION</span>
              </div>
              
              {/* National Urban Average Trend Indicator */}
              <div className="flex items-center gap-3 bg-red-950/20 border border-red-950/30 px-3 py-1.5 rounded-none self-start sm:self-auto">
                <div className="flex items-center justify-center w-6 h-6 rounded-none bg-red-950/40 border border-red-500/30">
                  <ArrowUp className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">MIXED-USE VS URBAN AVG</span>
                    <span className="text-xs font-mono font-black text-red-500">+104%</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Avg: 48.0 | Current Selection: 98.0</span>
                </div>
              </div>
            </div>
            <div className="w-full flex-grow h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EXPANSION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="year" stroke="#555" fontSize={10} tickLine={false} fontClassName="font-mono" />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} fontClassName="font-mono" />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px", textTransform: "uppercase" }} />
                  <Line
                    name="Mixed-Use Spaces"
                    type="monotone"
                    dataKey="mixedUse"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Commercial Units"
                    type="monotone"
                    dataKey="commercial"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    name="Residential Areas"
                    type="monotone"
                    dataKey="residential"
                    stroke="#888888"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "2":
        return (
          <div className="w-full h-full flex flex-col justify-between" id="chart-viz-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 mb-4 border-b border-zinc-900 pb-3">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Metric: Number of Building Floors</span>
                <span className="text-[10px] font-mono text-zinc-600 block mt-0.5">UNAUTHORIZED VERTICAL HEIGHT INDEX</span>
              </div>
              
              {/* National Urban Average Trend Indicator */}
              <div className="flex items-center gap-3 bg-red-950/20 border border-red-950/30 px-3 py-1.5 rounded-none self-start sm:self-auto">
                <div className="flex items-center justify-center w-6 h-6 rounded-none bg-red-950/40 border border-red-500/30">
                  <ArrowUp className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">FLOORS VS URBAN AVG</span>
                    <span className="text-xs font-mono font-black text-red-500">+77%</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Avg: 3.5 Floors | Selected Area Avg: 6.2</span>
                </div>
              </div>
            </div>
            <div className="w-full flex-grow h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEFICIT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="location" stroke="#555" fontSize={9} tickLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="square" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px", textTransform: "uppercase" }} />
                  <Bar name="Sanctioned Legal Floors" dataKey="legal" stackId="a" fill="#3f3f46" stroke="#52525b" />
                  <Bar name="Unauthorized Illegal Floors" dataKey="illegal" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "3":
        return (
          <div className="w-full h-full flex flex-col justify-between" id="chart-viz-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 mb-4 border-b border-zinc-900 pb-3">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Metric: Travel Time for 5km (Minutes)</span>
                <span className="text-[10px] font-mono text-zinc-600 block mt-0.5">PEAK RESPONSE ROUTING DELAYS</span>
              </div>
              
              {/* National Urban Average Trend Indicator */}
              <div className="flex items-center gap-3 bg-orange-950/20 border border-orange-950/30 px-3 py-1.5 rounded-none self-start sm:self-auto">
                <div className="flex items-center justify-center w-6 h-6 rounded-none bg-orange-950/40 border border-orange-500/30">
                  <ArrowUp className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">COMMUTE DELAY VS URBAN AVG</span>
                    <span className="text-xs font-mono font-black text-orange-500">+95%</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Avg: 16.5 Min | Selected Peak Avg: 32.2</span>
                </div>
              </div>
            </div>
            <div className="w-full flex-grow h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONGESTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="corridor" stroke="#555" fontSize={9} tickLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px", textTransform: "uppercase" }} />
                  <Bar name="Baseline Commute (Empty)" dataKey="baseline" fill="#3f3f46" stroke="#52525b" />
                  <Bar name="Peak Congestion Delay" dataKey="peak" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "4":
        return (
          <div className="w-full h-full flex flex-col justify-between" id="chart-viz-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 mb-4 border-b border-zinc-900 pb-3">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Metric: Vulnerability Score (Max 100)</span>
                <span className="text-[10px] font-mono text-zinc-600 block mt-0.5">METROPOLITAN COLLAPSE INDEX</span>
              </div>
              
              {/* National Urban Average Trend Indicator */}
              <div className="flex items-center gap-3 bg-red-950/20 border border-red-950/30 px-3 py-1.5 rounded-none self-start sm:self-auto">
                <div className="flex items-center justify-center w-6 h-6 rounded-none bg-red-950/40 border border-red-500/30">
                  <ArrowUp className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">HAZARD INDEX VS URBAN AVG</span>
                    <span className="text-xs font-mono font-black text-red-500">+58%</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Avg Score: 58.0 | Selected Cities Avg: 92.0</span>
                </div>
              </div>
            </div>
            <div className="w-full flex-grow h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VULNERABILITY_DATA} layout="vertical" margin={{ top: 10, right: 15, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" horizontal={false} />
                  <XAxis type="number" stroke="#555" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="city" stroke="#555" fontSize={10} tickLine={false} width={100} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px", textTransform: "uppercase" }} />
                  <Bar name="Emergency Access Delay" dataKey="delayComponent" stackId="b" fill="#EF4444" />
                  <Bar name="Bldg Code Violations" dataKey="densityComponent" stackId="b" fill="#FFFFFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950/20 rounded-none p-4 border border-zinc-900" id="chart-container-panel">
      {renderChart()}
    </div>
  );
}
