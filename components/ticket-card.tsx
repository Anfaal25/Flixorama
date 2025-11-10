"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TicketCardProps {
  onCancel?: () => void
  onRefund?: () => void
  showActions?: boolean
}

export function TicketCard({ onCancel, onRefund, showActions = true }: TicketCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="h-32 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600" />

          <div className="flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-foreground">Avengers: Quantum 801</h2>
              <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-medium text-white">Requested</span>
            </div>
            <p className="text-sm text-muted-foreground">Sci-Fi • Action • Thriller • 2025</p>
            <p className="mt-2 text-sm text-muted-foreground">Screen 3 • Seat C12</p>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-3">
            <Button onClick={onCancel} className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600">
              Cancel Ticket
            </Button>
            <Button onClick={onRefund} className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
              Refund Ticket
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
