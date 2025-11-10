"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CancelPage() {
  const [reason, setReason] = useState("")
  const maxLength = 200

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Tickets</h1>

        <div className="flex justify-center">
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

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-foreground">Reason for cancellation</label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value.slice(0, maxLength))}
                  placeholder="Please provide a reason for cancellation..."
                  className="min-h-[100px] resize-none"
                  maxLength={maxLength}
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {reason.length}/{maxLength} characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600">Submit Cancellation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
