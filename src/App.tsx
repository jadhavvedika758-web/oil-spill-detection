import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar, NavTabType } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IntelligenceBentoGrid } from './components/IntelligenceBentoGrid';
import { InvestigationTheater } from './components/InvestigationTheater';
import { SatelliteAnalysisView } from './components/SatelliteAnalysisView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SystemStatus } from './components/SystemStatus';
import { SimulationStudio } from './components/SimulationStudio';
import { CourtDossierModal } from './components/CourtDossierModal';
import { AiAnalystDrawer } from './components/AiAnalystDrawer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ThemeSettingsModal, ThemeMode } from './components/ThemeSettingsModal';
import { IntroLoadingAnimation } from './components/IntroLoadingAnimation';
import { Footer } from './components/Footer';
import { MOCK_INCIDENTS } from './data/mockIncidents';
import { SpillIncident, CorrelatedVessel } from './types';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');
  const [incidents, setIncidents] = useState<SpillIncident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<SpillIncident>(MOCK_INCIDENTS[0]);
  
  // Theme and UI accessibility mode state
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('cyber');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState<boolean>(false);

  // Court dossier modal state
  const [dossierState, setDossierState] = useState<{
    isOpen: boolean;
    incident: SpillIncident | null;
    vessel: CorrelatedVessel | null;
  }>({
    isOpen: false,
    incident: null,
    vessel: null,
  });

  // AI Chat Assistant drawer state
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  const handleOpenDossier = (incident: SpillIncident, vessel: CorrelatedVessel) => {
    setDossierState({
      isOpen: true,
      incident,
      vessel,
    });
  };

  const handleInjectCustomIncident = (newIncident: SpillIncident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
  };

  const handleTransferSatelliteToInvestigation = (customData: Partial<SpillIncident>) => {
    // Clone demo incident and overlay analyzed metrics
    const updated: SpillIncident = {
      ...selectedIncident,
      name: customData.name || selectedIncident.name,
      coordinates: customData.coordinates || selectedIncident.coordinates,
      areaKm2: customData.areaKm2 || selectedIncident.areaKm2,
      estimatedVolumeBbl: customData.estimatedVolumeBbl || selectedIncident.estimatedVolumeBbl,
      confidence: customData.confidence || selectedIncident.confidence,
      radarBackscatterDb: customData.radarBackscatterDb || selectedIncident.radarBackscatterDb,
    };
    setSelectedIncident(updated);
    setActiveTab('investigation');
  };

  const themeClass = `theme-${currentTheme}`;

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col relative selection:bg-[#00f2ff] selection:text-[#002022] ${themeClass} transition-colors duration-300`}>
      
      {/* Pre-Opening Satellite Radar Initialization Animation */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroLoadingAnimation
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* Ambient Canvas & Scanline */}
      <div className="fixed inset-0 z-[-2] bg-[var(--bg-main)]" />
      <div className="fixed inset-0 z-[-1] bg-grid opacity-30 pointer-events-none" />
      <div className="scanline" />

      {/* Top Fixed Tactical Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        incidents={incidents}
        selectedIncident={selectedIncident}
        setSelectedIncident={setSelectedIncident}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onOpenSimulation={() => setActiveTab('simulation')}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenThemeSettings={() => setIsThemeSettingsOpen(true)}
        currentTheme={currentTheme}
        onSelectTheme={(t) => setCurrentTheme(t)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-16 flex flex-col relative z-10 w-full overflow-hidden">
        {activeTab === 'dashboard' && (
          <>
            <HeroSection
              onLaunchInvestigation={() => setActiveTab('investigation')}
              onExploreDemo={() => setActiveTab('satellite')}
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelectIncident={(inc) => {
                setSelectedIncident(inc);
                setActiveTab('investigation');
              }}
              onReplayIntro={() => setShowIntro(true)}
            />
            <IntelligenceBentoGrid
              incidents={incidents}
              onSelectIncident={setSelectedIncident}
              onOpenInvestigation={() => setActiveTab('investigation')}
              onOpenAnalytics={() => setActiveTab('analytics')}
            />
          </>
        )}

        {activeTab === 'satellite' && (
          <SatelliteAnalysisView
            onTransferToInvestigation={handleTransferSatelliteToInvestigation}
          />
        )}

        {activeTab === 'investigation' && (
          <InvestigationTheater
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            onGenerateDossier={handleOpenDossier}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            incidents={incidents}
            selectedIncident={selectedIncident}
          />
        )}

        {activeTab === 'system' && (
          <SystemStatus />
        )}

        {activeTab === 'simulation' && (
          <SimulationStudio
            onInjectCustomIncident={handleInjectCustomIncident}
            onOpenInvestigation={() => setActiveTab('investigation')}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onSelectTab={setActiveTab}
      />

      {/* Modals & Slide-out Drawers */}
      <CourtDossierModal
        isOpen={dossierState.isOpen}
        onClose={() => setDossierState({ isOpen: false, incident: null, vessel: null })}
        incident={dossierState.incident}
        vessel={dossierState.vessel}
      />

      <AiAnalystDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        activeIncident={selectedIncident}
        activeVessel={selectedIncident.correlatedVessels[0] || null}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenDemo={() => {
          setIsHowItWorksOpen(false);
          setActiveTab('investigation');
        }}
      />

      <ThemeSettingsModal
        isOpen={isThemeSettingsOpen}
        onClose={() => setIsThemeSettingsOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

    </div>
  );
}
