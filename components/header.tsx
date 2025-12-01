"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import Image from "next/image"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/flixorama-logo.png" alt="Flixorama Cinema" width={180} height={60} className="h-12 w-auto" />
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "user" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
