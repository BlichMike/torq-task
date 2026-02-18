import { useState, useEffect } from 'react'

export const useClockTick = () => {
  const [clockTick, setClockTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setClockTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return { clockTick }
}
