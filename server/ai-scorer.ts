import type { SafetyScoreData } from '@shared/schema';

/**
 * AI Safety Score Calculation Algorithm
 * Based on the provided formula with weighted factors:
 * - Lighting (20%)
 * - Crowd Density (15%)
 * - Recent Incidents (25%)
 * - Sentiment Analysis (15%)
 * - Weather Risk (10%)
 * - Police Presence (5%)
 * - Night Factor (10%)
 * 
 * Returns a safety score from 0-100
 */
export function computeSafetyScore(data: SafetyScoreData, prevScore: number = 70): number {
  // Normalize lighting (0-100 scale)
  const L = Math.min(data.lighting / 100, 1);
  
  // Normalize crowd density (0-50 scale, higher is better up to a point)
  const C = Math.min(data.crowd_density / 50, 1);
  
  // Normalize incidents (0-10 scale, fewer is better)
  const I = 1 - Math.min(data.incidents_24h / 10, 1);
  
  // Normalize sentiment (-1 to 1 scale to 0-1 scale)
  const S = (data.sentiment + 1) / 2;
  
  // Weather risk (0-1 scale, lower is better)
  const W = 1 - data.weather_risk;
  
  // Police presence (boolean to 0.7 or 1)
  const P = data.police_nearby ? 1 : 0.7;
  
  // Night factor (0-1 scale, lower is better)
  const T = 1 - data.night_factor;
  
  // Calculate raw weighted score
  const raw = 100 * (
    0.20 * L +  // 20% weight on lighting
    0.15 * C +  // 15% weight on crowd density
    0.25 * I +  // 25% weight on incidents (highest)
    0.15 * S +  // 15% weight on sentiment
    0.10 * W +  // 10% weight on weather
    0.05 * P +  // 5% weight on police presence
    0.10 * T   // 10% weight on time of day
  );
  
  // Apply temporal smoothing (70% current, 30% previous)
  const final = 0.7 * raw + 0.3 * prevScore;
  
  return Math.round(final * 100) / 100;
}

/**
 * Generate mock safety data for a region
 * Simulates AI analysis from various data sources
 */
export function generateMockSafetyData(baseScore: number = 70): SafetyScoreData {
  // Add some randomness around the base score to simulate real-time variations
  const variance = (Math.random() - 0.5) * 20;
  const targetScore = Math.max(20, Math.min(100, baseScore + variance));
  
  // Determine time of day (simulate night factor)
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 20;
  const nightFactor = isNight ? 0.3 + Math.random() * 0.4 : Math.random() * 0.2;
  
  // Generate correlated data that would result in target score
  const lighting = targetScore > 60 ? 60 + Math.random() * 40 : 30 + Math.random() * 40;
  const crowdDensity = targetScore > 60 ? 20 + Math.random() * 30 : 5 + Math.random() * 25;
  const incidents24h = targetScore > 60 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 7);
  const sentiment = targetScore > 60 ? 0.3 + Math.random() * 0.7 : -0.5 + Math.random() * 0.8;
  const weatherRisk = Math.random() * 0.3;
  const policeNearby = targetScore > 50 ? Math.random() > 0.3 : Math.random() > 0.7;
  
  return {
    lighting: Math.round(lighting),
    crowd_density: Math.round(crowdDensity),
    incidents_24h: incidents24h,
    sentiment: Math.round(sentiment * 100) / 100,
    weather_risk: Math.round(weatherRisk * 100) / 100,
    police_nearby: policeNearby,
    night_factor: Math.round(nightFactor * 100) / 100,
  };
}
