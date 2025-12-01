import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";

export default function MovieCard({ movie, onBook, badgeColor }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/30">
      
      {/* CONSISTENT POSTER SIZE */}
      <div className="aspect-[2/3] w-full bg-muted overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="object-cover w-full h-full"
        />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{movie.title}</CardTitle>
          <Badge className={badgeColor || "bg-secondary"}>{movie.rating}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{movie.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {movie.duration}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {movie.genre}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={onBook}>
          Book Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
