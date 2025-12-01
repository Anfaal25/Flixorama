"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { useAuth, getUserProfile } from "@/contexts/auth-context"
import { useTickets } from "@/contexts/tickets-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, Calendar, CheckCircle2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

const movies = [
  {
    id: 1,
    title: "Avengers: Quantum 801",
    description: "Earth's mightiest heroes face their greatest challenge yet in this epic conclusion.",
    genre: "Action, Sci-Fi",
    duration: "156 min",
    rating: "PG-13",
    showtimes: ["2:00 PM", "5:30 PM", "8:45 PM"],
    image: "/generic-superhero-team-poster.png",
    price: 15.99,
  },
  {
    id: 2,
    title: "Cosmic Odyssey",
    description: "A journey through space and time that will leave you breathless.",
    genre: "Sci-Fi, Adventure",
    duration: "142 min",
    rating: "PG",
    showtimes: ["1:30 PM", "4:45 PM", "7:30 PM"],
    image: "/space-movie-poster.png",
    price: 14.99,
  },
  {
    id: 3,
    title: "The Last Detective",
    description: "A gripping mystery that keeps you guessing until the very end.",
    genre: "Mystery, Thriller",
    duration: "128 min",
    rating: "R",
    showtimes: ["3:00 PM", "6:15 PM", "9:30 PM"],
    image: "/detective-movie-poster.jpg",
    price: 13.99,
  },
  {
    id: 4,
    title: "Summer Dreams",
    description: "A heartwarming tale of love, loss, and second chances.",
    genre: "Romance, Drama",
    duration: "118 min",
    rating: "PG-13",
    showtimes: ["2:30 PM", "5:00 PM", "7:45 PM"],
    image: "/romance-movie-poster.png",
    price: 12.99,
  },
]

const generateSeats = () => {
  const rows = 7 // 7 rows to match the image
  const seatsPerRow = 11 // 11 seats per row
  const allSeats = []

  for (let row = 1; row <= rows; row++) {
    for (let i = 1; i <= seatsPerRow; i++) {
      allSeats.push({
        id: `${row}-${i}`,
        row,
        number: i,
        status: Math.random() > 0.75 ? "booked" : "available",
      })
    }
  }

  return allSeats
}

export default function MoviesPage() {
  const { user } = useAuth()
  const { addTicket } = useTickets()
  const router = useRouter()
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showGuestWarning, setShowGuestWarning] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<(typeof movies)[0] | null>(null)
  const [selectedShowtime, setSelectedShowtime] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [seats, setSeats] = useState(generateSeats())
  const [guestEmail, setGuestEmail] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [emailError, setEmailError] = useState("")

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split("T")[0]
  })

  if (!user) {
    router.push("/")
    return null
  }

  const handleBookClick = (movie: (typeof movies)[0]) => {
    if (user.role === "guest") {
      setSelectedMovie(movie)
      setShowGuestWarning(true)
      return
    }
    setSelectedMovie(movie)
    setSelectedShowtime("")
    setSelectedDate("")
    setSelectedSeats([])
    setSeats(generateSeats())
    setShowBookingDialog(true)
  }

  const handleGuestContinue = () => {
    setShowGuestWarning(false)
    setSelectedShowtime("")
    setSelectedDate("")
    setSelectedSeats([])
    setSeats(generateSeats())
    setShowBookingDialog(true)
  }

  const handleConfirmBooking = () => {
    if (selectedMovie && selectedShowtime && selectedDate && selectedSeats.length > 0) {
      setShowBookingDialog(false)
      setShowPaymentDialog(true)
    }
  }

  const handlePaymentConfirm = () => {
    if (user?.role === "guest") {
      if (!guestEmail || !guestEmail.includes("@")) {
        setEmailError("Please enter a valid email address")
        return
      }
      if (!selectedPaymentMethod) {
        setEmailError("Please select a payment method")
        return
      }
    } else {
      const userProfile = getUserProfile(user!.id)
      if (!selectedPaymentMethod && userProfile?.paymentMethods.length) {
        setEmailError("Please select a payment method")
        return
      }
    }

    if (selectedMovie && selectedShowtime && selectedDate && selectedSeats.length > 0) {
      // Add ticket for each selected seat
      selectedSeats.forEach((seat) => {
        addTicket({
          movieTitle: selectedMovie.title,
          showtime: selectedShowtime,
          date: selectedDate,
          theater: `Theater ${Math.floor(Math.random() * 5) + 1}`,
          seat,
          screen: `Screen ${Math.floor(Math.random() * 3) + 1}`,
          price: selectedMovie.price,
          userId: user!.id,
          image: selectedMovie.image,
        })
      })
      setShowPaymentDialog(false)
      setShowSuccessDialog(true)
      resetBookingStates()
    }
  }

  const resetBookingStates = () => {
    setSelectedShowtime("")
    setSelectedDate("")
    setSelectedSeats([])
    setSeats(generateSeats())
    setGuestEmail("")
    setSelectedPaymentMethod("")
    setEmailError("")
  }

  const toggleSeat = (seatId: string, status: string) => {
    if (status === "booked") return

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId)
      } else {
        return [...prev, seatId]
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
          <p className="text-muted-foreground">Browse our current movie selection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="object-cover w-full h-full" />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{movie.title}</CardTitle>
                  <Badge variant="secondary">{movie.rating}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{movie.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.genre}</span>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-medium mb-2">Showtimes:</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleBookClick(movie)} className="w-full bg-cyan-500 hover:bg-cyan-600">
                  Book Tickets
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={showGuestWarning} onOpenChange={setShowGuestWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guest Mode Limitations</DialogTitle>
            <DialogDescription>You are browsing as a guest. Please note the following restrictions:</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">Tickets cannot be cancelled</p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                    Guest tickets are final and cannot be refunded
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">Tickets cannot be transferred</p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                    You cannot transfer tickets to other users
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs pt-2">
                Create an account for full access to all features and flexibility with your tickets.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowGuestWarning(false)}>
              Cancel
            </Button>
            <Button onClick={handleGuestContinue} className="bg-cyan-500 hover:bg-cyan-600">
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Ticket</DialogTitle>
            <DialogDescription>
              Select your preferred date, showtime, and seats for {selectedMovie?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Date Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Date</Label>
              <RadioGroup value={selectedDate} onValueChange={setSelectedDate} className="grid grid-cols-4 gap-2">
                {availableDates.map((date) => (
                  <div key={date}>
                    <RadioGroupItem value={date} id={`date-${date}`} className="peer sr-only" />
                    <Label
                      htmlFor={`date-${date}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-cyan-500 [&:has([data-state=checked])]:border-cyan-500 cursor-pointer"
                    >
                      <span className="text-xs font-medium">
                        {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Showtime Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Showtime</Label>
              <RadioGroup
                value={selectedShowtime}
                onValueChange={setSelectedShowtime}
                className="grid grid-cols-3 gap-2"
              >
                {selectedMovie?.showtimes.map((time) => (
                  <div key={time}>
                    <RadioGroupItem value={time} id={`time-${time}`} className="peer sr-only" />
                    <Label
                      htmlFor={`time-${time}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-cyan-500 [&:has([data-state=checked])]:border-cyan-500 cursor-pointer"
                    >
                      <span className="text-sm font-medium">{time}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Seat Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Seats</Label>

              {/* Screen indicator with curved design */}
              <div className="relative py-8 mb-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4">
                  <svg viewBox="0 0 600 60" className="w-full">
                    <path
                      d="M 10 50 Q 300 10 590 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-400 dark:text-gray-600"
                    />
                  </svg>
                </div>
                <div className="text-center pt-12">
                  <span className="text-xs font-medium text-muted-foreground tracking-widest">SCREEN</span>
                </div>
              </div>

              {/* Seat grid matching the theater layout */}
              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <div key={row} className="flex items-center gap-2 justify-center">
                      <span className="w-6 text-gray-400 text-sm font-medium">{row}</span>
                      <div className="flex gap-1.5">
                        {seats
                          .filter((seat) => seat.row === row)
                          .map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id, seat.status)}
                              disabled={seat.status === "booked"}
                              className={`relative w-9 h-9 rounded-md transition-all ${
                                seat.status === "booked"
                                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                                  : selectedSeats.includes(seat.id)
                                    ? "bg-amber-500 scale-105 shadow-lg"
                                    : "bg-gray-400 hover:bg-gray-300"
                              }`}
                              title={seat.status === "booked" ? "Unavailable" : seat.id}
                            />
                          ))}
                      </div>
                      <span className="w-6 text-gray-400 text-sm font-medium">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 text-white text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 rounded-md" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-500 rounded-md" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-md opacity-50" />
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {selectedDate && selectedShowtime && selectedSeats.length > 0 && (
              <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Selected Seats: {selectedSeats.join(", ")} ({selectedSeats.length}{" "}
                      {selectedSeats.length === 1 ? "seat" : "seats"})
                    </p>
                    <span className="font-semibold">Total Price:</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    ${((selectedMovie?.price || 0) * selectedSeats.length).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedShowtime || selectedSeats.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Complete your booking by providing payment information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Booking Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Movie:</span>
                <span className="font-medium">{selectedMovie?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {selectedDate &&
                    new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedShowtime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats:</span>
                <span className="font-medium">{selectedSeats.join(", ")}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-emerald-600">
                  ${((selectedMovie?.price || 0) * selectedSeats.length).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Guest Email Input */}
            {user?.role === "guest" && (
              <div className="space-y-2">
                <Label htmlFor="guest-email">Email Address *</Label>
                <Input
                  id="guest-email"
                  type="email"
                  placeholder="your@email.com"
                  value={guestEmail}
                  onChange={(e) => {
                    setGuestEmail(e.target.value)
                    setEmailError("")
                  }}
                />
                <p className="text-xs text-muted-foreground">Your ticket will be sent to this email</p>
              </div>
            )}

            {/* Payment Method Selection for Guests */}
            {user?.role === "guest" && (
              <div className="space-y-2">
                <Label htmlFor="guest-payment">Payment Method *</Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={(value) => {
                    setSelectedPaymentMethod(value)
                    setEmailError("")
                  }}
                >
                  <SelectTrigger id="guest-payment">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Payment Method Selection for Registered Users */}
            {user?.role !== "guest" &&
              getUserProfile(user!.id)?.paymentMethods &&
              getUserProfile(user!.id)!.paymentMethods.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Select Payment Method *</Label>
                  <Select
                    value={selectedPaymentMethod}
                    onValueChange={(value) => {
                      setSelectedPaymentMethod(value)
                      setEmailError("")
                    }}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Choose a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUserProfile(user!.id)!.paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.type} •••• {method.last4}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            {emailError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentDialog(false)
                setShowBookingDialog(true)
              }}
            >
              Back
            </Button>
            <Button onClick={handlePaymentConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-950 p-4 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center space-y-2">
              <p>Your ticket for {selectedMovie?.title} has been successfully booked.</p>
              <div className="flex items-center justify-center gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">
                  Confirmation and ticket sent to {user?.role === "guest" ? guestEmail : user?.email}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                if (user?.role !== "guest") {
                  router.push("/tickets")
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
            >
              {user?.role === "guest" ? "Done" : "View My Tickets"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
