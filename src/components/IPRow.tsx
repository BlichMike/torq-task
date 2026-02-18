import { useState } from 'react'
import { useGetIPData } from '@/hooks/useGetIPData'
import { isValidIP, formatTime } from '@/utils'
import { Input } from './ui/input'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { ERROR_MESSAGES } from '@/consts'
import { DATA_HOOKS } from '@/dataHooks'

export interface IPRowProps {
  rowIndex: number
  clockTick: number
}

export const IPRow: React.FC<IPRowProps> = ({ rowIndex, clockTick: _clockTick }) => {
  const [ipInput, setIpInput] = useState<string>('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [shouldGetData, setShouldGetData] = useState(false)

  const { data, isLoading, error } = useGetIPData(ipInput, shouldGetData)
  const currentTime = data?.timezone ? formatTime(data.timezone) : null

  const handleBlur = () => {
    if (ipInput.length === 0) {
      return
    }

    if (!isValidIP(ipInput)) {
      setValidationError(ERROR_MESSAGES.INVALID_IP_FORMAT)
      setShouldGetData(false)
      return
    }

    setValidationError(null)
    setShouldGetData(true)
  }

  const handleChange = (value: string) => {
    setIpInput(value)
    setValidationError(null)
    setShouldGetData(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 my-1">
        <span className="text-sm text-muted-foreground bg-gray-100 rounded-full w-8 h-8 min-w-8 min-h-8 flex items-center justify-center">
          {rowIndex}
        </span>
        <Input
          data-hook={DATA_HOOKS.IP_INPUT}
          type="text"
          placeholder="Enter IP address"
          value={ipInput}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          disabled={isLoading}
          className={`${validationError ? 'border-red-500' : ''} w-[60%]`}
        />
        {isLoading && <LoadingSpinner />}
        {data && (
          <div className="flex items-center gap-2 w-[30%]">
            <img
              data-hook={DATA_HOOKS.COUNTRY_FLAG}
              src={data.country_flag}
              title={`${data.country}`}
              className="w-8 rounded"
            />
            {currentTime && (
              <span data-hook={DATA_HOOKS.CLOCK_TIME} className="text-sm font-mono text-muted-foreground" title={`${data.timezone}`}>
                {currentTime}
              </span>
            )}
          </div>
        )}
      </div>
      {validationError && <ErrorMessage message={validationError} />}
      {error && !isLoading && <ErrorMessage message={error.message} />}
    </div>
  )
}