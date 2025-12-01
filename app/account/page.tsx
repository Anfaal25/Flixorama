"use client"

import { UserAccountPage } from "@/components/user-account-page"
import { Header } from "@/components/header"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <UserAccountPage />
        {/* </CHANGE> */}
      </main>
    </div>
  )
}
