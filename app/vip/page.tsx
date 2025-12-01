"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import BookingDialog from "@/components/booking-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useTickets } from "@/contexts/tickets-context";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <Armchair className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">VIP Experience</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Recliners, gourmet food, and a premium theater experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipMovies.map((movie) => (
            <Card key={movie.id} className="border-orange-500/20 hover:shadow-lg transition">
              <div className="aspect-[2/3] bg-muted overflow-hidden">
                <img src={movie.image} className="object-cover w-full h-full" />
              </div>

              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <Badge className="bg-orange-500">VIP</Badge>
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
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => {
                  setSelectedMovie(movie);
                  setShowBooking(true);
                }}>
                  Book VIP Tickets
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
        format="VIP"
        seatLayout={{
          rows: ["A", "B", "C", "D", "E", "F"],
          seatsPerRow: 20
        }}
        onConfirm={addTicket}
      />
    </div>
  );
}
