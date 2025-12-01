"use client"

import { useState } from "react"
import { useAuth, getUserProfile, addPaymentMethod, removePaymentMethod } from "@/contexts/auth-context"
import { useTickets } from "@/contexts/tickets-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Mail, Phone, Lock, User, CheckCircle2, Trash2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserAccountPage() {
  const { user, logout } = useAuth()
  const { tickets } = useTickets()
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardType, setCardType] = useState("")
  const [cardError, setCardError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  if (!user || user.role === "guest") {
    return null
  }

  const userProfile = getUserProfile(user.id)
  const pastPurchases = tickets.filter((t) => new Date(t.date) < new Date())

  const handlePasswordChange = () => {
    setPasswordError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    // Simulate password change
    setPasswordSuccess(true)
    setTimeout(() => {
      setShowPasswordDialog(false)
      setPasswordSuccess(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 2000)
  }

  const handleAddPayment = () => {
    setCardError("")

    if (!cardNumber || !cardType) {
      setCardError("Please fill in all fields")
      return
    }

    if (cardNumber.length !== 16) {
      setCardError("Card number must be 16 digits")
      return
    }

    const last4 = cardNumber.slice(-4)
    addPaymentMethod(user.id, { type: cardType, last4 })

    setPaymentSuccess(true)
    setTimeout(() => {
      setShowAddPaymentDialog(false)
      setPaymentSuccess(false)
      setCardNumber("")
      setCardType("")
    }, 1500)
  }

  const handleRemovePayment = (paymentId: string) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      removePaymentMethod(user.id, paymentId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            {userProfile?.phone && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
              </div>
            )}
            <div className="pt-4">
              <Button onClick={() => setShowPasswordDialog(true)} variant="outline" className="w-full sm:w-auto">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Saved payment cards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProfile?.paymentMethods && userProfile.paymentMethods.length > 0 ? (
              userProfile.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg group">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{method.type}</p>
                    <p className="text-xs text-muted-foreground">•••• {method.last4}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePayment(method.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No payment methods saved</p>
            )}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="sm"
              onClick={() => setShowAddPaymentDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Past Purchases */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Past Purchases</CardTitle>
          <CardDescription>Your ticket purchase history</CardDescription>
        </CardHeader>
        <CardContent>
          {pastPurchases.length > 0 ? (
            <div className="space-y-3">
              {pastPurchases.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <img
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.movieTitle}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{ticket.movieTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.date).toLocaleDateString()} • {ticket.showtime}
                      </p>
                      <p className="text-xs text-muted-foreground">Seat: {ticket.seat}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No past purchases</p>
          )}
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>
          {passwordSuccess ? (
            <div className="py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="font-medium">Password changed successfully!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasswordChange} className="bg-cyan-500 hover:bg-cyan-600">
                  Change Password
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new credit or debit card</DialogDescription>
          </DialogHeader>
          {paymentSuccess ? (
            <div className="py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="font-medium">Payment method added successfully!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="card-type">Card Type</Label>
                  <Select value={cardType} onValueChange={setCardType}>
                    <SelectTrigger id="card-type">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Mastercard">Mastercard</SelectItem>
                      <SelectItem value="American Express">American Express</SelectItem>
                      <SelectItem value="Discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                    maxLength={16}
                  />
                </div>
                {cardError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{cardError}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPayment} className="bg-emerald-600 hover:bg-emerald-700">
                  Add Card
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
