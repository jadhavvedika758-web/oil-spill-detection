import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Ship, 
  Wind, 
  Compass, 
  Crosshair, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Navigation,
  Anchor,
  Info,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SpillIncident, CorrelatedVessel, DriftWaypoint } from '../types';

// Ensure Leaflet default marker icons or custom SVGs work without 404s
const createCustomIcon = (color: string, size: number = 24, text?: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        background: rgba(14, 19, 32, 0.85);
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 12px ${color}88, inset 0 0 6px ${color}44;
        color: ${color};
        font-family: monospace;
        font-size: 10px;
        font-weight: bold;
      ">
        <div style="width: 6px; height: 6px; background: ${color}; border-radius: 50%;"></div>
        ${text ? `<span style="position: absolute; bottom: -16px; white-space: nowrap; font-size: 9px; background: rgba(0,0,0,0.8); padding: 1px 4px; border-radius: 3px; border: 1px solid ${color}66;">${text}</span>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const createShipIcon = (headingDeg: number, isTarget: boolean = false, vesselName?: string) => {
  const color = isTarget ? '#ef4444' : '#00f2ff';
  const size = isTarget ? 32 : 24;
  return L.divIcon({
    className: 'custom-ship-marker',
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(${headingDeg}deg);
          width: 0;
          height: 0;
          border-left: ${size * 0.3}px solid transparent;
          border-right: ${size * 0.3}px solid transparent;
          border-bottom: ${size * 0.8}px solid ${color};
          filter: drop-shadow(0 0 6px ${color});
        "></div>
        ${isTarget ? `<div style="position: absolute; width: ${size * 1.3}px; height: ${size * 1.3}px; border: 1px dashed #ef4444; border-radius: 50%; animation: pulseGlow 2s infinite;"></div>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

interface InvestigationMapProps {
  incident: SpillIncident;
  selectedVessel: CorrelatedVessel | null;
  onSelectVessel: (vessel: CorrelatedVessel) => void;
  timelineProgress: number; // 0.0 (origin) to 1.0 (detection)
}

export const InvestigationMap: React.FC<InvestigationMapProps> = ({
  incident,
  selectedVessel,
  onSelectVessel,
  timelineProgress,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Map layer toggle states
  const [layers, setLayers] = useState({
    satelliteFootprint: true,
    oilSlick: true,
    spillOrigin: true,
    backwardDrift: true,
    forwardDrift: true,
    oceanCurrents: true,
    windVector: true,
    aisVessels: true,
    aisTrajectories: true,
    investigationZone: true,
    highCorrelationTrack: true,
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map between slick and origin
    const centerLat = (incident.coordinates[0] + incident.hindcastOrigin.lat) / 2;
    const centerLon = (incident.coordinates[1] + incident.hindcastOrigin.lon) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLon],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter CartoDB Basemap for high-tech mission control aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Setup Layer Groups
    layerGroupsRef.current = {
      satelliteFootprint: L.layerGroup().addTo(map),
      oilSlick: L.layerGroup().addTo(map),
      spillOrigin: L.layerGroup().addTo(map),
      backwardDrift: L.layerGroup().addTo(map),
      forwardDrift: L.layerGroup().addTo(map),
      oceanCurrents: L.layerGroup().addTo(map),
      windVector: L.layerGroup().addTo(map),
      aisVessels: L.layerGroup().addTo(map),
      aisTrajectories: L.layerGroup().addTo(map),
      investigationZone: L.layerGroup().addTo(map),
      highCorrelationTrack: L.layerGroup().addTo(map),
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [incident.id]);

  // Update Layers when incident, layers, selectedVessel, or timelineProgress change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const groups = layerGroupsRef.current as Record<string, L.LayerGroup>;
    Object.values(groups).forEach((g) => {
      if (g && typeof g.clearLayers === 'function') {
        g.clearLayers();
      }
    });

    const detectedLat = incident.coordinates[0];
    const detectedLon = incident.coordinates[1];
    const originLat = incident.hindcastOrigin.lat;
    const originLon = incident.hindcastOrigin.lon;
    const driftResult = incident.driftResult;

    // 1. SATELLITE FOOTPRINT LAYER
    if (layers.satelliteFootprint) {
      const swathBounds: L.LatLngBoundsExpression = [
        [detectedLat - 0.22, detectedLon - 0.35],
        [detectedLat + 0.22, detectedLon + 0.35],
      ];
      const satRect = L.rectangle(swathBounds, {
        color: '#00f2ff',
        weight: 1,
        dashArray: '4, 6',
        fillColor: '#00f2ff',
        fillOpacity: 0.04,
      });
      satRect.bindTooltip(`<b>SAR Swath Frame:</b> ${incident.satelliteSource}<br/>Polarization: ${incident.sarPolarization}`, {
        className: 'custom-leaflet-tooltip',
        sticky: true,
      });
      groups.satelliteFootprint.addLayer(satRect);
    }

    // 2. OIL SLICK DETECTION LAYER (Polygon + Centroid)
    if (layers.oilSlick) {
      // Dynamic slick position interpolated along timeline (origin -> detected)
      const curSlickLat = originLat + (detectedLat - originLat) * timelineProgress;
      const curSlickLon = originLon + (detectedLon - originLon) * timelineProgress;
      const slickRadiusMeters = (Math.sqrt(incident.areaKm2) * 500) * (0.4 + 0.6 * timelineProgress);

      // Slick polygon simulation
      const slickCircle = L.circle([curSlickLat, curSlickLon], {
        radius: slickRadiusMeters,
        color: '#ef4444',
        weight: 2,
        fillColor: '#1e293b',
        fillOpacity: 0.75,
      });

      slickCircle.bindPopup(`
        <div style="font-family: sans-serif; color: #1e293b; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; color: #ef4444; font-weight: bold;">${incident.name}</h4>
          <p style="margin: 2px 0; font-size: 12px;"><b>Area:</b> ${incident.areaKm2} km²</p>
          <p style="margin: 2px 0; font-size: 12px;"><b>Volume:</b> ~${incident.estimatedVolumeBbl} bbl</p>
          <p style="margin: 2px 0; font-size: 12px;"><b>Type:</b> ${incident.slickType}</p>
          <p style="margin: 2px 0; font-size: 12px;"><b>Radar Damping:</b> ${incident.radarBackscatterDb} dB</p>
        </div>
      `);
      groups.oilSlick.addLayer(slickCircle);

      // Centroid marker at detection
      const slickMarker = L.marker([detectedLat, detectedLon], {
        icon: createCustomIcon('#ef4444', 22, 'DETECTION T-0'),
      });
      groups.oilSlick.addLayer(slickMarker);
    }

    // 3. SPILL ORIGIN & UNCERTAINTY ELLIPSE LAYER
    if (layers.spillOrigin) {
      const uncertaintyKm = incident.hindcastOrigin.uncertaintyRadiusKm || 2.6;
      
      // Uncertainty Ellipse
      const originEllipse = L.circle([originLat, originLon], {
        radius: uncertaintyKm * 1000,
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '3, 4',
        fillColor: '#f59e0b',
        fillOpacity: 0.12,
      });
      originEllipse.bindTooltip(`<b>Estimated Release Origin:</b><br/>${originLat.toFixed(4)}°N, ${originLon.toFixed(4)}°E<br/>Time: ${incident.hindcastOrigin.estimatedReleaseTimeUtc}<br/>Uncertainty: ±${uncertaintyKm} km`, {
        className: 'custom-leaflet-tooltip',
      });
      groups.spillOrigin.addLayer(originEllipse);

      const originMarker = L.marker([originLat, originLon], {
        icon: createCustomIcon('#f59e0b', 24, 'ORIGIN T-HINDCAST'),
      });
      groups.spillOrigin.addLayer(originMarker);
    }

    // 4. BACKWARD DRIFT RECONSTRUCTION LAYER
    if (layers.backwardDrift) {
      const waypoints = driftResult?.backwardWaypoints || [
        { lat: detectedLat, lon: detectedLon, timeUtc: incident.detectedAt },
        { lat: (detectedLat + originLat) / 2, lon: (detectedLon + originLon) / 2, timeUtc: '' },
        { lat: originLat, lon: originLon, timeUtc: incident.hindcastOrigin.estimatedReleaseTimeUtc },
      ];

      const latlngs: [number, number][] = waypoints.map((wp) => [wp.lat, wp.lon]);

      const driftLine = L.polyline(latlngs, {
        color: '#00f2ff',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.85,
      });
      driftLine.bindTooltip(`<b>Lagrangian Backward Drift Path:</b><br/>Distance: ${incident.hindcastOrigin.driftDistanceNm} NM<br/>Elapsed: ${incident.hindcastOrigin.elapsedHours} hours<br/>Heading: ${driftResult?.driftVectorBearingDeg || 135}° SE`, {
        sticky: true,
      });
      groups.backwardDrift.addLayer(driftLine);

      // Intermediate timestep dots
      waypoints.forEach((wp, idx) => {
        if (idx > 0 && idx < waypoints.length - 1) {
          const dot = L.circleMarker([wp.lat, wp.lon], {
            radius: 4,
            color: '#00f2ff',
            fillColor: '#0e1320',
            fillOpacity: 1,
            weight: 2,
          });
          groups.backwardDrift.addLayer(dot);
        }
      });
    }

    // 5. FORWARD DRIFT FORECAST LAYER
    if (layers.forwardDrift && driftResult?.forwardWaypoints) {
      const fwdLatlngs: [number, number][] = [
        [detectedLat, detectedLon],
        ...driftResult.forwardWaypoints.map((wp) => [wp.lat, wp.lon] as [number, number]),
      ];
      const fwdLine = L.polyline(fwdLatlngs, {
        color: '#a855f7',
        weight: 2,
        dashArray: '3, 6',
        opacity: 0.7,
      });
      fwdLine.bindTooltip('<b>Forward Drift Forecast (24h Coastal Spread Vector)</b>');
      groups.forwardDrift.addLayer(fwdLine);
    }

    // 6. METOCEAN WIND & CURRENT VECTORS
    if (layers.windVector || layers.oceanCurrents) {
      const midLat = (detectedLat + originLat) / 2 + 0.08;
      const midLon = (detectedLon + originLon) / 2 + 0.12;

      if (layers.windVector) {
        // Draw wind arrow indicator
        const windMarker = L.marker([midLat, midLon], {
          icon: L.divIcon({
            className: 'wind-vector-badge',
            html: `
              <div style="background: rgba(14,19,32,0.9); border: 1px solid #38bdf8; border-radius: 6px; padding: 4px 8px; font-family: monospace; font-size: 10px; color: #38bdf8; display: flex; align-items: center; gap: 6px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <span style="display: inline-block; transform: rotate(${incident.metocean.windDirectionDeg}deg);">↓</span>
                <span>WIND: ${incident.metocean.windSpeedKts} kts @ ${incident.metocean.windDirectionDeg}°</span>
              </div>
            `,
            iconAnchor: [60, 15],
          }),
        });
        groups.windVector.addLayer(windMarker);
      }

      if (layers.oceanCurrents) {
        const currentMarker = L.marker([midLat - 0.04, midLon], {
          icon: L.divIcon({
            className: 'current-vector-badge',
            html: `
              <div style="background: rgba(14,19,32,0.9); border: 1px solid #10b981; border-radius: 6px; padding: 4px 8px; font-family: monospace; font-size: 10px; color: #10b981; display: flex; align-items: center; gap: 6px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <span style="display: inline-block; transform: rotate(${incident.metocean.surfaceCurrentDirDeg}deg);">↑</span>
                <span>CURRENT: ${incident.metocean.surfaceCurrentSpeedMs} m/s @ ${incident.metocean.surfaceCurrentDirDeg}°</span>
              </div>
            `,
            iconAnchor: [60, 15],
          }),
        });
        groups.oceanCurrents.addLayer(currentMarker);
      }
    }

    // 7. INVESTIGATION ZONE (Corridor buffer)
    if (layers.investigationZone) {
      const zoneCircle = L.circle([originLat, originLon], {
        radius: 8000, // 8 km search corridor
        color: '#64748b',
        weight: 1,
        dashArray: '6, 6',
        fillColor: '#0284c7',
        fillOpacity: 0.03,
      });
      groups.investigationZone.addLayer(zoneCircle);
    }

    // 8. AIS VESSELS & TRAJECTORIES
    if (layers.aisVessels || layers.aisTrajectories) {
      incident.correlatedVessels.forEach((vessel) => {
        const isTopTarget = vessel.attributionScore >= 85;
        const isSelected = selectedVessel?.id === vessel.id;

        // Calculate vessel position at timelineProgress
        const track = vessel.trackCoordinates;
        let vLat = track[0].lat;
        let vLon = track[0].lon;
        let vSpeed = vessel.speedKnots;
        let vHeading = vessel.courseOverGround;

        if (track.length >= 2) {
          const trackIdx = Math.min(track.length - 1, Math.floor(timelineProgress * (track.length - 1)));
          const p1 = track[trackIdx];
          const p2 = track[Math.min(track.length - 1, trackIdx + 1)];
          const sub = (timelineProgress * (track.length - 1)) % 1;
          vLat = p1.lat + (p2.lat - p1.lat) * sub;
          vLon = p1.lon + (p2.lon - p1.lon) * sub;
          vSpeed = p1.speedKts;
          vHeading = p1.courseDeg;
        }

        // Draw Historical Trajectory Line
        if (layers.aisTrajectories) {
          const trackLatLngs = track.map((p) => [p.lat, p.lon] as [number, number]);
          const trackColor = isTopTarget ? '#ef4444' : isSelected ? '#f59e0b' : '#38bdf8';
          const trackLine = L.polyline(trackLatLngs, {
            color: trackColor,
            weight: isTopTarget ? 3 : isSelected ? 2.5 : 1.5,
            opacity: isTopTarget ? 0.9 : 0.6,
            dashArray: vessel.aisStatus === 'ANOMALOUS_BLACKOUT' ? '5, 5' : undefined,
          });

          trackLine.bindTooltip(`<b>${vessel.name}</b> (${vessel.vesselType})<br/>Attribution Correlation: ${vessel.attributionScore}%`);
          groups.aisTrajectories.addLayer(trackLine);
        }

        // Draw Vessel Marker
        if (layers.aisVessels) {
          const vesselMarker = L.marker([vLat, vLon], {
            icon: createShipIcon(vHeading, isTopTarget, vessel.name),
          });

          vesselMarker.on('click', () => {
            onSelectVessel(vessel);
          });

          vesselMarker.bindPopup(`
            <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 190px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <b style="color: ${isTopTarget ? '#dc2626' : '#0284c7'}; font-size: 13px;">${vessel.name}</b>
                <span style="font-size: 10px; background: #e2e8f0; padding: 1px 4px; border-radius: 3px;">${vessel.flagCode}</span>
              </div>
              <p style="margin: 2px 0; font-size: 11px;"><b>MMSI:</b> ${vessel.mmsi} | <b>IMO:</b> ${vessel.imo}</p>
              <p style="margin: 2px 0; font-size: 11px;"><b>Type:</b> ${vessel.vesselType}</p>
              <p style="margin: 2px 0; font-size: 11px;"><b>Speed:</b> ${vSpeed} kts | <b>Draft:</b> ${vessel.draftM}m</p>
              <p style="margin: 2px 0; font-size: 11px;"><b>Proximity at Origin:</b> ${vessel.distanceAtOriginNm} NM</p>
              <div style="margin-top: 6px; padding: 4px; background: ${isTopTarget ? '#fee2e2' : '#f0fdf4'}; border-radius: 4px; font-size: 11px; font-weight: bold; color: ${isTopTarget ? '#991b1b' : '#166534'};">
                Correlation Score: ${vessel.attributionScore}%
              </div>
            </div>
          `);

          groups.aisVessels.addLayer(vesselMarker);
        }
      });
    }

  }, [incident, layers, selectedVessel, timelineProgress]);

  // Recenter Map to incident
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const centerLat = (incident.coordinates[0] + incident.hindcastOrigin.lat) / 2;
    const centerLon = (incident.coordinates[1] + incident.hindcastOrigin.lon) / 2;
    mapInstanceRef.current.setView([centerLat, centerLon], 10, { animate: true });
  };

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0b1220]' : 'h-[520px] rounded-xl overflow-hidden'} border border-[#3a494b]`}>
      
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Mission Control Top Badge */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-[#0e1320]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3a494b] text-xs font-mono-data text-[#dee2f4]">
        <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
        <span className="text-[#00f2ff] font-bold">LEAFLET TACTICAL SAR GEO-ENGINE</span>
        <span className="text-[#849495]">|</span>
        <span className="text-[#b9cacb]">{incident.locationName}</span>
      </div>

      {/* Layer Toggle Floating Button */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-data font-bold transition-all ${
            showLayerMenu
              ? 'bg-[#00f2ff] text-[#002022] shadow-[0_0_15px_rgba(0,242,255,0.5)]'
              : 'bg-[#0e1320]/90 text-[#00f2ff] border border-[#3a494b] hover:border-[#00f2ff]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>LAYERS ({Object.values(layers).filter(Boolean).length}/11)</span>
        </button>

        <button
          onClick={handleRecenter}
          title="Recenter Map on Incident"
          className="p-1.5 rounded-lg bg-[#0e1320]/90 text-[#dee2f4] border border-[#3a494b] hover:text-[#00f2ff] hover:border-[#00f2ff] transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Fullscreen"
          className="p-1.5 rounded-lg bg-[#0e1320]/90 text-[#dee2f4] border border-[#3a494b] hover:text-[#00f2ff] hover:border-[#00f2ff] transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Layer Switcher Dropdown Modal */}
      {showLayerMenu && (
        <div className="absolute top-12 right-3 z-[400] w-64 bg-[#0e1320]/95 backdrop-blur-xl border border-[#3a494b] rounded-xl p-3 shadow-2xl text-xs font-mono-data space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3a494b]">
            <span className="text-[#00f2ff] font-bold uppercase">Geospatial Layers</span>
            <span className="text-[10px] text-[#849495]">CartoDB Dark</span>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {[
              { key: 'satelliteFootprint', label: 'Satellite SAR Swath', color: '#00f2ff' },
              { key: 'oilSlick', label: 'Oil Slick (Detection T-0)', color: '#ef4444' },
              { key: 'spillOrigin', label: 'Origin Uncertainty Ellipse', color: '#f59e0b' },
              { key: 'backwardDrift', label: 'Backward Drift Hindcast', color: '#00f2ff' },
              { key: 'forwardDrift', label: 'Forward Drift Forecast (24h)', color: '#a855f7' },
              { key: 'oceanCurrents', label: 'Ocean Surface Current Vector', color: '#10b981' },
              { key: 'windVector', label: 'Metocean Wind Speed & Dir', color: '#38bdf8' },
              { key: 'aisVessels', label: 'AIS Fleet Tracked Vessels', color: '#00f2ff' },
              { key: 'aisTrajectories', label: 'Historical AIS Tracks', color: '#38bdf8' },
              { key: 'investigationZone', label: 'Investigation Zone Buffer', color: '#64748b' },
            ].map(({ key, label, color }) => {
              const active = layers[key as keyof typeof layers];
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key as keyof typeof layers)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all ${
                    active ? 'bg-[#1a2336] text-[#dee2f4]' : 'text-[#849495] hover:bg-[#141b2b]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, opacity: active ? 1 : 0.4 }} />
                    <span className="text-[11px]">{label}</span>
                  </div>
                  {active ? <Eye className="w-3.5 h-3.5 text-[#00f2ff]" /> : <EyeOff className="w-3.5 h-3.5 text-[#849495]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Bottom Legend / Telemetry Strip */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#0e1320]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3a494b] flex items-center gap-4 text-[11px] font-mono-data">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-[#b9cacb]">Slick Centroid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="text-[#b9cacb]">Hindcast Origin (T-10.4h)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff]" />
          <span className="text-[#b9cacb]">Top Suspect Vessel</span>
        </div>
      </div>

    </div>
  );
};
