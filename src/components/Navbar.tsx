import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Settings, 
  Search, 
  ShieldCheck, 
  Radio, 
  Compass, 
  Bot, 
  Sliders, 
  X,
  ExternalLink,
  ChevronRight,
  Palette,
  HelpCircle,
  Type,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Satellite
} from 'lucide-react';
import { SpillIncident } from '../types';
import { ThemeMode } from './ThemeSettingsModal';

export type NavTabType = 'dashboard' | 'satellite' | 'investigation' | 'analytics' | 'system' | 'simulation';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  incidents: SpillIncident[];
  selectedIncident: SpillIncident;
  setSelectedIncident: (inc: SpillIncident) => void;
  onOpenAiAssistant: () => void;
  onOpenSimulation: () => void;
  onOpenHowItWorks: () => void;
  onOpenThemeSettings: () => void;
  onTogglePlainEnglish: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  incidents,
  selectedIncident,
  setSelectedIncident,
  onOpenAiAssistant,
  onOpenSimulation,
  onOpenHowItWorks,
  onOpenThemeSettings,
  onTogglePlainEnglish,
  currentTheme,
  onSelectTheme,
  onReplayIntro,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.slickType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#121927]/95 backdrop-blur-xl border-b border-[#2a3b50] shadow-sm transition-all duration-300">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#2a3b50] flex-shrink-0 bg-[#0b1220] group-hover:border-[#00f2ff] transition-colors shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQxVcZJFrawIPDzF-ky6Kw6bDjxx6h5tLnYlQG3ajqGKObkPSUcCpGEx62Sb3-lIG-iqE21qweyr5qpEzjdvn6aLqHib1Nw5YKj_-GwUhHqrB1E_D0Wx7Zjlzm7T7-1LzJ-sI29-CfAPCFVf3t8jjBCEZEx_6F8jBrlQpOo4t9aJ_F4cFj7dQhEiuMVaKhChSkvDi4mctIAK_r2OA0r12uVoFebn2Tf4hLPlk1a9FCEQ-NR9RIV4U"
                alt="OilTrace AI Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#00f2ff] uppercase font-sans">
                OilTrace AI
              </span>
              <span className="text-[9px] font-mono-data text-[#94a3b8] tracking-widest uppercase -mt-1">
                Oil Spill Tracker
              </span>
            </div>
          </button>

          {/* Quick How It Works Guide Trigger */}
          <button
            onClick={onOpenHowItWorks}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30 text-xs font-medium transition-all cursor-pointer"
            title="How OilTrace AI works"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it Works</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 h-full">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`h-full px-3 flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-[#00f2ff] font-semibold'
                : 'text-[#94a3b8] hover:text-[#00f2ff]'
            }`}
          >
            <span>Dashboard</span>
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('satellite')}
            className={`h-full px-3 flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'satellite'
                ? 'text-[#00f2ff] font-semibold'
                : 'text-[#94a3b8] hover:text-[#00f2ff]'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-[#00f2ff]" />
            <span>Satellite Scan</span>
            {activeTab === 'satellite' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('investigation')}
            className={`h-full px-3 flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'investigation'
                ? 'text-[#00f2ff] font-semibold'
                : 'text-[#94a3b8] hover:text-[#00f2ff]'
            }`}
          >
            <span>Investigation</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-data bg-red-500/20 text-red-300 border border-red-500/40">
              LIVE
            </span>
            {activeTab === 'investigation' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`h-full px-3 flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-[#00f2ff] font-semibold'
                : 'text-[#94a3b8] hover:text-[#00f2ff]'
            }`}
          >
            <span>Analytics</span>
            {activeTab === 'analytics' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`h-full px-3 flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'simulation'
                ? 'text-[#00f2ff] font-semibold'
                : 'text-[#94a3b8] hover:text-[#00f2ff]'
            }`}
          >
            <span>Simulation</span>
            {activeTab === 'simulation' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`h-full px-3 flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'system'
                ? 'text-[#00f2ff] font-semibold'
                : 'text-[#94a3b8] hover:text-[#00f2ff]'
            }`}
          >
            <span>System</span>
            {activeTab === 'system' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
            )}
          </button>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Theme & Background Switcher */}
          <button
            onClick={onOpenThemeSettings}
            className="p-2 text-[#94a3b8] hover:text-[#00f2ff] transition-colors rounded-lg hover:bg-[#1a263c] border border-transparent hover:border-[#2a3b50] focus:outline-none cursor-pointer flex items-center gap-1.5"
            title="Change background color & theme"
          >
            <Palette className="w-4 h-4 text-[#00f2ff]" />
            <span className="hidden xl:inline text-xs font-mono-data text-[#94a3b8]">Theme</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-[#94a3b8] hover:text-[#00f2ff] transition-colors rounded-lg hover:bg-[#1a263c] border border-transparent hover:border-[#2a3b50] focus:outline-none cursor-pointer"
            title="Search incidents"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Copilot Drawer Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/40 hover:bg-[#00f2ff]/20 text-xs font-mono-data font-bold transition-all shadow-[0_0_12px_rgba(0,242,255,0.2)] cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI COPILOT</span>
          </button>

        </div>

      </div>

      {/* Quick Search Modal */}
      {showSearch && (
        <div className="absolute top-16 left-0 right-0 bg-[#0e1320]/95 backdrop-blur-xl border-b border-[#3a494b] p-4 shadow-2xl z-50">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#849495] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by incident ID, sector, vessel name, or slick type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-[#141c2c] border border-[#3a494b] rounded-lg text-xs font-mono-data text-[#dee2f4] focus:outline-none focus:border-[#00f2ff]"
              />
            </div>

            {searchQuery && (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((inc) => (
                    <button
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setActiveTab('investigation');
                        setShowSearch(false);
                      }}
                      className="w-full p-2.5 rounded-lg bg-[#1a2336] hover:bg-[#223048] border border-[#3a494b] flex items-center justify-between text-left transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{inc.name}</div>
                        <div className="text-[10px] font-mono-data text-[#849495]">{inc.locationName} • {inc.slickType}</div>
                      </div>
                      <span className="text-xs font-mono-data text-[#00f2ff] font-bold">{inc.areaKm2} km²</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-[#849495]">No incidents matching query.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
