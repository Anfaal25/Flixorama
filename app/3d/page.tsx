"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import BookingDialog from "@/components/booking-dialog";

import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Clock, Calendar, Video } from "lucide-react";
import { useRouter } from "next/navigation";

const movies3D = [
  {
    id: 1,
    title: "Depths of Atlantis",
    description:
      "Explore the mysterious underwater world brought to life with stunning 3D effects.",
    genre: "Adventure, Fantasy",
    duration: "132 min",
    rating: "PG",
    showtimes: ["12:30 PM", "4:00 PM", "7:45 PM"],
    image: "/3d-atlantis-poster.jpg",
    price: 18.99,
  },
  {
    id: 2,
    title: "Galaxy Raiders 3D",
    description:
      "An interstellar battle that comes straight off the screen in this thrilling 3D experience.",
    genre: "Action, Sci-Fi",
    duration: "141 min",
    rating: "PG-13",
    showtimes: ["1:15 PM", "5:00 PM", "9:00 PM"],
    image: "/3d-galaxy-raiders.jpg",
    price: 19.49,
  },
];

export default function ThreeDPage() {
  const { user } = useAuth();
  const { addTicket } = useTickets();
  const router = useRouter();

  const [showBooking, setShowBooking] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  if (!user) {
    router.push("/");
    return null;
  }

  const handleBook = (movie: any) => {
    setSelectedMovie(movie);
    setShowBooking(true);
  };

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

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies3D.map((movie) => (
            <Card
              key={movie.id}
              className="border-cyan-500/20 hover:shadow-lg transition"
            >
              <div className="aspect-[2/3] bg-muted overflow-hidden">
                <img
                  src={movie.image}
                  className="object-cover w-full h-full"
                  alt={movie.title}
                />
              </div>

              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <Badge className="bg-cyan-500">3D</Badge>
                <CardDescription className="line-clamp-2">
                  {movie.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {movie.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  {movie.genre}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  onClick={() => handleBook(movie)}
                >
                  Book 3D Tickets
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Booking Component */}
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
