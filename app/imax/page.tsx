"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import MovieCard from "@/components/movie-card";
import BookingDialog from "@/components/booking-dialog";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";
import { useRouter } from "next/navigation";

const imaxMovies = [
  {
    id: 1,
    title: "Avengers: Quantum 801",
    description: "Experience the biggest battles on the biggest screen.",
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
    description: "A breathtaking IMAX journey through time and stars.",
    genre: "Sci-Fi, Adventure",
    duration: "142 min",
    rating: "PG",
    showtimes: ["1:00 PM", "4:30 PM", "8:00 PM"],
    image: "/space-imax-poster.jpg",
    price: 23.99,
  },
];

export default function IMAXPage() {
  const { user } = useAuth();
  const { addTicket } = useTickets();
  const router = useRouter();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">IMAX Experience</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Ultra-immersive screens. Wall-shaking audio. Pure cinematic immersion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {imaxMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              badge={{ label: "IMAX", className: "bg-purple-500" }}
              onBook={() => {
                setSelectedMovie(movie);
                setBookingOpen(true);
              }}
            />
          ))}
        </div>
      </main>

      <BookingDialog
        movie={selectedMovie}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        format="IMAX"
        seatLayout={{
          rows: ["A", "B", "C", "D", "E", "F"],
          seatsPerRow: 20,
        }}
        onConfirm={addTicket}
      />
    </div>
  );
}
