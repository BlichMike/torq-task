import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useClockTick } from '@/hooks/useClockTick'

describe('useClockTick', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at 0', () => {
    const { result } = renderHook(() => useClockTick())
    expect(result.current.clockTick).toBe(0)
  })

  it('increments by 1 after one second', () => {
    const { result } = renderHook(() => useClockTick())
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.clockTick).toBe(1)
  })

  it('increments once per second over multiple seconds', () => {
    const { result } = renderHook(() => useClockTick())
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.clockTick).toBe(5)
  })

  it('does not increment before a full second has passed', () => {
    const { result } = renderHook(() => useClockTick())
    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current.clockTick).toBe(0)
  })

  it('clears the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = renderHook(() => useClockTick())
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalledOnce()
  })

  it('stops incrementing after unmount', () => {
    const { result, unmount } = renderHook(() => useClockTick())
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    unmount()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.clockTick).toBe(2)
  })
})
