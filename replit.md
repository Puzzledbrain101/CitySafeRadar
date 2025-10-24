# City Safety Radar — Mumbai

An AI-powered real-time safety heatmap application for Mumbai that helps users find the safest routes, view live safety alerts, and report incidents.

## Overview

City Safety Radar is a full-stack web application that provides real-time safety information for different areas of Mumbai. It uses AI-powered safety scoring to analyze multiple factors including lighting conditions, crowd density, recent incidents, sentiment analysis, weather risk, police presence, and time of day to generate comprehensive safety scores (0-100) for 30 key regions across Mumbai.

## Features

### Live Safety Heatmap
- Interactive map of Mumbai with 30 regions color-coded by safety level
- Auto-refreshes every 5 seconds with updated safety data
- Color coding: Green (Safe 70+), Yellow (Moderate 40-70), Red (Unsafe <40)
- Detailed region popups showing safety metrics

### AI-Based Safety Scoring
- Multi-factor analysis using weighted algorithm:
  - Lighting conditions (20%)
  - Crowd density (15%)
  - Recent incidents in 24h (25%)
  - Sentiment analysis (15%)
  - Weather risk (10%)
  - Police presence (5%)
  - Time of day factor (10%)
- Temporal smoothing for stable scores
- Real-time score updates

### Safest Route Planner
- Calculate optimal routes prioritizing safety over distance
- Avoids low-safety areas when possible
- Shows average safety score for the route
- Displays estimated time and distance
- Visual route overlay on map

### Live Alerts Panel
- Real-time safety alerts categorized by severity (Critical, Warning, Info)
- Auto-refresh every 5 seconds
- Grouped by severity with color-coded indicators
- Timestamps showing relative time

### User Incident Reporting
- Submit safety concerns and incidents
- Categories: Safety Incident, Poor Lighting, Crowd Issues, Other
- Automatically generates alerts for critical reports
- Helps improve community safety awareness

### Privacy Protection
- Privacy banner with data protection notice
- All camera feeds anonymized
- No personal tracking or identifiable data storage

## Architecture

### Recent Changes
- 2025-10-20: Initial implementation with complete MVP features
- Full-stack application with React frontend and Express backend
- In-memory storage for rapid prototyping
- 30 Mumbai regions with realistic mock data

### Project Structure

**Frontend (React + TypeScript)**
- `client/src/pages/Dashboard.tsx` - Main application layout
- `client/src/components/MapView.tsx` - Leaflet map with heatmap overlay
- `client/src/components/RoutePlanner.tsx` - Route calculation interface
- `client/src/components/AlertsPanel.tsx` - Live alerts display
- `client/src/components/UserReportForm.tsx` - Incident reporting modal
- `client/src/components/SafetyLegend.tsx` - Color-coded legend
- `client/src/components/PrivacyBanner.tsx` - Privacy notice

**Backend (Node.js + Express + TypeScript)**
- `server/routes.ts` - API endpoints and request handlers
- `server/storage.ts` - In-memory storage implementation
- `server/ai-scorer.ts` - AI safety scoring algorithm
- `server/mumbai-data.ts` - Mock Mumbai region data

**Shared**
- `shared/schema.ts` - TypeScript interfaces and Zod schemas

### Technology Stack
- Frontend: React 18, TypeScript, Tailwind CSS, Leaflet, React Query
- Backend: Express, Node.js, TypeScript
- Storage: In-memory (MemStorage)
- Maps: Leaflet with OpenStreetMap tiles (dark theme)
- Forms: React Hook Form with Zod validation
- UI Components: Shadcn UI with custom dark radar theme

## Design System

### Color Palette
- Background: Deep navy-black (220 15% 8%)
- Surface Cards: Slightly elevated (220 15% 12%)
- Safety Safe: Electric green (142 75% 50%)
- Safety Moderate: Vibrant amber (45 95% 55%)
- Safety Unsafe: Bright neon red (0 85% 60%)
- Primary CTA: Cyan neon (200 95% 55%)
- Alert Warning: Neon orange (25 95% 60%)

### Typography
- Primary: Inter (clean, modern)
- Monospace: JetBrains Mono (for scores and metrics)

### Visual Effects
- Glass-morphism on floating cards
- Neon glow effects on safety indicators
- Radar scan animation overlay
- Smooth transitions on score updates
- Pulsing indicators for live data

## API Endpoints

- `GET /api/heatmap` - Get all safety regions with current scores
- `GET /api/safety-score/:id` - Get specific region safety data
- `GET /api/alerts` - Get all active alerts
- `POST /api/user-reports` - Submit user safety report
- `POST /api/route` - Calculate safest route between two locations

## User Preferences

None configured yet.

## Development

The application auto-refreshes safety data every 5 seconds to simulate real-time updates. In production, this would integrate with:
- Real Twitter/X API for incident detection
- Google Maps Directions API for actual routing
- OpenWeatherMap API for weather data
- Camera feed analysis for crowd density
- NLP models for sentiment analysis

## Future Enhancements

- WebSocket connections for true real-time updates
- User authentication and saved routes
- Predictive safety analytics with time-series forecasting
- AI chatbot for natural language safety queries
- Mobile app with push notifications
- Integration with actual data sources (Twitter, Google Maps, Weather APIs)
- Historical safety data visualization
- Community safety ratings and feedback
