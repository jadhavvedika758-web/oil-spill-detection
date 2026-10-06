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
import { SpillIncident, CorrelatedVessel } from '../types';

type Coordinate = [number, number];

const isCoordinate = (value: unknown): value is Coordinate =>
  Array.isArray(value) &&
  value.length === 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number' &&
  Number.isFinite(value[0]) &&
  Number.isFinite(value[1]) &&
  Math.abs(value[0]) <= 90 &&
  Math.abs(value[1]) <= 180;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const formatNumber = (value: unknown, digits = 1, fallback = 'N/A') =>
  isFiniteNumber(value) ? value.toFixed(digits) : fallback;

const createTextElement = (tag: keyof HTMLElementTagNameMap, text: string, cssText = '') => {
  const element = document.createElement(tag);
  element.textContent = text;
  element.style.cssText = cssText;
  return element;
};

const createDetailContent = (title: string, rows: Array<[string, string]>) => {
  const container = document.createElement('div');
  container.style.cssText = 'font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 190px;';
  container.appendChild(createTextElement('h4', title, 'margin: 0 0 6px; color: #0284c7; font-size: 13px; font-weight: 700;'));

  rows.forEach(([label, value]) => {
    const row = document.createElement('p');
    row.style.cssText = 'margin: 2px 0; font-size: 11px;';
    const labelElement = createTextElement('strong', `${label}: `);
    row.append(labelElement, document.createTextNode(value));
    container.appendChild(row);
  });

  return container;
};

const createCustomIcon = (color: string, size = 24, label?: string) => {
  const container = document.createElement('div');
  container.style.cssText = `position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; background: rgba(14, 19, 32, 0.85); border: 2px solid ${color}; border-radius: 50%; box-shadow: 0 0 12px ${color}88, inset 0 0 6px ${color}44;`;

  const dot = document.createElement('div');
  dot.style.cssText = `width: 6px; height: 6px; background: ${color}; border-radius: 50%;`;
  container.appendChild(dot);

  if (label) {
    container.appendChild(createTextElement('span', label, `position: absolute; bottom: -16px; white-space: nowrap; font: bold 9px monospace; color: ${color}; background: rgba(0,0,0,0.8); padding: 1px 4px; border-radius: 3px; border: 1px solid ${color}66;`));
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: container,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const createShipIcon = (headingDeg: unknown, isTarget = false) => {
  const color = isTarget ? '#ef4444' : '#00f2ff';
  const size = isTarget ? 32 : 24;
  const safeHeading = isFiniteNumber(headingDeg) ? headingDeg : 0;
  const container = document.createElement('div');
  container.style.cssText = `position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;

  const ship = document.createElement('div');
  ship.style.cssText = `transform: rotate(${safeHeading}deg); width: 0; height: 0; border-left: ${size * 0.3}px solid transparent; border-right: ${size * 0.3}px solid transparent; border-bottom: ${size * 0.8}px solid ${color}; filter: drop-shadow(0 0 6px ${color});`;
  container.appendChild(ship);

  if (isTarget) {
    const targetRing = document.createElement('div');
    targetRing.style.cssText = `position: absolute; width: ${size * 1.3}px; height: ${size * 1.3}px; border: 1px dashed #ef4444; border-radius: 50%; animation: pulseGlow 2s infinite;`;
    container.appendChild(targetRing);
  }

  return L.divIcon({
    className: 'custom-ship-marker',
    html: container,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const createVectorBadgeIcon = (symbol: string, label: string, color: string, direction: unknown) => {
  const safeDirection = isFiniteNumber(direction) ? direction : 0;
  const container = document.createElement('div');
  container.style.cssText = `background: rgba(14,19,32,0.9); border: 1px solid ${color}; border-radius: 6px; padding: 4px 8px; font: 10px monospace; color: ${color}; display: flex; align-items: center; gap: 6px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5);`;
  const arrow = createTextElement('span', symbol, `display: inline-block; transform: rotate(${safeDirection}deg);`);
  container.append(arrow, createTextElement('span', label));

  return L.divIcon({ className: 'map-vector-badge', html: container, iconAnchor: [60, 15] });
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

  const detectedCoordinate = isCoordinate(incident?.coordinates) ? incident.coordinates : null;
  const originCoordinate =
    isFiniteNumber(incident?.hindcastOrigin?.lat) && isFiniteNumber(incident?.hindcastOrigin?.lon)
      ? ([incident.hindcastOrigin.lat, incident.hindcastOrigin.lon] as Coordinate)
      : null;

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const center: Coordinate = detectedCoordinate && originCoordinate
      ? [(detectedCoordinate[0] + originCoordinate[0]) / 2, (detectedCoordinate[1] + originCoordinate[1]) / 2]
      : detectedCoordinate || originCoordinate || [0, 0];

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: detectedCoordinate || originCoordinate ? 10 : 2,
      zoomControl: false,
      attributionControl: false,
    });

    // OpenStreetMap standard tiles with visible attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

    if (!detectedCoordinate && !originCoordinate) return;

    const [detectedLat, detectedLon] = detectedCoordinate || originCoordinate!;
    const originLat = originCoordinate?.[0];
    const originLon = originCoordinate?.[1];
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
      satRect.bindTooltip(createDetailContent('SAR Swath Frame', [
        ['Satellite', incident.satelliteSource || 'Unavailable'],
        ['Polarization', incident.sarPolarization || 'Unavailable'],
      ]), {
        className: 'custom-leaflet-tooltip',
        sticky: true,
      });
      groups.satelliteFootprint.addLayer(satRect);
    }

    // 2. OIL SLICK DETECTION LAYER (Polygon + Centroid)
    if (layers.oilSlick) {
      const progress = Math.min(1, Math.max(0, timelineProgress));
      const curSlickLat = originLat === undefined ? detectedLat : originLat + (detectedLat - originLat) * progress;
      const curSlickLon = originLon === undefined ? detectedLon : originLon + (detectedLon - originLon) * progress;
      const areaKm2 = isFiniteNumber(incident.areaKm2) && incident.areaKm2 > 0 ? incident.areaKm2 : 0;
      const slickRadiusMeters = areaKm2 > 0 ? Math.sqrt(areaKm2) * 500 * (0.4 + 0.6 * progress) : 0;

      if (slickRadiusMeters > 0) {
        const slickCircle = L.circle([curSlickLat, curSlickLon], {
          radius: slickRadiusMeters,
          color: '#ef4444',
          weight: 2,
          fillColor: '#1e293b',
          fillOpacity: 0.75,
        });

        slickCircle.bindPopup(createDetailContent(incident.name || 'Oil spill detection', [
          ['Area', `${formatNumber(incident.areaKm2)} km²`],
          ['Volume', isFiniteNumber(incident.estimatedVolumeBbl) ? `~${incident.estimatedVolumeBbl} bbl` : 'Unavailable'],
          ['Type', incident.slickType || 'Unavailable'],
          ['Radar damping', `${formatNumber(incident.radarBackscatterDb)} dB`],
        ]));
        groups.oilSlick.addLayer(slickCircle);
      }

      // Centroid marker at detection
      const slickMarker = L.marker([detectedLat, detectedLon], {
        icon: createCustomIcon('#ef4444', 22, 'DETECTION T-0'),
      });
      groups.oilSlick.addLayer(slickMarker);
    }

    // 3. SPILL ORIGIN & UNCERTAINTY ELLIPSE LAYER
    if (layers.spillOrigin && originCoordinate) {
      const uncertaintyKm = incident.hindcastOrigin.uncertaintyRadiusKm;
      
      if (isFiniteNumber(uncertaintyKm) && uncertaintyKm > 0) {
        const originEllipse = L.circle(originCoordinate, {
          radius: uncertaintyKm * 1000,
          color: '#f59e0b',
          weight: 1.5,
          dashArray: '3, 4',
          fillColor: '#f59e0b',
          fillOpacity: 0.12,
        });
        originEllipse.bindTooltip(createDetailContent('Estimated Release Origin', [
          ['Coordinates', `${formatNumber(originCoordinate[0], 4)}°N, ${formatNumber(originCoordinate[1], 4)}°E`],
          ['Time', incident.hindcastOrigin.estimatedReleaseTimeUtc || 'Unavailable'],
          ['Uncertainty', `±${formatNumber(uncertaintyKm)} km`],
        ]), { className: 'custom-leaflet-tooltip' });
        groups.spillOrigin.addLayer(originEllipse);
      }

      const originMarker = L.marker(originCoordinate, {
        icon: createCustomIcon('#f59e0b', 24, 'ORIGIN T-HINDCAST'),
      });
      groups.spillOrigin.addLayer(originMarker);
    }

    // 4. BACKWARD DRIFT RECONSTRUCTION LAYER
    if (layers.backwardDrift) {
      const waypoints = Array.isArray(driftResult?.backwardWaypoints)
        ? driftResult.backwardWaypoints.filter((waypoint) => isCoordinate([waypoint.lat, waypoint.lon]))
        : [];

      if (waypoints.length >= 2) {
        const latlngs: [number, number][] = waypoints.map((wp) => [wp.lat, wp.lon]);

        const driftLine = L.polyline(latlngs, {
          color: '#00f2ff',
          weight: 3,
          dashArray: '6, 6',
          opacity: 0.85,
        });
        driftLine.bindTooltip(createDetailContent('Lagrangian Backward Drift Path', [
          ['Distance', `${formatNumber(incident.hindcastOrigin.driftDistanceNm)} NM`],
          ['Elapsed', `${formatNumber(incident.hindcastOrigin.elapsedHours)} hours`],
          ['Heading', isFiniteNumber(driftResult?.driftVectorBearingDeg) ? `${driftResult.driftVectorBearingDeg}°` : 'Unavailable'],
        ]), { sticky: true });
        groups.backwardDrift.addLayer(driftLine);

        waypoints.forEach((wp, idx) => {
          if (idx > 0 && idx < waypoints.length - 1) {
            groups.backwardDrift.addLayer(L.circleMarker([wp.lat, wp.lon], {
              radius: 4, color: '#00f2ff', fillColor: '#0e1320', fillOpacity: 1, weight: 2,
            }));
          }
        });
      }
    }

    // 5. FORWARD DRIFT FORECAST LAYER
    if (layers.forwardDrift && Array.isArray(driftResult?.forwardWaypoints)) {
      const forwardWaypoints = driftResult.forwardWaypoints.filter((waypoint) => isCoordinate([waypoint.lat, waypoint.lon]));
      if (forwardWaypoints.length > 0) {
        const fwdLatlngs: [number, number][] = [
          [detectedLat, detectedLon],
          ...forwardWaypoints.map((wp) => [wp.lat, wp.lon] as [number, number]),
        ];
        const fwdLine = L.polyline(fwdLatlngs, {
          color: '#a855f7',
          weight: 2,
          dashArray: '3, 6',
          opacity: 0.7,
        });
        fwdLine.bindTooltip(createDetailContent('Forward Drift Forecast', [['Status', 'Available forecast waypoints']]));
        groups.forwardDrift.addLayer(fwdLine);
      }
    }

    // 6. METOCEAN WIND & CURRENT VECTORS
    if (layers.windVector || layers.oceanCurrents) {
      const midLat = originLat === undefined ? detectedLat : (detectedLat + originLat) / 2;
      const midLon = originLon === undefined ? detectedLon : (detectedLon + originLon) / 2;

      if (layers.windVector && isFiniteNumber(incident.metocean?.windSpeedKts) && isFiniteNumber(incident.metocean?.windDirectionDeg)) {
        const windMarker = L.marker([midLat, midLon], {
          icon: createVectorBadgeIcon('↓', `WIND: ${incident.metocean.windSpeedKts} kts @ ${incident.metocean.windDirectionDeg}°`, '#38bdf8', incident.metocean.windDirectionDeg),
        });
        groups.windVector.addLayer(windMarker);
      }

      if (layers.oceanCurrents && isFiniteNumber(incident.metocean?.surfaceCurrentSpeedMs) && isFiniteNumber(incident.metocean?.surfaceCurrentDirDeg)) {
        const currentMarker = L.marker([midLat - 0.04, midLon], {
          icon: createVectorBadgeIcon('↑', `CURRENT: ${incident.metocean.surfaceCurrentSpeedMs} m/s @ ${incident.metocean.surfaceCurrentDirDeg}°`, '#10b981', incident.metocean.surfaceCurrentDirDeg),
        });
        groups.oceanCurrents.addLayer(currentMarker);
      }
    }

    // 7. INVESTIGATION ZONE (Corridor buffer)
    if (layers.investigationZone && originCoordinate && isFiniteNumber(incident.hindcastOrigin.uncertaintyRadiusKm) && incident.hindcastOrigin.uncertaintyRadiusKm > 0) {
      const zoneCircle = L.circle(originCoordinate, {
        radius: incident.hindcastOrigin.uncertaintyRadiusKm * 1000,
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
      const vessels = Array.isArray(incident.correlatedVessels) ? incident.correlatedVessels : [];
      vessels.forEach((vessel) => {
        const isTopTarget = isFiniteNumber(vessel.attributionScore) && vessel.attributionScore >= 85;
        const isSelected = selectedVessel?.id === vessel.id;

        // Calculate vessel position at timelineProgress
        const track = Array.isArray(vessel.trackCoordinates)
          ? vessel.trackCoordinates.filter((point) => isCoordinate([point.lat, point.lon]))
          : [];
        if (track.length === 0) return;

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

          trackLine.bindTooltip(createDetailContent(vessel.name || 'Unnamed vessel', [
            ['Type', vessel.vesselType || 'Unavailable'],
            ['Correlation', isFiniteNumber(vessel.attributionScore) ? `${vessel.attributionScore}%` : 'Unavailable'],
          ]));
          groups.aisTrajectories.addLayer(trackLine);
        }

        if (layers.highCorrelationTrack && isTopTarget && track.length >= 2) {
          groups.highCorrelationTrack.addLayer(L.polyline(track.map((point) => [point.lat, point.lon] as [number, number]), {
            color: '#ef4444', weight: 5, opacity: 0.35,
          }));
        }

        // Draw Vessel Marker
        if (layers.aisVessels) {
          const vesselMarker = L.marker([vLat, vLon], {
            icon: createShipIcon(vHeading, isTopTarget),
          });

          vesselMarker.on('click', () => {
            onSelectVessel(vessel);
          });

          vesselMarker.bindPopup(createDetailContent(vessel.name || 'Unnamed vessel', [
            ['Flag', vessel.flagCode || 'Unavailable'],
            ['MMSI', vessel.mmsi || 'Unavailable'],
            ['IMO', vessel.imo || 'Unavailable'],
            ['Type', vessel.vesselType || 'Unavailable'],
            ['Speed', `${formatNumber(vSpeed)} kts`],
            ['Draft', `${formatNumber(vessel.draftM)} m`],
            ['Proximity at origin', `${formatNumber(vessel.distanceAtOriginNm, 2)} NM`],
            ['Correlation score', isFiniteNumber(vessel.attributionScore) ? `${vessel.attributionScore}%` : 'Unavailable'],
          ]));

          groups.aisVessels.addLayer(vesselMarker);
        }
      });
    }

  }, [incident, layers, selectedVessel, timelineProgress]);

  // Recenter Map to incident
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const center: Coordinate = detectedCoordinate && originCoordinate
      ? [(detectedCoordinate[0] + originCoordinate[0]) / 2, (detectedCoordinate[1] + originCoordinate[1]) / 2]
      : detectedCoordinate || originCoordinate || [0, 0];
    mapInstanceRef.current.setView(center, detectedCoordinate || originCoordinate ? 10 : 2, { animate: true });
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
        <span className="text-[#b9cacb]">{incident.locationName || 'Location unavailable'}</span>
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
            <span className="text-[10px] text-[#849495]">OpenStreetMap</span>
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
              { key: 'highCorrelationTrack', label: 'High-Correlation Track Highlight', color: '#ef4444' },
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
          <span className="text-[#b9cacb]">Hindcast Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff]" />
          <span className="text-[#b9cacb]">Top Suspect Vessel</span>
        </div>
      </div>

      {!detectedCoordinate && !originCoordinate && (
        <div className="absolute inset-0 z-[401] pointer-events-none flex items-center justify-center p-6">
          <div className="max-w-sm rounded-lg border border-[#3a494b] bg-[#0e1320]/95 px-4 py-3 text-center text-xs font-mono-data text-[#b9cacb] shadow-xl">
            Geospatial overlays are unavailable until the incident includes valid coordinates.
          </div>
        </div>
      )}

    </div>
  );
};
