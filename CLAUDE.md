# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MusiL is a DTM (Desktop Music) and music composition knowledge recording platform built with Angular 16 and Firebase. It's a single-page application with a comprehensive Firebase backend for content management and user interaction.

## Development Commands

### Frontend (Angular)
```bash
npm start              # Start dev server on port 4200 with auto-open
npm run dev           # Start dev server accessible from all hosts  
npm run build         # Build for production
npm run test          # Run unit tests with Karma/Jasmine
npm run lint          # ESLint check
npm run lint-fix      # Auto-fix ESLint issues + Prettier formatting
```

### Firebase Functions
```bash
cd functions/
npm run build         # Compile TypeScript to JavaScript
npm run serve         # Start Firebase emulators (functions only)
npm run start         # Lint + build + start functions shell
npm run deploy        # Deploy functions to Firebase
npm run logs          # View function logs
npm run lint          # ESLint for functions
npm run lint-fix      # Auto-fix functions code
```

## Architecture

### Frontend Structure (`/src/app/`)
- **`components/`** - Reusable UI components (article cards, dialogs, rich text editor)
- **`pages/`** - Route-level components (top, articles, mypage, settings)
- **`services/`** - Business logic and Firebase communication
- **`guards/`** - Route protection (auth, admin, form change detection)
- **`pipes/`** - Data transformation utilities
- **`lib/`** - Custom configurations (Quill editor, Material i18n)

### Firebase Functions (`/functions/src/`)
- **Runtime**: Node.js 18 with TypeScript compilation to `/functions/lib/`
- **Functions**: user management, articles, likes, view counts, Twitter integration, admin operations, sitemap generation, backup
- **Shared Interfaces**: Type definitions used by both frontend and backend

### Key Features
- **Rich Text Editor**: Quill.js with image upload/resize capabilities
- **Search**: Algolia integration for article search functionality
- **SSR**: Firebase Functions handle `/a/**` routes for SEO optimization
- **Authentication**: Firebase Auth with role-based access control
- **File Storage**: Firebase Storage for user-uploaded images

## Testing

- **Framework**: Karma with Jasmine for unit tests
- **Browser**: ChromeHeadless (CI-friendly)
- **Coverage**: HTML reports generated in `/coverage/musil/`
- **Test Files**: `*.spec.ts` files co-located with source code

## Build & Deployment

- **Output Directory**: `/dist/musil/` for Firebase hosting
- **Post-build**: Automatically copies `index.html` to functions directory for SSR
- **Emulators**: Functions (5001), Firestore (8080), Hosting (5000)
- **Bundle Limits**: 500kb warning, 2MB error for main bundles

## Development Setup Requirements

- **Node.js 18** (required for Firebase Functions)
- **Angular CLI 16**
- **Firebase CLI** for deployment and local emulation