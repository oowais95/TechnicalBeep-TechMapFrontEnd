export const MAP_CONFIG = {
  defaultCenter: [40.7128, -74.006] as [number, number],
  defaultZoom: 3,
  focusedZoom: 13,
  tileLayer: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  },
} as const
