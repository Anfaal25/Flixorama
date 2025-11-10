"use client"

import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Armchair, Wine, Utensils } from "lucide-react"
import { useRouter } from "next/navigation"

const vipMovies = [
  {
    id: 1,
    title: "The Last Detective",
    description: "Enjoy this gripping mystery in luxury recliner seats with premium food and beverage service.",
    genre: "Mystery, Thriller",
    duration: "128 min",
    rating: "R",
    showtimes: ["2:00 PM", "5:30 PM", "9:00 PM"],
    image: "/detective-vip-poster.jpg",
  },
  {
    id: 2,
    title: "Summer Dreams",
    description: "Experience this romantic tale in ultimate comfort with VIP amenities.",
    genre: "Romance, Drama",
    duration: "118 min",
    rating: "PG-13",
    showtimes: ["3:00 PM", "6:00 PM", "8:30 PM"],
    image: "/romance-vip-poster.jpg",
  },
]

export default function VIPPage() {
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
            <Armchair className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">VIP Experience</h1>
          </div>
          <p className="text-muted-foreground">Enjoy premium seating, exclusive amenities, and personalized service</p>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-500/20">
            <CardHeader>
              <Armchair className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Luxury Seating</CardTitle>
              <CardDescription>Fully reclining leather seats with extra legroom</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-orange-500/20">
            <CardHeader>
              <Utensils className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Gourmet Menu</CardTitle>
              <CardDescription>Premium food and snacks delivered to your seat</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-orange-500/20">
            <CardHeader>
              <Wine className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Full Bar</CardTitle>
              <CardDescription>Craft cocktails and fine wines available</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-500/20">
              <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="object-cover w-full h-full" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-500 hover:bg-orange-600">VIP</Badge>
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
                  <p className="text-xs font-medium mb-2">VIP Showtimes:</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.showtimes.map((time, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-orange-500/50">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Book VIP Tickets</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
