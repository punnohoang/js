# VetClinic - Veterinary Clinic Management System

A comprehensive web-based management system for veterinary clinics built with Next.js frontend and Java Spring Boot backend.

## Features

### For Customers (Pet Owners)
- Register and manage pet profiles
- Book appointments with veterinarians
- View medical records and examination results
- Receive prescriptions
- View and pay invoices
- Track appointment history

### For Veterinarians
- View daily schedule and appointments
- Examine patients and update medical records
- Create diagnoses and treatment plans
- Prescribe medications
- Manage patient medical history

### For Receptionists
- Check-in customers and pets
- Manage appointment scheduling
- Create and manage invoices
- Collect payments
- Maintain customer information

### For Administrators
- Manage user accounts and permissions
- View comprehensive statistics and reports
- Monitor revenue and appointments
- Generate business reports
- System configuration

## Tech Stack

### Frontend
- **Framework**: Next.js 15+ with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API + SWR
- **Charts**: Recharts

### Backend (To be implemented)
- **Framework**: Java Spring Boot
- **Database**: MySQL
- **Authentication**: JWT
- **API**: RESTful

## Project Structure

\`\`\`
app/
├── login/                 # Login page
├── register/             # Registration page
├── dashboard/            # Main dashboard
├── appointments/         # Appointment management
├── medical-records/      # Medical records
├── invoices/            # Invoice management
├── pets/                # Pet management
├── examinations/        # Veterinarian examination
├── schedule/            # Schedule management
├── patients/            # Patient list
├── check-in/            # Reception check-in
├── billing/             # Billing management
├── customers/           # Customer management
├── users/               # User management
├── reports/             # Reports and statistics
└── settings/            # Settings

components/
├── login-form.tsx       # Login form component
├── register-form.tsx    # Registration form
├── sidebar.tsx          # Navigation sidebar
└── dashboard-layout.tsx # Dashboard layout wrapper

lib/
├── api-client.ts        # API client for backend communication
├── auth-context.tsx     # Authentication context
└── hooks/
    └── use-api.ts       # Custom hook for API calls
\`\`\`

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd vet-clinic-management
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The frontend communicates with the Java Spring Boot backend through RESTful APIs. The `apiClient` in `lib/api-client.ts` handles all API requests.

### Available API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

#### Pets
- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

#### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `POST /api/appointments/:id/cancel` - Cancel appointment

#### Medical Records
- `GET /api/medical-records` - Get medical records
- `POST /api/medical-records` - Create record
- `PUT /api/medical-records/:id` - Update record

#### Invoices
- `GET /api/invoices` - Get invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id/status` - Update payment status

#### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Statistics (Admin only)
- `GET /api/statistics` - Get system statistics

## Authentication

The system uses JWT (JSON Web Tokens) for authentication. The token is stored in localStorage and automatically included in all API requests.

### User Roles
- **CUSTOMER**: Pet owner
- **VETERINARIAN**: Veterinary doctor
- **RECEPTIONIST**: Reception staff
- **ADMIN**: System administrator

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact support@vetclinic.com
