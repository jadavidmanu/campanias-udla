# Campaign Management System

## Overview

A modern web application for managing advertising campaigns, ad groups, and ads with complete CRUD operations. Built as a full-stack TypeScript application with React frontend and Express backend, designed for marketing teams to organize and track their advertising campaigns across different media channels and educational programs.

The system provides a comprehensive view of campaign hierarchies, advanced search functionality, and data export capabilities. It follows a clean, data-focused design inspired by Linear and Notion for optimal workflow efficiency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management with optimistic updates
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens for consistent theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: SQLite with better-sqlite3 for development simplicity
- **ORM**: Drizzle ORM with TypeScript-first approach
- **API Design**: RESTful endpoints with consistent error handling
- **Validation**: Zod schemas shared between frontend and backend

### Data Layer Design
- **Three-tier hierarchy**: Campaigns → Ad Groups → Ads
- **Foreign key relationships**: Cascading deletes maintain referential integrity
- **Shared schema**: TypeScript types generated from Drizzle schema ensure type safety
- **Automatic timestamps**: Created/updated tracking on all entities

### Authentication Strategy
- Currently no authentication implemented
- Session-based approach planned with connect-pg-simple for PostgreSQL sessions
- Architecture prepared for future user management implementation

### Design System Approach
- **Consistent spacing**: Tailwind utilities (2, 4, 6, 8) for predictable layouts
- **Color system**: CSS custom properties for light/dark mode support
- **Typography**: Inter font family with consistent weight and size scales
- **Component library**: Reusable components with variant-based styling

### Development Workflow
- **Hot reload**: Vite with runtime error overlay for development
- **Type safety**: Strict TypeScript configuration across all layers
- **Code organization**: Feature-based structure with shared utilities
- **Build process**: Optimized production builds with static asset handling

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing library
- **react-hook-form**: Form handling with minimal re-renders
- **@hookform/resolvers**: Zod integration for form validation

### UI and Styling
- **@radix-ui/***: Accessible UI primitives for complex components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **clsx**: Conditional className utility

### Database and Backend
- **better-sqlite3**: Synchronous SQLite database driver
- **drizzle-orm**: Type-safe SQL ORM with excellent TypeScript support
- **drizzle-kit**: Database migration and introspection tools
- **express**: Minimal web application framework

### Development Tools
- **vite**: Fast build tool with HMR support
- **typescript**: Static type checking
- **zod**: Runtime type validation and schema definition
- **date-fns**: Modern date utility library

### Planned Production Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for production deployment
- **connect-pg-simple**: PostgreSQL session store for authentication