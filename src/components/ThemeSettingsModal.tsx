import React from 'react';
import { 
  X, 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Check, 
  Layers, 
  Eye,
  Sliders,
  Type
} from 'lucide-react';

export type ThemeMode = 'cyber' | 'midnight' | 'abyss' | 'light';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onTogglePlainEnglish?: () => void;
  customBgColor?: string;
  onChangeCustomBgColor?: (color: string) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onTogglePlainEnglish,
  customBgColor,
  onChangeCustomBgColor,
}) => {
  if (!isOpen) return null;

  const presetThemes: { id: ThemeMode; name: string; desc: string; bg: string; accent: string; badge: string }[] = [
    {
      id: 'cyber',
      name: 'Cyber Command (Default)',
      desc: 'Tactical deep navy canvas with luminous neon cyan radar lines and high-tech glow.',
      bg: '#0b1220',
      accent: '#00f2ff',
      badge: 'POPULAR',
    },
    {
      id: 'midnight',
      name: 'Midnight Stealth',
      desc: 'OLED pitch-black background with tactical emerald-green and cyan stealth aesthetics.',
      bg: '#040810',
      accent: '#10b981',
      badge: 'DARK OLED',
    },
    {
      id: 'abyss',
      name: 'Deep Oceanic Abyss',
      desc: 'Rich deep-sea cobalt blue atmosphere with electric azure accents.',
      bg: '#07152b',
      accent: '#38bdf8',
      badge: 'MARITIME',
    },
    {
      id: 'light',
      name: 'Admiralty High-Contrast Light',
      desc: 'Clean, crystal-clear white & slate dashboard optimized for daytime readability.',
      bg: '#f1f5f9',
      accent: '#0284c7',
      badge: 'DAYLIGHT',
    },
  ];

  const quickColorSwatches = [
    { label: 'Obsidian Navy', hex: '#0b1220' },
    { label: 'Pitch Black', hex: '#040810' },
    { label: 'Deep Ocean Blue', hex: '#07152b' },
    { label: 'Space Dark', hex: '#0e1726' },
    { label: 'Steel Graphite', hex: '#141c2b' },
    { label: 'Executive Slate', hex: '#f1f5f9' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#121a2a] border border-[#2a3b50] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto text-[#dee2f4]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a3b50] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/40 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#00f2ff]" />
            </div>
            <div>
              <span className="text-xs font-mono-data text-[#00f2ff] uppercase tracking-wider font-bold">
                Visual Appearance & Readability
              </span>
              <h2 className="text-xl font-bold text-[#dee2f4]">
                Theme & Display Settings
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94a3b8] hover:text-[#dee2f4] hover:bg-[#1a263c] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Palette Selection */}
        <div className="space-y-3">
          <label className="text-xs font-mono-data text-[#94a3b8] uppercase tracking-wider block">
            Choose Background Atmosphere & Theme:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presetThemes.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-4 rounded-xl text-left border transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#1a2840] border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                      : 'bg-[#162236] border-[#2a3b50] hover:border-[#94a3b8]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.bg }}
                        />
                        <span className="text-xs font-bold text-[#dee2f4]">{theme.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00f2ff]" />}
                    </div>
                    <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                      {theme.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono-data">
                    <span
                      className="px-2 py-0.5 rounded font-bold"
                      style={{ color: theme.accent, backgroundColor: `${theme.accent}15` }}
                    >
                      {theme.badge}
                    </span>
                    <span className="text-[#94a3b8]">{theme.bg}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Background Color Swatches */}
        <div className="p-4 rounded-xl bg-[#0b1220] border border-[#2a3b50] space-y-3">
          <label className="text-xs font-mono-data text-[#94a3b8] uppercase tracking-wider block">
            Quick Background Tint Palette:
          </label>
          <div className="flex flex-wrap gap-2">
            {quickColorSwatches.map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => {
                  if (swatch.hex === '#040810') {
                    onSelectTheme('midnight');
                  } else if (swatch.hex === '#07152b') {
                    onSelectTheme('abyss');
                  } else if (swatch.hex === '#f1f5f9') {
                    onSelectTheme('light');
                  } else {
                    onSelectTheme('cyber');
                  }
                  if (typeof onChangeCustomBgColor === 'function') {
                    onChangeCustomBgColor(swatch.hex);
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#162236] border border-[#2a3b50] hover:border-[#00f2ff] transition-all text-xs font-mono-data cursor-pointer"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/30"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-[#cbd5e1]">{swatch.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
