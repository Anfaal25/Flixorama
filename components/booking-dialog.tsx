"use client";

import { useState } from "react";
import { useAuth, getUserProfile } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

interface BookingDialogProps {
  movie: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: "STANDARD" | "IMAX" | "VIP" | "3D";
  seatLayout: {
    rows: (string | number)[];
    seatsPerRow: number;
  };
  onConfirm: (ticket: any) => void;
}

export default function BookingDialog({
  movie,
  open,
  onOpenChange,
  format,
  seatLayout,
  onConfirm,
}: BookingDialogProps) {
  const { user } = useAuth();

  const [guestWarning, setGuestWarning] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [emailError, setEmailError] = useState("");

  // Generate seat map
  const generateSeats = () => {
    const allSeats: any[] = [];
    for (const row of seatLayout.rows) {
      for (let i = 1; i <= seatLayout.seatsPerRow; i++) {
        allSeats.push({
          id: `${row}-${i}`,
          row,
          number: i,
          status: Math.random() > 0.75 ? "booked" : "available",
        });
      }
    }
    return allSeats;
  };

  const [seats, setSeats] = useState(generateSeats());

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  const resetAll = () => {
    setSelectedDate("");
    setSelectedShowtime("");
    setSelectedSeats([]);
    setSeats(generateSeats());
    setSelectedPaymentMethod("");
    setEmailError("");
  };

  const toggleSeat = (id: string, status: string) => {
    if (status === "booked") return;
    setSelectedSeats((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleContinueToPayment = () => {
    if (!selectedDate || !selectedShowtime || selectedSeats.length === 0) return;
    onOpenChange(false);
    setPaymentDialog(true);
  };

  const handlePaymentConfirm = () => {
    if (user.role === "guest") {
      if (!guestEmail.includes("@")) {
        setEmailError("Please enter a valid email.");
        return;
      }
      if (!selectedPaymentMethod) {
        setEmailError("Please select a payment method.");
        return;
      }
    } else {
      const profile = getUserProfile(user.id);
      if (profile?.paymentMethods?.length && !selectedPaymentMethod) {
        setEmailError("Please select a saved payment method.");
        return;
      }
    }

    const confirmationEmail = user.role === "guest" ? guestEmail : user.email;

    // Create ticket(s)
    selectedSeats.forEach((seat) => {
      onConfirm({
        movieTitle: movie.title,
        format,
        date: selectedDate,
        showtime: selectedShowtime,
        seats: [seat],
        price: movie.price,
        userId: user.id,
        email: confirmationEmail,
        theater: `${format} Theater`,
        screen: `${format} Screen`,
        poster: movie.image,
      });
    });

    setPaymentDialog(false);
    setSuccessDialog(true);
    // resetAll() will be called when success dialog is closed so that guestEmail
    // is still available for the confirmation message
  };

  return (
    <>
      {/* MAIN BOOKING DIALOG */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {format} Ticket</DialogTitle>
            <DialogDescription>
              Select date, showtime, and seats for {movie?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* DATE SELECTION */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Date</Label>
              <RadioGroup value={selectedDate} onValueChange={setSelectedDate} className="grid grid-cols-4 gap-2">
                {availableDates.map((date) => (
                  <div key={date}>
                    <RadioGroupItem value={date} id={`date-${date}`} className="peer sr-only" />
                    <Label
                      htmlFor={`date-${date}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 peer-data-[state=checked]:border-cyan-500 cursor-pointer"
                    >
                      <span className="text-xs font-medium">
                        {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* SHOWTIMES */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Showtime</Label>
              <RadioGroup
                value={selectedShowtime}
                onValueChange={setSelectedShowtime}
                className="grid grid-cols-3 gap-2"
              >
                {movie?.showtimes.map((time: string) => (
                  <div key={time}>
                    <RadioGroupItem value={time} id={`time-${time}`} className="peer sr-only" />
                    <Label
                      htmlFor={`time-${time}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 peer-data-[state=checked]:border-cyan-500 cursor-pointer"
                    >
                      {time}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* SCREEN LABEL */}
            <div className="text-center py-4">
              <span className="text-xs font-bold tracking-widest text-muted-foreground">SCREEN</span>
            </div>

            {/* SEAT MAP */}
            <div className="bg-black/90 p-6 rounded-lg space-y-2">
              {seatLayout.rows.map((row: any) => (
                <div key={row} className="flex items-center gap-1 justify-center">
                  <span className="w-6 text-white text-xs">{row}</span>
                  <div className="flex gap-1">
                    {seats
                      .filter((s) => s.row === row)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          disabled={seat.status === "booked"}
                          onClick={() => toggleSeat(seat.id, seat.status)}
                          className={`w-7 h-7 rounded-md transition-all ${
                            seat.status === "booked"
                              ? "bg-gray-600 opacity-60 cursor-not-allowed"
                              : selectedSeats.includes(seat.id)
                              ? "bg-amber-500 scale-110"
                              : "bg-gray-300 hover:bg-gray-200"
                          }`}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* PRICE SUMMARY */}
            {selectedDate && selectedShowtime && selectedSeats.length > 0 && (
              <div className="p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <p className="text-sm">
                  Selected Seats: {selectedSeats.join(", ")} ({selectedSeats.length})
                </p>
                <p className="text-xl font-bold text-emerald-600">
                  ${(movie.price * selectedSeats.length).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleContinueToPayment}
              disabled={!selectedDate || !selectedShowtime || selectedSeats.length === 0}
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PAYMENT DIALOG */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="p-4 border rounded-lg text-sm space-y-1">
              <p>
                <strong>Movie:</strong> {movie?.title}
              </p>
              <p>
                <strong>Format:</strong> {format}
              </p>
              <p>
                <strong>Date:</strong> {selectedDate}
              </p>
              <p>
                <strong>Time:</strong> {selectedShowtime}
              </p>
              <p>
                <strong>Seats:</strong> {selectedSeats.join(", ")}
              </p>
            </div>

            {/* Guest email */}
            {user.role === "guest" && (
              <>
                <Label>Email Address *</Label>
                <Input
                  value={guestEmail}
                  onChange={(e) => {
                    setGuestEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="your@email.com"
                />
              </>
            )}

            {/* Payment method */}
            <Label>Payment Method *</Label>
            <Select
              value={selectedPaymentMethod}
              onValueChange={(val) => {
                setSelectedPaymentMethod(val);
                setEmailError("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {user.role === "guest" ? (
                  <>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </>
                ) : (
                  getUserProfile(user.id)?.paymentMethods?.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      {pm.type} •••• {pm.last4}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPaymentDialog(false);
                onOpenChange(true);
              }}
            >
              Back
            </Button>
            <Button onClick={handlePaymentConfirm}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SUCCESS DIALOG */}
      <Dialog
        open={successDialog}
        onOpenChange={(open) => {
          setSuccessDialog(open);
          if (!open) {
            resetAll();
            setGuestEmail("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-950 p-4 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                Confirmation email sent to{" "}
                {user.role === "guest" ? guestEmail : user.email}
                .
              </p>
              {user.role === "guest" ? (
                <p className="text-sm">
                  As a guest, you&apos;ll receive a secure payment link in that
                  email. Complete payment through the link to finalize your
                  booking and have your ticket activated.
                </p>
              ) : (
                <p className="text-sm">
                  Your payment has been processed and your ticket is now
                  confirmed.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSuccessDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
