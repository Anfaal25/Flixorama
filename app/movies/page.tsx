"use client"

import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
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
  },
]

export default function MoviesPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/")
    return null
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
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">Book Tickets</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
