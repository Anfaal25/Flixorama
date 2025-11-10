"use client"

import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Glasses } from "lucide-react"
import { useRouter } from "next/navigation"

const threeDMovies = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    description: "Immerse yourself in a three-dimensional journey through space and time.",
    genre: "Sci-Fi, Adventure",
    duration: "142 min",
    rating: "PG",
    showtimes: ["1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"],
    image: "/space-3d-movie-poster.jpg",
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
  },
]

export default function ThreeDPage() {
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
          <div className="flex items-center gap-3 mb-2">
            <Glasses className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-bold">3D Movies</h1>
          </div>
          <p className="text-muted-foreground">
            Immerse yourself in three-dimensional cinema with cutting-edge 3D technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {threeDMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow border-cyan-500/20">
              <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="object-cover w-full h-full" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-cyan-500 hover:bg-cyan-600">3D</Badge>
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
                  <p className="text-xs font-medium mb-2">3D Showtimes:</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-cyan-500/50">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">Book 3D Tickets</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
