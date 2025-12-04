# Flixorama Cinema - Complete User Guide

A comprehensive movie ticket booking and management system with authentication, payment processing, and admin workflows.

## Quick Start

### Installation

1. **Clone Repo** - Clone the project to your desired location
2. **Open Terminal** - Navigate to the project folder:
   ```
   cd path/to/flixorama
   ```
3. **Install Dependencies**:
   ```
   npm install
   ```
4. **Start Development Server**:
   ```
   npm run dev
   ```
5. **Open Browser** - Visit `http://localhost:3000`

---

## Demo Accounts

### Regular User
- **Email**: `user@cinema.com`
- **Password**: `user123`
- Full access: book, cancel, transfer tickets

### Admin
- **Email**: `admin@cinema.com`
- **Password**: `admin123`
- Manage cancellation requests

### Guest Mode
- Click "Continue as Guest" on login
- Limited features (see restrictions below)

---

## Complete Feature Guide

### 1. Authentication & Login

**First Time Access:**
1. App opens to login screen
2. Choose one of three options:
   - **Login** - Enter email and password
   - **Sign Up** - Create new account (name, email, password)
   - **Continue as Guest** - Browse without account

**Guest Mode Limitations:**
- Cannot cancel tickets
- Cannot transfer tickets
- Must provide email for each booking
- Payment via email link
- No booking history saved

---

### 2. Browsing Movies

**Movie Categories:**
- **Movies** - All current releases
- **IMAX** - Large format premium experience
- **VIP** - Luxury seating with food/beverage service
- **3D** - Three-dimensional immersive viewing

**Each Movie Card Shows:**
- Movie poster (uniform aspect ratio 2:3)
- Title and rating (PG, PG-13, R)
- Duration and genres
- Available showtimes
- "Book Tickets" button

---

### 3. Booking Tickets (Complete Flow)

#### Step 1: Select Movie
1. Navigate to any category (Movies, IMAX, VIP, 3D)
2. Browse available movies
3. Click "Book Tickets" on desired movie

**Guest Warning:**
- If guest mode, warning dialog appears
- Shows limitations (no cancel/transfer)
- Click "Continue Anyway" or "Cancel"

#### Step 2: Select Date & Time
1. **Date Selection**: Choose from next 7 days
2. **Showtime Selection**: Choose from available times
3. Both required to proceed

#### Step 3: Select Seats
**Seating Interface:**
- Visual theater layout (7 rows × 11 seats)
- Screen indicator at top
- Color-coded seats:
  - **Gray** - Booked (unavailable)
  - **White** - Available
  - **Orange (Amber)** - Your selection
- Click seats to select/deselect
- Can select multiple seats
- Shows selected seat numbers and total price

#### Step 4: Payment & Confirmation

**Click "Continue to Payment"**

**For Guest Users:**
1. **Email Address** (required)
   - Enter valid email
   - Ticket will be sent here
2. **Payment Method** (required)
   - Email Payment Link
   - Paypal
   - Credit Card
   - Debit Card
3. **Email Payment Link Option:**
   - Secure payment link sent to email
   - Complete payment within 24 hours
   - Booking confirmed after payment

**For Registered Users:**
1. Email auto-filled from account
2. Choose from saved payment methods:
   - Visa •••• 4242
   - Mastercard •••• 5555
3. Or add new payment method from account page

**Booking Summary Shows:**
- Movie title
- Date and time
- Selected seats
- Total price

**Click "Confirm Booking"**

#### Step 5: Confirmation
- Green checkmark appears
- Success message displayed
- Email notification sent with:
  - Ticket details
  - QR code (if registered user)
  - Payment link (if guest with email payment)
- Click "View My Tickets" to see booking

---

### 4. Managing Tickets

**Access:** Click "My Tickets" in navigation

#### Two Tabs Available:

**Upcoming Tickets:**
- Shows future movie bookings
- Each ticket displays:
  - Movie title and ticket ID
  - Date, time, theater, seat
  - Total price
- Select tickets using checkboxes
- Actions available:
  - **Cancel Ticket** - Request cancellation
  - **Transfer Ticket** - Transfer to another user (goes to admin for confirmation)

**Past Purchases:**
- Shows completed bookings
- Read-only (no actions available)

#### Cancellation Process (Registered Users):
1. Select ticket(s) using checkbox
2. Click "Cancel Ticket" button
3. Confirmation dialog appears
4. Click "Confirm Cancellation"
5. Request sent to admin
6. Ticket marked "Pending Review"
7. Ticket grayed out until admin decision
8. Email notification when processed

**Guest Users:**
- Cannot cancel tickets


#### Transfer Process:
- Shows confirmation message
- Sends request to Admin
- No functionality on admin side (upcoming feature)

---

### 5. Account Management

**Access:** Click your name in header → "Account Settings"

**Profile Information:**
- Change password button

**Payment Methods:**
- View saved cards
  - Visa •••• 4242
  - Mastercard •••• 5555
- Add new payment method
- Remove payment methods

**Past Purchases:**
- Complete booking history
- Movie name, date, time, seat

**Actions Available:**
- Change password
- Manage payment methods
- View complete transaction history

---

### 6. Admin Dashboard

**Access:** Login with admin credentials

**Admin View Shows:**
- All pending cancellation requests
- Table format with columns:
  - Ticket ID
  - Movie Name
  - Theater
  - Seat Number
  - User Email
  - Request Date
  - Actions

#### Processing Requests:

**Approve Cancellation:**
1. Click "Validate" button on request
2. Confirmation dialog appears
3. Click "Approve"
4. Ticket refunded
5. Removed from user's upcoming tickets
6. User notified via email
7. Request removed from admin queue

**Reject Cancellation:**
1. Click "Validate" button on request
2. Confirmation dialog appears
3. Click "Reject" (red button)
4. Ticket remains active
5. User can still use ticket
6. User notified via email
7. Request removed from admin queue

**Admin Dashboard Features:**
- Real-time request updates
- Sortable columns
- Search functionality
- Bulk actions (future feature)

---

### 7. Dark Mode

**Toggle Dark Mode:**
- Click sun/moon icon in header
- Instant theme switch
- Preference saved

**Fully Supported:**
- All pages and components
- Proper contrast ratios
- Semantic color tokens
- Readable in both modes

---

### 8. Navigation

**Header Navigation:**
- **Logo** - Return to home
- **Movies** - All movies
- **IMAX** - IMAX format
- **VIP** - VIP experience
- **3D** - 3D movies
- **My Tickets** - View bookings
- **User Menu** (click name):
  - Account Settings
  - Logout

---

## Payment Processing

### For Registered Users:
1. Select from saved payment methods
2. Instant booking confirmation
3. Receipt emailed immediately

### For Guest Users:
1. **Email Payment Link**
   - Receive secure link via email
   - Click link within 24 hours
   - Complete payment on secure page
   - Booking confirmed after payment
   - Ticket emailed after payment

---
## Technical Details

**Built With:**
- Next.js 14 (React Framework)
- TypeScript (Type Safety)
- Tailwind CSS (Styling)
- shadcn/ui (Components)

**Project Structure:**
\`\`\`
flixorama-cinema/
├── app/              # Pages
│   ├── movies/      # Regular movies
│   ├── imax/        # IMAX movies
│   ├── vip/         # VIP movies
│   ├── 3d/          # 3D movies
│   ├── tickets/     # User tickets
│   └── account/     # Account settings
├── components/       # React components
├── contexts/        # State management
└── public/          # Static assets
\`\`\`

**Available Scripts:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - Code linting

---

### Team Details 
- Halanna Le - 30148215 - halanna.le@ucalgary.ca
- Anfaal Mahbub - 30140009 - anfaal.mahbub@ucalgary.ca 
- Youssef Mamoun - 30149233 - Youssef.Mamoun@ucalgary.ca
- Collin Mtendamema - 30139450 - Collin.Mtendamema@ucalgary.ca
