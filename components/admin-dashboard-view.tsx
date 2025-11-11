"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTickets, type CancellationRequest } from "@/contexts/tickets-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { CheckCircle2 } from "lucide-react"

export function AdminDashboardView() {
  const { logout } = useAuth()
  const { cancellationRequests, approveCancellation, rejectCancellation } = useTickets()
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null)
  const [showValidateDialog, setShowValidateDialog] = useState(false)
  const [showConfirmedDialog, setShowConfirmedDialog] = useState(false)

  const handleValidateClick = (request: CancellationRequest) => {
    setSelectedRequest(request)
    setShowValidateDialog(true)
  }

  const handleApprove = () => {
    if (selectedRequest) {
      approveCancellation(selectedRequest.id)
      setShowValidateDialog(false)
      setShowConfirmedDialog(true)
    }
  }

  const handleReject = () => {
    if (selectedRequest) {
      rejectCancellation(selectedRequest.id)
      setShowValidateDialog(false)
      setSelectedRequest(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clerk Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage ticket cancellation requests</p>
          </div>
          <Button onClick={logout} variant="outline" className="border-gray-300 bg-transparent">
            Logout
          </Button>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0">
            {cancellationRequests.length === 0 ? (
              <div className="text-center py-16 text-gray-600">No cancellation requests yet</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-cyan-500 hover:bg-cyan-500">
                      <TableHead className="text-white font-semibold">Request ID</TableHead>
                      <TableHead className="text-white font-semibold">Movie</TableHead>
                      <TableHead className="text-white font-semibold">Theater</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancellationRequests.map((request, index) => (
                      <TableRow key={request.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <TableCell className="font-medium text-gray-900">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{request.ticket.movieTitle}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(request.ticket.date).toLocaleDateString()} • {request.ticket.showtime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{request.ticket.theater}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          {request.status === "pending" ? (
                            <Button
                              size="sm"
                              onClick={() => handleValidateClick(request)}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white"
                            >
                              Validate
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-500">Processed</span>
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Validate Cancellation</DialogTitle>
              <DialogDescription className="text-gray-600">Review the cancellation request details</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="py-4">
                <Card className="border-gray-200 bg-gray-50">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.userName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Movie:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.ticket.movieTitle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedRequest.ticket.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Seat:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.ticket.seat}</span>
                    </div>
                    {selectedRequest.reason && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Reason:</p>
                        <p className="text-sm text-gray-900">{selectedRequest.reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleReject} className="border-gray-300 text-gray-700 bg-transparent">
                Reject
              </Button>
              <Button onClick={handleApprove} className="bg-orange-500 hover:bg-orange-600 text-white">
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmed Dialog */}
        <Dialog open={showConfirmedDialog} onOpenChange={setShowConfirmedDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-gray-900">Cancellation Confirmed</DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                The ticket has been successfully cancelled and the customer will be notified.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                onClick={() => {
                  setShowConfirmedDialog(false)
                  setSelectedRequest(null)
                }}
                className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
