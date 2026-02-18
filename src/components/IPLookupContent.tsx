import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { IPRow } from './IPRow'
import { generateId } from '@/utils'
import { useClockTick } from '@/hooks/useClockTick'
import { DATA_HOOKS } from '@/dataHooks'

export const IPLookupContent = () => {
  const [rowIds, setRowIds] = useState<string[]>(() => [generateId()])
  const { clockTick } = useClockTick()

  const handleAddRow = () => {
    setRowIds((prev) => [...prev, generateId()])
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        data-hook={DATA_HOOKS.ADD_ROW_BUTTON}
        onClick={handleAddRow}
        className="w-fit bg-[#2596be] hover:bg-[#2596be]/90 text-white"
      >
        <PlusIcon className="size-4" />
        Add
      </Button>
      <Separator />
      <div className="flex flex-col gap-4 overflow-auto min-h-[200px] max-h-[300px]">
        {rowIds.map((id, index) => (
          <IPRow key={id} rowIndex={index + 1} clockTick={clockTick} />
        ))}
      </div>
    </div>
  )
}