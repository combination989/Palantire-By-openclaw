import { create } from 'zustand';

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low';
export type Category = 'Conflict' | 'Terrorism' | 'Cyber' | 'Natural Disaster' | 'Political';

export interface ThreatEvent {
  id: string;
  title: string;
  description: string;
  category: Category;
  threatLevel: ThreatLevel;
  location: string;
  country: string;
  coordinates: [number, number];
  timestamp: string;
  source: string;
}

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  threatLevel: ThreatLevel;
}

interface FilterState {
  categories: Category[];
  threatLevels: ThreatLevel[];
  searchQuery: string;
  showUSBases: boolean;
  showNATOBases: boolean;
}

interface AppState {
  events: ThreatEvent[];
  liveAlerts: LiveAlert[];
  selectedEventId: string | null;
  filters: FilterState;
  activeNav: string;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  setSelectedEvent: (id: string | null) => void;
  toggleCategory: (cat: Category) => void;
  toggleThreatLevel: (level: ThreatLevel) => void;
  setSearchQuery: (query: string) => void;
  toggleUSBases: () => void;
  toggleNATOBases: () => void;
  setActiveNav: (nav: string) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
}

const mockEvents: ThreatEvent[] = [
  { id: '1', title: 'Cyber Xion', description: 'Advanced persistent threat detected targeting critical infrastructure.', category: 'Cyber', threatLevel: 'critical', location: 'Eastern Europe', country: 'Ukraine', coordinates: [37.6173, 48.7194], timestamp: '2026-01-31T01:45:00Z', source: 'OSINT' },
  { id: '2', title: 'China', description: 'State-sponsored cyber espionage campaign detected.', category: 'Cyber', threatLevel: 'high', location: 'Beijing', country: 'China', coordinates: [116.4074, 39.9042], timestamp: '2026-01-31T00:30:00Z', source: 'Intel' },
  { id: '3', title: 'Germany', description: 'Critical infrastructure attack on power grid systems.', category: 'Cyber', threatLevel: 'high', location: 'Berlin', country: 'Germany', coordinates: [13.4050, 52.5200], timestamp: '2026-01-30T22:15:00Z', source: 'BSI' },
  { id: '4', title: 'Cyberattacks', description: 'Coordinated DDoS attacks on financial institutions.', category: 'Cyber', threatLevel: 'medium', location: 'Global', country: 'Multiple', coordinates: [0, 30], timestamp: '2026-01-30T18:00:00Z', source: 'FinCERT' },
  { id: '5', title: 'Baritaka', description: 'New malware strain with sophisticated evasion techniques.', category: 'Cyber', threatLevel: 'medium', location: 'South America', country: 'Brazil', coordinates: [-47.9292, -15.7801], timestamp: '2026-01-30T14:20:00Z', source: 'CERT.br' },
  { id: '6', title: 'Georis', description: 'Geopolitical tensions with military movements detected.', category: 'Conflict', threatLevel: 'high', location: 'South China Sea', country: 'Taiwan', coordinates: [121.5654, 25.0330], timestamp: '2026-01-30T10:00:00Z', source: 'Naval' },
  { id: '7', title: 'Dengbang', description: 'Terrorist cell communications intercepted.', category: 'Terrorism', threatLevel: 'critical', location: 'Southeast Asia', country: 'Philippines', coordinates: [121.7740, 12.8797], timestamp: '2026-01-30T08:45:00Z', source: 'INTERPOL' },
  { id: '8', title: 'Boocrow', description: 'Political instability with mass protests reported.', category: 'Political', threatLevel: 'medium', location: 'Middle East', country: 'Iran', coordinates: [51.3890, 35.6892], timestamp: '2026-01-29T23:30:00Z', source: 'Field' },
  { id: '9', title: 'Arctic Ops', description: 'Military exercises detected in Arctic region.', category: 'Conflict', threatLevel: 'low', location: 'Arctic', country: 'Russia', coordinates: [37.6173, 55.7558], timestamp: '2026-01-29T16:00:00Z', source: 'NATO' },
  { id: '10', title: 'Sandstorm', description: 'Natural disaster warning - severe weather approaching.', category: 'Natural Disaster', threatLevel: 'medium', location: 'North Africa', country: 'Egypt', coordinates: [31.2357, 30.0444], timestamp: '2026-01-29T12:00:00Z', source: 'WMO' },
  { id: '11', title: 'Pacific Watch', description: 'Submarine activity in contested waters.', category: 'Conflict', threatLevel: 'high', location: 'Pacific Ocean', country: 'Japan', coordinates: [139.6917, 35.6895], timestamp: '2026-01-29T06:00:00Z', source: 'JMSDF' },
  { id: '12', title: 'Nightfall', description: 'Ransomware attack on healthcare systems.', category: 'Cyber', threatLevel: 'critical', location: 'Western Europe', country: 'UK', coordinates: [-0.1276, 51.5074], timestamp: '2026-01-28T20:00:00Z', source: 'NCSC' },
];

const mockAlerts: LiveAlert[] = [
  { id: 'a1', title: 'New Detected', description: 'Live attack 377326 case alert in Lima (Jurisdiction)', timestamp: '2026-01-31T02:20:00Z', threatLevel: 'critical' },
  { id: 'a2', title: 'Live Alert', description: 'Live access 80.82.77 admin security detected', timestamp: '2026-01-31T02:18:00Z', threatLevel: 'high' },
  { id: 'a3', title: 'Live Alert', description: 'Live access 8.125 malwarezone', timestamp: '2026-01-31T02:15:00Z', threatLevel: 'medium' },
  { id: 'a4', title: 'Live Alert', description: 'Live attack 8.05127 Redia buffer denied', timestamp: '2026-01-31T02:10:00Z', threatLevel: 'low' },
];

export const useStore = create<AppState>((set) => ({
  events: mockEvents,
  liveAlerts: mockAlerts,
  selectedEventId: null,
  activeNav: 'Dashboard',
  leftPanelOpen: true,
  rightPanelOpen: true,
  filters: {
    categories: ['Conflict', 'Terrorism', 'Cyber', 'Natural Disaster', 'Political'],
    threatLevels: ['critical', 'high', 'medium', 'low'],
    searchQuery: '',
    showUSBases: false,
    showNATOBases: false,
  },
  setSelectedEvent: (id) => set({ selectedEventId: id }),
  toggleCategory: (cat) => set((state) => ({
    filters: { ...state.filters, categories: state.filters.categories.includes(cat) ? state.filters.categories.filter((c) => c !== cat) : [...state.filters.categories, cat] },
  })),
  toggleThreatLevel: (level) => set((state) => ({
    filters: { ...state.filters, threatLevels: state.filters.threatLevels.includes(level) ? state.filters.threatLevels.filter((l) => l !== level) : [...state.filters.threatLevels, level] },
  })),
  setSearchQuery: (query) => set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  toggleUSBases: () => set((state) => ({ filters: { ...state.filters, showUSBases: !state.filters.showUSBases } })),
  toggleNATOBases: () => set((state) => ({ filters: { ...state.filters, showNATOBases: !state.filters.showNATOBases } })),
  setActiveNav: (nav) => set({ activeNav: nav }),
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
}));
