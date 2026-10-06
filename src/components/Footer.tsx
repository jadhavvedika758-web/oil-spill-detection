import React from 'react';
import { NavTabType } from './Navbar';
import { HelpCircle, Shield, Satellite, Radio } from 'lucide-react';

interface FooterProps {
  onOpenHowItWorks?: () => void;
  onSelectTab?: (tab: NavTabType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItWorks,
  onSelectTab,
}) => {
  return (
    <footer className="w-full flex flex-col sm:flex-row justify-between items-center px-6 py-4 z-40 bg-[#090e1a]/95 backdrop-blur-md border-t border-[#2a3b50] text-[11px] font-mono-data text-[#849495] gap-3">
      <div className="text-[#00dbe7] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
        <span className="font-bold">OILTRACE AI • SIH26143 MARITIME INTELLIGENCE</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
        {onOpenHowItWorks && (
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-[#00f2ff] transition-colors cursor-pointer flex items-center gap-1.5 text-[#94a3b8]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#00f2ff]" />
            <span>System Architecture</span>
          </button>
        )}
        {onSelectTab && (
          <>
            <button
              onClick={() => onSelectTab('satellite')}
              className="hover:text-[#00f2ff] transition-colors cursor-pointer"
            >
              Satellite CV
            </button>
            <button
              onClick={() => onSelectTab('investigation')}
              className="hover:text-[#00f2ff] transition-colors cursor-pointer"
            >
              Radar & Vessels
            </button>
            <button
              onClick={() => onSelectTab('simulation')}
              className="hover:text-[#00f2ff] transition-colors cursor-pointer"
            >
              Drift Studio
            </button>
          </>
        )}
        <span className="text-[#64748b]">
          MARPOL Annex I / UNCLOS Evidence Protocol
        </span>
      </div>
    </footer>
  );
};
