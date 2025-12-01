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
import { Clock, Calendar, Sparkles, CheckCircle2, Armchair, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

const imaxMovies = [
  {
    id: 1,
    title: "Avengers: Quantum 801",
    description: "Experience the ultimate superhero battle on the biggest screen with crystal-clear IMAX technology.",
    genre: "Action, Sci-Fi",
    duration: "156 min",
    rating: "PG-13",
    showtimes: ["12:00 PM", "3:30 PM", "7:00 PM", "10:30 PM"],
    image: "/avengers-imax-poster.jpg",
    price: 24.99,
  },
  {
    id: 2,
    title: "Cosmic Odyssey",
    description: "Journey through the cosmos in breathtaking IMAX clarity and immersive sound.",
    genre: "Sci-Fi, Adventure",
    duration: "142 min",
    rating: "PG",
    showtimes: ["1:00 PM", "4:30 PM", "8:00 PM"],
    image: "/space-imax-poster.jpg",
    price: 23.99,
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
        status: Math.random() > 0.7 ? "booked" : "available",
      })
    }
  }

  return allSeats
}

export default function IMAXPage() {
  const { user } = useAuth()
  const { addTicket } = useTickets()
  const router = useRouter()
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showGuestWarning, setShowGuestWarning] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<(typeof imaxMovies)[0] | null>(null)
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

  const handleBookClick = (movie: (typeof imaxMovies)[0]) => {
    if (user.role === "guest") {
      setSelectedMovie(movie)
      setShowGuestWarning(true)
      return
    }
    setSelectedMovie(movie)
    setSelectedShowtime("")
    setSelectedDate("")
    setSelectedSeat("")
    setSeats(generateSeats())
    setShowBookingDialog(true)
  }

  const handleGuestContinue = () => {
    setShowGuestWarning(false)
    setSelectedShowtime("")
    setSelectedDate("")
    setSelectedSeat("")
    setSeats(generateSeats())
    setShowBookingDialog(true)
  }

  const handleConfirmBooking = () => {
    if (selectedMovie && selectedShowtime && selectedDate && selectedSeat) {
      addTicket({
        movieTitle: selectedMovie.title,
        showtime: selectedShowtime,
        date: selectedDate,
        theater: `IMAX Theater ${Math.floor(Math.random() * 3) + 1}`,
        seat: selectedSeat,
        screen: "IMAX Screen",
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
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">IMAX Experience</h1>
          </div>
          <p className="text-muted-foreground">
            Experience movies in stunning IMAX format with unparalleled picture and sound quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imaxMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow border-purple-500/20">
              <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="object-cover w-full h-full" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-purple-500 hover:bg-purple-600">IMAX</Badge>
                </div>
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
                  <p className="text-xs font-medium mb-2">IMAX Showtimes:</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-purple-500/50">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleBookClick(movie)} className="w-full bg-purple-500 hover:bg-purple-600">
                  Book IMAX Tickets
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
            <Button onClick={handleGuestContinue} className="bg-purple-500 hover:bg-purple-600">
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Added booking dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book IMAX Ticket</DialogTitle>
            <DialogDescription>
              Select your preferred date, showtime, and seat for {selectedMovie?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Date</Label>
              <RadioGroup value={selectedDate} onValueChange={setSelectedDate} className="grid grid-cols-4 gap-2">
                {availableDates.map((date) => (
                  <div key={date}>
                    <RadioGroupItem value={date} id={`date-${date}`} className="peer sr-only" />
                    <Label
                      htmlFor={`date-${date}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
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
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
                    >
                      <span className="text-sm font-medium">{time}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Seat</Label>
              <div className="bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 py-4 rounded-lg text-center border-b-4 border-gray-300 dark:border-gray-600">
                <span className="text-lg font-bold tracking-widest">SCREEN</span>
              </div>

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

            {selectedDate && selectedShowtime && selectedSeat && (
              <div className="rounded-lg border-2 border-purple-500 bg-purple-50/30 dark:bg-purple-950/30 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Seat: {selectedSeat}</p>
                    <span className="font-semibold">Total Price:</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">${selectedMovie?.price.toFixed(2)}</span>
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
              className="bg-purple-500 hover:bg-purple-600"
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
            <DialogDescription className="text-center space-y-2">
              <p>Your IMAX ticket for {selectedMovie?.title} has been successfully booked.</p>
              <div className="flex items-center justify-center gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">Confirmation email sent to {user.email}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/tickets")
              }}
              className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto"
            >
              View My Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
