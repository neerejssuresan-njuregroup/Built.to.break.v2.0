/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StepContent {
  id: string;
  icon: string;
  category: string;
  title: string;
  desc: string;
  accentColor: string;
}

export interface ExpansionData {
  year: number;
  residential: number;
  commercial: number;
  mixedUse: number;
}

export interface DeficitData {
  location: string;
  legal: number;
  illegal: number;
}

export interface CongestionData {
  corridor: string;
  baseline: number;
  peak: number;
}

export interface VulnerabilityData {
  city: string;
  index: number;
  delayComponent: number;
  densityComponent: number;
}

export interface SimulatorInputs {
  laneWidth: number; // in meters (1 to 12)
  buildingFloors: number; // (1 to 8)
  commercialOverload: number; // multiplier (1x to 5x)
  exitsCount: number; // (1 to 4)
}

export interface SimulatorOutputs {
  evacuationVelocity: number; // percentage (0 to 100)
  tenderAccessMinutes: number; // time to access (minutes)
  hazardScore: number; // total hazard (0 to 100)
  hazardLevel: "Low" | "Moderate" | "High" | "Critical";
  hazardColor: string;
  explanation: string;
}
