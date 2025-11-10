"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { TicketCard } from "@/components/ticket-card"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { CancellationConfirmedModal } from "@/components/cancellation-confirmed-modal"

export default function TicketsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCancelled, setShowCancelled] = useState(false)
  const [actionType, setActionType] = useState<"cancel" | "refund">("cancel")

  const handleAction = (type: "cancel" | "refund") => {
    setActionType(type)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
    setShowCancelled(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Tickets</h1>

        <div className="flex justify-center">
          <TicketCard onCancel={() => handleAction("cancel")} onRefund={() => handleAction("refund")} />
        </div>

        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
          actionType={actionType}
        />

        <CancellationConfirmedModal isOpen={showCancelled} onClose={() => setShowCancelled(false)} />
      </main>
    </div>
  )
}
