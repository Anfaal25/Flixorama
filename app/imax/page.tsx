"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import BookingDialog from "@/components/booking-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Sparkles } from "lucide-react";
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

  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [showBooking, setShowBooking] = useState(false);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imaxMovies.map((movie) => (
            <Card key={movie.id} className="border-purple-500/20 hover:shadow-lg transition">
              <div className="aspect-[2/3] bg-muted overflow-hidden">
                <img src={movie.image} className="object-cover w-full h-full" />
              </div>

              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <Badge className="bg-purple-500">IMAX</Badge>
                <CardDescription className="line-clamp-2">{movie.description}</CardDescription>
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
                <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={() => {
                  setSelectedMovie(movie);
                  setShowBooking(true);
                }}>
                  Book IMAX Tickets
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <BookingDialog
        movie={selectedMovie}
        open={showBooking}
        onOpenChange={setShowBooking}
        format="IMAX"
        seatLayout={{
          rows: ["A", "B", "C", "D", "E", "F"],
          seatsPerRow: 20
        }}
        onConfirm={addTicket}
      />
    </div>
  );
}
