import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Satellite, 
  Cpu, 
  Wind, 
  Compass, 
  Ship, 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  X, 
  ArrowRight,
  Zap,
  Activity,
  AlertCircle
} from 'lucide-react';
import { SpillIncident, CorrelatedVessel } from '../types';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: SpillIncident;
  onCompleteDemo: () => void;
  onOpenReport: () => void;
}

interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  status: 'pending' | 'running' | 'completed';
  telemetry: string;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  incident,
  onCompleteDemo,
  onOpenReport,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const steps: DemoStep[] = [
    {
      id: 1,
      title: 'STEP 01: SATELLITE INGESTION',
      subtitle: 'Downlinking Sentinel-1A SAR C-Band Level-1 GRD Frame',
      icon: Satellite,
      status: currentStepIndex === 0 ? 'running' : currentStepIndex > 0 ? 'completed' : 'pending',
      telemetry: 'Acquiring VV+VH dual-pol 10m spatial resolution imagery over North Sea Sector 4.',
    },
    {
      id: 2,
      title: 'STEP 02: COMPUTER VISION & SPECKLE FILTERING',
      subtitle: 'Enhanced Lee Filter (7x7) + Multi-Scale U-Net Convolution',
      icon: Cpu,
      status: currentStepIndex === 1 ? 'running' : currentStepIndex > 1 ? 'completed' : 'pending',
      telemetry: 'Inverting Bragg wave damping. Mineral oil backscatter depression: -18.7 dB.',
    },
    {
      id: 3,
      title: 'STEP 03: SPILL CHARACTERISATION',
      subtitle: 'Geometric Boundary Contours & Hydrocarbon Classification',
      icon: Activity,
      status: currentStepIndex === 2 ? 'running' : currentStepIndex > 2 ? 'completed' : 'pending',
      telemetry: `Calculated area: ${incident?.areaKm2 || 0} km² | Estimated Volume: ${incident?.estimatedVolumeBbl || 0} bbl | Biogenic algae false-positive ruled out (2.1%).`,
    },
    {
      id: 4,
      title: 'STEP 04: ENVIRONMENTAL FUSION',
      subtitle: 'Coupling Metocean Wind & Surface Ocean Velocity Fields',
      icon: Wind,
      status: currentStepIndex === 3 ? 'running' : currentStepIndex > 3 ? 'completed' : 'pending',
      telemetry: `ECMWF ERA5 21.4 kts NW Wind + CMEMS 0.94 m/s SE Surface Current assimilated.`,
    },
    {
      id: 5,
      title: 'STEP 05: DRIFT RECONSTRUCTION (HINDCAST)',
      subtitle: 'Deterministic Reverse Lagrangian Particle Tracking',
      icon: Compass,
      status: currentStepIndex === 4 ? 'running' : currentStepIndex > 4 ? 'completed' : 'pending',
      telemetry: `Plume tracked 15.6 NM back to probable release origin at ${incident?.hindcastOrigin?.lat || 0}°N, ${incident?.hindcastOrigin?.lon || 0}°E (T-10.4h at 08:15 UTC).`,
    },
    {
      id: 6,
      title: 'STEP 06: AIS TRAJECTORY CORRELATION',
      subtitle: 'Spatial-Temporal Kinematic Filtering Across Fleet',
      icon: Ship,
      status: currentStepIndex === 5 ? 'running' : currentStepIndex > 5 ? 'completed' : 'pending',
      telemetry: `Correlating 10 candidate vessel tracks against 8 km search envelope and release window.`,
    },
    {
      id: 7,
      title: 'STEP 07: EXPLAINABLE VESSEL RANKING',
      subtitle: 'Multi-Factor Attribution Score Formulation',
      icon: ShieldAlert,
      status: currentStepIndex === 6 ? 'running' : currentStepIndex > 6 ? 'completed' : 'pending',
      telemetry: `MT Stena Nautica flagged with 94.2% correlation (0.28 NM at origin + 0.65m draft drop anomaly).`,
    },
    {
      id: 8,
      title: 'STEP 08: AI INVESTIGATION DOSSIER',
      subtitle: 'Automated Admiralty Forensic Brief & Chain of Custody',
      icon: FileText,
      status: currentStepIndex === 7 ? 'running' : currentStepIndex > 7 ? 'completed' : 'pending',
      telemetry: `MARPOL Annex I evidentiary package generated with SHA256 cryptographic proof hash.`,
    },
  ];

  // Pipeline Stepper Timer (Advances every 3.2 seconds or fast-forward)
  useEffect(() => {
    if (!isOpen || !isPlaying || isCompleted) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        setIsPlaying(false);
        onCompleteDemo();
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStepIndex, isCompleted]);

  if (!isOpen) return null;

  const topVessel = incident.correlatedVessels[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-elevated rounded-2xl border border-[#00f2ff]/40 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,242,255,0.2)] text-[#dee2f4]">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#3a494b]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-xs font-mono-data text-[#00f2ff] uppercase font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>SIH26143 Automated End-to-End Judge Demo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#dee2f4]">
              Autonomous Satellite-to-Vessel Attribution Pipeline
            </h2>
            <p className="text-xs text-[#b9cacb] mt-1">
              Executing complete automated investigation workflow for incident <b className="text-[#00f2ff]">{incident.id}</b>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#141c2c] text-[#849495] hover:text-[#dee2f4] hover:bg-[#1a2336] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Status Pill */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-data">
            <span className="text-[#00f2ff] font-bold">
              STATUS: {isCompleted ? 'INVESTIGATION COMPLETE' : steps[currentStepIndex].title}
            </span>
            <span className="text-[#849495]">
              STEP {Math.min(steps.length, currentStepIndex + 1)} OF {steps.length} ({Math.round(((currentStepIndex + (isCompleted ? 1 : 0)) / steps.length) * 100)}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#0e1320] border border-[#3a494b] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00f2ff] to-[#10b981] transition-all duration-500 rounded-full"
              style={{ width: `${((currentStepIndex + (isCompleted ? 1 : 0)) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Pipeline Step List */}
        {!isCompleted ? (
          <div className="space-y-3 py-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = step.status === 'running';
              const isPast = step.status === 'completed';

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isCurrent
                      ? 'bg-[#1a2336] border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.25)]'
                      : isPast
                      ? 'bg-[#101726]/60 border-emerald-500/40 text-[#849495]'
                      : 'bg-[#0e1320]/40 border-[#3a494b]/40 opacity-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isCurrent
                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] animate-pulse'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-[#1a2336] text-[#849495]'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-mono-data font-bold ${isCurrent ? 'text-[#00f2ff]' : isPast ? 'text-[#dee2f4]' : 'text-[#849495]'}`}>
                        {step.title}
                      </h4>
                      <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 animate-pulse'
                          : isPast
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-[#0e1320] text-[#849495]'
                      }`}>
                        {isCurrent ? 'PROCESSING...' : isPast ? 'VERIFIED' : 'QUEUED'}
                      </span>
                    </div>
                    <p className="text-xs text-[#dee2f4] mt-0.5">{step.subtitle}</p>
                    <p className="text-[11px] font-mono-data text-[#849495] mt-1">{step.telemetry}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Final Investigation Complete Scorecard */
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121c2e] to-[#0a101d] border border-[#00f2ff]/50 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3a494b]">
                <div>
                  <span className="text-xs font-mono-data text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    INVESTIGATION PIPELINE COMPLETE
                  </span>
                  <h3 className="text-xl font-bold text-[#dee2f4] mt-1">
                    Forensic Attribution Findings & Scorecard
                  </h3>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-[#0e1320] border border-[#3a494b] text-xs font-mono-data text-[#00f2ff]">
                  ID: {incident.id}
                </div>
              </div>

              {/* 7 Key Judge Demo Verification Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0e1320] border border-[#3a494b]">
                  <div className="text-[10px] font-mono-data text-[#849495]">DETECTION CONFIDENCE</div>
                  <div className="text-xl font-bold font-mono-data text-emerald-400 mt-1">{incident.confidence}%</div>
                  <div className="text-[10px] font-mono-data text-[#849495] mt-0.5">Sentinel-1A SAR</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1320] border border-[#3a494b]">
                  <div className="text-[10px] font-mono-data text-[#849495]">ESTIMATED SPILL AREA</div>
                  <div className="text-xl font-bold font-mono-data text-[#00f2ff] mt-1">{incident.areaKm2} <span className="text-xs text-[#dee2f4]">km²</span></div>
                  <div className="text-[10px] font-mono-data text-[#849495] mt-0.5">~{incident.estimatedVolumeBbl} bbl</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1320] border border-[#3a494b]">
                  <div className="text-[10px] font-mono-data text-[#849495]">ESTIMATED ORIGIN</div>
                  <div className="text-sm font-bold font-mono-data text-[#f59e0b] mt-1">
                    {incident.hindcastOrigin.lat}°N, {incident.hindcastOrigin.lon}°E
                  </div>
                  <div className="text-[10px] font-mono-data text-[#849495] mt-0.5">T-10.4h at 08:15 UTC</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1320] border border-[#3a494b]">
                  <div className="text-[10px] font-mono-data text-[#849495]">VESSELS ANALYSED</div>
                  <div className="text-xl font-bold font-mono-data text-[#dee2f4] mt-1">{incident.correlatedVessels.length}</div>
                  <div className="text-[10px] font-mono-data text-[#849495] mt-0.5">AIS Telemetry Cross-Match</div>
                </div>
              </div>

              {/* Top Flagged Suspect Banner */}
              {topVessel && (
                <div className="p-4 rounded-xl bg-[#1a2336] border border-[#ef4444]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#ef4444]/20 text-[#ef4444]">
                      <Ship className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono-data text-[#ef4444] font-bold uppercase">
                        TOP CORRELATED VESSEL (HIGHEST INVESTIGATIVE RELEVANCE)
                      </div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{topVessel.name}</span>
                        <span className="text-xs font-mono-data text-[#849495] font-normal">
                          (MMSI: {topVessel.mmsi} | Flag: {topVessel.flag})
                        </span>
                      </h4>
                      <p className="text-xs text-[#b9cacb] mt-0.5">
                        Proximity at origin: <b className="text-white">{topVessel.distanceAtOriginNm} NM</b> | Time delta: <b className="text-white">{topVessel.timeDeviationMinutes} min</b> | Draft change: <b className="text-[#ef4444]">{topVessel.draftChangeM}m</b>
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <div className="text-2xl font-bold font-mono-data text-emerald-400">
                      {topVessel.attributionScore}%
                    </div>
                    <div className="text-[10px] font-mono-data text-[#849495]">Attribution Score</div>
                  </div>
                </div>
              )}

              {/* Mandatory Legal / Scientific Disclaimer */}
              <div className="p-3 rounded-lg bg-[#0e1320] border border-[#3a494b] text-[11px] font-mono-data text-[#849495] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>
                  <b>IMPORTANT NOTICE:</b> Correlation score represents investigative relevance, not proof of responsibility. Forensic findings are prepared for IMO / Flag State review.
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#3a494b]">
          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-lg bg-[#1a2336] text-[#dee2f4] border border-[#3a494b] hover:border-[#00f2ff] text-xs font-mono-data font-bold flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'PAUSE PIPELINE' : 'RESUME'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentStepIndex(steps.length - 1);
                    setIsCompleted(true);
                    setIsPlaying(false);
                    onCompleteDemo();
                  }}
                  className="px-3 py-2 rounded-lg bg-[#141c2c] text-[#849495] hover:text-[#dee2f4] text-xs font-mono-data"
                >
                  Skip to Results
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsCompleted(false);
                  setIsPlaying(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#1a2336] text-[#dee2f4] border border-[#3a494b] hover:border-[#00f2ff] text-xs font-mono-data font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RE-RUN JUDGE DEMO</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isCompleted && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="btn-primary px-5 py-2.5 rounded-lg text-xs font-mono-data font-bold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>GENERATE INVESTIGATION REPORT</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#141c2c] text-[#849495] hover:text-[#dee2f4] text-xs font-mono-data"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
