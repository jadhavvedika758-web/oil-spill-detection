import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Radio, 
  Server, 
  Cpu, 
  Wifi, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { SATELLITE_MISSIONS } from '../data/mockIncidents';

export const SystemStatus: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([

    '[22:54:12 UTC] SENTINEL-1A downlinked 4.2 GB Level-1 GRD SAR frame for North Sea Sector 4.',
    '[22:54:18 UTC] Neural YOLO-SAR v9 detected mineral oil backscatter depression (-18.7 dB).',
    '[22:54:23 UTC] Lagrangian hydrodynamic hindcast initiated with ECMWF ERA5 wind boundary layer.',
    '[22:54:30 UTC] AIS cross-reference query completed: 3 candidate vessels correlated.',
    '[22:54:36 UTC] Vessel MT Stena Nautica flagged for 18-minute AIS transponder suppression window.',
    '[22:54:44 UTC] Evidentiary hash SHA256:7f8a9e4be38c71b402ad generated and logged to immutable chain.',
  ]);

  useEffect(() => {
    const simulatedEvents = [
      'TerraSAR-X High-Res Spotlight pass scheduled over Malacca Strait in 18 minutes.',
      'Svalbard Ground Station antenna #4 tracking Sentinel-1C pass at 82° elevation.',
      'Stokes drift surface vector updated: current velocity 0.94 m/s @ 135° SE.',
      'COSMO-SkyMed X-band SAR downlink initiated via Maspalomas oceanic dish array.',
      'Dark fleet AIS anomaly scanner processed 1,420 vessel tracks in past 60 seconds.',
    ];

    const interval = setInterval(() => {
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const timestamp = new Date().toTimeString().slice(0, 8);
      setLogs((prev) => [`[${timestamp} UTC] ${randomEvent}`, ...prev.slice(0, 7)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-10 bg-[#0e1320] text-[#dee2f4] space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#3a494b] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00f2ff]/30 bg-[#00f2ff]/10 text-xs font-mono-data text-[#00f2ff] uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Constellation & Neural Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#dee2f4]">
            Satellite Constellation & Core Grid Status
          </h1>
          <p className="text-sm text-[#b9cacb] mt-1">
            Real-time orbital tracking, ground station antenna arrays, and deep-learning inference pipeline telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono-data flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>

      {/* Satellite Missions Cards */}
      <div>
        <h2 className="text-xs font-mono-data text-[#849495] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Satellite className="w-4 h-4 text-[#00f2ff]" />
          ACTIVE ORBITAL SAR CONSTELLATION ASSETS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SATELLITE_MISSIONS.map((sat) => (
            <div
              key={sat.id}
              className="glass-panel-elevated rounded-xl p-5 border border-[#3a494b] hover:border-[#00f2ff]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono-data font-bold text-[#00f2ff]">{sat.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data font-bold ${
                    sat.downlinkStatus === 'LOCKED' || sat.downlinkStatus === 'DOWNLINKING'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#1a1f2d] text-[#b9cacb] border border-[#3a494b]'
                  }`}>
                    {sat.downlinkStatus}
                  </span>
                </div>

                <div className="text-base font-bold text-[#dee2f4]">{sat.name}</div>
                <div className="text-xs text-[#849495] font-mono-data">{sat.constellation} · {sat.orbitType}</div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono-data">
                  <div className="p-2 rounded bg-[#0e1320] border border-[#3a494b]/40">
                    <div className="text-[9px] text-[#849495]">SENSOR</div>
                    <div className="text-[#dee2f4] font-semibold">{sat.sensor}</div>
                  </div>
                  <div className="p-2 rounded bg-[#0e1320] border border-[#3a494b]/40">
                    <div className="text-[9px] text-[#849495]">RESOLUTION</div>
                    <div className="text-[#00f2ff] font-semibold">{sat.resolutionM}m Spotlight</div>
                  </div>
                  <div className="p-2 rounded bg-[#0e1320] border border-[#3a494b]/40">
                    <div className="text-[9px] text-[#849495]">SWATH WIDTH</div>
                    <div className="text-[#dee2f4]">{sat.swathWidthKm} km</div>
                  </div>
                  <div className="p-2 rounded bg-[#0e1320] border border-[#3a494b]/40">
                    <div className="text-[9px] text-[#849495]">ALTITUDE</div>
                    <div className="text-[#dee2f4]">{sat.altitudeKm} km</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#3a494b]/60 flex items-center justify-between text-xs font-mono-data">
                <span className="text-[#849495]">NEXT PASS TARGET:</span>
                <span className="text-amber-300 font-medium">{sat.nextPassTarget} (in {sat.nextPassInMinutes}m)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Neural Models + Ground Stations + Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Neural Inference Pipeline */}
        <div className="glass-panel-elevated rounded-xl p-5 border border-[#3a494b] space-y-4">
          <div className="flex items-center justify-between border-b border-[#3a494b] pb-3">
            <h3 className="text-xs font-mono-data text-[#dee2f4] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00f2ff]" />
              NEURAL INFERENCE ENGINES
            </h3>
            <span className="text-[10px] font-mono-data text-emerald-400">ONLINE</span>
          </div>

          <div className="space-y-3 font-mono-data text-xs">
            <div className="p-3 rounded bg-[#1a1f2d] border border-[#3a494b]">
              <div className="flex justify-between font-semibold">
                <span className="text-[#dee2f4]">YOLO-SAR v9 (Slick Detector)</span>
                <span className="text-[#00f2ff]">18.2 ms</span>
              </div>
              <div className="text-[10px] text-[#849495] mt-1">Multi-polarization Bragg wave damping classifier</div>
              <div className="w-full bg-[#0e1320] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00f2ff] h-full w-[99%]" />
              </div>
            </div>

            <div className="p-3 rounded bg-[#1a1f2d] border border-[#3a494b]">
              <div className="flex justify-between font-semibold">
                <span className="text-[#dee2f4]">Lagrangian Hydro-Drift v4</span>
                <span className="text-[#00f2ff]">32.6 ms</span>
              </div>
              <div className="text-[10px] text-[#849495] mt-1">Stokes drift & Ekman layer hydrodynamic physics</div>
              <div className="w-full bg-[#0e1320] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00fa91] h-full w-[100%]" />
              </div>
            </div>

            <div className="p-3 rounded bg-[#1a1f2d] border border-[#3a494b]">
              <div className="flex justify-between font-semibold">
                <span className="text-[#dee2f4]">AIS Kinematic Graph v3</span>
                <span className="text-[#00f2ff]">14.1 ms</span>
              </div>
              <div className="text-[10px] text-[#849495] mt-1">Spatiotemporal correlation & dark-fleet anomaly mesh</div>
              <div className="w-full bg-[#0e1320] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#adc7ff] h-full w-[99%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Ground Station Antennas */}
        <div className="glass-panel-elevated rounded-xl p-5 border border-[#3a494b] space-y-4">
          <div className="flex items-center justify-between border-b border-[#3a494b] pb-3">
            <h3 className="text-xs font-mono-data text-[#dee2f4] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00f2ff]" />
              POLAR DOWNLINK GROUND STATIONS
            </h3>
            <span className="text-[10px] font-mono-data text-emerald-400">5/5 SYNCED</span>
          </div>

          <div className="space-y-2.5 font-mono-data text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#1a1f2d] border border-[#3a494b]/60">
              <div>
                <div className="font-semibold text-[#dee2f4]">Svalbard (SGS) Norway</div>
                <div className="text-[10px] text-[#849495]">78.22° N · 15.40° E (Antenna Array A1-A4)</div>
              </div>
              <span className="text-emerald-400 font-bold">LOCKED</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#1a1f2d] border border-[#3a494b]/60">
              <div>
                <div className="font-semibold text-[#dee2f4]">Kiruna Polar Ground Station</div>
                <div className="text-[10px] text-[#849495]">67.85° N · 20.96° E (X-Band Feed)</div>
              </div>
              <span className="text-emerald-400 font-bold">LOCKED</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#1a1f2d] border border-[#3a494b]/60">
              <div>
                <div className="font-semibold text-[#dee2f4]">Inuvik Station Canada</div>
                <div className="text-[10px] text-[#849495]">68.36° N · 133.72° W (C-Band Feed)</div>
              </div>
              <span className="text-emerald-400 font-bold">LOCKED</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#1a1f2d] border border-[#3a494b]/60">
              <div>
                <div className="font-semibold text-[#dee2f4]">Maspalomas Oceanic Facility</div>
                <div className="text-[10px] text-[#849495]">27.76° N · 15.63° W (Atlantic Sector)</div>
              </div>
              <span className="text-emerald-400 font-bold">LOCKED</span>
            </div>
          </div>
        </div>

        {/* Live Terminal Telemetry Feed */}
        <div className="glass-panel-elevated rounded-xl p-5 border border-[#3a494b] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#3a494b] pb-3 mb-3">
              <h3 className="text-xs font-mono-data text-[#00f2ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                SURVEILLANCE RADAR EVENT STREAM
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
            </div>

            <div className="p-3 rounded-lg bg-[#090e1a] border border-[#3a494b] font-mono-data text-[11px] space-y-2 h-56 overflow-y-auto leading-relaxed text-[#b9cacb]">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-[#00f2ff] select-none">&gt;</span>
                  <span className={index === 0 ? 'text-[#dee2f4] font-semibold' : 'text-[#849495]'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-[10px] font-mono-data text-[#849495]">
            <span>ENCRYPTION: AES-256-GCM</span>
            <span className="text-emerald-400">CLEARANCE: TIER-1 DEFENSE</span>
          </div>
        </div>

      </div>

    </div>
  );
};
