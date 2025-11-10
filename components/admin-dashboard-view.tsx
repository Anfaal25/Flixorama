"use client"

import { useState } from "react"
import { useTickets, type CancellationRequest } from "@/contexts/tickets-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Calendar, Clock, MapPin, User } from "lucide-react"

export function AdminDashboardView() {
  const { cancellationRequests, approveCancellation, rejectCancellation } = useTickets()
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null)
  const [showValidateDialog, setShowValidateDialog] = useState(false)
  const [showConfirmedDialog, setShowConfirmedDialog] = useState(false)
  const [action, setAction] = useState<"approve" | "reject">("approve")

  const pendingRequests = cancellationRequests.filter((r) => r.status === "pending")
  const processedRequests = cancellationRequests.filter((r) => r.status !== "pending")

  const handleValidateClick = (request: CancellationRequest, actionType: "approve" | "reject") => {
    setSelectedRequest(request)
    setAction(actionType)
    setShowValidateDialog(true)
  }

  const handleConfirmAction = () => {
    if (selectedRequest) {
      if (action === "approve") {
        approveCancellation(selectedRequest.id)
      } else {
        rejectCancellation(selectedRequest.id)
      }
      setShowValidateDialog(false)
      setShowConfirmedDialog(true)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-600">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clerk Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage ticket cancellation requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-3xl">{pendingRequests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved Today</CardDescription>
            <CardTitle className="text-3xl">
              {processedRequests.filter((r) => r.status === "approved").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">{cancellationRequests.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cancellation Requests</CardTitle>
          <CardDescription>Review and process ticket cancellation requests</CardDescription>
        </CardHeader>
        <CardContent>
          {cancellationRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No cancellation requests yet</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead>Request ID</TableHead>
                    <TableHead>Movie / Details</TableHead>
                    <TableHead>Theater</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancellationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.ticket.movieTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(request.ticket.date).toLocaleDateString()} • {request.ticket.showtime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.ticket.theater}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {request.status === "pending" ? (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleValidateClick(request, "approve")}
                              className="bg-cyan-500 hover:bg-cyan-600"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleValidateClick(request, "reject")}
                              className="bg-purple-500 hover:bg-purple-600 text-white"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Processed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validate Dialog */}
      <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Validate Cancellation" : "Reject Cancellation"}</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "Please confirm that you want to approve this cancellation request."
                : "Please confirm that you want to reject this cancellation request."}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{selectedRequest.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Movie:</span>
                    <span className="font-medium">{selectedRequest.ticket.movieTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Showtime:</span>
                    <span className="font-medium">
                      {new Date(selectedRequest.ticket.date).toLocaleDateString()} at {selectedRequest.ticket.showtime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">
                      {selectedRequest.ticket.theater} - Seat {selectedRequest.ticket.seat}
                    </span>
                  </div>
                  {selectedRequest.reason && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Reason:</p>
                      <p className="text-sm">{selectedRequest.reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={action === "approve" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {action === "approve" ? "Approve Request" : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmed Dialog */}
      <Dialog open={showConfirmedDialog} onOpenChange={setShowConfirmedDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${action === "approve" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {action === "approve" ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
            </div>
            <DialogTitle className="text-center">
              {action === "approve" ? "Cancellation Confirmed" : "Request Rejected"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {action === "approve"
                ? "The ticket has been successfully cancelled and the customer will be notified."
                : "The cancellation request has been rejected and the customer will be notified."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowConfirmedDialog(false)
                setSelectedRequest(null)
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
