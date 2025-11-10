"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CancellationConfirmedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CancellationConfirmedModal({ isOpen, onClose }: CancellationConfirmedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Cancellation Confirmed</DialogTitle>
          <DialogDescription className="pt-4 text-base text-foreground">
            The ticket has been successfully cancelled and the customer has been notified.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-cyan-500 text-white hover:bg-cyan-600 sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
