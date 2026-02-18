import { IP_VALIDATION } from '@/consts'
export const formatTime = (timezone: string): string => {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export const isValidIP = (ip: string): boolean => {
  if (!ip || ip.trim() === '') {
    return false
  }

  return IP_VALIDATION.IPV4_REGEX.test(ip.trim())
}

export const generateId = (): string => {
  return crypto.randomUUID()
}