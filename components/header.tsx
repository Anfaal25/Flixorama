"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Film } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Film className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground">Flixorama Cinema</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-6">
            <Link
              href="/movies"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/movies" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Movies
            </Link>
            <Link
              href="/imax"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/imax" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              IMAX
            </Link>
            <Link
              href="/vip"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/vip" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              VIP
            </Link>
            <Link
              href="/3d"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/3d" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              3D
            </Link>
            {user.role === "user" && (
              <Link
                href="/tickets"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/tickets" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                My Tickets
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
