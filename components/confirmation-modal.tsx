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

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  actionType: "cancel" | "refund"
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, actionType }: ConfirmationModalProps) {
  const title = actionType === "cancel" ? "Validate Cancellation" : "Validate Refund"
  const message =
    actionType === "cancel"
      ? "Are you sure you want to progress this item?"
      : "Are you sure you want to refund this ticket?"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="pt-4 text-base text-foreground">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={onConfirm} className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
