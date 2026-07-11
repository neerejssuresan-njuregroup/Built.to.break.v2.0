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
            <div className="flex justify-between items-center px-2 mb-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold">Metric: Footprint Index (Base 100)</span>
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
                    stroke="#3F3F46"
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
            <div className="flex justify-between items-center px-2 mb-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold">Metric: Number of Building Floors</span>
            </div>
            <div className="w-full flex-grow h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEFICIT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="location" stroke="#555" fontSize={9} tickLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="square" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px", textTransform: "uppercase" }} />
                  <Bar name="Sanctioned Legal Floors" dataKey="legal" stackId="a" fill="#18181b" border="1px solid #333" />
                  <Bar name="Unauthorized Illegal Floors" dataKey="illegal" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "3":
        return (
          <div className="w-full h-full flex flex-col justify-between" id="chart-viz-3">
            <div className="flex justify-between items-center px-2 mb-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold">Metric: Travel Time for 5km (Minutes)</span>
            </div>
            <div className="w-full flex-grow h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONGESTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="corridor" stroke="#555" fontSize={9} tickLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px", textTransform: "uppercase" }} />
                  <Bar name="Baseline Commute (Empty)" dataKey="baseline" fill="#18181b" />
                  <Bar name="Peak Congestion Delay" dataKey="peak" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "4":
        return (
          <div className="w-full h-full flex flex-col justify-between" id="chart-viz-4">
            <div className="flex justify-between items-center px-2 mb-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold">Metric: Vulnerability Score (Max 100)</span>
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
