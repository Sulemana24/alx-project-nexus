Learnify - Interactive Quiz Platform
Overview
Learnify is a modern, AI-powered quiz platform that transforms traditional PDF past questions into interactive learning experiences. Built for AAMUSTED-K and other educational institutions, it enables students to practice smarter and teachers to create engaging assessments effortlessly.

🚀 Features
For Students
AI-Powered Quiz Generation: Upload PDFs and instantly generate interactive quizzes

Personal Practice: Create unlimited practice sessions from any study material

Timed Assessments: Join teacher-created quizzes with real-time timers

E-Learning Hub: Access curated YouTube educational content

Performance Analytics: Track progress with detailed insights and analytics

Instant Feedback: Get immediate results with explanations

For Teachers
Automated Quiz Creation: Convert course materials to quizzes in seconds

Class Management: Create and manage quizzes for entire classes

Advanced Settings: Set time limits, access codes, and anti-cheating measures

Student Analytics: Monitor class performance and identify knowledge gaps

Content Management: Curate e-learning resources for students

For Administrators
User Management: Comprehensive user administration and moderation

Revenue Management: Subscription plans, billing, and financial reporting

Institutional Licensing: Manage university-wide deployments

System Analytics: Platform usage and performance monitoring

Content Moderation: AI-generated content quality control

🛠 Tech Stack
Frontend & Framework
Next.js 14+ (App Router) - Full-stack React framework

TypeScript - Type-safe development

Tailwind CSS - Utility-first styling

React Hook Form - Form management and validation

Backend & Database
Next.js API Routes - Serverless backend API

PostgreSQL - Primary relational database

Prisma ORM - Database management and type safety

Next-Auth.js - Authentication and authorization

External Services & APIs
DeepSeek API - AI-powered PDF-to-quiz generation

Uploadthing - File upload and storage management

Stripe/Paystack - Payment processing and subscriptions

YouTube Data API - E-learning content integration

Deployment & Infrastructure
Vercel - Platform deployment and hosting

Environment Variables - Secure configuration management

📁 Project Structure
text
Learnify/
├── app/
│ ├── (auth)/ # Authentication routes
│ ├── (dashboard)/ # Dashboard layouts
│ │ ├── student/ # Student dashboard
│ │ ├── teacher/ # Teacher dashboard  
│ │ └── admin/ # Admin dashboard
│ ├── api/ # API routes
│ │ ├── auth/ # Authentication
│ │ ├── upload/ # File uploads
│ │ ├── generate-questions/# AI quiz generation
│ │ ├── quizzes/ # Quiz management
│ │ ├── practice/ # Student practice
│ │ └── admin/ # Admin endpoints
│ └── globals.css # Global styles
├── components/ # Reusable components
│ ├── ui/ # Base UI components
│ ├── dashboard/ # Dashboard components
│ ├── quizzes/ # Quiz components
│ └── forms/ # Form components
├── lib/ # Utility libraries
│ ├── auth.ts # Authentication config
│ ├── db.ts # Database client
│ ├── utils.ts # Helper functions
│ └── validations.ts # Form validations
├── types/ # TypeScript definitions
└── public/ # Static assets
🚀 Getting Started
Prerequisites
Node.js 18+

PostgreSQL database

DeepSeek API account

Stripe/Paystack account (for payments)

Installation
Clone the repository

bash
git clone https://github.com/Sulemana24/alx-project-nexus
cd passcomaster
Install dependencies

bash
npm install
Environment Setup

bash
cp .env.example .env.local
Configure your environment variables:

env

# Database

DATABASE_URL="postgresql://username:password@localhost:5432/learnify"

# Authentication

NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services

DEEPSEEK_API_KEY="your-deepseek-api-key"

# File Upload

UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Payments

STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
Database Setup

bash
npx prisma generate
npx prisma db push
Run the development server

bash
npm run dev
Open http://localhost:3000 in your browser.

🎯 Key Learnings & Technologies
Frontend Engineering Concepts
Next.js App Router: Modern React framework with server components

TypeScript: Type safety and improved developer experience

Tailwind CSS: Utility-first CSS framework for rapid UI development

Component Architecture: Reusable, maintainable component design

State Management: React hooks and context for state management

Backend Integration
API Route Handlers: Next.js API routes for backend logic

Database Design: PostgreSQL schema design and optimization

ORM Usage: Prisma for type-safe database operations

Authentication: Next-Auth with role-based access control

External API Integration
AI Service Integration: DeepSeek API for content generation

File Upload Services: Uploadthing for secure file handling

Payment Processing: Stripe/Paystack for subscription management

Video Content: YouTube API for e-learning resources

System Design & Architecture
Monolithic Architecture: Full-stack application in Next.js

Role-Based Access: Multi-tenant system with student/teacher/admin roles

Data Flow Optimization: Efficient data fetching and caching strategies

Error Handling: Comprehensive error boundaries and user feedback

💡 Challenges & Solutions
Challenge 1: PDF Text Extraction & AI Processing
Problem: Extracting clean text from various PDF formats and generating meaningful questions.

Solution:

Implemented robust PDF text extraction with error handling

Created prompt engineering strategies for consistent AI output

Added validation and manual review for generated content

Challenge 2: Real-time Quiz Experience
Problem: Synchronized timers and preventing cheating during assessments.

Solution:

Client-side timer with server-side validation

UI restrictions (right-click disable, text selection prevention)

Progressive answer submission with auto-save

Challenge 3: Role-based Feature Access
Problem: Different functionalities for students, teachers, and admins.

Solution:

Next-Auth role management with middleware protection

Conditional UI rendering based on user roles

Separate dashboard layouts for each user type

📊 Database Schema Highlights
sql
-- Core tables include:
-- users: Student, teacher, and admin accounts
-- quizzes: Quiz metadata and settings  
-- questions: AI-generated and manual questions
-- student_answers: Answer tracking and grading
-- student_practice_sessions: Personal practice history
-- subscription_plans: Monetization and feature access
-- institutional_licenses: University partnerships
🔄 Data Flow Architecture
User Authentication → Role-based dashboard routing

PDF Upload → Text extraction → AI processing → Quiz generation

Quiz Taking → Timer management → Answer submission → Grading

Analytics → Performance tracking → Insights generation

🎨 UI/UX Design Principles
Clean Interface: Minimalist design focused on content

Mobile-First: Responsive design for all devices

Accessibility: WCAG compliant with proper contrast ratios

User-Centric: Intuitive navigation and clear information hierarchy

🚧 Future Enhancements
Mobile App: React Native companion application

Advanced AI: Personalized learning path recommendations

Gamification: Points, badges, and leaderboards

Collaborative Features: Group study sessions and peer learning

API Access: Developer API for third-party integrations

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Support
For support and questions:

📧 Email: support@learnify.com

🐛 Issue Tracker

💬 Discord Community

🙏 Acknowledgments
AAMUSTED-K for inspiration and user research

DeepSeek for AI capabilities

Vercel for deployment infrastructure

The open-source community for invaluable tools and libraries

Built with ❤️ for the future of education
