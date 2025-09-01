# 🏗️ Ingoma Tours - Architecture Documentation

> **Complete Project Memory Bank & Developer Reference**

## 📋 Project Overview

**Ingoma Tours** is a comprehensive tour booking and travel management platform built with modern web technologies, focusing on performance, scalability, and user experience.

### 🎯 Core Features

- **Tour Management**: Create, edit, and manage tour packages
- **Booking System**: Complete booking workflow with payment integration
- **User Authentication**: Role-based access control (Admin, User, Guest)
- **Payment Processing**: IremboPay Payment Gateway integration
- **Community Features**: Story sharing and reviews
- **Admin Dashboard**: Comprehensive management interface
- **Real-time Updates**: WebSocket-powered live notifications

### 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query + Custom Hooks
- **Payment**: IremboPay Payment Gateway
- **Email**: Resend API
- **File Upload**: Cloudinary
- **Real-time**: WebSocket Server

## 📚 Documentation Structure

### Core Architecture

- [**Project Summary**](./project-summary.md) - Complete memory bank and architecture overview
- [**Database Schema**](./database-architecture.md) - Prisma models, relationships, and indexes
- [**API Architecture**](./api-architecture.md) - REST endpoints, validation, and patterns
- [**Component System**](./component-architecture.md) - UI components and patterns
- [**Technical Decisions**](./technical-decisions.md) - Architecture decision records
- [**Changelog**](./CHANGELOG.md) - Version history and recent updates

### Integration Guides

- [**Payment Integration**](./payment-integration.md) - IremboPay gateway implementation
- [**Email System**](./email-system.md) - Resend integration and templates
- [**File Upload**](./file-upload-system.md) - Cloudinary integration patterns

### Development

- [**Environment Setup**](./environment-setup.md) - Development environment configuration
- [**Validation Schemas**](./validation-schemas.md) - Zod schemas and type safety
- [**Error Handling**](./error-handling.md) - Error patterns and boundaries
- [**Performance**](./performance-optimizations.md) - Optimization strategies

### UI/UX

- [**Design System**](./design-system.md) - Colors, typography, and components
- [**Responsive Design**](./responsive-patterns.md) - Mobile-first approach
- [**Animation System**](./animation-patterns.md) - Framer Motion implementations

### Deployment & Operations

- [**Deployment Guide**](./deployment.md) - Production deployment steps
- [**Monitoring**](./monitoring-logging.md) - Logging and error tracking
- [**Security**](./security-considerations.md) - Security best practices

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository>
   cd ingoma-tours
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

3. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔄 Key Workflows

### Booking Flow

1. User browses tours → Selects date/participants → Fills booking form
2. System creates pending booking → Initializes IremboPay payment
3. User completes payment → Webhook updates booking status
4. Confirmation email sent → Booking confirmed

### Admin Workflow

1. Admin logs in → Accesses dashboard
2. Manages tours, bookings, stories, FAQs
3. Views analytics and reports
4. Handles customer communications

## 🏛️ Architectural Principles

- **Type Safety First**: Strict TypeScript throughout
- **Server-First**: Leverage Next.js Server Components
- **Database-Driven**: Prisma schema as single source of truth
- **Component Reusability**: Shadcn UI + custom patterns
- **Performance Focus**: Optimized loading and caching
- **Security by Design**: Protected routes and data validation
- **Developer Experience**: Clear patterns and comprehensive tooling

## 📞 Support & Maintenance

For questions about the architecture or implementation details, refer to the specific documentation files linked above. Each file contains detailed implementation patterns, code examples, and best practices.

---

## 🆕 Recent Updates

**Version 1.2.0** (January 2025) includes major improvements:

- ✅ **50% Deposit Payment System** - Fixed payment charging and enhanced user experience
- ✅ **Enhanced Admin Dashboard** - Complete booking management with search, filtering, and bulk operations
- ✅ **Professional UI Improvements** - Replaced browser popups with custom dialogs
- ✅ **Technical Debt Resolution** - Fixed TypeScript errors, foreign key constraints, and performance issues

See [**CHANGELOG.md**](./CHANGELOG.md) for complete details.

---

**Last Updated**: January 2025  
**Version**: 1.2.0
