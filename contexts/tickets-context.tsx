"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Ticket {
  id: string
  movieTitle: string
  showtime: string
  date: string
  theater: string
  seat: string
  screen: string
  price: number
  status: "active" | "past" | "cancelled" | "pending_cancellation" | "pending_transfer"
  purchaseDate: string
  userId: string
  image?: string // Added image field
}

export interface CancellationRequest {
  id: string
  ticketId: string
  ticket: Ticket
  userId: string
  userName: string
  requestDate: string
  reason?: string
  status: "pending" | "approved" | "rejected"
}

interface TicketsContextType {
  tickets: Ticket[]
  cancellationRequests: CancellationRequest[]
  requestCancellation: (ticketId: string, reason?: string) => void
  requestTransfer: (ticketId: string) => void
  approveCancellation: (requestId: string) => void
  rejectCancellation: (requestId: string) => void
  addTicket: (ticket: Omit<Ticket, "id" | "status" | "purchaseDate">) => void // Added addTicket method
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined)

// Mock tickets data
const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    movieTitle: "Avengers: Quantum 801",
    showtime: "7:30 PM",
    date: "2025-01-15",
    theater: "Theater 3",
    seat: "A-12",
    screen: "Screen 01",
    price: 15.99,
    status: "active",
    purchaseDate: "2025-01-10",
    userId: "1",
    image: "/generic-superhero-team-poster.png", // Added image
  },
  {
    id: "TKT-002",
    movieTitle: "Cosmic Warriors",
    showtime: "9:00 PM",
    date: "2025-01-18",
    theater: "Theater 5",
    seat: "B-08",
    screen: "Screen 02",
    price: 18.99,
    status: "active",
    purchaseDate: "2025-01-11",
    userId: "1",
    image: "/space-movie-poster.png", // Added image
  },
  {
    id: "TKT-003",
    movieTitle: "The Last Journey",
    showtime: "6:00 PM",
    date: "2024-12-20",
    theater: "Theater 2",
    seat: "C-15",
    screen: "Screen 03",
    price: 12.99,
    status: "past",
    purchaseDate: "2024-12-15",
    userId: "1",
    image: "/detective-movie-poster.jpg", // Added image
  },
  {
    id: "TKT-004",
    movieTitle: "Space Odyssey 2025",
    showtime: "8:30 PM",
    date: "2025-01-20",
    theater: "Theater 1",
    seat: "D-10",
    screen: "Screen 01",
    price: 16.99,
    status: "active",
    purchaseDate: "2025-01-12",
    userId: "1",
    image: "/romance-movie-poster.png", // Added image
  },
]

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>([])

  useEffect(() => {
    // Load from localStorage or use initial data
    const storedTickets = localStorage.getItem("cinema_tickets")
    const storedRequests = localStorage.getItem("cinema_cancellation_requests")

    if (storedTickets) {
      setTickets(JSON.parse(storedTickets))
    } else {
      setTickets(INITIAL_TICKETS)
      localStorage.setItem("cinema_tickets", JSON.stringify(INITIAL_TICKETS))
    }

    if (storedRequests) {
      setCancellationRequests(JSON.parse(storedRequests))
    }
  }, [])

  const requestCancellation = (ticketId: string, reason?: string) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket) return

    const newRequest: CancellationRequest = {
      id: `REQ-${Date.now()}`,
      ticketId,
      ticket,
      userId: ticket.userId,
      userName: "John Doe",
      requestDate: new Date().toISOString(),
      reason,
      status: "pending",
    }

    const updatedRequests = [...cancellationRequests, newRequest]
    setCancellationRequests(updatedRequests)
    localStorage.setItem("cinema_cancellation_requests", JSON.stringify(updatedRequests))

    // Update ticket status
    const updatedTickets = tickets.map((t) =>
      t.id === ticketId ? { ...t, status: "pending_cancellation" as const } : t,
    )
    setTickets(updatedTickets)
    localStorage.setItem("cinema_tickets", JSON.stringify(updatedTickets))
  }

  const requestTransfer = (ticketId: string) => {
    // For now, just update status - full transfer flow can be added later
    const updatedTickets = tickets.map((t) => (t.id === ticketId ? { ...t, status: "pending_transfer" as const } : t))
    setTickets(updatedTickets)
    localStorage.setItem("cinema_tickets", JSON.stringify(updatedTickets))
  }

  const approveCancellation = (requestId: string) => {
    const request = cancellationRequests.find((r) => r.id === requestId)
    if (!request) return

    // Update request status
    const updatedRequests = cancellationRequests.map((r) =>
      r.id === requestId ? { ...r, status: "approved" as const } : r,
    )
    setCancellationRequests(updatedRequests)
    localStorage.setItem("cinema_cancellation_requests", JSON.stringify(updatedRequests))

    // Update ticket status
    const updatedTickets = tickets.map((t) => (t.id === request.ticketId ? { ...t, status: "cancelled" as const } : t))
    setTickets(updatedTickets)
    localStorage.setItem("cinema_tickets", JSON.stringify(updatedTickets))
  }

  const rejectCancellation = (requestId: string) => {
    const request = cancellationRequests.find((r) => r.id === requestId)
    if (!request) return

    // Update request status
    const updatedRequests = cancellationRequests.map((r) =>
      r.id === requestId ? { ...r, status: "rejected" as const } : r,
    )
    setCancellationRequests(updatedRequests)
    localStorage.setItem("cinema_cancellation_requests", JSON.stringify(updatedRequests))

    // Revert ticket status
    const updatedTickets = tickets.map((t) => (t.id === request.ticketId ? { ...t, status: "active" as const } : t))
    setTickets(updatedTickets)
    localStorage.setItem("cinema_tickets", JSON.stringify(updatedTickets))
  }

  const addTicket = (ticketData: Omit<Ticket, "id" | "status" | "purchaseDate">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${Date.now()}`,
      status: "active",
      purchaseDate: new Date().toISOString(),
    }

    const updatedTickets = [...tickets, newTicket]
    setTickets(updatedTickets)
    localStorage.setItem("cinema_tickets", JSON.stringify(updatedTickets))
  }

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        cancellationRequests,
        requestCancellation,
        requestTransfer,
        approveCancellation,
        rejectCancellation,
        addTicket, // Added to context value
      }}
    >
      {children}
    </TicketsContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketsContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketsProvider")
  }
  return context
}
