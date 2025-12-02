"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import MovieCard from "@/components/movie-card";
import BookingDialog from "@/components/booking-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";
import { useRouter } from "next/navigation";

const movies = [
  {
    id: 1,
    title: "Avengers: Quantum 801",
    description: "Earth's mightiest heroes face their greatest challenge yet.",
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
    description: "A gripping mystery that keeps you guessing.",
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
    description: "A heartfelt story of love and second chances.",
    genre: "Romance, Drama",
    duration: "118 min",
    rating: "PG-13",
    showtimes: ["2:30 PM", "5:00 PM", "7:45 PM"],
    image: "/romance-movie-poster.png",
    price: 12.99,
  },
];

export default function MoviesPage() {
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
        <h1 className="text-3xl font-bold mb-6">Now Showing</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              badge={{ label: movie.rating, className: "bg-gray-600" }}
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
        format="STANDARD"
        seatLayout={{
          rows: [1, 2, 3, 4, 5, 6, 7],
          seatsPerRow: 11,
        }}
        onConfirm={addTicket}
      />
    </div>
  );
}
