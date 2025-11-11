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
import { Calendar, Clock, MapPin, TicketIcon, CheckCircle2 } from "lucide-react"

export function UserTicketsView() {
  const { user } = useAuth()
  const { tickets, requestCancellation, requestTransfer } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [actionType, setActionType] = useState<"cancel" | "transfer">("cancel")

  const userTickets = tickets.filter((t) => t.userId === user?.id)
  const upcomingTickets = userTickets.filter((t) => t.status === "active" || t.status === "pending_cancellation")
  const pastTickets = userTickets.filter((t) => t.status === "past" || t.status === "cancelled")

  const handleCancelClick = () => {
    setActionType("cancel")
    setShowCancelDialog(false)
    setShowConfirmDialog(true)
  }

  const handleTransferClick = () => {
    setActionType("transfer")
    setShowTransferDialog(false)
    setShowConfirmDialog(true)
  }

  const handleConfirmAction = () => {
    if (selectedTicket) {
      if (actionType === "cancel") {
        requestCancellation(selectedTicket.id, cancelReason)
      } else {
        requestTransfer(selectedTicket.id)
      }
      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
      setCancelReason("")
    }
  }

  const TicketCard = ({ ticket }: { ticket: Ticket }) => {
    const isSelected = selectedTicket?.id === ticket.id
    const isPending = ticket.status === "pending_cancellation"

    return (
      <Card
        className={`cursor-pointer transition-all border-2 bg-card ${isSelected ? "border-cyan-500 shadow-lg" : "border-border hover:border-muted-foreground/50"} ${isPending ? "opacity-60" : ""}`}
        onClick={() => !isPending && setSelectedTicket(isSelected ? null : ticket)}
      >
        {ticket.image && (
          <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
            <img
              src={ticket.image || "/placeholder.svg"}
              alt={ticket.movieTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{ticket.movieTitle}</CardTitle>
              <CardDescription className="mt-1">#{ticket.id}</CardDescription>
            </div>
            {isPending && (
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300">
                Pending Review
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Price</span>
              <span className="text-lg font-bold">${ticket.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <p className="text-muted-foreground mt-2">View and manage your movie tickets</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
          <TabsTrigger value="past">Past Purchases ({pastTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 mt-8">
          {upcomingTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <TicketIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-foreground text-lg">No upcoming tickets</p>
                <p className="text-muted-foreground text-sm mt-1">Book a movie to see your tickets here</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>

              {selectedTicket && selectedTicket.status === "active" && (
                <Card className="border-2 border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/30">
                  <CardHeader>
                    <CardTitle>Ticket Selected</CardTitle>
                    <CardDescription>Choose an action for {selectedTicket.movieTitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-3">
                    <Button
                      onClick={() => setShowCancelDialog(true)}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white h-12"
                    >
                      Cancel Ticket
                    </Button>
                    <Button
                      onClick={() => setShowTransferDialog(true)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white h-12"
                    >
                      Transfer Ticket
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6 mt-8">
          {pastTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <TicketIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-foreground text-lg">No past tickets</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Reason Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Ticket</DialogTitle>
            <DialogDescription>Please provide a reason for cancellation (optional)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation</Label>
              <Textarea
                id="reason"
                placeholder="Let us know why you're canceling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Go Back
            </Button>
            <Button onClick={handleCancelClick} className="bg-cyan-500 hover:bg-cyan-600">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Ticket</DialogTitle>
            <DialogDescription>Transfer this ticket to another user</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              You are about to transfer your ticket for <strong>{selectedTicket?.movieTitle}</strong>. This action will
              send a request to the admin for approval.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Go Back
            </Button>
            <Button onClick={handleTransferClick} className="bg-purple-500 hover:bg-purple-600">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === "cancel" ? "Confirm Cancellation" : "Confirm Transfer"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType === "cancel" ? "cancel" : "transfer"} this ticket?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Card className="bg-muted/50">
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${selectedTicket?.price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Go Back
            </Button>
            <Button onClick={handleConfirmAction} className="bg-orange-500 hover:bg-orange-600">
              Confirm {actionType === "cancel" ? "Cancellation" : "Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-950 p-4 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Request Submitted</DialogTitle>
            <DialogDescription className="text-center">
              Your {actionType === "cancel" ? "cancellation" : "transfer"} request has been sent to our admin team for
              review. You will be notified once it has been processed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                setSelectedTicket(null)
              }}
              className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
