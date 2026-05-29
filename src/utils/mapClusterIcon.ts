import L from 'leaflet'

type ClusterLike = { getChildCount: () => number }

export const createEventClusterIcon = (cluster: ClusterLike): L.DivIcon => {
  const count = cluster.getChildCount()

  return L.divIcon({
    html: `
      <div class="tem-cluster-marker" aria-hidden="true">
        <div class="tem-cluster-marker__circle">
          <span class="tem-cluster-marker__count">${count}</span>
        </div>
        <span class="tem-cluster-marker__label">events</span>
      </div>
    `,
    className: 'tem-cluster-icon',
    iconSize: L.point(56, 72),
    iconAnchor: L.point(28, 36),
  })
}
