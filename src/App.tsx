import { useState } from 'react'
import { IPLookupDialog } from './components/IPLookupDialog'

export const App = () => {
  const [isIPLookupOpen, setIsIPLookupOpen] = useState(false)
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">
        Welcome to the Torq task, click the button below to start the IP lookup
      </h1>
      <IPLookupDialog isOpen={isIPLookupOpen} onOpenChange={setIsIPLookupOpen} />
    </div>
  )
}
