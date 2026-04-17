import { useEffect, useState } from 'react'

export const useUserGeolocation = (fallback: [number, number]) => {
  const [center, setCenter] = useState<[number, number]>(fallback)

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude])
      },
      () => {
        setCenter(fallback)
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
      },
    )
  }, [fallback])

  return center
}
