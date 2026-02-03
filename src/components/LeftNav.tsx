import { LayoutDashboard, Map, AlertTriangle, Brain, Calendar, PanelLeft, Settings, Info, Crosshair } from 'lucide-react';
import { useStore } from '../store/useStore';

const navItems = [
  { id: 'Dashboard', icon: LayoutDashboard },
  { id: 'Map', icon: Map },
  { id: 'Threats', icon: AlertTriangle },
  { id: 'Intelligence', icon: Brain },
  { id: 'Events', icon: Calendar },
  { id: 'Panel', icon: PanelLeft },
  { id: 'Settings', icon: Settings },
  { id: 'About', icon: Info },
];

export function LeftNav() {
  const { activeNav, setActiveNav } = useStore();

  return (
    <nav className="fixed left-0 top-10 bottom-8 w-14 bg-black/95 border-r border-red-alert/30 flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-9 h-9 border border-red-alert flex items-center justify-center relative group cursor-pointer">
          <Crosshair className="w-5 h-5 text-red-alert" />
          <div className="absolute inset-0 bg-red-alert/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`w-9 h-9 flex items-center justify-center transition-all group relative cursor-pointer ${
              activeNav === id
                ? 'bg-red-alert/20 text-red-alert border border-red-alert/50'
                : 'text-gray-600 hover:text-red-alert hover:bg-red-alert/10 border border-transparent'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="absolute left-12 px-2 py-1 bg-black border border-red-alert/50 text-[10px] text-red-alert opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-mono tracking-wider">
              {id.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-cyan-terminal hover:bg-cyan-terminal/10 border border-transparent hover:border-cyan-terminal/50 transition-all cursor-pointer">
        <Settings className="w-4 h-4" />
      </button>
    </nav>
  );
}
