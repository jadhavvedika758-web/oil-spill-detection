import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Sparkles, 
  Satellite, 
  Ship, 
  Scale 
} from 'lucide-react';
import { SpillIncident, CorrelatedVessel, IncidentDossier } from '../types';

interface CourtDossierModalProps {
  isOpen?: boolean;
  incident: SpillIncident | null;
  vessel: CorrelatedVessel | null;
  onClose: () => void;
}

export const CourtDossierModal: React.FC<CourtDossierModalProps> = ({
  isOpen = false,
  incident,
  vessel,
}) => {
  const [dossier, setDossier] = useState<IncidentDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !incident || !vessel) return;

    const fetchDossier = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/generate-court-dossier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incident, targetVessel: vessel }),
        });
        const data = await res.json();
        setDossier(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [isOpen, incident, vessel]);

  if (!isOpen || !incident || !vessel) return null;

  const handleCopy = () => {
    if (!dossier) return;
    const text = `
# OILTRACE AI - ADMIRALTY FORENSIC EVIDENCE DOSSIER
**DOSSIER ID:** ${dossier.dossierId}
**CHAIN OF CUSTODY CRYPTOGRAPHIC HASH:** ${dossier.chainOfCustodyHash}
**CASE STATUS:** ${dossier.caseStatus}
**INCIDENT ID:** ${incident.id} (${incident.name})
**LOCATION:** ${incident.locationName} (${incident.coordinates[0]}°N, ${incident.coordinates[1]}°E)
**TARGET VESSEL:** ${vessel.name} (MMSI: ${vessel.mmsi} | IMO: ${vessel.imo} | Flag: ${vessel.flag})
**ATTRIBUTION CERTAINTY SCORE:** ${dossier.confidenceScore}%

## 1. SATELLITE RADAR POLARIMETRIC EVIDENCE
- Polarimetric Contrast: ${dossier.satelliteSignatures?.polarimetricContrast}
- Slick Footprint: ${dossier.satelliteSignatures?.slickAreaExpansion}
- Layer Thickness: ${dossier.satelliteSignatures?.thicknessEstimation}

## 2. HYDRODYNAMIC LAGRANGIAN DRIFT VALIDATION
${dossier.hydrodynamicDriftValidation}

## 3. AIS KINEMATIC TRAJECTORY CORRELATION
${dossier.aisTrajectoryCorrelation}

## 4. FORMAL ADMIRALTY LEGAL OPINION
${dossier.legalConclusion}

## 5. RECOMMENDED ACTIONS
${dossier.actionItems?.map((a) => `- ${a}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#111417] border border-[#3a494b] rounded-xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#3a494b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1f2d] border border-[#00f2ff] flex items-center justify-center">
              <Scale className="w-5 h-5 text-[#00f2ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-data text-[#00f2ff] uppercase tracking-wider font-bold">
                  LEGAL EVIDENCE BRIEF FOR MARITIME POLICE & COURT
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  MARPOL ANNEX I
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#dee2f4]">
                Official Polluter Report: ${vessel.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#849495] hover:text-[#dee2f4] hover:bg-[#1a1f2d] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#00f2ff] animate-spin" />
            <p className="text-sm font-mono-data text-[#dee2f4]">
              Compiling satellite SAR polarimetric data, hydrodynamic hindcast paths, and AIS telemetry into cryptographic brief...
            </p>
          </div>
        ) : dossier ? (
          <div className="space-y-6 font-mono-data text-xs text-[#dee2f4]">
            
            {/* Top Cryptographic Header */}
            <div className="p-3.5 rounded-xl bg-[#1a1f2d] border border-[#3a494b] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[9px] text-[#849495] uppercase font-bold">CASE NUMBER</div>
                <div className="text-[#00f2ff] font-bold text-xs">{dossier.dossierId}</div>
              </div>
              <div>
                <div className="text-[9px] text-[#849495] uppercase font-bold">DIGITAL TAMPER-PROOF HASH</div>
                <div className="text-emerald-400 font-bold text-[10px] truncate">{dossier.chainOfCustodyHash}</div>
              </div>
              <div>
                <div className="text-[9px] text-[#849495] uppercase font-bold">ATTRIBUTION CERTAINTY</div>
                <div className="text-red-400 font-bold text-sm">{dossier.confidenceScore}% (MATCH CONFIRMED)</div>
              </div>
            </div>

            {/* Section 1: Satellite SAR Radar Signatures */}
            <div className="p-4 rounded-lg bg-[#0e1320] border border-[#3a494b] space-y-2">
              <h3 className="text-xs font-bold text-[#00f2ff] uppercase flex items-center gap-1.5 border-b border-[#3a494b]/60 pb-1.5">
                <Satellite className="w-3.5 h-3.5" />
                1. Satellite SAR Remote Sensing Evidence
              </h3>
              <div className="space-y-1 text-[#b9cacb] leading-relaxed">
                <div>• <strong className="text-[#dee2f4]">Polarimetric Damping:</strong> {dossier.satelliteSignatures?.polarimetricContrast}</div>
                <div>• <strong className="text-[#dee2f4]">Surface Slick Footprint:</strong> {dossier.satelliteSignatures?.slickAreaExpansion}</div>
                <div>• <strong className="text-[#dee2f4]">Optical/Radar Layer Thickness:</strong> {dossier.satelliteSignatures?.thicknessEstimation}</div>
              </div>
            </div>

            {/* Section 2: Hydrodynamic Drift Validation */}
            <div className="p-4 rounded-lg bg-[#0e1320] border border-[#3a494b] space-y-2">
              <h3 className="text-xs font-bold text-[#00f2ff] uppercase flex items-center gap-1.5 border-b border-[#3a494b]/60 pb-1.5">
                <Ship className="w-3.5 h-3.5" />
                2. Hydrodynamic Backward Particle Hindcast
              </h3>
              <p className="text-[#b9cacb] leading-relaxed">
                {dossier.hydrodynamicDriftValidation}
              </p>
            </div>

            {/* Section 3: AIS Telemetry Correlation */}
            <div className="p-4 rounded-lg bg-[#0e1320] border border-[#3a494b] space-y-2">
              <h3 className="text-xs font-bold text-[#00f2ff] uppercase flex items-center gap-1.5 border-b border-[#3a494b]/60 pb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                3. AIS Kinematic & Draft Anomaly Analysis
              </h3>
              <p className="text-[#b9cacb] leading-relaxed">
                {dossier.aisTrajectoryCorrelation}
              </p>
            </div>

            {/* Section 4: Legal Conclusion */}
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/40 space-y-2">
              <h3 className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5 border-b border-red-500/30 pb-1.5">
                <Scale className="w-3.5 h-3.5" />
                4. Admiralty Legal Opinion & Finding
              </h3>
              <p className="text-[#dee2f4] leading-relaxed font-sans text-xs">
                {dossier.legalConclusion}
              </p>
            </div>

            {/* Section 5: Action Items */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#849495] uppercase">Recommended Port State Control Actions:</div>
              <ul className="list-disc pl-5 space-y-1 text-[#b9cacb] text-xs">
                {dossier.actionItems?.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#3a494b]">
          <div className="text-[10px] font-mono-data text-[#849495]">
            CERTIFIED BY OILTRACE AI MARITIME RECONNAISSANCE ENGINE
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded bg-[#1a1f2d] hover:bg-[#252a37] text-[#dee2f4] border border-[#3a494b] font-mono-data text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Brief' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-primary px-4 py-2 rounded font-mono-data text-xs font-bold uppercase flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-[#002022]" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
