export interface MilitaryBase {
  id: string;
  name: string;
  type: 'US' | 'NATO';
  coordinates: [number, number];
}

export const militaryBases: MilitaryBase[] = [
  { id: 'us1', name: 'Ramstein Air Base', type: 'US', coordinates: [7.6003, 49.4369] },
  { id: 'us2', name: 'Camp Humphreys', type: 'US', coordinates: [127.0374, 36.9633] },
  { id: 'us3', name: 'Yokosuka Naval Base', type: 'US', coordinates: [139.6544, 35.2836] },
  { id: 'us4', name: 'Naval Station Rota', type: 'US', coordinates: [-6.3494, 36.6175] },
  { id: 'us5', name: 'Camp Lemonnier', type: 'US', coordinates: [43.1456, 11.5469] },
  { id: 'nato1', name: 'NATO HQ Brussels', type: 'NATO', coordinates: [4.4200, 50.8797] },
  { id: 'nato2', name: 'Allied Joint Force Command Naples', type: 'NATO', coordinates: [14.2681, 40.8518] },
  { id: 'nato3', name: 'SHAPE Mons', type: 'NATO', coordinates: [3.9717, 50.4542] },
  { id: 'nato4', name: 'NATO Air Command Izmir', type: 'NATO', coordinates: [27.1428, 38.4237] },
];
