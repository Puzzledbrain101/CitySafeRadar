import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Safety Region schema - represents a geographic area in Mumbai with safety metrics
export const safetyRegions = pgTable("safety_regions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  safetyScore: integer("safety_score").notNull(), // 0-100
  lighting: integer("lighting").notNull(), // 0-100
  crowdDensity: integer("crowd_density").notNull(), // 0-100
  incidents24h: integer("incidents_24h").notNull().default(0),
  sentiment: real("sentiment").notNull().default(0), // -1 to 1
  weatherRisk: real("weather_risk").notNull().default(0), // 0 to 1
  policeNearby: boolean("police_nearby").notNull().default(false),
  nightFactor: real("night_factor").notNull().default(0), // 0 to 1
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertSafetyRegionSchema = createInsertSchema(safetyRegions).omit({
  id: true,
  lastUpdated: true,
});

export type InsertSafetyRegion = z.infer<typeof insertSafetyRegionSchema>;
export type SafetyRegion = typeof safetyRegions.$inferSelect;

// Alert schema - represents safety alerts/incidents
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  regionId: varchar("region_id").notNull(),
  severity: text("severity").notNull(), // 'critical' | 'warning' | 'info'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// User Report schema - user-submitted safety reports
export const userReports = pgTable("user_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  category: text("category").notNull(), // 'incident' | 'lighting' | 'crowd' | 'other'
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserReportSchema = createInsertSchema(userReports).omit({
  id: true,
  timestamp: true,
});

export type InsertUserReport = z.infer<typeof insertUserReportSchema>;
export type UserReport = typeof userReports.$inferSelect;

// Route schema - planned routes with safety analysis
export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  sourceLatitude: real("source_latitude").notNull(),
  sourceLongitude: real("source_longitude").notNull(),
  destLatitude: real("dest_latitude").notNull(),
  destLongitude: real("dest_longitude").notNull(),
  averageSafetyScore: integer("average_safety_score").notNull(),
  distance: real("distance").notNull(), // in kilometers
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  waypoints: text("waypoints").notNull(), // JSON string of coordinates
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

// TypeScript interfaces for frontend use
export interface SafetyScoreData {
  lighting: number;
  crowd_density: number;
  incidents_24h: number;
  sentiment: number;
  weather_risk: number;
  police_nearby: boolean;
  night_factor: number;
}

export interface RouteRequest {
  source: string;
  destination: string;
  sourceCoords: [number, number];
  destCoords: [number, number];
}

export interface HeatmapData {
  regions: SafetyRegion[];
  timestamp: string;
}
