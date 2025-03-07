# MediPass Healthcare Patient Dashboard

A modern, responsive healthcare patient dashboard built with React, TypeScript, and Material UI. This application provides patients with a comprehensive interface to manage their healthcare information, medical records, appointments, and more.

## 🌟 Features

### Dashboard
- Patient overview with personal information and medical QR code
- Quick action buttons for common tasks
- Appointment management and scheduling
- Medical records viewing and organization
- Health metrics visualization with interactive charts

### Medical Records
- Comprehensive view of all medical documents
- Categorized organization: prescriptions, lab reports, vaccinations, etc.
- Advanced search, sorting, and filtering capabilities
- Document upload with metadata capture
- Data sharing and access management

### Coming Soon
- Appointments management
- Data sharing and permissions
- Settings and profile management
- Emergency mode
- Notifications system

## 🚀 Technology Stack

- **Frontend**: React, TypeScript
- **UI Library**: Material UI (v5)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts**: Recharts
- **Date Handling**: Day.js
- **API Integration**: Axios (mock API for demo)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

The UI automatically adapts to different screen sizes to provide the best user experience on any device.

## 🛠️ Installation & Setup

1. Clone the repository
   ```
   git clone https://github.com/your-username/healthcare-frontend.git
   cd healthcare-frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open your browser to http://localhost:3000

## 📝 Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable UI components
│   ├── common/      # Shared components (Layout, Header, etc.)
│   ├── dashboard/   # Dashboard-specific components
│   └── records/     # Medical records components
├── context/         # React Context for state management
├── pages/           # Main application pages
├── services/        # API services and data handling
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 📊 Data Flow

This application uses mock data for demonstration purposes. In a production environment, you would replace the mock API services with real API calls to your backend server.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
