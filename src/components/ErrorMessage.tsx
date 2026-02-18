import { AlertCircle } from 'lucide-react'
import { DATA_HOOKS } from '@/dataHooks'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="flex items-center gap-2" data-hook={DATA_HOOKS.ERROR_MESSAGE}>
      <AlertCircle className="h-4 w-4 text-red-500" />
      <span className="text-sm text-red-500">{message}</span>
    </div>
  )
}
