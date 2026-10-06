import React, { useState } from 'react';
import { 
  Satellite, 
  Droplet, 
  History, 
  Ship, 
  ArrowRight, 
  Layers, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Crosshair, 
  Cpu, 
  Waves, 
  Compass,
  FileCheck2
} from 'lucide-react';
import { SpillIncident } from '../types';

interface IntelligenceBentoGridProps {
  incidents: SpillIncident[];
  onSelectIncident: (inc: SpillIncident) => void;
  onOpenInvestigation: () => void;
  onOpenAnalytics: () => void;
}

export const IntelligenceBentoGrid: React.FC<IntelligenceBentoGridProps> = ({
  incidents,
  onSelectIncident,
  onOpenInvestigation,
  onOpenAnalytics,
}) => {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-10 py-16 lg:py-24 bg-[#0b1220]/90 backdrop-blur-md border-t border-[#2a3b50]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 mb-3 text-xs font-mono-data text-[#00f2ff] uppercase tracking-wider font-semibold">
            <Cpu className="w-4 h-4" />
            <span>How Our AI Protects The Ocean</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#dee2f4] tracking-tight">
            Intelligence Capabilities
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8] mt-3 max-w-2xl leading-relaxed">
            From radar satellite detection in space to court-certified evidence briefs, here is how we track and hold polluters accountable.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
          
          {/* Feature 1: Satellite Intelligence (Large Card - Col Span 2) */}
          <div className="md:col-span-2 bg-[#121a2a] border border-[#2a3b50] rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-[#00f2ff]/60 transition-all relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#162236] border border-[#2a3b50] flex items-center justify-center group-hover:border-[#00f2ff] transition-colors">
                  <Satellite className="w-6 h-6 text-[#00f2ff]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono-data bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    SATELLITES ACTIVE
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#dee2f4] mb-2">
                Satellite Intelligence & SAR Ingestion
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl leading-relaxed">
                Space radar passes right through heavy rain and darkness. It detects oil because oil dampens water ripples, making spills look like clear dark outlines on radar imagery.
              </p>
            </div>

            {/* Interactive Sensor Telemetry Bar */}
            <div className="relative z-10 mt-4 pt-4 border-t border-[#2a3b50]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-data text-xs">
                <div className="p-2.5 rounded-lg bg-[#0b1220] border border-[#2a3b50]">
                  <div className="text-[#94a3b8] text-[10px] uppercase font-bold">SAR BANDS</div>
                  <div className="text-[#dee2f4] font-semibold">C-Band & X-Band</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b1220] border border-[#2a3b50]">
                  <div className="text-[#94a3b8] text-[10px] uppercase font-bold">RESOLUTION</div>
                  <div className="text-[#00f2ff] font-semibold">1.0m Meter-Level</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b1220] border border-[#2a3b50]">
                  <div className="text-[#94a3b8] text-[10px] uppercase font-bold">INGESTION SPEED</div>
                  <div className="text-[#dee2f4] font-semibold">4.2 TB / sec</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b1220] border border-[#2a3b50]">
                  <div className="text-[#94a3b8] text-[10px] uppercase font-bold">ORBIT ALTITUDE</div>
                  <div className="text-emerald-400 font-semibold">693 km Space</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: AI Oil-Slick Detection */}
          <div className="bg-[#121a2a] border border-[#2a3b50] rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-[#00f2ff]/60 transition-all relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#162236] border border-[#2a3b50] flex items-center justify-center mb-4 group-hover:border-red-400 transition-colors">
                <Droplet className="w-6 h-6 text-[#00f2ff]" />
              </div>
              <h3 className="text-lg font-bold text-[#dee2f4] mb-2">
                AI Detection & Speciation
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                Deep learning models distinguish real crude oil and dirty bilge water from harmless natural algae, seaweed, and wind shadows.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-[#2a3b50]">
              <div className="flex items-center justify-between text-xs font-mono-data">
                <span className="text-[#94a3b8]">FALSE POSITIVE RATE:</span>
                <span className="text-emerald-400 font-bold">&lt; 0.8% (Near Zero)</span>
              </div>
              <div className="w-full bg-[#0b1220] h-2 rounded-full overflow-hidden mt-2 border border-[#2a3b50]">
                <div className="bg-[#00f2ff] h-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Feature 3: Drift Reconstruction */}
          <div className="bg-[#121a2a] border border-[#2a3b50] rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-[#00f2ff]/60 transition-all relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-tl from-[#026be0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#162236] border border-[#2a3b50] flex items-center justify-center mb-4 group-hover:border-[#00f2ff] transition-colors">
                <History className="w-6 h-6 text-[#00f2ff]" />
              </div>
              <h3 className="text-lg font-bold text-[#dee2f4] mb-2">
                Ocean Drift Rewind
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                Hydrodynamic Lagrangian hindcast modeling utilizing real-time ECMWF wind vectors, CMEMS ocean currents, Stokes drift, and wave shear to trace slicks back to origin.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-[#2a3b50] flex items-center justify-between text-xs font-mono-data">
              <span className="text-[#94a3b8]">HINDCAST ACCURACY:</span>
              <span className="text-[#00f2ff] font-bold">±0.25 Nautical Miles</span>
            </div>
          </div>

          {/* Feature 4: AIS Correlation (Wide Card - Col Span 2) */}
          <div className="md:col-span-2 bg-[#121a2a] border border-[#2a3b50] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center group hover:border-[#00f2ff]/60 transition-all relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00f2ff]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#162236] border border-[#2a3b50] flex items-center justify-center mb-4 group-hover:border-[#00f2ff] transition-colors">
                <Ship className="w-6 h-6 text-[#00f2ff]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#dee2f4] mb-2">
                AIS Kinematic Correlation Matrix
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-4">
                Automated spatiotemporal cross-referencing of satellite/terrestrial AIS tracks against reconstructed spill origins. Detects deliberate AIS blackout windows and vessel draft drops.
              </p>
              <button
                onClick={onOpenInvestigation}
                className="inline-flex items-center gap-2 text-xs font-mono-data text-[#00f2ff] hover:underline font-bold"
              >
                <span>OPEN SHIP TRACKING RADAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Lock Visualization */}
            <div className="w-full md:w-72 h-36 border border-[#2a3b50] bg-[#0b1220] rounded-xl flex flex-col p-3.5 relative z-10 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono-data text-[#94a3b8] mb-2">
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <Crosshair className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  RADAR TARGET LOCK
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">LIVE TRACK</span>
              </div>

              <div className="flex-grow flex items-center justify-center relative my-1">
                <div className="w-full h-[1px] bg-[#2a3b50] relative">
                  <div className="absolute left-[35%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-red-500 animate-ping opacity-75"></div>
                  <div className="absolute left-[35%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                  
                  {/* Origin vector */}
                  <div className="absolute left-[35%] top-1/2 h-8 w-[1px] border-l border-dashed border-[#00f2ff] -translate-y-8" />
                  <div className="absolute left-[35%] -top-3 text-[10px] font-mono-data text-[#00f2ff] font-bold">
                    SPILL-ORIGIN
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center font-mono-data text-xs text-[#00f2ff] mt-2 pt-2 border-t border-[#2a3b50]">
                <span className="font-bold text-red-400">98.4% CERTAINTY</span>
                <span className="text-[#cbd5e1]">IMO 9384928</span>
              </div>
            </div>
          </div>

        </div>

        {/* Global Live Threats Quick Panel */}
        <div className="mt-14 bg-[#121a2a] rounded-2xl p-6 border border-[#2a3b50] shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#2a3b50] gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#dee2f4] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                Active Maritime Pollution Surveillance Incidents
              </h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Real-time satellite feeds detecting and identifying guilty ships across international waters
              </p>
            </div>
            <button
              onClick={onOpenInvestigation}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-mono-data uppercase flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <span>Open Interactive Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs">
              <thead>
                <tr className="border-b border-[#2a3b50] text-[#94a3b8] text-[11px]">
                  <th className="pb-3 font-semibold">INCIDENT ID</th>
                  <th className="pb-3 font-semibold">LOCATION</th>
                  <th className="pb-3 font-semibold">OIL TYPE</th>
                  <th className="pb-3 font-semibold">ESTIMATED SIZE</th>
                  <th className="pb-3 font-semibold">RADAR SATELLITE</th>
                  <th className="pb-3 font-semibold">SUSPECT SHIP</th>
                  <th className="pb-3 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3b50]/60 text-[#dee2f4]">
                {incidents.map((inc) => {
                  const topVessel = inc.correlatedVessels[0];
                  return (
                    <tr key={inc.id} className="hover:bg-[#162236] transition-colors group">
                      <td className="py-3.5 font-bold text-[#00f2ff]">
                        {inc.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-sans text-xs font-semibold text-[#dee2f4]">{inc.name}</div>
                        <div className="text-[10px] text-[#94a3b8]">{inc.locationName}</div>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#0b1220] border border-[#2a3b50] text-xs">
                          {inc.slickType.split(' ')[0]} {inc.slickType.split(' ')[1] || ''}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold">{inc.areaKm2} km²</div>
                        <div className="text-[10px] text-[#94a3b8]">{inc.estimatedVolumeBbl.toLocaleString()} bbl</div>
                      </td>
                      <td className="py-3.5 text-xs text-[#cbd5e1]">
                        {inc.satelliteSource.split(' ')[0]}
                      </td>
                      <td className="py-3.5">
                        {topVessel ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 text-xs font-bold">
                              {topVessel.attributionScore}% MATCH
                            </span>
                            <span className="text-xs text-[#cbd5e1] font-sans truncate max-w-[130px]">
                              {topVessel.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#94a3b8]">Analyzing...</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            onSelectIncident(inc);
                            onOpenInvestigation();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#00f2ff]/10 hover:bg-[#00f2ff] hover:text-[#002022] text-[#00f2ff] border border-[#00f2ff]/40 transition-all font-sans font-semibold text-xs cursor-pointer"
                        >
                          Investigate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
