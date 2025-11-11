"use client"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TicketIcon, BookmarkIcon, CreditCardIcon } from "lucide-react"
import Link from "next/link"

export function UserAccountView() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* My Tickets Card */}
          <Link href="/tickets" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-cyan-500 h-full">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 p-6 rounded-2xl mb-6 shadow-lg">
                  <TicketIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">My Tickets</h2>
                <p className="text-sm text-gray-600 text-center">View and manage your bookings</p>
              </CardContent>
            </Card>
          </Link>

          {/* Bookmarks Card */}
          <Link href="/bookmarks" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-cyan-500 h-full">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6 rounded-2xl mb-6 shadow-lg">
                  <BookmarkIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Bookmarks</h2>
                <p className="text-sm text-gray-600 text-center">Your saved movies</p>
              </CardContent>
            </Card>
          </Link>

          {/* Subscriptions Card */}
          <Link href="/subscriptions" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-cyan-500 h-full">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-2xl mb-6 shadow-lg">
                  <CreditCardIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Subscriptions</h2>
                <p className="text-sm text-gray-600 text-center">Manage your plans</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Browse Movies Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Movies</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/movies">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-base">All Movies</Button>
            </Link>
            <Link href="/categories">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-base">Categories</Button>
            </Link>
            <Link href="/imax">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base">IMAX</Button>
            </Link>
            <Link href="/vip">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-base">VIP</Button>
            </Link>
            <Link href="/3d">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-base">3D Movies</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
