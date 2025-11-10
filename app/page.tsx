"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { AdminDashboardView } from "@/components/admin-dashboard-view"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Sparkles, Armchair, Glasses } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <AdminDashboardView />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Flixorama Cinema</h1>
          <p className="text-muted-foreground text-lg">Experience movies like never before</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/movies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="bg-cyan-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Film className="h-6 w-6 text-cyan-500" />
                </div>
                <CardTitle>All Movies</CardTitle>
                <CardDescription>Browse our complete collection of current films</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">View Movies</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/imax">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>IMAX</CardTitle>
                <CardDescription>Experience stunning visuals on the biggest screen</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">View IMAX</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/vip">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="bg-orange-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Armchair className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>VIP Experience</CardTitle>
                <CardDescription>Premium seating and exclusive amenities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">View VIP</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/3d">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="bg-cyan-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Glasses className="h-6 w-6 text-cyan-500" />
                </div>
                <CardTitle>3D Movies</CardTitle>
                <CardDescription>Immerse yourself in three-dimensional cinema</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">View 3D</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12">
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-2xl">Manage Your Tickets</CardTitle>
              <CardDescription className="text-base">
                View your upcoming movies and past purchases. Cancel or transfer tickets as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tickets">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                  Go to My Tickets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
