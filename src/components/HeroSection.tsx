import React, { useState, useEffect } from 'react';
import { Rocket, Compass, Shield, Radio, Activity, Eye, Zap, ArrowUpRight } from 'lucide-react';
import { SpillIncident } from '../types';

interface HeroSectionProps {
  onLaunchInvestigation: () => void;
  onExploreDemo: () => void;
  incidents: SpillIncident[];
  selectedIncident: SpillIncident;
  onSelectIncident: (inc: SpillIncident) => void;
  onReplayIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchInvestigation,
  onExploreDemo,
  incidents,
  selectedIncident,
  onSelectIncident,
  onReplayIntro,
}) => {

  const [telemetry, setTelemetry] = useState({
    lat: 56.4182,
    lon: 3.2241,
    orbitSync: 99.8,
    dataRate: 4.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        lat: Number((56.4182 + (Math.random() - 0.5) * 0.002).toFixed(4)),
        lon: Number((3.2241 + (Math.random() - 0.5) * 0.002).toFixed(4)),
        orbitSync: Number((99.7 + Math.random() * 0.2).toFixed(1)),
        dataRate: Number((4.15 + Math.random() * 0.1).toFixed(2)),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-10 py-16 lg:py-24 overflow-hidden">
      {/* Dynamic Command Center Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0e1320] via-[#0e1320] to-[#1a1f2d] opacity-85 mix-blend-overlay"></div>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB01SUzOQQISyh0AQq1Tf_vxWtqOCJupi5cfXBPSJ0gYimNY11yUjrZKiMFWFM5dQQ3Ud_lR-7K5p514zqaga0MFbyJ6ylFd5IKGdf2ZsaxLIor22dxYlHUZPbU-wBj0U22GFhtg5_T2P_3nAWNZok-vexR8729LEV5KUbkerIkW7DoRElJgGygiJB82Mf2rJ8KYg53XXxxvDkV_3u8APeh8Wemsd-ingSeQZkSDuxUPEf2snNzkoY"
          alt="High-tech command center surveillance background"
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1320] via-transparent to-[#0e1320]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1320] via-transparent to-[#0e1320]"></div>
      </div>

      {/* Hero Central Elevated Glass Box */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 glass-panel-elevated p-6 sm:p-10 lg:p-12 rounded-xl ambient-shadow backdrop-blur-xl border-t border-t-[#00f2ff]/40">
        
        {/* Active Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse"></span>
          <span className="font-mono-data text-[11px] text-[#00f2ff] uppercase tracking-widest font-semibold">
            Global Surveillance Active
          </span>
        </div>

        {/* Display Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-bold text-[#dee2f4] uppercase tracking-tight max-w-4xl drop-shadow-xl leading-tight sm:leading-[56px] font-sans">
            <>
              OILTRACE AI: See the spill.<br />
              <span className="text-[#00f2ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.4)]">Trace the drift.</span><br />
              Identify the vessel.
            </>
        </h1>

        {/* Lead Description */}
        <p className="text-base sm:text-lg text-[#b9cacb] max-w-2xl leading-relaxed font-sans font-normal">
          AI-powered satellite intelligence for marine oil-spill detection, drift reconstruction and evidence-based vessel attribution. Engineered for high-stakes maritime surveillance.
        </p>

        {/* Interactive Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 w-full sm:w-auto justify-center">
          <button
            onClick={onLaunchInvestigation}
            className="btn-primary px-8 py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 group w-full sm:w-auto min-w-[240px] cursor-pointer shadow-lg font-bold"
          >
            <Rocket className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 text-[#002022]" />
            <span>Launch Investigation</span>
          </button>

          <button
            onClick={onExploreDemo}
            className="btn-ghost px-8 py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 group w-full sm:w-auto min-w-[240px] bg-[#0e1320]/80 border border-[#3a494b] backdrop-blur-sm cursor-pointer hover:border-[#00f2ff]"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform text-[#00f2ff]" />
            <span>Explore Demo</span>
          </button>

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="px-4 py-4 rounded-xl text-xs sm:text-sm font-mono-data uppercase tracking-wider flex items-center justify-center gap-2 bg-[#121927]/80 hover:bg-[#1a263c] border border-[#2a3b50] hover:border-[#00f2ff]/50 text-[#94a3b8] hover:text-[#00f2ff] transition-all cursor-pointer shadow-md"
              title="Replay the high-tech satellite boot animation"
            >
              <Zap className="w-4 h-4 text-[#00f2ff]" />
              <span>Replay Intro</span>
            </button>
          )}
        </div>

        {/* Quick Incidents Selector Bar */}
        <div className="w-full pt-4 mt-2">
          <div className="text-[11px] font-mono-data text-[#849495] uppercase tracking-wider mb-2.5 flex items-center justify-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00f2ff] animate-pulse" />
            <span>Select an active oil spill case to inspect:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {incidents.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-data transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                      : 'bg-[#1a1f2d] text-[#b9cacb] border border-[#3a494b] hover:border-[#849495]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${inc.priority === 'CRITICAL' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{inc.name.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="text-[10px] opacity-70">({inc.areaKm2}km² · {inc.confidence}% match)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Data Ticker (Exact styling as in mockup) */}
        <div className="w-full mt-6 pt-5 border-t border-[#3a494b]/50 flex flex-wrap justify-between items-center font-mono-data text-[11px] text-[#849495] opacity-80 uppercase tracking-widest gap-2">
          <span>SYS.LAT: {telemetry.lat}° N</span>
          <span>SYS.LON: {telemetry.lon}° E</span>
          <span>ORBIT_SYNC: {telemetry.orbitSync}%</span>
          <span>DAT_RATE: {telemetry.dataRate} TB/s</span>
          <span className="text-[#00f2ff] font-semibold">SEC_CLR: TIER-1 DEFENSE</span>
        </div>
      </div>
    </section>
  );
};
