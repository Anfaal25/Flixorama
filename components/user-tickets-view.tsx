"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTickets, type Ticket } from "@/contexts/tickets-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, TicketIcon, X, ArrowRightLeft, CheckCircle2 } from "lucide-react"

export function UserTicketsView() {
  const { user } = useAuth()
  const { tickets, requestCancellation, requestTransfer } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const userTickets = tickets.filter((t) => t.userId === user?.id)
  const upcomingTickets = userTickets.filter((t) => t.status === "active" || t.status === "pending_cancellation")
  const pastTickets = userTickets.filter((t) => t.status === "past" || t.status === "cancelled")

  const handleCancelClick = () => {
    setShowCancelDialog(false)
    setShowConfirmDialog(true)
  }

  const handleConfirmCancel = () => {
    if (selectedTicket) {
      requestCancellation(selectedTicket.id, cancelReason)
      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
      setCancelReason("")
    }
  }

  const handleTransfer = () => {
    if (selectedTicket) {
      requestTransfer(selectedTicket.id)
      setSelectedTicket(null)
    }
  }

  const TicketCard = ({ ticket }: { ticket: Ticket }) => {
    const isSelected = selectedTicket?.id === ticket.id
    const isPending = ticket.status === "pending_cancellation"

    return (
      <Card
        className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary" : ""} ${isPending ? "opacity-60" : ""}`}
        onClick={() => !isPending && setSelectedTicket(isSelected ? null : ticket)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{ticket.movieTitle}</CardTitle>
              <CardDescription className="mt-1">Ticket ID: {ticket.id}</CardDescription>
            </div>
            {isPending && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                Pending Review
              </Badge>
            )}
            {ticket.status === "active" && isSelected && <Badge className="bg-primary">Selected</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(ticket.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{ticket.showtime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{ticket.theater}</span>
            </div>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
              <span>Seat {ticket.seat}</span>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Price</span>
              <span className="font-semibold">${ticket.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground mt-1">View and manage your movie tickets</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TicketIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming tickets</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>

              {selectedTicket && selectedTicket.status === "active" && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Ticket Actions</CardTitle>
                    <CardDescription>Choose an action for the selected ticket</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-3">
                    <Button onClick={() => setShowCancelDialog(true)} variant="default" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Ticket
                    </Button>
                    <Button
                      onClick={handleTransfer}
                      variant="secondary"
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transfer Ticket
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TicketIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No past tickets</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Ticket</DialogTitle>
            <DialogDescription>Please provide a reason for cancellation (optional)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation</Label>
              <Textarea
                id="reason"
                placeholder="Enter your reason here..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">{cancelReason.length} / 500 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Go Back
            </Button>
            <Button onClick={handleCancelClick}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>Are you sure you want to request cancellation for this ticket?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Movie:</span>
                    <span className="font-medium">{selectedTicket?.movieTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {selectedTicket && new Date(selectedTicket.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seat:</span>
                    <span className="font-medium">{selectedTicket?.seat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Go Back
            </Button>
            <Button onClick={handleConfirmCancel} className="bg-orange-500 hover:bg-orange-600">
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Request Submitted</DialogTitle>
            <DialogDescription className="text-center">
              Your cancellation request has been sent to our admin team for review. You will be notified once it has
              been processed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                setSelectedTicket(null)
              }}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
