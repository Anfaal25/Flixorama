import { Header } from "@/components/header"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">Your selected tickets and items.</p>
      </main>
    </div>
  )
}
