# Flixorama Cinema - Movie Ticket Management System

A modern movie ticket booking and management system built with Next.js, featuring user authentication, ticket booking, cancellation workflows, and admin approval systems.

## Features

- **User Authentication**: Login, signup, and guest mode
- **Movie Browsing**: Browse movies by category (Regular, IMAX, VIP, 3D)
- **Ticket Booking**: Interactive seat selection with visual theater layout
- **Ticket Management**: View upcoming and past tickets
- **Cancellation/Transfer**: Request ticket cancellations or transfers (admin approval required)
- **Admin Dashboard**: Approve or reject cancellation requests
- **Account Management**: View profile, payment methods, and purchase history
- **Dark Mode**: Full dark mode support
- **Guest Mode**: Browse and book with limitations (no cancellations/transfers)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Extract the project files** to your desired location

2. **Open Terminal/Command Prompt** and navigate to the project folder:
   ```
   cd path/to/flixorama-cinema
   ```

3. **Install dependencies**:
   ```
   npm install
   ```

4. **Run the development server**:
   ```
   npm run dev
   ```
  

5. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```
  

## Demo Accounts

### Regular User Account
- **Email**: `user@cinema.com`
- **Password**: `user123`
- Can book tickets, cancel, and transfer

### Admin Account
- **Email**: `admin@cinema.com`
- **Password**: `admin123`
- Can approve/reject cancellation requests

### Guest Mode
- Click "Continue as Guest" on login page
- Can browse and book tickets
- Cannot cancel or transfer tickets

## Project Structure

```
flixorama-cinema/
├── app/                    # Next.js app directory
│   ├── movies/            # Regular movies page
│   ├── imax/              # IMAX movies page
│   ├── vip/               # VIP movies page
│   ├── 3d/                # 3D movies page
│   ├── tickets/           # User tickets page
│   ├── account/           # User account page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Navigation header
│   ├── login-form.tsx    # Authentication form
│   ├── user-tickets-view.tsx    # User tickets view
│   ├── admin-dashboard-view.tsx # Admin dashboard
│   └── user-account-page.tsx    # Account settings
├── contexts/             # React contexts
│   ├── auth-context.tsx  # Authentication state
│   └── tickets-context.tsx  # Tickets state
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## Features Guide

### Booking Tickets
1. Browse movies in any category
2. Click "Book Tickets" on a movie
3. Select date, showtime, and seat
4. Confirm booking
5. Receive email confirmation

### Managing Tickets
1. Navigate to "My Tickets"
2. View "Upcoming" or "Past Purchases"
3. Select a ticket to cancel or transfer
4. Request is sent to admin for approval

### Admin Approval
1. Login as admin
2. View pending cancellation requests
3. Click "Validate" on a request
4. Approve or reject the request

### Account Settings
1. Click on your profile name
2. Select "Account Settings"
3. View/edit profile information
4. Change password
5. View payment methods and purchase history

## Guest Mode Limitations

When using guest mode:
- ⚠️ Tickets cannot be cancelled
- ⚠️ Tickets cannot be transferred
- ⚠️ No account history saved

Create an account for full access to all features.

## Dark Mode

Toggle dark mode using the theme button in the header. Dark mode is fully supported across all pages and components.

## Support

For issues or questions, please check the demo accounts and ensure you're using the correct credentials.

## License

This is a demo project for educational purposes.
