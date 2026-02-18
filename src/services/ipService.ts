import type { IPData } from '@/types/ipData'
import { ERROR_MESSAGES } from '@/consts'

class IPService {
  private readonly baseUrl = `http://ipwhois.app/json`

  public async getIPData(ip: string): Promise<IPData> {
    let response: Response

    try {
      response = await fetch(`${this.baseUrl}/${ip}`)
    } catch {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }

    if (response.status === 404) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND)
    }

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR)
    }

    const data = await response.json()

    return {
      country: data.country,
      country_flag: data.country_flag,
      timezone: data.timezone,
      timezone_gmt: data.timezone_gmt,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    }
  }
}

export const ipService = new IPService()