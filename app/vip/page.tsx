"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import MovieCard from "@/components/movie-card";
import BookingDialog from "@/components/booking-dialog";
import { Armchair } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";
import { useRouter } from "next/navigation";

const vipMovies = [
  {
    id: 1,
    title: "The Last Detective",
    description: "A gripping thriller watched in luxury recliner seating.",
    genre: "Mystery, Thriller",
    duration: "128 min",
    rating: "R",
    showtimes: ["2:00 PM", "5:30 PM", "9:00 PM"],
    image: "/detective-vip-poster.jpg",
    price: 29.99,
  },
  {
    id: 2,
    title: "Summer Dreams",
    description: "A sweeping romance with premium food and drink service.",
    genre: "Romance, Drama",
    duration: "118 min",
    rating: "PG-13",
    showtimes: ["3:00 PM", "6:00 PM", "8:30 PM"],
    image: "/romance-vip-poster.jpg",
    price: 27.99,
  },
];

export default function VIPPage() {
  const { user } = useAuth();
  const { addTicket } = useTickets();
  const router = useRouter();

  const [bookingOpen, setBookingOpen] = useState(false);
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
          <Armchair className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">VIP Experience</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Recliners, gourmet food, and a premium theater experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vipMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              badge={{ label: "VIP", className: "bg-orange-500" }}
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
        format="VIP"
        seatLayout={{
          rows: ["A", "B", "C", "D", "E", "F"],
          seatsPerRow: 20,
        }}
        onConfirm={addTicket}
      />
    </div>
  );
}
