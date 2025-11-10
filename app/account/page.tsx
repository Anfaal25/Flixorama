import { Header } from "@/components/header"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </main>
    </div>
  )
}
