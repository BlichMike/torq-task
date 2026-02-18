import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IPLookupContent } from "./IPLookupContent"
import { Separator } from "./ui/separator"
import { DATA_HOOKS } from "@/dataHooks"

export const IPLookupDialog = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => {

  const handleOpenChange = () => {
    onOpenChange(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button data-hook={DATA_HOOKS.LOOKUP_BUTTON} className="bg-[#2596be] hover:bg-[#2596be]/90 text-white" onClick={handleOpenChange}>Lookup IP</Button>
      </DialogTrigger>
      <DialogContent data-hook={DATA_HOOKS.DIALOG} className="sm:max-w-[700px] sm:max-h-[40vh] h-full w-full flex flex-col ">
        <DialogHeader className="gap-4 text-left">
          <DialogTitle>IP Lookup</DialogTitle>
          <Separator />
          <DialogDescription>
            Enter one or more IP addresses and get their country
          </DialogDescription>
        </DialogHeader>
        <IPLookupContent />
      </DialogContent>
    </Dialog>
  )
}