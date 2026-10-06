import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  Upload, 
  Crosshair, 
  Droplet, 
  Wind, 
  Ship, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Eye,
  Layers,
  Compass,
  Zap,
  Activity,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { SpillIncident, CorrelatedVessel, MetoceanData } from '../types';
import { runDeterministicDriftModel } from '../services/driftModel';
import { rankVesselsByAttribution } from '../services/aisCorrelationEngine';

interface SimulationStudioProps {
  onInjectCustomIncident: (newIncident: SpillIncident) => void;
  onOpenInvestigation: () => void;
}

export const SimulationStudio: React.FC<SimulationStudioProps> = ({
  onInjectCustomIncident,
  onOpenInvestigation,
}) => {
  // Preset scenario configurations
  const [selectedPreset, setSelectedPreset] = useState<'NORTH_SEA' | 'MALACCA' | 'HORMUZ' | 'GOM' | 'CUSTOM'>('NORTH_SEA');
  
  // Custom scenario form state
  const [formData, setFormData] = useState({
    name: 'North Sea Bravo Sector Slick #9042',
    locationName: 'North Sea EEZ (56.41° N, 3.22° E)',
    lat: 56.418,
    lon: 3.224,
    slickType: 'Crude Oil (API 32°)' as const,
    volumeBbl: 3820,
    areaKm2: 44.8,
    windSpeedKts: 21.4,
    windDirDeg: 310,
    currentSpeedMs: 0.94,
    currentDirDeg: 135,
    elapsedHours: 10.4,
    vesselName: 'MT Stena Nautica',
    vesselMmsi: '235081944',
    vesselFlag: 'United Kingdom',
  });

  // Simulated Result State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<SpillIncident | null>(null);

  // Apply preset values
  const handlePresetSelect = (presetKey: 'NORTH_SEA' | 'MALACCA' | 'HORMUZ' | 'GOM' | 'CUSTOM') => {
    setSelectedPreset(presetKey);
    if (presetKey === 'NORTH_SEA') {
      setFormData({
        name: 'North Sea Bravo Sector Slick #9042',
        locationName: 'North Sea EEZ (56.41° N, 3.22° E)',
        lat: 56.418,
        lon: 3.224,
        slickType: 'Crude Oil (API 32°)',
        volumeBbl: 3820,
        areaKm2: 44.8,
        windSpeedKts: 21.4,
        windDirDeg: 310,
        currentSpeedMs: 0.94,
        currentDirDeg: 135,
        elapsedHours: 10.4,
        vesselName: 'MT Stena Nautica',
        vesselMmsi: '235081944',
        vesselFlag: 'United Kingdom',
      });
    } else if (presetKey === 'MALACCA') {
      setFormData({
        name: 'Malacca Strait Tanker Route Slick #9038',
        locationName: 'Malacca Chokepoint (2.18° N, 102.14° E)',
        lat: 2.185,
        lon: 102.142,
        slickType: 'Heavy Fuel Oil (HFO)',
        volumeBbl: 2150,
        areaKm2: 32.5,
        windSpeedKts: 12.8,
        windDirDeg: 220,
        currentSpeedMs: 0.65,
        currentDirDeg: 118,
        elapsedHours: 8.5,
        vesselName: 'MV Orient Sapphire',
        vesselMmsi: '563098210',
        vesselFlag: 'Singapore',
      });
    } else if (presetKey === 'HORMUZ') {
      setFormData({
        name: 'Strait of Hormuz Outbound #9031',
        locationName: 'Strait of Hormuz (26.34° N, 56.12° E)',
        lat: 26.341,
        lon: 56.128,
        slickType: 'Crude Oil (API 32°)',
        volumeBbl: 5400,
        areaKm2: 58.2,
        windSpeedKts: 16.2,
        windDirDeg: 340,
        currentSpeedMs: 0.82,
        currentDirDeg: 160,
        elapsedHours: 12.0,
        vesselName: 'MT Persian Vanguard',
        vesselMmsi: '422019482',
        vesselFlag: 'Panama',
      });
    } else if (presetKey === 'GOM') {
      setFormData({
        name: 'Gulf of Mexico Deepwater Deep #9024',
        locationName: 'Gulf of Mexico Block 42 (28.12° N, -89.45° W)',
        lat: 28.124,
        lon: -89.451,
        slickType: 'Condensate Light Oil',
        volumeBbl: 1850,
        areaKm2: 24.1,
        windSpeedKts: 14.5,
        windDirDeg: 140,
        currentSpeedMs: 1.15,
        currentDirDeg: 310,
        elapsedHours: 6.8,
        vesselName: 'OSV Pelican Leader',
        vesselMmsi: '367489201',
        vesselFlag: 'United States',
      });
    }
  };

  // Run Real Lagrangian Hindcast & AIS Correlation Engine
  const handleExecuteSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const metocean: MetoceanData = {
        windSpeedKts: formData.windSpeedKts,
        windDirectionDeg: formData.windDirDeg,
        surfaceCurrentSpeedMs: formData.currentSpeedMs,
        surfaceCurrentDirDeg: formData.currentDirDeg,
        seaSurfaceTempC: 12.4,
        waveHeightM: 2.1,
      };

      // 1. Calculate coupled Lagrangian Hindcast & Forecast
      const driftResult = runDeterministicDriftModel(
        formData.lat,
        formData.lon,
        new Date().toISOString(),
        metocean,
        formData.elapsedHours,
        24.0,
        0.032
      );

      // 2. Generate candidate fleet tracks around calculated origin
      const rawCandidates: CorrelatedVessel[] = [
        {
          id: 'SIM-VSL-01',
          name: formData.vesselName,
          mmsi: formData.vesselMmsi,
          imo: '9482910',
          callsign: 'V7SIM1',
          flag: formData.vesselFlag,
          flagCode: formData.vesselFlag.slice(0, 2).toUpperCase(),
          vesselType: 'Crude Oil Tanker',
          lengthM: 245,
          beamM: 42,
          speedKnots: 11.2,
          courseOverGround: 135,
          draftM: 14.8,
          draftChangeM: -0.65,
          distanceAtOriginNm: 0.35,
          timeDeviationMinutes: 4.5,
          attributionScore: 94.2,
          aisStatus: 'ANOMALOUS_BLACKOUT',
          ownerCompany: 'Oceanic Transport Holdings',
          registeredPort: 'Monrovia',
          destination: 'Rotterdam Europort',
          eta: new Date(Date.now() + 86400000).toISOString(),
          suspectedAction: 'Liquid hydrocarbon discharge matching slick origin point and volume.',
          trackCoordinates: [
            { lat: driftResult.originLat - 0.04, lon: driftResult.originLon - 0.05, timeUtc: '07:30', speedKts: 13.8, courseDeg: 135 },
            { lat: driftResult.originLat + 0.003, lon: driftResult.originLon + 0.002, timeUtc: driftResult.estimatedReleaseTimeUtc, speedKts: 8.4, courseDeg: 135 },
            { lat: formData.lat + 0.02, lon: formData.lon + 0.02, timeUtc: '18:40', speedKts: 11.2, courseDeg: 135 },
          ],
        },
        {
          id: 'SIM-VSL-02',
          name: 'MV Nordic Carrier',
          mmsi: '211849302',
          imo: '9301928',
          callsign: 'DFNC',
          flag: 'Germany',
          flagCode: 'DE',
          vesselType: 'Container Ship',
          lengthM: 290,
          beamM: 32,
          speedKnots: 18.4,
          courseOverGround: 310,
          draftM: 11.2,
          draftChangeM: 0.0,
          distanceAtOriginNm: 5.2,
          timeDeviationMinutes: 45.0,
          attributionScore: 18.4,
          aisStatus: 'NORMAL',
          ownerCompany: 'Hanseatic Line AG',
          registeredPort: 'Hamburg',
          destination: 'Hamburg Terminal',
          eta: new Date(Date.now() + 43200000).toISOString(),
          suspectedAction: 'Standard commercial container transit in northbound traffic lane.',
          trackCoordinates: [
            { lat: driftResult.originLat + 0.06, lon: driftResult.originLon + 0.08, timeUtc: '07:30', speedKts: 18.4, courseDeg: 310 },
            { lat: driftResult.originLat + 0.04, lon: driftResult.originLon + 0.05, timeUtc: '08:15', speedKts: 18.2, courseDeg: 310 },
          ],
        },
      ];

      // 3. Score and rank candidate fleet
      const correlatedFleet = rankVesselsByAttribution(rawCandidates, driftResult);

      const newIncident: SpillIncident = {
        id: `OT-SIM-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        locationName: formData.locationName,
        coordinates: [formData.lat, formData.lon],
        areaKm2: formData.areaKm2,
        estimatedVolumeBbl: formData.volumeBbl,
        slickType: formData.slickType,
        confidence: 96.4,
        biogenicConfidence: 2.1,
        satelliteSource: 'Sentinel-1A SAR (Simulated Test Run)',
        sarPolarization: 'VV + VH',
        detectedAt: new Date().toISOString(),
        radarBackscatterDb: -18.7,
        radarDampingRatio: 8.9,
        thicknessMicrons: 4.2,
        status: 'UNDER_INVESTIGATION',
        priority: 'HIGH',
        notes: `Simulated scenario generated via Simulation Studio. Metocean hindcast matches ${formData.elapsedHours}h drift.`,
        metocean: metocean,
        hindcastOrigin: {
          lat: driftResult.originLat,
          lon: driftResult.originLon,
          estimatedReleaseTimeUtc: driftResult.estimatedReleaseTimeUtc,
          elapsedHours: formData.elapsedHours,
          driftDistanceNm: driftResult.driftDistanceNm,
          uncertaintyRadiusKm: driftResult.uncertaintyRadiusKm,
        },
        driftResult: driftResult,
        correlatedVessels: correlatedFleet,
      };

      setSimulatedResult(newIncident);
      setIsSimulating(false);
    }, 500);
  };

  const handleLaunchInvestigation = () => {
    if (simulatedResult) {
      onInjectCustomIncident(simulatedResult);
      onOpenInvestigation();
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-10 bg-[#0e1320] text-[#dee2f4] space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#3a494b] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00f2ff]/30 bg-[#00f2ff]/10 text-xs font-mono-data text-[#00f2ff] uppercase tracking-wider mb-2 font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Hydrodynamic Lagrangian Drift Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#dee2f4]">
            Incident Simulation & Metocean Drift Injector
          </h1>
          <p className="text-sm text-[#b9cacb] mt-1 max-w-3xl">
            Simulate custom oil spill scenarios by adjusting ocean currents, wind leeway vectors, and candidate vessel tracks.
          </p>
        </div>

        <button
          onClick={handleExecuteSimulation}
          disabled={isSimulating}
          className="btn-primary px-5 py-2.5 rounded-lg text-xs font-mono-data font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        >
          <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'RUNNING LAGRANGIAN HINDCAST...' : 'EXECUTE SIMULATION MODEL'}</span>
        </button>
      </div>

      {/* Preset Scenarios Selector */}
      <div>
        <h2 className="text-xs font-mono-data text-[#849495] uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#00f2ff]" />
          CHOOSE SCENARIO BENCHMARK
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'NORTH_SEA', name: 'North Sea EEZ', loc: '56.41° N, 3.22° E', type: 'Crude Oil', wind: '21.4 kts NW' },
            { key: 'MALACCA', name: 'Malacca TSS', loc: '2.18° N, 102.14° E', type: 'Heavy Fuel Oil', wind: '12.8 kts SW' },
            { key: 'HORMUZ', name: 'Strait of Hormuz', loc: '26.34° N, 56.12° E', type: 'Crude Oil', wind: '16.2 kts NNW' },
            { key: 'GOM', name: 'Gulf of Mexico', loc: '28.12° N, -89.45° W', type: 'Condensate', wind: '14.5 kts SE' },
          ].map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePresetSelect(preset.key as any)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedPreset === preset.key
                  ? 'bg-[#1a2336] border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                  : 'bg-[#121a2a] border-[#3a494b] hover:border-[#00f2ff]/40'
              }`}
            >
              <div className="text-xs font-mono-data text-[#00f2ff] font-bold">{preset.name}</div>
              <div className="text-xs text-[#849495] mt-1">{preset.loc}</div>
              <div className="text-[11px] font-mono-data text-[#b9cacb] mt-2 pt-2 border-t border-[#3a494b]/60">
                {preset.type} • {preset.wind}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Form Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metocean & Geospatial Parameters (7 Cols) */}
        <div className="lg:col-span-7 glass-panel-elevated rounded-xl p-5 sm:p-6 border border-[#3a494b] space-y-5">
          <h3 className="text-xs font-mono-data font-bold text-[#00f2ff] uppercase flex items-center gap-2 pb-3 border-b border-[#3a494b]">
            <Compass className="w-4 h-4" />
            1. Metocean Environmental Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono-data text-[#849495] block mb-1">
                WIND SPEED: <b className="text-white">{formData.windSpeedKts} kts</b>
              </label>
              <input
                type="range"
                min="2"
                max="45"
                step="0.5"
                value={formData.windSpeedKts}
                onChange={(e) => setFormData({ ...formData, windSpeedKts: parseFloat(e.target.value) })}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#00f2ff] border border-[#3a494b]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#849495] block mb-1">
                WIND DIRECTION: <b className="text-white">{formData.windDirDeg}°</b>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={formData.windDirDeg}
                onChange={(e) => setFormData({ ...formData, windDirDeg: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#00f2ff] border border-[#3a494b]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#849495] block mb-1">
                OCEAN CURRENT VELOCITY: <b className="text-white">{formData.currentSpeedMs} m/s</b>
              </label>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.05"
                value={formData.currentSpeedMs}
                onChange={(e) => setFormData({ ...formData, currentSpeedMs: parseFloat(e.target.value) })}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#10b981] border border-[#3a494b]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#849495] block mb-1">
                OCEAN CURRENT DIRECTION: <b className="text-white">{formData.currentDirDeg}°</b>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={formData.currentDirDeg}
                onChange={(e) => setFormData({ ...formData, currentDirDeg: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#10b981] border border-[#3a494b]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#849495] block mb-1">
                HINDCAST LOOKBACK: <b className="text-white">{formData.elapsedHours} hours</b>
              </label>
              <input
                type="range"
                min="2"
                max="36"
                step="0.5"
                value={formData.elapsedHours}
                onChange={(e) => setFormData({ ...formData, elapsedHours: parseFloat(e.target.value) })}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#f59e0b] border border-[#3a494b]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#849495] block mb-1">
                SPILL AREA: <b className="text-white">{formData.areaKm2} km²</b>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={formData.areaKm2}
                onChange={(e) => setFormData({ ...formData, areaKm2: parseFloat(e.target.value) })}
                className="w-full h-2 bg-[#0e1320] rounded-lg appearance-none cursor-pointer accent-[#ef4444] border border-[#3a494b]"
              />
            </div>
          </div>

          <h3 className="text-xs font-mono-data font-bold text-[#00f2ff] uppercase flex items-center gap-2 pt-3 pb-3 border-b border-t border-[#3a494b]">
            <Ship className="w-4 h-4" />
            2. Suspect Vessel Target
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono-data text-[#849495]">VESSEL NAME</label>
              <input
                type="text"
                value={formData.vesselName}
                onChange={(e) => setFormData({ ...formData, vesselName: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-[#0e1320] border border-[#3a494b] text-xs font-mono-data mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-data text-[#849495]">MMSI</label>
              <input
                type="text"
                value={formData.vesselMmsi}
                onChange={(e) => setFormData({ ...formData, vesselMmsi: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-[#0e1320] border border-[#3a494b] text-xs font-mono-data mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-data text-[#849495]">FLAG STATE</label>
              <input
                type="text"
                value={formData.vesselFlag}
                onChange={(e) => setFormData({ ...formData, vesselFlag: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-[#0e1320] border border-[#3a494b] text-xs font-mono-data mt-1"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Drift Output & Action (5 Cols) */}
        <div className="lg:col-span-5 glass-panel-elevated rounded-xl p-5 sm:p-6 border border-[#3a494b] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#3a494b]">
            <span className="text-xs font-mono-data font-bold text-[#00f2ff] uppercase">
              Lagrangian Drift Model Output
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0e1320] border border-[#3a494b] text-[10px] font-mono-data text-emerald-400 font-bold">
              PHYSICS SOLVER READY
            </span>
          </div>

          {simulatedResult ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#0e1320] border border-[#00f2ff]/40 space-y-3">
                <div className="text-[10px] font-mono-data text-[#00f2ff] font-bold uppercase">
                  ESTIMATED REVERSE RELEASE ORIGIN
                </div>
                <div className="text-xl font-bold font-mono-data text-white">
                  {simulatedResult.hindcastOrigin.lat.toFixed(4)}°N, {simulatedResult.hindcastOrigin.lon.toFixed(4)}°E
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-data text-[#849495]">
                  <div>Drift Distance: <b className="text-white">{simulatedResult.hindcastOrigin.driftDistanceNm} NM</b></div>
                  <div>Elapsed Time: <b className="text-white">{simulatedResult.hindcastOrigin.elapsedHours} hrs</b></div>
                  <div>Drift Heading: <b className="text-white">{simulatedResult.driftResult?.driftVectorBearingDeg || 135}°</b></div>
                  <div>Uncertainty: <b className="text-white">±{simulatedResult.hindcastOrigin.uncertaintyRadiusKm} km</b></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141c2c] border border-[#3a494b] space-y-2">
                <div className="text-[10px] font-mono-data text-[#ef4444] font-bold uppercase">
                  CORRELATED SUSPECT ATTRIBUTION
                </div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>{simulatedResult.correlatedVessels[0]?.name}</span>
                  <span className="text-emerald-400 font-mono-data font-bold">
                    {simulatedResult.correlatedVessels[0]?.attributionScore}% Score
                  </span>
                </div>
                <p className="text-xs text-[#849495]">
                  AIS track intersects origin coordinates within {simulatedResult.correlatedVessels[0]?.distanceAtOriginNm} NM.
                </p>
              </div>

              <button
                onClick={handleLaunchInvestigation}
                className="w-full btn-primary p-3 rounded-lg text-xs font-mono-data font-bold flex items-center justify-center gap-2"
              >
                <span>OPEN SCENARIO IN INVESTIGATION THEATER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#3a494b] rounded-xl space-y-3">
              <Compass className="w-10 h-10 text-[#849495] animate-pulse" />
              <p className="text-xs text-[#849495] font-mono-data">
                Adjust sliders and click "EXECUTE SIMULATION MODEL" to calculate backward trajectory and vessel correlation scores.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
