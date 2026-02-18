import { describe, it, expect } from 'vitest'
import { isValidIP, formatTime, generateId } from '@/utils'

describe('isValidIP', () => {
  it('returns true for valid IPv4 addresses', () => {
    expect(isValidIP('1.1.1.1')).toBe(true)
    expect(isValidIP('8.8.8.8')).toBe(true)
    expect(isValidIP('192.168.1.1')).toBe(true)
    expect(isValidIP('0.0.0.0')).toBe(true)
    expect(isValidIP('255.255.255.255')).toBe(true)
    expect(isValidIP('10.0.0.1')).toBe(true)
  })

  it('returns false for out-of-range octets', () => {
    expect(isValidIP('256.0.0.1')).toBe(false)
    expect(isValidIP('1.999.0.1')).toBe(false)
    expect(isValidIP('1.2.3.300')).toBe(false)
  })

  it('returns false for wrong number of octets', () => {
    expect(isValidIP('1.2.3')).toBe(false)
    expect(isValidIP('1.2.3.4.5')).toBe(false)
    expect(isValidIP('1.2')).toBe(false)
  })

  it('returns false for non-numeric octets', () => {
    expect(isValidIP('abc.def.ghi.jkl')).toBe(false)
    expect(isValidIP('192.168.1.x')).toBe(false)
  })

  it('returns false for malformed separators', () => {
    expect(isValidIP('192.168.1.')).toBe(false)
    expect(isValidIP('.1.2.3.4')).toBe(false)
    expect(isValidIP('192,168,1,1')).toBe(false)
  })

  it('returns false for empty or whitespace-only input', () => {
    expect(isValidIP('')).toBe(false)
    expect(isValidIP('   ')).toBe(false)
  })

  it('returns false for IPv6 addresses', () => {
    expect(isValidIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(false)
    expect(isValidIP('::1')).toBe(false)
  })
})

describe('formatTime', () => {
  it('returns a HH:MM:SS string for a valid timezone', () => {
    const result = formatTime('America/New_York')
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('returns a HH:MM:SS string for UTC', () => {
    const result = formatTime('UTC')
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('returns a HH:MM:SS string for a European timezone', () => {
    const result = formatTime('Europe/London')
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('generates unique IDs on each call', () => {
    const ids = Array.from({ length: 20 }, generateId)
    const unique = new Set(ids)
    expect(unique.size).toBe(20)
  })
})
