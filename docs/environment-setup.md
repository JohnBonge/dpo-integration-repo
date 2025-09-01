# 🔧 Environment Setup

## Overview

Complete setup guide for development and production environments, including all dependencies, environment variables, and configuration requirements for the Ingoma Tours platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 14.x or higher
- **Git**: Latest version

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>
cd ingoma-tours

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
ingoma-tours/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   └── ...               # Application pages
├── components/            # React components
├── lib/                   # Utilities and services
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── docs/                 # Project documentation
├── hooks/                # Custom React hooks
├── middleware/           # API middleware
├── utils/                # Helper utilities
├── contexts/             # React contexts
└── server/               # Server-side utilities
```

## 🌐 Environment Variables

### Core Configuration

```bash
# Database
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/ingoma_tours"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/ingoma_tours"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Payment Gateway (IremboPay)

```bash
# IremboPay Payment Gateway
IREMBO_PUBLICK_KEY="your-irembo-public-key"
IREMBO_SECRET_KEY="your-irembo-secret-key"
IREMBOPAY_WEBHOOK_SECRET="your-webhook-secret"
```

### Email Service (Resend)

```bash
# Email Service
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="admin@yourdomain.com"
```

### File Upload (Cloudinary)

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Security & Authentication

```bash
# JWT Secret for additional token operations
JWT_SECRET="your-jwt-secret-key"

# Session configuration
SESSION_SECRET="your-session-secret"
```

### Real-time Features

```bash
# WebSocket Configuration
NEXT_PUBLIC_WS_URL="ws://localhost:3000"
```

### Analytics & Monitoring

```bash
# Optional: Analytics configuration
ANALYTICS_ID="your-analytics-id"
SENTRY_DSN="your-sentry-dsn"
```

## 📊 Database Setup

### PostgreSQL Installation

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb ingoma_tours

# Create user (optional)
psql postgres
CREATE USER ingoma_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ingoma_tours TO ingoma_user;
```

#### Ubuntu/Debian

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE ingoma_tours;
CREATE USER ingoma_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ingoma_tours TO ingoma_user;
```

#### Windows

```bash
# Download and install PostgreSQL from official website
# https://www.postgresql.org/download/windows/

# Use pgAdmin or command line to create database
psql -U postgres
CREATE DATABASE ingoma_tours;
```

### Prisma Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply schema to database
npx prisma db push

# Seed database with sample data
npx prisma db seed

# Open Prisma Studio (optional)
npx prisma studio
```

## 🔑 Service Configuration

### NextAuth.js Setup

```typescript
// app/api/auth/[...nextauth]/auth.ts
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      // Email/password authentication
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
```

### Cloudinary Configuration

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Resend Email Setup

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: EmailOptions) {
  try {
    await resend.emails.send({
      from: 'Ingoma Tours <noreply@yourdomain.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
```

## 🛠️ Development Tools

### VSCode Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### ESLint Configuration

`.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Configuration

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "jsxSingleQuote": true
}
```

## 🔄 Scripts and Commands

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "db:generate": "npx prisma generate",
    "db:push": "npx prisma db push",
    "db:seed": "npx prisma db seed",
    "db:reset": "npx prisma migrate reset",
    "db:studio": "npx prisma studio",
    "build:analyze": "ANALYZE=true npm run build"
  }
}
```

### Useful Development Commands

```bash
# Database operations
npm run db:generate     # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:seed        # Seed database
npm run db:reset       # Reset database
npm run db:studio      # Open Prisma Studio

# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server

# Code quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run type-check     # TypeScript type checking
```

## 🌍 Production Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Database URL, API keys, etc.
```

### Environment Variables for Production

```bash
# Production URLs
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXTAUTH_URL="https://yourdomain.com"

# Database (use connection pooling for production)
POSTGRES_PRISMA_URL="postgresql://user:password@host/db?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host/db"

# All other environment variables from development
# with production values
```

### Build Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

## 🔒 Security Considerations

### Environment Variable Security

```bash
# Never commit sensitive environment variables
echo ".env*" >> .gitignore

# Use different values for different environments
# Development: .env.local
# Production: Set in deployment platform
```

### Database Security

```bash
# Use connection pooling in production
# Enable SSL for database connections
# Regular database backups
# Monitor database performance
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -l

# Reset Prisma client
npx prisma generate
```

#### Environment Variable Issues

```bash
# Check variables are loaded
console.log(process.env.VARIABLE_NAME)

# Restart development server after changes
npm run dev
```

#### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### Prisma Issues

```bash
# Reset database completely
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Check schema validity
npx prisma validate
```

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Development Tools

- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Vercel Analytics](https://vercel.com/analytics) - Performance monitoring
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) - React debugging

---

This environment setup guide provides everything needed to get the Ingoma Tours platform running in both development and production environments.
