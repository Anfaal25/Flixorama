"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ValidateModal } from "@/components/validate-modal"
import { CancellationConfirmedModal } from "@/components/cancellation-confirmed-modal"

type Request = {
  id: string
  movie: string
  theatre: string
  stage: "Requested" | "Validate" | "Refunded"
  dateCreated: string
}

const initialRequests: Request[] = [
  {
    id: "REQ-1023",
    movie: "Avengers: Quantum Rift",
    theatre: "Theatre 3",
    stage: "Requested",
    dateCreated: "2025-01-10",
  },
  {
    id: "REQ-1024",
    movie: "Avengers: Quantum Rift",
    theatre: "Theatre 4",
    stage: "Validate",
    dateCreated: "2025-01-10",
  },
  {
    id: "REQ-1025",
    movie: "Avengers: Quantum Rift",
    theatre: "Theatre 1",
    stage: "Refunded",
    dateCreated: "2025-01-09",
  },
  {
    id: "REQ-1026",
    movie: "Avengers: Quantum Rift",
    theatre: "Theatre 2",
    stage: "Requested",
    dateCreated: "2025-01-09",
  },
  {
    id: "REQ-1027",
    movie: "Avengers: Quantum Rift",
    theatre: "Theatre 5",
    stage: "Validate",
    dateCreated: "2025-01-08",
  },
  {
    id: "REQ-1028",
    movie: "Avengers: Quantum Rift",
    theatre: "Theatre 6",
    stage: "Refunded",
    dateCreated: "2025-01-08",
  },
]

export function ClerkDashboard() {
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false)
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false)

  const handleValidateClick = (request: Request) => {
    setSelectedRequest(request)
    setIsValidateModalOpen(true)
  }

  const handleConfirmValidation = () => {
    if (selectedRequest) {
      setRequests(requests.map((req) => (req.id === selectedRequest.id ? { ...req, stage: "Refunded" } : req)))
    }
    setIsValidateModalOpen(false)
    setIsConfirmedModalOpen(true)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Requested":
        return "text-status-requested"
      case "Validate":
        return "text-status-validate"
      case "Refunded":
        return "text-status-refunded"
      default:
        return ""
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-foreground">Clerk Dashboard</h1>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground">Record ID</TableHead>
              <TableHead className="text-table-header-foreground">Seat/Screen Info</TableHead>
              <TableHead className="text-table-header-foreground">Theater</TableHead>
              <TableHead className="text-table-header-foreground">Status</TableHead>
              <TableHead className="text-table-header-foreground">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="bg-table-row hover:bg-table-row-hover">
                <TableCell className="font-medium text-foreground">{request.id}</TableCell>
                <TableCell className="text-foreground">{request.movie}</TableCell>
                <TableCell className="text-foreground">{request.theatre}</TableCell>
                <TableCell className={getStageColor(request.stage)}>{request.stage}</TableCell>
                <TableCell className="text-foreground">{request.dateCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ValidateModal
        isOpen={isValidateModalOpen}
        onClose={() => setIsValidateModalOpen(false)}
        onConfirm={handleConfirmValidation}
      />

      <CancellationConfirmedModal
        isOpen={isConfirmedModalOpen}
        onClose={() => {
          setIsConfirmedModalOpen(false)
          setSelectedRequest(null)
        }}
      />
    </div>
  )
}
