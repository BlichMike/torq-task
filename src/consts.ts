export const IP_VALIDATION = {
  IPV4_REGEX: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
} as const

export const ERROR_MESSAGES = {
  INVALID_IP_FORMAT: 'Please enter a valid IP address',
  NETWORK_ERROR: 'Unable to connect. Please try again.',
  NOT_FOUND: 'IP address not found',
  UNKNOWN_ERROR: 'An error occurred. Please try again.',
} as const
