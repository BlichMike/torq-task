import { ipService } from '@/services/ipService'
import { useQuery } from '@tanstack/react-query'
import type { IPData } from '@/types/ipData'
import { isValidIP } from '@/utils'

interface UseGetIPDataReturn {
  data: IPData | undefined
  isLoading: boolean
  error: Error | null
}

export const useGetIPData = (ip: string, enabled: boolean): UseGetIPDataReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ipData', ip],
    queryFn: () => ipService.getIPData(ip),
    enabled: enabled && isValidIP(ip),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    error: error as Error | null,
  }
}