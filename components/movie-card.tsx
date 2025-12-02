"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";

export default function MovieCard({ movie, badge, onBook }) {
  return (
    <Card className="hover:shadow-lg transition shadow-sm">
      <div className="aspect-[2/3] overflow-hidden bg-muted">
        <img src={movie.image} className="object-cover w-full h-full" alt={movie.title} />
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{movie.title}</CardTitle>
          {badge && <Badge className={badge.className}>{badge.label}</Badge>}
        </div>
        <CardDescription className="line-clamp-2">{movie.description}</CardDescription>
      </CardHeader>

      <CardContent className="text-sm space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{movie.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{movie.genre}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-cyan-500 hover:bg-cyan-600" onClick={onBook}>
          Book Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
