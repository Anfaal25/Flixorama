"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useTickets } from "@/contexts/tickets-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, Calendar, CheckCircle2, Armchair } from "lucide-react"
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
  const rows = ["A", "B", "C", "D", "E", "F"]
  const seatsPerRow = 20
  const allSeats = []

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      allSeats.push({
        id: `${row}-${i}`,
        row,
        number: i,
        status: Math.random() > 0.7 ? "booked" : "available", // Some seats are pre-booked
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<(typeof movies)[0] | null>(null)
  const [selectedShowtime, setSelectedShowtime] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSeat, setSelectedSeat] = useState("")
  const [seats, setSeats] = useState(generateSeats())

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
    setSelectedMovie(movie)
    setSelectedShowtime("")
    setSelectedDate("")
    setSelectedSeat("")
    setSeats(generateSeats()) // Generate fresh seat layout
    setShowBookingDialog(true)
  }

  const handleConfirmBooking = () => {
    if (selectedMovie && selectedShowtime && selectedDate && selectedSeat) {
      addTicket({
        movieTitle: selectedMovie.title,
        showtime: selectedShowtime,
        date: selectedDate,
        theater: `Theater ${Math.floor(Math.random() * 5) + 1}`,
        seat: selectedSeat,
        screen: `Screen ${Math.floor(Math.random() * 3) + 1}`,
        price: selectedMovie.price,
        userId: user.id,
        image: selectedMovie.image,
      })
      setShowBookingDialog(false)
      setShowSuccessDialog(true)
    }
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

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Ticket</DialogTitle>
            <DialogDescription>
              Select your preferred date, showtime, and seat for {selectedMovie?.title}
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

            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Seat</Label>

              {/* Screen indicator */}
              <div className="bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 py-4 rounded-lg text-center border-b-4 border-gray-300 dark:border-gray-600">
                <span className="text-lg font-bold tracking-widest">SCREEN</span>
              </div>

              {/* Seat grid with visual chair icons */}
              <div className="bg-black/90 dark:bg-black p-6 rounded-lg">
                <div className="space-y-2">
                  {["A", "B", "C", "D", "E", "F"].map((row) => (
                    <div key={row} className="flex items-center gap-1">
                      <span className="w-6 text-white text-xs font-bold">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {seats
                          .filter((seat) => seat.row === row)
                          .map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => seat.status === "available" && setSelectedSeat(seat.id)}
                              disabled={seat.status === "booked"}
                              className={`relative w-7 h-7 rounded-t-md transition-all ${
                                seat.status === "booked"
                                  ? "bg-red-600 cursor-not-allowed opacity-80"
                                  : selectedSeat === seat.id
                                    ? "bg-purple-500 scale-110 shadow-lg"
                                    : "bg-fuchsia-500 hover:bg-fuchsia-400 hover:scale-105"
                              }`}
                              title={seat.status === "booked" ? "Unavailable" : seat.id}
                            >
                              <Armchair className="w-4 h-4 absolute inset-0 m-auto text-white/90" />
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                                {seat.number}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 text-white text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-fuchsia-500 rounded-t-md flex items-center justify-center">
                      <Armchair className="w-3 h-3" />
                    </div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-500 rounded-t-md flex items-center justify-center">
                      <Armchair className="w-3 h-3" />
                    </div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-600 rounded-t-md flex items-center justify-center">
                      <Armchair className="w-3 h-3" />
                    </div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {selectedDate && selectedShowtime && selectedSeat && (
              <div className="rounded-lg border-2 border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/30 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Seat: {selectedSeat}</p>
                    <span className="font-semibold">Total Price:</span>
                  </div>
                  <span className="text-2xl font-bold text-cyan-600">${selectedMovie?.price.toFixed(2)}</span>
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
              disabled={!selectedDate || !selectedShowtime || !selectedSeat}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Confirm Booking
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
            <DialogDescription className="text-center">
              Your ticket for {selectedMovie?.title} has been successfully booked. Check your tickets section to view
              details.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/tickets")
              }}
              className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto"
            >
              View My Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
