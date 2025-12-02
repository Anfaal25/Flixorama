"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import MovieCard from "@/components/movie-card";
import BookingDialog from "@/components/booking-dialog";
import { Video } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";
import { useRouter } from "next/navigation";

const movies3D = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    description: "Immerse yourself in a three-dimensional journey through space and time.",
    genre: "Sci-Fi, Adventure",
    duration: "142 min",
    rating: "PG",
    showtimes: ["1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"],
    image: "/space-3d-movie-poster.jpg",
    price: 18.99,
  },
  {
    id: 2,
    title: "Avengers: Quantum 801",
    description: "Watch heroes leap off the screen in stunning 3D action sequences.",
    genre: "Action, Sci-Fi",
    duration: "156 min",
    rating: "PG-13",
    showtimes: ["2:00 PM", "5:30 PM", "8:45 PM"],
    image: "/avengers-3d-poster.jpg",
    price: 17.99,
  },
];

export default function ThreeDPage() {
  const { user } = useAuth();
  const { addTicket } = useTickets();
  const router = useRouter();

  const [showBooking, setShowBooking] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Video className="h-8 w-8 text-cyan-500" />
          <h1 className="text-3xl font-bold">3D Movies</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Dive into immersive 3D worlds where every scene comes alive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies3D.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              badge={{ label: "3D", className: "bg-cyan-500" }}
              onBook={() => {
                setSelectedMovie(movie);
                setShowBooking(true);
              }}
            />
          ))}
        </div>
      </main>

      <BookingDialog
        movie={selectedMovie}
        open={showBooking}
        onOpenChange={setShowBooking}
        format="3D"
        seatLayout={{
          rows: ["A", "B", "C", "D", "E", "F"],
          seatsPerRow: 20,
        }}
        onConfirm={addTicket}
      />
    </div>
  );
}
