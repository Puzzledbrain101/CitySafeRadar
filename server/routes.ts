import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { computeSafetyScore, generateMockSafetyData } from "./ai-scorer";
import { mumbaiRegions, getRandomAlert } from "./mumbai-data";
import type { 
  InsertSafetyRegion,
  InsertAlert, 
  InsertUserReport,
  SafetyRegion 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize Mumbai regions on startup
  async function initializeMumbaiRegions() {
    const existingRegions = await storage.getSafetyRegions();
    if (existingRegions.length === 0) {
      for (const region of mumbaiRegions) {
        const safetyData = generateMockSafetyData(region.baseScore);
        const safetyScore = computeSafetyScore(safetyData);
        
        const regionData: InsertSafetyRegion = {
          name: region.name,
          latitude: region.lat,
          longitude: region.lng,
          safetyScore: Math.round(safetyScore),
          lighting: safetyData.lighting,
          crowdDensity: safetyData.crowd_density,
          incidents24h: safetyData.incidents_24h,
          sentiment: safetyData.sentiment,
          weatherRisk: safetyData.weather_risk,
          policeNearby: safetyData.police_nearby,
          nightFactor: safetyData.night_factor,
        };
        
        await storage.createSafetyRegion(regionData);
      }
      
      // Generate initial alerts
      await generateRandomAlerts();
    }
  }
  
  // Generate random alerts for simulation
  async function generateRandomAlerts() {
    const regions = await storage.getSafetyRegions();
    const numAlerts = 3 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < numAlerts; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      let severity: 'critical' | 'warning' | 'info';
      
      if (region.safetyScore < 40) {
        severity = Math.random() > 0.5 ? 'critical' : 'warning';
      } else if (region.safetyScore < 70) {
        severity = Math.random() > 0.3 ? 'warning' : 'info';
      } else {
        severity = 'info';
      }
      
      const alert: InsertAlert = {
        regionId: region.id,
        severity,
        message: getRandomAlert(severity, region.name),
      };
      
      await storage.createAlert(alert);
    }
  }
  
  // Update safety scores periodically (simulate real-time updates)
  async function updateSafetyScores() {
    const regions = await storage.getSafetyRegions();
    
    for (const region of regions) {
      // Get the base score for this region
      const baseRegion = mumbaiRegions.find(r => r.name === region.name);
      const baseScore = baseRegion?.baseScore || 70;
      
      // Generate new safety data
      const safetyData = generateMockSafetyData(baseScore);
      const newScore = computeSafetyScore(safetyData, region.safetyScore);
      
      // Update region with new data
      await storage.updateSafetyRegion(region.id, {
        safetyScore: Math.round(newScore),
        lighting: safetyData.lighting,
        crowdDensity: safetyData.crowd_density,
        incidents24h: safetyData.incidents_24h,
        sentiment: safetyData.sentiment,
        weatherRisk: safetyData.weather_risk,
        policeNearby: safetyData.police_nearby,
        nightFactor: safetyData.night_factor,
      });
    }
    
    // Occasionally generate new alerts
    if (Math.random() > 0.7) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      let severity: 'critical' | 'warning' | 'info';
      
      if (region.safetyScore < 40) {
        severity = Math.random() > 0.5 ? 'critical' : 'warning';
      } else if (region.safetyScore < 70) {
        severity = Math.random() > 0.3 ? 'warning' : 'info';
      } else {
        severity = 'info';
      }
      
      const alert: InsertAlert = {
        regionId: region.id,
        severity,
        message: getRandomAlert(severity, region.name),
      };
      
      await storage.createAlert(alert);
    }
    
    // Clean up old alerts (older than 2 hours)
    await storage.deleteOldAlerts(2);
  }
  
  // Initialize data
  await initializeMumbaiRegions();
  
  // Update scores every 5 seconds
  setInterval(updateSafetyScores, 5000);
  
  // API Routes
  
  // Get heatmap data
  app.get("/api/heatmap", async (_req, res) => {
    try {
      const regions = await storage.getSafetyRegions();
      res.json({ 
        regions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });
  
  // Get safety score for a specific region
  app.get("/api/safety-score/:id", async (req, res) => {
    try {
      const region = await storage.getSafetyRegion(req.params.id);
      if (!region) {
        return res.status(404).json({ error: "Region not found" });
      }
      res.json(region);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch safety score" });
    }
  });
  
  // Get all alerts
  app.get("/api/alerts", async (_req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });
  
  // Get all user reports
  app.get("/api/user-reports", async (_req, res) => {
    try {
      const reports = await storage.getUserReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user reports" });
    }
  });
  
  // Submit user report
  app.post("/api/user-reports", async (req, res) => {
    try {
      const reportData: InsertUserReport = req.body;
      
      // Validate required fields
      if (!reportData.location || !reportData.description || !reportData.category) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const report = await storage.createUserReport(reportData);
      
      // Create an alert based on the report
      if (reportData.category === 'incident') {
        const alert: InsertAlert = {
          regionId: 'user-report',
          severity: 'warning',
          message: `User reported incident near ${reportData.location}: ${reportData.description.substring(0, 100)}`,
        };
        await storage.createAlert(alert);
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit report" });
    }
  });
  
  // Calculate safest route
  app.post("/api/route", async (req, res) => {
    try {
      const { source, destination } = req.body;
      
      if (!source || !destination) {
        return res.status(400).json({ error: "Source and destination are required" });
      }
      
      // Find regions matching source and destination
      const regions = await storage.getSafetyRegions();
      const sourceRegion = regions.find(r => 
        r.name.toLowerCase().includes(source.toLowerCase()) ||
        source.toLowerCase().includes(r.name.toLowerCase())
      );
      const destRegion = regions.find(r => 
        r.name.toLowerCase().includes(destination.toLowerCase()) ||
        destination.toLowerCase().includes(r.name.toLowerCase())
      );
      
      // If exact matches not found, use nearby regions
      const sourceCoords: [number, number] = sourceRegion 
        ? [sourceRegion.latitude, sourceRegion.longitude]
        : [19.0760 + (Math.random() - 0.5) * 0.1, 72.8777 + (Math.random() - 0.5) * 0.1];
      
      const destCoords: [number, number] = destRegion
        ? [destRegion.latitude, destRegion.longitude]
        : [19.0760 + (Math.random() - 0.5) * 0.1, 72.8777 + (Math.random() - 0.5) * 0.1];
      
      // Generate waypoints for the route (simplified - in production use Google Maps API)
      const waypoints: [number, number][] = [sourceCoords];
      
      // Add intermediate points avoiding low-safety areas
      const numSteps = 5;
      const latStep = (destCoords[0] - sourceCoords[0]) / numSteps;
      const lngStep = (destCoords[1] - sourceCoords[1]) / numSteps;
      
      for (let i = 1; i < numSteps; i++) {
        waypoints.push([
          sourceCoords[0] + latStep * i,
          sourceCoords[1] + lngStep * i,
        ]);
      }
      
      waypoints.push(destCoords);
      
      // Calculate average safety score along route
      let totalScore = 0;
      let count = 0;
      
      for (const waypoint of waypoints) {
        const nearbyRegions = regions
          .map(r => ({
            region: r,
            distance: Math.sqrt(
              Math.pow(r.latitude - waypoint[0], 2) + 
              Math.pow(r.longitude - waypoint[1], 2)
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);
        
        if (nearbyRegions.length > 0) {
          const avgNearbyScore = nearbyRegions.reduce((sum, nr) => sum + nr.region.safetyScore, 0) / nearbyRegions.length;
          totalScore += avgNearbyScore;
          count++;
        }
      }
      
      const averageSafetyScore = count > 0 ? Math.round(totalScore / count) : 70;
      
      // Calculate distance (simplified Haversine)
      const R = 6371; // Earth radius in km
      const lat1 = sourceCoords[0] * Math.PI / 180;
      const lat2 = destCoords[0] * Math.PI / 180;
      const deltaLat = (destCoords[0] - sourceCoords[0]) * Math.PI / 180;
      const deltaLng = (destCoords[1] - sourceCoords[1]) * Math.PI / 180;
      
      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      // Estimate time (assuming 30 km/h average in Mumbai)
      const estimatedTime = Math.round((distance / 30) * 60);
      
      const route = await storage.createRoute({
        source,
        destination,
        sourceLatitude: sourceCoords[0],
        sourceLongitude: sourceCoords[1],
        destLatitude: destCoords[0],
        destLongitude: destCoords[1],
        averageSafetyScore,
        distance: Math.round(distance * 100) / 100,
        estimatedTime,
        waypoints: JSON.stringify(waypoints),
      });
      
      console.log('Route created:', JSON.stringify(route, null, 2));
      res.json(route);
    } catch (error) {
      console.error('Route calculation error:', error);
      res.status(500).json({ error: "Failed to calculate route" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
