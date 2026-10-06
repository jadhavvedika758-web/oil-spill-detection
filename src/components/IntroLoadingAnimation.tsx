import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Satellite, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  FastForward, 
  CheckCircle2, 
  Activity,
  Terminal,
  Globe,
  Rocket,
  Shield,
  Crosshair,
  Maximize2
} from 'lucide-react';

interface IntroLoadingAnimationProps {
  onComplete: () => void;
  onTogglePlainEnglish?: () => void;
}

export const IntroLoadingAnimation: React.FC<IntroLoadingAnimationProps> = ({
  onComplete,
  onTogglePlainEnglish,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [targetLocked, setTargetLocked] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Audio synthesizer for sci-fi space sounds
  const playSound = (freq: number, type: OscillatorType = 'sine', duration = 0.08, gainVal = 0.05) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignored if user has not interacted
    }
  };

  const playWarpSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // ignore
    }
  };

  const steps = [
    { label: 'Connecting to Ocean Radar Satellites...', sub: 'Acquiring Sentinel-1 & RADARSAT Low Earth Orbits', target: 20 },
    { label: 'Scanning Ocean Sea Surface from Space...', sub: 'Detecting oily sheen damping natural ocean waves', target: 45 },
    { label: 'Rewinding Ocean Currents & Wind Vectors...', sub: 'Hydrodynamic model back-traces spill to origin point', target: 70 },
    { label: 'Tracking Vessel GPS & Tank Levels...', sub: 'Matching ship routes with nighttime dump timestamps', target: 90 },
    { label: 'Orbital Descent Synchronized', sub: 'Evidence dossier engine armed and ready for courtroom proof', target: 100 }
  ];

  const handleFinish = () => {
    setIsWarping(true);
    playWarpSound();
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading progress driver
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleFinish();
          }, 500);
          return 100;
        }

        const increment = prev < 25 ? 2.2 : prev < 60 ? 1.6 : prev < 85 ? 1.4 : 3.0;
        const nextVal = Math.min(100, prev + increment);

        // Sound trigger
        if (Math.floor(nextVal / 12) !== Math.floor(prev / 12)) {
          playSound(440 + nextVal * 7, 'sine', 0.05, 0.03);
        }

        if (nextVal >= 55 && !targetLocked) {
          setTargetLocked(true);
          playSound(1100, 'triangle', 0.15, 0.06);
        }

        // Active step
        if (nextVal < 20) setCurrentStepIndex(0);
        else if (nextVal < 45) setCurrentStepIndex(1);
        else if (nextVal < 70) setCurrentStepIndex(2);
        else if (nextVal < 90) setCurrentStepIndex(3);
        else setCurrentStepIndex(4);

        // Simulated telemetry feed
        if (Math.random() > 0.6) {
          const lat = (56.418 + (Math.random() - 0.5) * 0.05).toFixed(4);
          const lon = (3.224 + (Math.random() - 0.5) * 0.05).toFixed(4);
          const db = (-16.2 - Math.random() * 5).toFixed(1);
          setLogs((l) => [
            `ORBIT_ALT: 693km | LAT ${lat}°N LON ${lon}°E | DAMP: ${db}dB | SAT_SPEED: 7.62km/s`,
            ...l.slice(0, 4)
          ]);
        }

        return nextVal;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [soundEnabled, targetLocked]);

  // HIGH PERFORMANCE 3D SPACE & EARTH CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars pool
    const numStars = 320;
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speed: number;
    }
    const stars: Star[] = [];
    const starColors = ['#ffffff', '#00f2ff', '#adc7ff', '#74f5ff', '#d0bcff', '#00fa91'];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 1.8 + 0.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        speed: Math.random() * 1.5 + 0.8,
      });
    }

    // Shooting comets
    interface Comet {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }
    const comets: Comet[] = [];
    for (let i = 0; i < 4; i++) {
      comets.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.4,
        length: Math.random() * 100 + 60,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 0,
        active: false,
      });
    }

    // Earth state
    let earthRotation = 0;
    let satelliteAngle = 0;
    let laserPulse = 0;

    let animationRunning = true;

    const render = () => {
      if (!animationRunning) return;

      // Deep space gradient background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a1022');
      bgGrad.addColorStop(0.45, '#050914');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle glowing galactic nebula clouds
      ctx.save();
      const nebulaGrad1 = ctx.createRadialGradient(
        width * 0.25, height * 0.3, 20,
        width * 0.25, height * 0.3, width * 0.4
      );
      nebulaGrad1.addColorStop(0, 'rgba(0, 242, 255, 0.08)');
      nebulaGrad1.addColorStop(0.6, 'rgba(100, 50, 255, 0.03)');
      nebulaGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad1;
      ctx.fillRect(0, 0, width, height);

      const nebulaGrad2 = ctx.createRadialGradient(
        width * 0.75, height * 0.7, 30,
        width * 0.75, height * 0.7, width * 0.45
      );
      nebulaGrad2.addColorStop(0, 'rgba(0, 250, 145, 0.05)');
      nebulaGrad2.addColorStop(0.7, 'rgba(0, 100, 200, 0.02)');
      nebulaGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Render 3D Starfield with hyperspace acceleration warp
      const warpMult = isWarping ? 18 : 1.2;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= s.speed * warpMult;

        if (s.z <= 0) {
          s.z = 1000;
          s.x = (Math.random() - 0.5) * width * 2;
          s.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 400 / s.z;
        const px = s.x * k + width / 2;
        const py = s.y * k + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1000 - s.z) / 800);
          const starRadius = Math.max(0.6, (1 - s.z / 1000) * s.size * (isWarping ? 2.5 : 1.2));

          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha;

          if (isWarping) {
            // Draw hyperspace streak lines
            const prevK = 400 / (s.z + 40);
            const prevPx = s.x * prevK + width / 2;
            const prevPy = s.y * prevK + height / 2;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(prevPx, prevPy);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = starRadius;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, starRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Shooting comets
      if (Math.random() < 0.03) {
        const inactive = comets.find((c) => !c.active);
        if (inactive) {
          inactive.active = true;
          inactive.x = Math.random() * width * 0.8;
          inactive.y = Math.random() * height * 0.4;
          inactive.opacity = 1;
        }
      }
      comets.forEach((c) => {
        if (!c.active) return;
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        c.opacity -= 0.015;

        if (c.opacity <= 0 || c.x > width || c.y > height) {
          c.active = false;
        } else {
          ctx.save();
          ctx.beginPath();
          const tailX = c.x - Math.cos(c.angle) * c.length;
          const tailY = c.y - Math.sin(c.angle) * c.length;
          const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
          grad.addColorStop(0, 'rgba(0, 242, 255, 0)');
          grad.addColorStop(1, `rgba(255, 255, 255, ${c.opacity})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
          ctx.restore();
        }
      });

      // -------------------------------------------------------------
      // 3D ORBITING PLANET EARTH & ATMOSPHERE
      // -------------------------------------------------------------
      const earthCenterX = width / 2;
      const earthCenterY = height / 2 - 20;
      const earthRadius = Math.min(width, height) * 0.22;

      earthRotation += 0.004;
      satelliteAngle += 0.015;
      laserPulse += 0.06;

      ctx.save();

      // Atmospheric Outer Glow (Rayleigh scattering halo)
      const atmosphereGlow = ctx.createRadialGradient(
        earthCenterX, earthCenterY, earthRadius * 0.85,
        earthCenterX, earthCenterY, earthRadius * 1.35
      );
      atmosphereGlow.addColorStop(0, 'rgba(0, 242, 255, 0.4)');
      atmosphereGlow.addColorStop(0.3, 'rgba(0, 150, 255, 0.2)');
      atmosphereGlow.addColorStop(0.7, 'rgba(0, 80, 200, 0.06)');
      atmosphereGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Earth Body sphere with 3D ocean shading
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      const earthShading = ctx.createRadialGradient(
        earthCenterX - earthRadius * 0.35, earthCenterY - earthRadius * 0.35, earthRadius * 0.1,
        earthCenterX, earthCenterY, earthRadius
      );
      earthShading.addColorStop(0, '#0066aa');
      earthShading.addColorStop(0.4, '#003366');
      earthShading.addColorStop(0.8, '#00142b');
      earthShading.addColorStop(1, '#000611');
      ctx.fillStyle = earthShading;
      ctx.fill();

      // Clip inside Earth for continent wireframe / 3D lat-long lines
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.clip();

      // Latitude lines (Parallels)
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.22)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 20) {
        const yOffset = Math.sin((lat * Math.PI) / 180) * earthRadius;
        const latRadius = Math.cos((lat * Math.PI) / 180) * earthRadius;
        ctx.beginPath();
        ctx.ellipse(
          earthCenterX,
          earthCenterY + yOffset,
          latRadius,
          latRadius * 0.35,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Longitude lines (Meridians) rotating in 3D
      for (let lon = 0; lon < 360; lon += 30) {
        const curLon = ((lon + earthRotation * 180) % 360) * (Math.PI / 180);
        const xOffset = Math.cos(curLon);
        const zOffset = Math.sin(curLon);

        if (zOffset > -0.1) {
          ctx.strokeStyle = `rgba(0, 242, 255, ${0.12 + Math.max(0, zOffset) * 0.25})`;
          ctx.beginPath();
          ctx.ellipse(
            earthCenterX,
            earthCenterY,
            Math.abs(xOffset) * earthRadius,
            earthRadius,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      // Draw stylized 3D landmass dots (Continents / Shipping coasts)
      ctx.fillStyle = 'rgba(0, 250, 145, 0.55)';
      const continentPoints = [
        // Europe & North Sea
        { lat: 55, lon: 5 }, { lat: 58, lon: 2 }, { lat: 52, lon: 4 }, { lat: 60, lon: 10 }, { lat: 48, lon: -2 },
        { lat: 45, lon: 8 }, { lat: 40, lon: -4 }, { lat: 38, lon: 15 }, { lat: 64, lon: 18 }, { lat: 56, lon: 12 },
        // Asia / Malacca / Hormuz
        { lat: 25, lon: 55 }, { lat: 22, lon: 60 }, { lat: 15, lon: 75 }, { lat: 8, lon: 78 }, { lat: 2, lon: 102 },
        { lat: 5, lon: 105 }, { lat: 18, lon: 115 }, { lat: 30, lon: 122 }, { lat: 35, lon: 135 },
        // Atlantic & Americas
        { lat: 40, lon: -72 }, { lat: 30, lon: -85 }, { lat: 25, lon: -80 }, { lat: 10, lon: -70 }, { lat: -15, lon: -45 }
      ];

      continentPoints.forEach((pt) => {
        const radLat = (pt.lat * Math.PI) / 180;
        const radLon = ((pt.lon + earthRotation * 180) * Math.PI) / 180;
        
        const z = Math.cos(radLat) * Math.sin(radLon);
        if (z > 0) {
          const x = earthCenterX + Math.cos(radLat) * Math.cos(radLon) * earthRadius;
          const y = earthCenterY - Math.sin(radLat) * earthRadius * 0.95;
          ctx.beginPath();
          ctx.arc(x, y, 2.5 * z, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Target Spill Oil Slick on Ocean Surface (56.4°N, 3.2°E - North Sea)
      const targetRadLat = (56.4 * Math.PI) / 180;
      const targetRadLon = ((3.2 + earthRotation * 180) * Math.PI) / 180;
      const targetZ = Math.cos(targetRadLat) * Math.sin(targetRadLon);

      let targetScreenX = earthCenterX;
      let targetScreenY = earthCenterY;
      let targetVisible = false;

      if (targetZ > 0.05) {
        targetVisible = true;
        targetScreenX = earthCenterX + Math.cos(targetRadLat) * Math.cos(targetRadLon) * earthRadius;
        targetScreenY = earthCenterY - Math.sin(targetRadLat) * earthRadius * 0.95;

        // Glowing Oil Slick target ping ripples
        const rippleR = ((laserPulse * 25) % 35) * targetZ;
        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - rippleR / 35)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(targetScreenX, targetScreenY, rippleR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(targetScreenX, targetScreenY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // end clip Earth

      // Outer atmosphere rim highlight
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.stroke();

      // -------------------------------------------------------------
      // 3D ORBITAL SATELLITE (Sentinel-1 SAR Radar Platform)
      // -------------------------------------------------------------
      const orbitA = earthRadius * 1.55;
      const orbitB = earthRadius * 0.65;
      const satX = earthCenterX + Math.cos(satelliteAngle) * orbitA;
      const satY = earthCenterY + Math.sin(satelliteAngle) * orbitB;
      const satZ = Math.sin(satelliteAngle);

      // Draw Orbit Track Ellipse
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(earthCenterX, earthCenterY, orbitA, orbitB, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Satellite Body & Solar Panels
      ctx.save();
      ctx.translate(satX, satY);

      // Conical Radar Laser Scanning Beam pointing to earth/target
      if (targetVisible) {
        ctx.save();
        const laserGrad = ctx.createLinearGradient(0, 0, targetScreenX - satX, targetScreenY - satY);
        laserGrad.addColorStop(0, 'rgba(0, 242, 255, 0.8)');
        laserGrad.addColorStop(0.5, 'rgba(0, 242, 255, 0.25)');
        laserGrad.addColorStop(1, 'rgba(239, 68, 68, 0.7)');

        ctx.strokeStyle = laserGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(targetScreenX - satX, targetScreenY - satY);
        ctx.stroke();

        // Laser scan cone
        ctx.fillStyle = 'rgba(0, 242, 255, 0.06)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(targetScreenX - satX - 18, targetScreenY - satY - 10);
        ctx.lineTo(targetScreenX - satX + 18, targetScreenY - satY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Satellite Bus (chassis)
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f2ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(-6, -6, 12, 12);

      // Solar Panels
      ctx.fillStyle = '#0088cc';
      ctx.fillRect(-22, -3, 14, 6);
      ctx.fillRect(8, -3, 14, 6);
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-22, -3, 14, 6);
      ctx.strokeRect(8, -3, 14, 6);

      // Radar dish antenna
      ctx.strokeStyle = '#00fa91';
      ctx.beginPath();
      ctx.arc(0, 7, 5, 0, Math.PI);
      ctx.stroke();

      // Pulsing antenna beacon
      ctx.fillStyle = '#00f2ff';
      ctx.beginPath();
      ctx.arc(0, -7, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Target lock HUD overlays on canvas if locked
      if (targetVisible && targetLocked) {
        ctx.save();
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 1.5;
        const boxSize = 24;
        
        // Reticle corners
        ctx.beginPath();
        // Top-left
        ctx.moveTo(targetScreenX - boxSize, targetScreenY - boxSize + 8);
        ctx.lineTo(targetScreenX - boxSize, targetScreenY - boxSize);
        ctx.lineTo(targetScreenX - boxSize + 8, targetScreenY - boxSize);
        // Top-right
        ctx.moveTo(targetScreenX + boxSize - 8, targetScreenY - boxSize);
        ctx.lineTo(targetScreenX + boxSize, targetScreenY - boxSize);
        ctx.lineTo(targetScreenX + boxSize, targetScreenY - boxSize + 8);
        // Bottom-left
        ctx.moveTo(targetScreenX - boxSize, targetScreenY + boxSize - 8);
        ctx.lineTo(targetScreenX - boxSize, targetScreenY + boxSize);
        ctx.lineTo(targetScreenX - boxSize + 8, targetScreenY + boxSize);
        // Bottom-right
        ctx.moveTo(targetScreenX + boxSize - 8, targetScreenY + boxSize);
        ctx.lineTo(targetScreenX + boxSize, targetScreenY + boxSize);
        ctx.lineTo(targetScreenX + boxSize, targetScreenY + boxSize - 8);
        ctx.stroke();

        // Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00f2ff';
        ctx.fillText('TARGET LOCK: SLICK_001', targetScreenX + boxSize + 6, targetScreenY - 6);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('ANOMALY: -18.7dB DAMPING', targetScreenX + boxSize + 6, targetScreenY + 8);
        ctx.restore();
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      animationRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isWarping, targetLocked]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(15px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-[#02040a] text-[#dee2f4] flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden"
    >
      {/* 3D Canvas Space & Earth Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Futuristic Cockpit Scanlines & Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,4,10,0.85)_100%)] pointer-events-none z-0" />

      {/* TOP SCI-FI COCKPIT HUD */}
      <div className="w-full max-w-7xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff] flex items-center justify-center text-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.5)]">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-wider text-[#dee2f4] font-sans">
                OILTRACE AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-data bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 font-bold uppercase tracking-widest">
                SPACE MISSION CONTROL
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono-data text-[#94a3b8]">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#00f2ff]" />
                ORBIT: 693 KM LEO
              </span>
              <span className="text-[#3a494b]">•</span>
              <span className="text-emerald-400 font-bold">RADAR SWEEP ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playSound(880, 'sine', 0.1, 0.05);
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
              soundEnabled
                ? 'bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff] shadow-[0_0_12px_rgba(0,242,255,0.3)]'
                : 'bg-[#0b1220]/80 text-[#94a3b8] hover:text-[#dee2f4] border-[#2a3b50]'
            }`}
            title={soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00f2ff]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFinish}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00dbe7] via-[#00f2ff] to-[#74f5ff] text-[#002022] font-mono-data text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,242,255,0.6)] hover:brightness-110 cursor-pointer"
          >
            <span>Enter Dashboard</span>
            <Rocket className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CENTER HUD COCKPIT RETICLE & TELEMETRY */}
      <div className="relative my-auto flex flex-col items-center justify-center z-10 max-w-2xl w-full">
        
        {/* Orbital Target Box */}
        <div className="relative flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl bg-[#070e1c]/80 border border-[#00f2ff]/40 shadow-[0_0_40px_rgba(0,242,255,0.2)] backdrop-blur-xl max-w-lg w-full">
          
          {/* Animated Target Status */}
          <div className="flex items-center gap-2 text-xs font-mono-data uppercase tracking-widest text-[#00f2ff] mb-2 font-bold">
            <Crosshair className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{targetLocked ? 'SAR POLARIMETRIC LOCK ESTABLISHED' : 'ACQUIRING ORBITAL CONSTELLATION'}</span>
          </div>

          {/* Large Glowing Progress */}
          <div className="text-5xl sm:text-6xl font-black font-mono-data text-[#ffffff] tracking-tight drop-shadow-[0_0_25px_rgba(0,242,255,0.6)]">
            {Math.round(progress)}<span className="text-[#00f2ff] text-3xl font-bold">%</span>
          </div>

          {/* Subtitle Telemetry */}
          <div className="text-xs font-mono-data text-[#94a3b8] mt-1 flex items-center gap-2">
            <span>TARGET: 56.418°N, 3.224°E</span>
            <span className="text-[#3a494b]">•</span>
            <span className="text-emerald-400">SAT INGESTION 1.4 GBPS</span>
          </div>

          {/* Current Step Label */}
          <div className="mt-5 w-full space-y-1.5 border-t border-[#2a3b50]/60 pt-4">
            <div className="text-sm font-bold text-[#dee2f4] font-mono-data flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-[#00f2ff] animate-pulse" />
              <span>{steps[currentStepIndex].label}</span>
            </div>
            <p className="text-xs text-[#94a3b8] font-sans">
              {steps[currentStepIndex].sub}
            </p>
          </div>

          {/* 5-Phase Step Pip Bar */}
          <div className="grid grid-cols-5 gap-2 w-full mt-4">
            {steps.map((step, idx) => {
              const isDone = progress >= step.target;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isDone
                      ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]'
                      : isCurrent
                      ? 'bg-[#00f2ff]/50 animate-pulse'
                      : 'bg-[#1a263c]'
                  }`}
                />
              );
            })}
          </div>

          {/* Interactive Fast-Launch Button */}
          <button
            onClick={handleFinish}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#121d30] hover:bg-[#1a2b48] border border-[#00f2ff]/40 hover:border-[#00f2ff] text-xs font-mono-data uppercase font-bold text-[#00f2ff] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Orbital Lock Complete • Launch Investigation</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* BOTTOM MISSION TELEMETRY LOGS & SHORTCUT HINTS */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between border-t border-[#2a3b50]/80 pt-4 gap-3 z-10">
        <div className="flex items-center gap-2 text-[10px] font-mono-data text-[#94a3b8] overflow-hidden truncate max-w-2xl">
          <Terminal className="w-3.5 h-3.5 text-[#00f2ff] flex-shrink-0" />
          <span className="text-[#00f2ff] font-bold">ORBITAL TELEMETRY:</span>
          <span className="text-[#cbd5e1] truncate">{logs[0] || 'Sentinel-1A SAR radar sweeping European North Sea corridor...'}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-data text-[#94a3b8]">
          <span>Press</span>
          <kbd className="px-2 py-0.5 rounded bg-[#162236] border border-[#2a3b50] text-[#dee2f4] text-[10px] font-bold shadow-sm">
            SPACE
          </kbd>
          <span>or</span>
          <kbd className="px-2 py-0.5 rounded bg-[#162236] border border-[#2a3b50] text-[#dee2f4] text-[10px] font-bold shadow-sm">
            ESC
          </kbd>
          <span>to skip straight into dashboard</span>
        </div>
      </div>
    </motion.div>
  );
};
