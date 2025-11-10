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

interface ValidateModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ValidateModal({ isOpen, onClose, onConfirm }: ValidateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Validate Cancellation</DialogTitle>
          <DialogDescription className="space-y-2 pt-4 text-base text-muted-foreground">
            <p>Approve this cancellation request?</p>
            <p>This action will notify the customer and update the status.</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-status-requested bg-transparent text-status-requested hover:bg-status-requested/10"
          >
            Back
          </Button>
          <Button onClick={onConfirm} className="bg-status-validate text-white hover:bg-status-validate/90">
            Validate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
