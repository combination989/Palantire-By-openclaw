import { useState } from 'react';
import type { Category } from '../store/useStore';
import { ChevronDown, ChevronLeft, ChevronRight, Activity, TrendingUp, Database, Shield, Terminal } from 'lucide-react';
import { useStore, ThreatLevel } from '../store/useStore';

const threatColors: Record<ThreatLevel, string> = {
  critical: 'bg-red-alert',
  high: 'bg-orange-alert',
  medium: 'bg-yellow-warning',
  low: 'bg-cyan-terminal',
};

const threatTextColors: Record<ThreatLevel, string> = {
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
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function LeftPanel() {
  const { events, filters, selectedEventId, setSelectedEvent, leftPanelOpen, toggleLeftPanel, toggleCategory } = useStore();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleFilterSelect = (opt: string) => {
    setSelectedFilter(opt);
    setFilterOpen(false);
    const allCategories: Category[] = ['Conflict', 'Terrorism', 'Cyber', 'Natural Disaster', 'Political'];
    if (opt === 'All') {
      allCategories.forEach(cat => {
        if (!filters.categories.includes(cat)) toggleCategory(cat);
      });
    } else {
      allCategories.forEach(cat => {
        const shouldBeActive = cat === opt;
        const isActive = filters.categories.includes(cat);
        if (shouldBeActive !== isActive) toggleCategory(cat);
      });
    }
  };

  const filteredEvents = events.filter((e) => {
    if (!filters.categories.includes(e.category)) return false;
    if (!filters.threatLevels.includes(e.threatLevel)) return false;
    if (filters.searchQuery && !e.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    realTime: { value: '22,000', change: '+47%' },
    operations: { value: '1,836', change: '' },
    records: { value: '2,320', change: '+15%' },
    threats: { value: '1.30K', change: '' },
  };

  if (!leftPanelOpen) {
    return (
      <button
        onClick={toggleLeftPanel}
        className="fixed left-14 top-1/2 -translate-y-1/2 w-5 h-14 bg-black border border-red-alert/50 z-50 flex items-center justify-center hover:bg-red-alert/20 transition-all group"
        title="Expand Panel"
      >
        <ChevronRight className="w-3 h-3 text-red-alert group-hover:scale-125 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed left-14 top-10 bottom-8 w-72 bg-black/95 border-r border-red-alert/30 flex flex-col z-40 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-3 border-b border-red-alert/30 flex items-center justify-between bg-red-alert/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-alert" />
          <div>
            <h1 className="text-xs font-bold text-red-alert tracking-widest">┌─── CONTROL PANEL</h1>
          </div>
        </div>
        <button
          onClick={toggleLeftPanel}
          className="p-1 border border-red-alert/30 hover:bg-red-alert/20 text-red-alert transition-all cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Data Feeds */}
      <div className="p-3 border-b border-red-alert/20">
        <h2 className="text-[10px] font-bold text-cyan-terminal mb-3 tracking-widest">▸ DATA FEEDS</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-terminal-panel border border-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-cyan-terminal" />
              <span className="text-[10px] text-gray-500 tracking-wider">REAL_TIME</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{stats.realTime.value}</span>
              <span className="text-[10px] text-cyan-terminal ml-1">{stats.realTime.change}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-terminal-panel border border-gray-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-orange-alert" />
              <span className="text-[10px] text-gray-500 tracking-wider">OPERATIONS</span>
            </div>
            <span className="text-sm font-bold text-white">{stats.operations.value}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-terminal-panel border border-gray-800">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-cyan-terminal" />
              <span className="text-[10px] text-gray-500 tracking-wider">RECORDS</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{stats.records.value}</span>
              <span className="text-[10px] text-cyan-terminal ml-1">{stats.records.change}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-terminal-panel border border-gray-800">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-red-alert" />
              <span className="text-[10px] text-gray-500 tracking-wider">THREATS</span>
            </div>
            <span className="text-sm font-bold text-red-alert">{stats.threats.value}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-red-alert/20">
        <h2 className="text-[10px] font-bold text-cyan-terminal mb-2 tracking-widest">▸ FILTERS</h2>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full flex items-center justify-between px-2 py-2 bg-terminal-panel border border-gray-700 text-xs text-gray-300 hover:border-red-alert/50 transition-colors cursor-pointer"
          >
            <span className="text-[10px] tracking-wider">{selectedFilter.toUpperCase()}</span>
            <ChevronDown className={`w-3 h-3 text-red-alert transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
          {filterOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-red-alert/50 overflow-hidden z-50">
              {['All', 'Cyber', 'Conflict', 'Terrorism', 'Political', 'Natural Disaster'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleFilterSelect(opt)}
                  className={`w-full px-2 py-2 text-left text-[10px] tracking-wider transition-colors cursor-pointer ${
                    selectedFilter === opt ? 'bg-red-alert/20 text-red-alert' : 'text-gray-400 hover:bg-red-alert/10 hover:text-white'
                  }`}
                >
                  ▸ {opt.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Threats List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-3 pb-2 border-b border-red-alert/10">
          <h2 className="text-[10px] font-bold text-red-alert tracking-widest">
            ┌─── THREAT FEED ({filteredEvents.length}) ───┐
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filteredEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`w-full p-2 mb-1 text-left transition-all cursor-pointer border ${
                selectedEventId === event.id
                  ? 'bg-red-alert/10 border-red-alert/50'
                  : 'hover:bg-white/5 border-transparent hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 mt-1 flex-shrink-0 ${threatColors[event.threatLevel]} ${
                  event.threatLevel === 'critical' ? 'animate-pulse' : ''
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-medium text-white truncate">{event.title}</span>
                    <span className={`px-1 py-0.5 text-[9px] border ${
                      event.threatLevel === 'critical' ? 'border-red-alert/50 text-red-alert bg-red-alert/10' :
                      event.threatLevel === 'high' ? 'border-orange-alert/50 text-orange-alert bg-orange-alert/10' :
                      event.threatLevel === 'medium' ? 'border-yellow-warning/50 text-yellow-warning bg-yellow-warning/10' :
                      'border-cyan-terminal/50 text-cyan-terminal bg-cyan-terminal/10'
                    }`}>
                      {event.threatLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600">{formatTime(event.timestamp)} • {event.country}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-red-alert/10 text-center">
          <span className="text-[9px] text-gray-600 tracking-widest">└───────────────────────────┘</span>
        </div>
      </div>
    </div>
  );
}
