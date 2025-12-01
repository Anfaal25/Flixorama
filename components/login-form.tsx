"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Film, UserPlus } from "lucide-react"

export function LoginForm() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup, continueAsGuest } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (isSignup && !name.trim()) {
      setError("Please enter your name")
      setIsLoading(false)
      return
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    let success = false
    if (isSignup) {
      success = await signup(email, password, name)
      if (!success) {
        setError("Email already exists")
      }
    } else {
      success = await login(email, password)
      if (!success) {
        setError("Invalid email or password")
      }
    }

    setIsLoading(false)
  }

  const handleGuestMode = () => {
    continueAsGuest()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="bg-cyan-500/10 p-4 rounded-full">
              <Film className="h-10 w-10 text-cyan-500" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">Flixorama Cinema</CardTitle>
            <CardDescription className="mt-3 text-base">
              {isSignup ? "Create your account" : "Sign in to your account"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                  className="h-12"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white text-base"
              disabled={isLoading}
            >
              {isLoading ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError("")
              }}
              className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
            >
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGuestMode}
              className="w-full h-12 mt-4 border-2 bg-transparent"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>
          </div>

          {!isSignup && (
            <div className="mt-8 space-y-2 text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <p className="font-semibold">Demo Accounts:</p>
              <div className="space-y-1 text-xs">
                <p>
                  <strong>User:</strong> user@cinema.com / user123
                </p>
                <p>
                  <strong>Admin:</strong> admin@cinema.com / admin123
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
