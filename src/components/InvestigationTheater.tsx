import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Layers, 
  Wind, 
  Compass, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Ship, 
  Droplet, 
  Clock, 
  Activity, 
  Sliders, 
  Info,
  ChevronDown,
  Navigation,
  Anchor,
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { SpillIncident, CorrelatedVessel } from '../types';
import { InvestigationMap } from './InvestigationMap';
import { JudgeDemoModal } from './JudgeDemoModal';
import { InvestigationReportModal } from './InvestigationReportModal';

interface InvestigationTheaterProps {
  incidents: SpillIncident[];
  selectedIncident: SpillIncident;
  onSelectIncident: (inc: SpillIncident) => void;
  onGenerateDossier: (incident: SpillIncident, vessel: CorrelatedVessel) => void;
  onOpenCopilot?: (initialQuery?: string) => void;
}

export const InvestigationTheater: React.FC<InvestigationTheaterProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onGenerateDossier,
  onOpenCopilot,
}) => {
  // Timeline scrubber progress (0.0 = Spill origin T-hindcast, 1.0 = Detected time T-0)
  const [timelineProgress, setTimelineProgress] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Selected Vessel in attribution list
  const [selectedVessel, setSelectedVessel] = useState<CorrelatedVessel>(
    selectedIncident.correlatedVessels[0] || null
  );

  // Modals & Drawers
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isExplainDrawerOpen, setIsExplainDrawerOpen] = useState(false);

  // Live AI Copilot Quick Query inside theater
  const [quickQuery, setQuickQuery] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isQueryingAi, setIsQueryingAi] = useState(false);

  // Live investigation state feedback
  const [investigationStatus, setInvestigationStatus] = useState<'READY' | 'ANALYSING' | 'CORRELATED'>('CORRELATED');

  // Update selected vessel when incident changes
  useEffect(() => {
    if (selectedIncident.correlatedVessels.length > 0) {
      setSelectedVessel(selectedIncident.correlatedVessels[0]);
    }
    setTimelineProgress(1.0);
    setQuickAnswer(null);
  }, [selectedIncident]);

  // Timeline animation loop
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying) {
      const step = () => {
        setTimelineProgress((prev) => {
          if (prev >= 1.0) {
            return 0.0;
          }
          return Math.min(1.0, prev + 0.004);
        });
        animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  // Handle live quick AI Copilot query
  const handleAskCopilot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickQuery.trim()) return;

    setIsQueryingAi(true);
    try {
      const res = await fetch('/api/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: quickQuery,
          incident: selectedIncident,
          vessel: selectedVessel,
        }),
      });
      const data = await res.json();
      setQuickAnswer(data.reply);
    } catch (err) {
      setQuickAnswer(`[OILTRACE TACTICAL RESPONSE]: Correlated suspect ${selectedVessel?.name || 'MT Stena Nautica'} holds highest investigative correlation (${selectedVessel?.attributionScore || 94.2}%) based on backward Lagrangian trajectory and 0.65m draft reduction.`);
    } finally {
      setIsQueryingAi(false);
    }
  };

  // Pre-fill quick query buttons
  const handleQuickQuestion = (q: string) => {
    setQuickQuery(q);
    // Auto execute
    setIsQueryingAi(true);
    fetch('/api/copilot/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: q,
        incident: selectedIncident,
        vessel: selectedVessel,
      }),
    })
      .then((r) => r.json())
      .then((d) => setQuickAnswer(d.reply))
      .catch(() => setQuickAnswer(`[OILTRACE AI]: Top correlated candidate is MT Stena Nautica with 94.2% score.`))
      .finally(() => setIsQueryingAi(false));
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8 bg-[#0e1320] text-[#dee2f4] space-y-6">
      
      {/* Top Banner: Incident Selector & Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-[#3a494b]">
        
        {/* Incident Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="px-2.5 py-0.5 rounded bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 text-xs font-mono-data font-bold">
              SIH26143 ACTIVE INVESTIGATION THEATER
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono-data font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              DEMO MODE ACTIVE
            </span>
            <span className="text-xs font-mono-data text-[#849495]">
              ID: {selectedIncident.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#dee2f4] flex items-center gap-3">
            <span>{selectedIncident.name}</span>
            <span className="text-sm font-normal font-mono-data text-[#849495]">
              ({selectedIncident.coordinates[0]}°N, {selectedIncident.coordinates[1]}°E)
            </span>
          </h1>
        </div>

        {/* Action Buttons: Run Full Investigation, Run Judge Demo, Generate Report */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Incident Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedIncident.id}
              onChange={(e) => {
                const found = incidents.find((i) => i.id === e.target.value);
                if (found) onSelectIncident(found);
              }}
              className="bg-[#1a2336] text-xs font-mono-data text-[#dee2f4] border border-[#3a494b] rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#00f2ff] appearance-none"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id}: {inc.name} ({inc.areaKm2} km²)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#849495] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* RUN JUDGE DEMO BUTTON (Primary Highlight) */}
          <button
            onClick={() => setIsJudgeDemoOpen(true)}
            className="btn-primary px-4 py-2 rounded-lg text-xs font-mono-data font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)] animate-pulse"
          >
            <Zap className="w-4 h-4" />
            <span>RUN FULL INVESTIGATION / JUDGE DEMO</span>
          </button>

          {/* GENERATE REPORT BUTTON */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#141c2c] text-[#00f2ff] border border-[#00f2ff]/40 hover:bg-[#00f2ff]/10 text-xs font-mono-data font-bold flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>GENERATE REPORT</span>
          </button>

        </div>
      </div>

      {/* Main Grid Workspace: Left Map & Scrubber (8 Cols) | Right Evidence & Ranking (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Geospatial Theater (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Leaflet Mission Control Map */}
          <InvestigationMap
            incident={selectedIncident}
            selectedVessel={selectedVessel}
            onSelectVessel={(vessel) => {
              setSelectedVessel(vessel);
              setIsExplainDrawerOpen(true);
            }}
            timelineProgress={timelineProgress}
          />

          {/* Timeline & Hindcast Drift Scrubber Controls */}
          <div className="p-4 rounded-xl glass-panel-elevated border border-[#3a494b] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-lg text-xs font-mono-data font-bold flex items-center gap-1.5 transition-all ${
                    isPlaying
                      ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                      : 'bg-[#00f2ff] text-[#002022] shadow-[0_0_12px_rgba(0,242,255,0.4)]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'PAUSE HINDCAST' : 'PLAY DRIFT TIMELINE'}</span>
                </button>

                <button
                  onClick={() => setTimelineProgress(1.0)}
                  className="p-2 rounded-lg bg-[#141c2c] text-[#849495] hover:text-[#dee2f4] border border-[#3a494b] text-xs font-mono-data flex items-center gap-1 transition-all"
                  title="Jump to Satellite Detection"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET T-0</span>
                </button>
              </div>

              {/* Scrubber Time Indicators */}
              <div className="text-right text-xs font-mono-data">
                <div className="text-[#00f2ff] font-bold">
                  {timelineProgress === 0.0
                    ? `T-10.4h RELEASE ORIGIN (${selectedIncident.hindcastOrigin.estimatedReleaseTimeUtc})`
                    : timelineProgress === 1.0
                    ? `T-0 SATELLITE DETECTION (${selectedIncident.detectedAt})`
                    : `HINDCAST STEP: ${(timelineProgress * 100).toFixed(0)}% PROGRESS`}
                </div>
                <div className="text-[#849495] text-[10px]">
                  Drift: {selectedIncident.hindcastOrigin.driftDistanceNm} NM along bearing {selectedIncident.driftResult?.driftVectorBearingDeg || 135}° SE
                </div>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={timelineProgress}
                onChange={(e) => {
                  setTimelineProgress(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#00f2ff] border border-[#3a494b]"
              />
              <div className="flex items-center justify-between text-[10px] font-mono-data text-[#849495]">
                <span>← T-10.4h Spill Origin ({selectedIncident.hindcastOrigin.lat}°N, {selectedIncident.hindcastOrigin.lon}°E)</span>
                <span>T-0 Sentinel-1A Acquisition ({selectedIncident.coordinates[0]}°N, {selectedIncident.coordinates[1]}°E) →</span>
              </div>
            </div>
          </div>

          {/* Quick AI Forensic Copilot Bar */}
          <div className="p-4 rounded-xl bg-[#121a2a] border border-[#3a494b] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-data font-bold text-[#00f2ff]">
                <Sparkles className="w-4 h-4 text-[#00f2ff]" />
                <span>AI MARITIME FORENSIC COPILOT</span>
              </div>
              <span className="text-[10px] font-mono-data text-[#849495]">Gemini / Heuristic Grounded</span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                'Why is MT Stena Nautica ranked #1?',
                'Explain drift hindcast calculation',
                'What are the key uncertainties in this case?',
                'Are biogenic algae slicks ruled out?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-2.5 py-1 rounded bg-[#0e1320] text-[#b9cacb] hover:text-[#00f2ff] hover:border-[#00f2ff]/40 border border-[#3a494b] text-[11px] font-mono-data transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleAskCopilot} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask investigation copilot about drift, AIS correlation, or evidence..."
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0e1320] border border-[#3a494b] text-xs font-mono-data text-[#dee2f4] focus:outline-none focus:border-[#00f2ff]"
              />
              <button
                type="submit"
                disabled={isQueryingAi}
                className="px-4 py-2 rounded-lg bg-[#00f2ff] text-[#002022] text-xs font-mono-data font-bold hover:bg-[#00f2ff]/90 transition-all flex items-center gap-1.5"
              >
                {isQueryingAi ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>ASK</span>
              </button>
            </form>

            {/* Copilot Answer Display */}
            {quickAnswer && (
              <div className="p-3 rounded-lg bg-[#0e1320] border border-[#00f2ff]/40 text-xs font-mono-data text-[#dee2f4] space-y-1 animate-fade-in">
                <div className="flex items-center justify-between text-[#00f2ff] text-[10px] font-bold">
                  <span>COPILOT INVESTIGATION INTELLIGENCE</span>
                  <button onClick={() => setQuickAnswer(null)} className="text-[#849495] hover:text-white">✕</button>
                </div>
                <p className="leading-relaxed">{quickAnswer}</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Correlated Fleet Ranking & Why Flagged Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Correlated Vessel Ranking Table */}
          <div className="glass-panel-elevated rounded-xl p-4 sm:p-5 border border-[#3a494b] space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#3a494b]">
              <div>
                <span className="text-xs font-mono-data font-bold text-[#00f2ff] uppercase flex items-center gap-1.5">
                  <Ship className="w-4 h-4" />
                  CORRELATED VESSEL RANKING
                </span>
                <p className="text-[10px] font-mono-data text-[#849495] mt-0.5">
                  Spatial-Temporal Kinematic Attribution
                </p>
              </div>

              <span className="px-2 py-0.5 rounded bg-[#141c2c] text-xs font-mono-data text-[#dee2f4] border border-[#3a494b]">
                {selectedIncident.correlatedVessels.length} VESSELS
              </span>
            </div>

            {/* Vessel List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {selectedIncident.correlatedVessels.map((vessel, index) => {
                const isSelected = selectedVessel?.id === vessel.id;
                const isTopRank = index === 0;
                const scoreColor =
                  vessel.attributionScore >= 80
                    ? 'text-emerald-400'
                    : vessel.attributionScore >= 50
                    ? 'text-amber-400'
                    : 'text-[#849495]';

                return (
                  <div
                    key={vessel.id}
                    onClick={() => {
                      setSelectedVessel(vessel);
                      setIsExplainDrawerOpen(true);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a2336] border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                        : 'bg-[#101726] border-[#3a494b] hover:border-[#00f2ff]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono-data font-bold ${
                          isTopRank ? 'bg-[#ef4444] text-white' : 'bg-[#141c2c] text-[#849495]'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{vessel.name}</span>
                            <span className="text-[10px] font-mono-data text-[#849495]">({vessel.flagCode})</span>
                          </h4>
                          <p className="text-[10px] font-mono-data text-[#849495]">
                            {vessel.vesselType} • MMSI {vessel.mmsi}
                          </p>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className={`text-base font-bold font-mono-data ${scoreColor}`}>
                          {vessel.attributionScore}%
                        </div>
                        <div className="text-[9px] font-mono-data text-[#849495]">Correlation</div>
                      </div>
                    </div>

                    {/* Telemetry Strip & Anomaly Indicator */}
                    <div className="mt-2.5 pt-2 border-t border-[#3a494b]/60 flex items-center justify-between text-[10px] font-mono-data">
                      <span className="text-[#b9cacb]">Dist at Origin: <b className="text-white">{vessel.distanceAtOriginNm} NM</b></span>
                      {vessel.draftChangeM && (
                        <span className="text-[#ef4444] font-bold">Draft: {vessel.draftChangeM}m</span>
                      )}
                      {vessel.aisStatus === 'ANOMALOUS_BLACKOUT' && (
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          AIS GAP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div className="p-2.5 rounded-lg bg-[#0e1320] border border-[#3a494b] text-[10px] font-mono-data text-[#849495] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
              <span>Correlation score represents investigative relevance, not proof of responsibility.</span>
            </div>

          </div>

          {/* WHY WAS THIS VESSEL FLAGGED? Detail Card */}
          {selectedVessel && (
            <div className="glass-panel-elevated rounded-xl p-4 sm:p-5 border border-[#3a494b] space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#3a494b]">
                <div className="flex items-center gap-1.5 text-xs font-mono-data font-bold text-[#00f2ff]">
                  <ShieldAlert className="w-4 h-4" />
                  <span>WHY WAS {selectedVessel.name.toUpperCase()} FLAGGED?</span>
                </div>
                <span className="text-xs font-mono-data font-bold text-emerald-400">
                  {selectedVessel.attributionScore}%
                </span>
              </div>

              {/* 5-Factor Score Breakdown Progress Bars */}
              {selectedVessel.scoreBreakdown && (
                <div className="space-y-2 text-[11px] font-mono-data">
                  <div>
                    <div className="flex justify-between text-[#849495] mb-0.5">
                      <span>Spatial Origin Proximity (30% wt):</span>
                      <span className="text-[#dee2f4] font-bold">{selectedVessel.scoreBreakdown.spatialScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0e1320] overflow-hidden">
                      <div className="h-full bg-[#00f2ff] rounded-full" style={{ width: `${selectedVessel.scoreBreakdown.spatialScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#849495] mb-0.5">
                      <span>Temporal Release Coincidence (25% wt):</span>
                      <span className="text-[#dee2f4] font-bold">{selectedVessel.scoreBreakdown.temporalScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0e1320] overflow-hidden">
                      <div className="h-full bg-[#00f2ff] rounded-full" style={{ width: `${selectedVessel.scoreBreakdown.temporalScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#849495] mb-0.5">
                      <span>Trajectory & Kinematic Profile (20% wt):</span>
                      <span className="text-[#dee2f4] font-bold">{selectedVessel.scoreBreakdown.trajectoryScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0e1320] overflow-hidden">
                      <div className="h-full bg-[#00f2ff] rounded-full" style={{ width: `${selectedVessel.scoreBreakdown.trajectoryScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#849495] mb-0.5">
                      <span>Drift Hydrodynamic Compatibility (15% wt):</span>
                      <span className="text-[#dee2f4] font-bold">{selectedVessel.scoreBreakdown.driftCompatibilityScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0e1320] overflow-hidden">
                      <div className="h-full bg-[#00f2ff] rounded-full" style={{ width: `${selectedVessel.scoreBreakdown.driftCompatibilityScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#849495] mb-0.5">
                      <span>AIS Integrity & Telemetry Confidence (10% wt):</span>
                      <span className="text-[#dee2f4] font-bold">{selectedVessel.scoreBreakdown.aisConfidenceScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0e1320] overflow-hidden">
                      <div className="h-full bg-[#00f2ff] rounded-full" style={{ width: `${selectedVessel.scoreBreakdown.aisConfidenceScore}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Explainability Bullets */}
              <div className="p-3 rounded-lg bg-[#0e1320] border border-[#3a494b] space-y-1.5 text-xs">
                <div className="text-[10px] font-mono-data font-bold text-[#00f2ff] uppercase">
                  FORENSIC ATTRIBUTION RATIONALE:
                </div>
                {selectedVessel.scoreBreakdown?.explanationBullets.map((b, i) => (
                  <div key={i} className="text-[#dee2f4] flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Dossier Action Button */}
              <button
                onClick={() => onGenerateDossier(selectedIncident, selectedVessel)}
                className="w-full btn-primary p-2.5 rounded-lg text-xs font-mono-data font-bold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>EXPORT ADMIRALTY BRIEF FOR {selectedVessel.name.toUpperCase()}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Judge Demo Automated Pipeline Modal */}
      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        incident={selectedIncident}
        onCompleteDemo={() => {
          setTimelineProgress(1.0);
          setInvestigationStatus('CORRELATED');
        }}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Investigation Report Modal */}
      <InvestigationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        incident={selectedIncident}
        selectedVessel={selectedVessel}
      />

    </div>
  );
};
