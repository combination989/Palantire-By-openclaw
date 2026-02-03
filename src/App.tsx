import { useState, useEffect } from 'react';
import { LeftNav } from './components/LeftNav';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { MapView } from './components/MapView';
import { Github } from 'lucide-react';

function App() {
  const [uptime, setUptime] = useState({ days: 47, hours: 12 });
  const [statusBlink, setStatusBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusBlink(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black font-mono">
      {/* Scanline Overlay */}
      <div className="scanlines" />

      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-10 bg-black/95 border-b border-red-alert/50 z-[60] flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="Palantiree Logo"
            className={`w-6 h-6 object-contain ${statusBlink ? 'opacity-100' : 'opacity-70'}`}
          />
          <span className="text-red-alert font-bold tracking-widest text-sm text-glow-red uppercase">
            PALANTIREE BY OPENCLAW
          </span>
          <span className="text-gray-500 text-xs">|</span>
          <span className={`text-orange-alert text-xs tracking-wider ${statusBlink ? 'opacity-100' : 'opacity-60'}`}>
            THREAT MONITORING ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-cyan-terminal">
            SYSTEM: <span className="text-white">ONLINE</span>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-cyan-terminal">
            UPTIME: <span className="text-white">{uptime.days}d {uptime.hours}h</span>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-orange-alert">
            THREAT LEVEL: <span className="font-bold">ELEVATED</span>
          </span>
          <span className={`w-2 h-2 rounded-full bg-red-alert ${statusBlink ? 'opacity-100' : 'opacity-30'}`} />
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-10 pb-8 h-full">
        <MapView />
        <LeftNav />
        <LeftPanel />
        <RightPanel />
      </div>


      {/* Bottom Footer Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-black/95 border-t border-red-alert/30 z-[60] flex items-center justify-center gap-8 text-[10px] text-gray-500 tracking-widest">
        <span className="flex items-center gap-2">
          <span className="text-red-alert">⬢</span> AUTONOMOUS MONITORING
        </span>
        <span className="flex items-center gap-2">
          <span className="text-cyan-terminal">⬢</span> REAL-TIME DATA
        </span>
        <span className="flex items-center gap-2">
          <span className="text-orange-alert">⬢</span> CLASSIFIED ACCESS
        </span>
        <span className="flex items-center gap-2">
          <span className="text-yellow-warning">⬢</span> GLOBAL COVERAGE
        </span>
        <div className="flex items-center gap-6 ml-4 pl-4 border-l border-gray-800">
          <a
            href="https://x.com/palantiree_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors group"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-white group-hover:scale-110 transition-transform" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            <span>X</span>
          </a>
          <a
            href="https://github.com/blackdragonspear62/palantiree"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors group"
          >
            <Github className="w-3 h-3 text-white group-hover:scale-110 transition-transform" />
            <span>GITHUB</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
