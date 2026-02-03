import { useState, useEffect } from 'react';
import { RefreshCw, Circle, X, ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { useStore, ThreatLevel } from '../store/useStore';

const threatColors: Record<ThreatLevel, string> = {
  critical: 'text-red-alert',
  high: 'text-orange-alert',
  medium: 'text-yellow-warning',
  low: 'text-cyan-terminal',
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 5) return 'NOW';
  return `${mins}m`;
}

export function RightPanel() {
  const { liveAlerts, events, selectedEventId, setSelectedEvent, rightPanelOpen, toggleRightPanel } = useStore();
  const [activeTab, setActiveTab] = useState<'Summary' | 'Analytics'>('Summary');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState({ total: 0, threat: 0, system: 0 });
  const [blink, setBlink] = useState(true);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    const interval = setInterval(() => setBlink(prev => !prev), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targets = { total: 78, threat: 22, system: 100 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedValues({
        total: Math.round(targets.total * progress),
        threat: Math.round(targets.threat * progress),
        system: Math.round(targets.system * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!rightPanelOpen) {
    return (
      <button
        onClick={toggleRightPanel}
        className="fixed right-0 top-1/2 -translate-y-1/2 w-5 h-14 bg-black border border-cyan-terminal/50 z-50 flex items-center justify-center hover:bg-cyan-terminal/20 transition-all group"
        title="Expand Panel"
      >
        <ChevronLeft className="w-3 h-3 text-cyan-terminal group-hover:scale-125 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-10 bottom-8 w-80 bg-black/95 border-l border-cyan-terminal/30 flex flex-col z-40 transition-all duration-300">
      {/* Header */}
      <div className="p-3 border-b border-cyan-terminal/30 flex items-center justify-between bg-cyan-terminal/5">
        <button
          onClick={toggleRightPanel}
          className="p-1 border border-cyan-terminal/30 hover:bg-cyan-terminal/20 text-cyan-terminal transition-all cursor-pointer"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] text-cyan-terminal tracking-wider">
            <Radio className={`w-3 h-3 ${blink ? 'opacity-100' : 'opacity-30'}`} />
            LIVE FEED
          </span>
          <button className="p-1 hover:bg-cyan-terminal/10 transition-colors cursor-pointer">
            <RefreshCw className="w-3 h-3 text-gray-600 hover:text-cyan-terminal" />
          </button>
        </div>
      </div>

      {/* Live Alerts */}
      <div className="p-3 border-b border-cyan-terminal/20">
        <h2 className="text-[10px] font-bold text-red-alert mb-2 tracking-widest">
          ┌─── LIVE ALERTS ───┐
        </h2>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {liveAlerts.map((alert) => (
            <button 
              key={alert.id} 
              onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              className={`relative w-full text-left p-2 transition-all cursor-pointer border ${
                expandedAlert === alert.id ? 'bg-red-alert/10 border-red-alert/30' : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex items-start gap-2">
                <Circle className={`w-2 h-2 mt-1 flex-shrink-0 ${threatColors[alert.threatLevel]} ${
                  alert.threatLevel === 'critical' ? 'animate-pulse' : ''
                }`} fill="currentColor" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${threatColors[alert.threatLevel]}`}>{alert.title}</span>
                    <span className="text-[9px] text-gray-600">{formatTime(alert.timestamp)}</span>
                  </div>
                  <p className={`text-[10px] text-gray-500 mt-0.5 ${expandedAlert === alert.id ? '' : 'line-clamp-1'}`}>
                    {alert.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-1">
          <span className="text-[9px] text-gray-700 tracking-widest">└─────────────────┘</span>
        </div>
      </div>

      {/* Selected Event Detail */}
      {selectedEvent && (
        <div className="p-3 border-b border-orange-alert/30 bg-orange-alert/5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-bold text-orange-alert tracking-widest">▸ SELECTED TARGET</h2>
            <button 
              onClick={() => setSelectedEvent(null)} 
              className="p-1 hover:bg-orange-alert/10 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3 text-gray-500 hover:text-white" />
            </button>
          </div>
          <h3 className="text-xs font-semibold text-white mb-1">{selectedEvent.title}</h3>
          <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{selectedEvent.description}</p>
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div className="p-1 bg-black/50 border border-gray-800">
              <span className="text-gray-600">LOC:</span> <span className="text-white">{selectedEvent.location}</span>
            </div>
            <div className="p-1 bg-black/50 border border-gray-800">
              <span className="text-gray-600">CTY:</span> <span className="text-white">{selectedEvent.country}</span>
            </div>
            <div className="p-1 bg-black/50 border border-gray-800">
              <span className="text-gray-600">SRC:</span> <span className="text-cyan-terminal">{selectedEvent.source}</span>
            </div>
            <div className="p-1 bg-black/50 border border-gray-800">
              <span className="text-gray-600">LVL:</span> <span className={`${
                selectedEvent.threatLevel === 'critical' ? 'text-red-alert' :
                selectedEvent.threatLevel === 'high' ? 'text-orange-alert' : 'text-yellow-warning'
              }`}>{selectedEvent.threatLevel.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      <div className="flex-1 p-3 overflow-y-auto">
        <h2 className="text-[10px] font-bold text-cyan-terminal mb-2 tracking-widest">▸ ANALYTICS</h2>
        
        <div className="flex gap-1 mb-3">
          {(['Summary', 'Analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 text-[10px] tracking-wider transition-all cursor-pointer border ${
                activeTab === tab 
                  ? 'bg-cyan-terminal/20 text-cyan-terminal border-cyan-terminal/50' 
                  : 'text-gray-600 hover:text-gray-300 border-gray-700 hover:bg-white/5'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'Summary' ? (
          <>
            <div className="mb-3 p-2 bg-terminal-panel border border-gray-800">
              <div className="text-[9px] text-gray-600 mb-2 tracking-wider">THREAT_DISTRIBUTION</div>
              <div className="h-14 flex items-end gap-0.5">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-red-alert/30 to-red-alert"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-terminal-panel border border-gray-800">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500 tracking-wider">COVERAGE</span>
                  <span className="text-cyan-terminal font-bold">{animatedValues.total}%</span>
                </div>
                <div className="h-1 bg-gray-900 overflow-hidden">
                  <div className="h-full bg-cyan-terminal transition-all duration-1000" style={{ width: `${animatedValues.total}%` }} />
                </div>
              </div>
              <div className="p-2 bg-terminal-panel border border-gray-800">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500 tracking-wider">RISK_LEVEL</span>
                  <span className="text-orange-alert font-bold">{animatedValues.threat}%</span>
                </div>
                <div className="h-1 bg-gray-900 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-alert to-red-alert transition-all duration-1000" style={{ width: `${animatedValues.threat}%` }} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 p-2 bg-terminal-panel border border-gray-800">
              <div className="text-[9px] text-gray-600 mb-2 tracking-wider">CATEGORY_BREAKDOWN</div>
              <div className="space-y-1">
                {[
                  { name: 'CYBER', count: 6, color: 'bg-cyan-terminal', pct: 50 },
                  { name: 'CONFLICT', count: 3, color: 'bg-orange-alert', pct: 25 },
                  { name: 'TERRORISM', count: 1, color: 'bg-red-alert', pct: 8 },
                  { name: 'POLITICAL', count: 1, color: 'bg-yellow-warning', pct: 8 },
                  { name: 'NATURAL', count: 1, color: 'bg-green-500', pct: 8 },
                ].map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 ${cat.color}`} />
                    <span className="text-[10px] text-gray-500 flex-1 tracking-wider">{cat.name}</span>
                    <span className="text-[10px] text-white w-4">{cat.count}</span>
                    <div className="w-14 h-1 bg-gray-900 overflow-hidden">
                      <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-2 bg-terminal-panel border border-gray-800">
              <div className="text-[9px] text-gray-600 mb-2 tracking-wider">SYSTEM_STATUS</div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-500">UPTIME</span>
                <span className="text-cyan-terminal font-bold">{animatedValues.system}%</span>
              </div>
              <div className="h-1 bg-gray-900 overflow-hidden mb-2">
                <div className="h-full bg-cyan-terminal" style={{ width: `${animatedValues.system}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <div className="text-center p-2 bg-black/50 border border-gray-800">
                  <div className="text-red-alert font-bold text-sm">12</div>
                  <div className="text-gray-600 tracking-wider">ACTIVE</div>
                </div>
                <div className="text-center p-2 bg-black/50 border border-gray-800">
                  <div className="text-orange-alert font-bold text-sm">4</div>
                  <div className="text-gray-600 tracking-wider">ALERTS</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
