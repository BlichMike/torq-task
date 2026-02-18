import { Loader2 } from 'lucide-react'
import { DATA_HOOKS } from '@/dataHooks'

interface LoadingSpinnerProps {
  text?: string
}

export const LoadingSpinner = ({ text = 'Searching...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center gap-2" data-hook={DATA_HOOKS.LOADING_SPINNER}>
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}
