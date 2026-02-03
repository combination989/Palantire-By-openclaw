import { useEffect, useRef, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useStore, ThreatLevel } from '../store/useStore';
import { militaryBases } from '../data/militaryBases';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const threatColors: Record<ThreatLevel, string> = {
  critical: '#ff0033',
  high: '#ff6600',
  medium: '#ffcc00',
  low: '#00ff88',
};

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const baseMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const { events, filters, selectedEventId, setSelectedEvent, leftPanelOpen, rightPanelOpen } = useStore();

  const filteredEvents = useMemo(() => events.filter((e) => {
    if (!filters.categories.includes(e.category)) return false;
    if (!filters.threatLevels.includes(e.threatLevel)) return false;
    if (filters.searchQuery && !e.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  }), [events, filters]);

  const geojsonData = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: filteredEvents.map((e) => ({
      type: 'Feature' as const,
      properties: { id: e.id, title: e.title, threatLevel: e.threatLevel },
      geometry: { type: 'Point' as const, coordinates: e.coordinates },
    })),
  }), [filteredEvents]);

  const visibleBases = useMemo(() => militaryBases.filter((b) => {
    if (b.type === 'US' && !filters.showUSBases) return false;
    if (b.type === 'NATO' && !filters.showNATOBases) return false;
    return true;
  }), [filters.showUSBases, filters.showNATOBases]);

  const setupMapLayers = useCallback(() => {
    if (!map.current) return;
    const m = map.current;

    if (m.getSource('events')) {
      (m.getSource('events') as mapboxgl.GeoJSONSource).setData(geojsonData as GeoJSON.FeatureCollection);
      return;
    }

    m.addSource('events', {
      type: 'geojson',
      data: geojsonData as GeoJSON.FeatureCollection,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Cluster circles - Red alert style
    m.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'events',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': 'rgba(255, 0, 51, 0.2)',
        'circle-radius': ['step', ['get', 'point_count'], 25, 5, 35, 15, 45],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ff0033',
      },
    });

    m.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'events',
      filter: ['has', 'point_count'],
      layout: { 'text-field': '{point_count_abbreviated}', 'text-size': 14, 'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'] },
      paint: { 'text-color': '#ff0033' },
    });

    // Glow layers for each threat level
    m.addLayer({
      id: 'glow-critical',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'threatLevel'], 'critical']],
      paint: { 'circle-color': threatColors.critical, 'circle-radius': 20, 'circle-opacity': 0.4, 'circle-blur': 1 },
    });

    m.addLayer({
      id: 'glow-high',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'threatLevel'], 'high']],
      paint: { 'circle-color': threatColors.high, 'circle-radius': 16, 'circle-opacity': 0.4, 'circle-blur': 1 },
    });

    m.addLayer({
      id: 'glow-low',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['in', ['get', 'threatLevel'], ['literal', ['low', 'medium']]]],
      paint: { 'circle-color': '#00ff88', 'circle-radius': 14, 'circle-opacity': 0.4, 'circle-blur': 1 },
    });

    // Main marker layers
    m.addLayer({
      id: 'markers-critical',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'threatLevel'], 'critical']],
      paint: { 'circle-color': threatColors.critical, 'circle-radius': 8, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
    });

    m.addLayer({
      id: 'markers-high',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'threatLevel'], 'high']],
      paint: { 'circle-color': threatColors.high, 'circle-radius': 7, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
    });

    m.addLayer({
      id: 'markers-medium',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'threatLevel'], 'medium']],
      paint: { 'circle-color': threatColors.medium, 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
    });

    m.addLayer({
      id: 'markers-low',
      type: 'circle',
      source: 'events',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'threatLevel'], 'low']],
      paint: { 'circle-color': threatColors.low, 'circle-radius': 5, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
    });

    // Click handlers
    m.on('click', 'clusters', (e) => {
      const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      if (!features.length) return;
      const clusterId = features[0].properties?.cluster_id;
      (m.getSource('events') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom === undefined) return;
        m.easeTo({ center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number], zoom });
      });
    });

    const markerLayers = ['markers-critical', 'markers-high', 'markers-medium', 'markers-low'];
    markerLayers.forEach((layerId) => {
      m.on('click', layerId, (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) setSelectedEvent(feature.properties.id);
      });
      m.on('mouseenter', layerId, () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', layerId, () => { m.getCanvas().style.cursor = ''; });
    });

    m.on('mouseenter', 'clusters', () => { m.getCanvas().style.cursor = 'pointer'; });
    m.on('mouseleave', 'clusters', () => { m.getCanvas().style.cursor = ''; });
  }, [geojsonData, setSelectedEvent]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [30, 20],
      zoom: 1.5,
      minZoom: 0.5,
      maxZoom: 18,
      projection: 'globe',
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    map.current.on('load', () => {
      // Dark red-tinted atmosphere for military feel
      map.current?.setFog({
        color: 'rgb(10, 0, 0)',
        'high-color': 'rgb(30, 5, 5)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(0, 0, 0)',
        'star-intensity': 0.3
      });
      setupMapLayers();
    });

    return () => { map.current?.remove(); map.current = null; };
  }, [setupMapLayers]);

  useEffect(() => {
    if (map.current?.isStyleLoaded() && map.current.getSource('events')) {
      (map.current.getSource('events') as mapboxgl.GeoJSONSource).setData(geojsonData as GeoJSON.FeatureCollection);
    }
  }, [geojsonData]);

  useEffect(() => {
    if (!map.current) return;
    baseMarkersRef.current.forEach(m => m.remove());
    baseMarkersRef.current = [];

    visibleBases.forEach((base) => {
      const el = document.createElement('div');
      const color = base.type === 'US' ? '#00ff88' : '#00aaff';
      el.innerHTML = `<div style="width:8px;height:8px;background:${color};transform:rotate(45deg);border:1px solid rgba(255,255,255,0.5);box-shadow:0 0 8px ${color};"></div>`;
      el.title = base.name;
      const marker = new mapboxgl.Marker({ element: el }).setLngLat(base.coordinates).addTo(map.current!);
      baseMarkersRef.current.push(marker);
    });
  }, [visibleBases]);

  // Resize map when panels toggle
  useEffect(() => {
    if (map.current) {
      setTimeout(() => map.current?.resize(), 350);
    }
  }, [leftPanelOpen, rightPanelOpen]);

  // Fly to selected event
  useEffect(() => {
    if (!map.current || !selectedEventId) return;
    const event = events.find(e => e.id === selectedEventId);
    if (event) {
      map.current.flyTo({ center: event.coordinates, zoom: 5, duration: 1000 });
    }
  }, [selectedEventId, events]);

  // Calculate dynamic positioning - accounting for header (40px) and footer (32px)
  const leftOffset = leftPanelOpen ? 344 : 56; // 56px nav when collapsed
  const rightOffset = rightPanelOpen ? 320 : 0;

  return (
    <div 
      className="fixed transition-all duration-300"
      style={{ left: `${leftOffset}px`, right: `${rightOffset}px`, top: '40px', bottom: '32px' }}
    >
      <div ref={mapContainer} className="w-full h-full" />
      {/* Grid overlay effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,0,51,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,0,51,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} 
      />
    </div>
  );
}
