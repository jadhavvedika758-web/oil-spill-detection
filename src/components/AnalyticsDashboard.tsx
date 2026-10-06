import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Wind, 
  Waves, 
  Radio, 
  FileCheck, 
  AlertOctagon, 
  Gauge, 
  ShieldCheck,
  Droplet
} from 'lucide-react';
import { SpillIncident } from '../types';

interface AnalyticsDashboardProps {
  incidents: SpillIncident[];
  selectedIncident: SpillIncident;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  incidents,
  selectedIncident,
}) => {

  // Metocean hindcast trajectory points data
  const driftTimeSeriesData = [
    { time: 'T-10h', windSpeed: 24.2, currentSpeed: 1.10, driftDistNm: 0.0, slickAreaKm2: 2.1 },
    { time: 'T-8h', windSpeed: 23.5, currentSpeed: 1.05, driftDistNm: 3.4, slickAreaKm2: 8.4 },
    { time: 'T-6h', windSpeed: 21.8, currentSpeed: 0.98, driftDistNm: 7.2, slickAreaKm2: 18.2 },
    { time: 'T-4h', windSpeed: 22.1, currentSpeed: 0.95, driftDistNm: 10.8, slickAreaKm2: 29.5 },
    { time: 'T-2h', windSpeed: 20.4, currentSpeed: 0.92, driftDistNm: 13.5, slickAreaKm2: 38.0 },
    { time: 'T-0h', windSpeed: 21.4, currentSpeed: 0.94, driftDistNm: 15.6, slickAreaKm2: 44.8 },
  ];

  // SAR Radar Polarimetric Backscatter Spectrum (Clean water vs Biogenic vs Mineral Oil)
  const radarBackscatterData = [
    { band: 'C-Band VV', cleanSea: -10.2, biogenicFilm: -13.5, mineralCrude: -18.7, heavyHFO: -21.4 },
    { band: 'C-Band VH', cleanSea: -22.5, biogenicFilm: -24.8, mineralCrude: -28.9, heavyHFO: -32.1 },
    { band: 'X-Band VV', cleanSea: -8.5, biogenicFilm: -11.9, mineralCrude: -19.4, heavyHFO: -23.0 },
    { band: 'X-Band HH', cleanSea: -9.8, biogenicFilm: -12.4, mineralCrude: -20.1, heavyHFO: -24.2 },
  ];

  // Suspect Vessel Kinematics (Speed vs Draft change leading to discharge)
  const vesselKinematicsData = [
    { time: '06:00Z', speedKts: 14.2, draftM: 15.4, dischargeDetected: 0 },
    { time: '07:00Z', speedKts: 14.0, draftM: 15.4, dischargeDetected: 0 },
    { time: '08:00Z', speedKts: 11.2, draftM: 15.1, dischargeDetected: 40 },
    { time: '08:15Z (Spill)', speedKts: 9.8, draftM: 14.8, dischargeDetected: 98 },
    { time: '08:45Z', speedKts: 12.5, draftM: 14.75, dischargeDetected: 60 },
    { time: '10:00Z', speedKts: 13.9, draftM: 14.75, dischargeDetected: 10 },
    { time: '12:00Z', speedKts: 14.1, draftM: 14.75, dischargeDetected: 0 },
  ];

  // Regional Hotspot Statistics
  const regionalStats = [
    { region: 'North Sea EEZ', spillsDetected: 42, attributedRate: 95.2, avgVolumeBbl: 2400 },
    { region: 'Strait of Malacca', spillsDetected: 68, attributedRate: 91.8, avgVolumeBbl: 1850 },
    { region: 'Strait of Hormuz', spillsDetected: 54, attributedRate: 97.4, avgVolumeBbl: 4200 },
    { region: 'Gulf of Mexico', spillsDetected: 31, attributedRate: 88.6, avgVolumeBbl: 1100 },
    { region: 'Gulf of Guinea', spillsDetected: 39, attributedRate: 84.1, avgVolumeBbl: 3100 },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-10 bg-[#0e1320] text-[#dee2f4] space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#3a494b] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 text-xs font-mono-data text-[#00f2ff] uppercase tracking-wider mb-2 font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>Operational Metocean & SAR Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#dee2f4]">
            Forensic Telemetry & Hydrodynamics
          </h1>
          <p className="text-sm text-[#b9cacb] mt-1 max-w-3xl">
            Quantitative analysis of Bragg wave attenuation, wind-driven surface drift, and vessel telemetry anomalies.'
          </p>
        </div>

        {/* Global Summary Metric Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 rounded-xl bg-[#161b28] border border-[#3a494b] font-mono-data text-xs shadow-md">
            <div className="text-[#849495] text-[10px] uppercase font-bold">GLOBAL ATTRIBUTION SLA</div>
            <div className="text-emerald-400 font-bold text-lg">94.2% Success</div>
          </div>
          <div className="p-3 rounded-xl bg-[#161b28] border border-[#3a494b] font-mono-data text-xs shadow-md">
            <div className="text-[#849495] text-[10px] uppercase font-bold">TOTAL DISCHARGE'</div>
            <div className="text-[#00f2ff] font-bold text-lg">12,310 BBL</div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Hydrodynamic Lagrangian Drift Model */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-[#3a494b] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#dee2f4] uppercase font-mono-data flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#00f2ff]" />
                Drift Distance vs. Slick Expansion (Lagrangian Model)
              </h3>
              <p className="text-xs text-[#849495] mt-1">
                Coupled Stokes drift, Ekman surface currents, and atmospheric wind shear progression
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-data bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 font-bold">
              {selectedIncident.id}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={driftTimeSeriesData}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a37" />
                <XAxis dataKey="time" stroke="#849495" tick={{ fill: '#849495', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#849495" tick={{ fill: '#849495', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b28', borderColor: '#3a494b', borderRadius: '8px', color: '#dee2f4', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="slickAreaKm2" name="Slick Area (km²)" stroke="#00f2ff" fillOpacity={1} fill="url(#areaColor)" />
                <Line type="monotone" dataKey="driftDistNm" name="Drift Distance (NM)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: SAR Radar Polarimetric Backscatter Damping */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-[#3a494b] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#dee2f4] uppercase font-mono-data flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00f2ff]" />
                SAR Polarimetric Backscatter Damping (dB)
              </h3>
              <p className="text-xs text-[#849495] mt-1">
                Negative backscatter depression against ambient sea surface distinguishes petroleum from natural slicks
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-data bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
              POL-SAR
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarBackscatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a37" />
                <XAxis dataKey="band" stroke="#849495" tick={{ fill: '#849495', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#849495" tick={{ fill: '#849495', fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[-35, 0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b28', borderColor: '#3a494b', borderRadius: '8px', color: '#dee2f4', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="cleanSea" name="Clean Sea Surface (dB)" fill="#3a494b" />
                <Bar dataKey="biogenicFilm" name="Biogenic Algae Film (dB)" fill="#00fa91" />
                <Bar dataKey="mineralCrude" name="Crude Oil" fill="#00f2ff" />
                <Bar dataKey="heavyHFO" name="Heavy Fuel Slop (dB)" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Suspect Vessel Kinematic Anomaly Profile */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-[#3a494b] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#dee2f4] uppercase font-mono-data flex items-center gap-2">
                <Gauge className="w-4 h-4 text-red-400" />
                Suspect AIS Kinematics & Slop Tank Discharge Anomaly
              </h3>
              <p className="text-xs text-[#849495] mt-1">
                Correlation of sudden vessel deceleration with hydrostatic draft decrease
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-data bg-red-950 text-red-300 border border-red-500/40 font-bold">
              SPILL MOMENT: 08:15Z
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vesselKinematicsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a37" />
                <XAxis dataKey="time" stroke="#849495" tick={{ fill: '#849495', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis yAxisId="left" stroke="#00f2ff" tick={{ fill: '#00f2ff', fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[8, 16]} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fill: '#ef4444', fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b28', borderColor: '#3a494b', borderRadius: '8px', color: '#dee2f4', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="speedKnots" name="Vessel Speed (Knots)" stroke="#00f2ff" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="dischargeDetected" name="Discharge Probability Index (%)" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 5, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Regional EEZ Hotspots & Legal Conviction Rates */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-[#3a494b] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#dee2f4] uppercase font-mono-data flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Regional EEZ Risk & Attribution Accuracy
              </h3>
              <p className="text-xs text-[#849495] mt-1">
                Historical attribution compliance rate and detected spill volume across major shipping lanes
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-data bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
              MARPOL AUDITED
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#252a37" />
                <XAxis type="number" stroke="#849495" tick={{ fill: '#849495', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis dataKey="region" type="category" stroke="#849495" tick={{ fill: '#dee2f4', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b28', borderColor: '#3a494b', borderRadius: '8px', color: '#dee2f4', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="spillsDetected" name="Spill Incidents Detected" fill="#00dbe7" />
                <Bar dataKey="attributedRate" name="Attribution Success Rate (%)" fill="#00fa91" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
