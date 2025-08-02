# 📧 Email Campaign Builder

A visual email campaign management system built with React and Node.js. Create sophisticated email campaigns with drag-and-drop flow builders, user authentication, and real-time tracking.

✨ Features

🎨 Visual Campaign Builder

- Drag & Drop Interface: Build campaigns visually on an intuitive canvas
- Multiple Node Types: Send Email, Wait, and Conditional Logic
- Save & Load: Save campaigns and load previous designs
- User-specific: Each user sees only their own campaigns

🔐 Authentication

- Secure Login/Signup: JWT-based authentication
- Session Management: Automatic login state persistence
- Fresh Canvas: Clean slate for each user login

📊 Campaign Execution

- Automated Emails: Send through Gmail SMTP
- Event Tracking: Track opens, clicks, and custom events
- Smart Logic: Route users based on their actions
- Real-time Dashboard: Monitor campaign progress

🚀 Quick Start

Prerequisites

- Node.js (v16+)
- MongoDB database
- Gmail account with App Password

Installation

1. Clone and install

   ```bash
   git clone <repository-url>
   cd email-campaign-builder

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

2. Set up environment variables

   Server (.env in server directory):

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/email-campaigns
   JWT_SECRET=your-secret-key-here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

   Client (.env in client directory):

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. Start the application

   ```bash
   # Start server (from server directory)
   npm start

   # Start client (from client directory)
   npm run dev
   ```

4. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

🏗️ Architecture

Frontend

- React 18 with hooks
- Vite for fast development
- Tailwind CSS for styling
- React Flow for visual campaign builder
- Axios for API calls

Backend

- Express.js web framework
- MongoDB + Mongoose for database
- JWT for authentication
- Nodemailer for email sending
- Bcryptjs for password hashing

📋 Campaign Node Types

📧 Send Email

- Configure subject and content
- Automatic tracking pixel
- Email delivery confirmation

⏰ Wait

- Custom wait periods (minutes, hours, days)
- Automatic progression after completion

🔀 Condition

- Email Opened: Check if user opened previous email
- Link Clicked: Check if user clicked any link
- Page Visited: Check if user visited specific page
- Form Submitted: Check if user submitted a form
- Idle Time: Check time since last activity

📊 Dashboard Features

- Real-time tracking of user states and events
- Event history with comprehensive logging
- Campaign progress visualization
- User journey mapping and analytics
- Manual event triggering for testing

🔧 Configuration

Email Setup (Gmail)

1. Enable 2-factor authentication
2. Generate an App Password
3. Use App Password in `EMAIL_PASS` environment variable

Database Setup

- MongoDB Atlas (recommended for production)
- Local MongoDB for development

🚀 Deployment

Render Deployment

1. Connect GitHub repository to Render
2. Set up environment variables in dashboard
3. Configure build settings for client and server
4. Deploy with automatic builds

Production Environment Variables

```env
# Server
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Client
VITE_API_BASE_URL=https://your-server-app.onrender.com
```

🛠️ Project Structure

```
email-campaign-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── server.js     # Main server file
│   └── package.json
└── README.md
```

🔍 Troubleshooting

Common Issues

1. Email sending fails: Check Gmail App Password
2. Database connection errors: Verify MongoDB URI
3. Authentication issues: Ensure JWT_SECRET is set
4. CORS errors: Check API_BASE_URL configuration

Debug Steps

1. Check server logs for error messages
2. Verify environment variables are set correctly
3. Test database connection locally
4. Ensure proper file permissions

📈 Future Enhancements

- Advanced analytics and performance metrics
- A/B testing for campaign variations
- Template library for emails
- Integration with external services
- Advanced user segmentation
- Mobile application
- Webhook support for real-time events

🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
