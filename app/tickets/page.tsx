"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { UserTicketsView } from "@/components/user-tickets-view"
import { useRouter } from "next/navigation"

export default function TicketsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <UserTicketsView />
      </main>
    </div>
  )
}
