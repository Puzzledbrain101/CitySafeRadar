import { 
  type SafetyRegion, 
  type InsertSafetyRegion,
  type Alert,
  type InsertAlert,
  type UserReport,
  type InsertUserReport,
  type Route,
  type InsertRoute,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Safety Regions
  getSafetyRegions(): Promise<SafetyRegion[]>;
  getSafetyRegion(id: string): Promise<SafetyRegion | undefined>;
  createSafetyRegion(region: InsertSafetyRegion): Promise<SafetyRegion>;
  updateSafetyRegion(id: string, region: Partial<InsertSafetyRegion>): Promise<SafetyRegion | undefined>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  deleteOldAlerts(olderThanHours: number): Promise<void>;
  
  // User Reports
  getUserReports(): Promise<UserReport[]>;
  getUserReport(id: string): Promise<UserReport | undefined>;
  createUserReport(report: InsertUserReport): Promise<UserReport>;
  
  // Routes
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
}

export class MemStorage implements IStorage {
  private safetyRegions: Map<string, SafetyRegion>;
  private alerts: Map<string, Alert>;
  private userReports: Map<string, UserReport>;
  private routes: Map<string, Route>;

  constructor() {
    this.safetyRegions = new Map();
    this.alerts = new Map();
    this.userReports = new Map();
    this.routes = new Map();
  }

  // Safety Regions
  async getSafetyRegions(): Promise<SafetyRegion[]> {
    return Array.from(this.safetyRegions.values());
  }

  async getSafetyRegion(id: string): Promise<SafetyRegion | undefined> {
    return this.safetyRegions.get(id);
  }

  async createSafetyRegion(insertRegion: InsertSafetyRegion): Promise<SafetyRegion> {
    const id = randomUUID();
    const region: SafetyRegion = { 
      ...insertRegion, 
      id,
      lastUpdated: new Date(),
    };
    this.safetyRegions.set(id, region);
    return region;
  }

  async updateSafetyRegion(id: string, updates: Partial<InsertSafetyRegion>): Promise<SafetyRegion | undefined> {
    const existing = this.safetyRegions.get(id);
    if (!existing) return undefined;
    
    const updated: SafetyRegion = { 
      ...existing, 
      ...updates,
      lastUpdated: new Date(),
    };
    this.safetyRegions.set(id, updated);
    return updated;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id,
      timestamp: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async deleteOldAlerts(olderThanHours: number): Promise<void> {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    for (const [id, alert] of this.alerts.entries()) {
      if (alert.timestamp < cutoffTime) {
        this.alerts.delete(id);
      }
    }
  }

  // User Reports
  async getUserReports(): Promise<UserReport[]> {
    return Array.from(this.userReports.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getUserReport(id: string): Promise<UserReport | undefined> {
    return this.userReports.get(id);
  }

  async createUserReport(insertReport: InsertUserReport): Promise<UserReport> {
    const id = randomUUID();
    const report: UserReport = { 
      ...insertReport, 
      id,
      timestamp: new Date(),
    };
    this.userReports.set(id, report);
    return report;
  }

  // Routes
  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { 
      ...insertRoute, 
      id,
      createdAt: new Date(),
    };
    this.routes.set(id, route);
    return route;
  }
}

export const storage = new MemStorage();
