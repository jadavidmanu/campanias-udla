import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertAdGroupSchema, insertAdSchema, insertProgramSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }
      
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const validatedData = insertCampaignSchema.partial().parse(req.body);
      const campaign = await storage.updateCampaign(id, validatedData);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const deleted = await storage.deleteCampaign(id);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const filters = {
        nombre_campania: req.query.nombre_campania as string,
        medio: req.query.medio as string,
        programa_interes: req.query.programa_interes as string,
        facultad: req.query.facultad as string,
        tipo_campana: req.query.tipo_campana as string,
      };

      // Remove empty values
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof typeof filters]) {
          delete filters[key as keyof typeof filters];
        }
      });

      const results = await storage.searchCampaigns(filters);
      res.json(results);
    } catch (error) {
      console.error("Error searching campaigns:", error);
      res.status(500).json({ message: "Failed to search campaigns" });
    }
  });

  // Complete hierarchy endpoint
  app.get("/api/complete", async (req, res) => {
    try {
      const hierarchy = await storage.getCompleteHierarchy();
      res.json({ campaigns: hierarchy });
    } catch (error) {
      console.error("Error fetching complete hierarchy:", error);
      res.status(500).json({ message: "Failed to fetch complete hierarchy" });
    }
  });

  // Ad Group routes
  app.get("/api/ad-groups", async (req, res) => {
    try {
      const adGroups = await storage.getAdGroups();
      res.json(adGroups);
    } catch (error) {
      console.error("Error fetching ad groups:", error);
      res.status(500).json({ message: "Failed to fetch ad groups" });
    }
  });

  app.get("/api/campaigns/:campaignId/ad-groups", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      if (isNaN(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }
      
      const adGroups = await storage.getAdGroupsByCampaign(campaignId);
      res.json(adGroups);
    } catch (error) {
      console.error("Error fetching ad groups by campaign:", error);
      res.status(500).json({ message: "Failed to fetch ad groups for campaign" });
    }
  });

  app.get("/api/ad-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ad group ID" });
      }
      
      const adGroup = await storage.getAdGroup(id);
      if (!adGroup) {
        return res.status(404).json({ message: "Ad group not found" });
      }
      
      res.json(adGroup);
    } catch (error) {
      console.error("Error fetching ad group:", error);
      res.status(500).json({ message: "Failed to fetch ad group" });
    }
  });

  app.post("/api/ad-groups", async (req, res) => {
    try {
      const validatedData = insertAdGroupSchema.parse(req.body);
      const adGroup = await storage.createAdGroup(validatedData);
      res.status(201).json(adGroup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error creating ad group:", error);
      res.status(500).json({ message: "Failed to create ad group" });
    }
  });

  app.put("/api/ad-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ad group ID" });
      }

      const validatedData = insertAdGroupSchema.partial().parse(req.body);
      const adGroup = await storage.updateAdGroup(id, validatedData);
      
      if (!adGroup) {
        return res.status(404).json({ message: "Ad group not found" });
      }
      
      res.json(adGroup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error updating ad group:", error);
      res.status(500).json({ message: "Failed to update ad group" });
    }
  });

  app.delete("/api/ad-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ad group ID" });
      }

      const deleted = await storage.deleteAdGroup(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ad group not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ad group:", error);
      res.status(500).json({ message: "Failed to delete ad group" });
    }
  });

  // Ad routes
  app.get("/api/ads", async (req, res) => {
    try {
      const ads = await storage.getAds();
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  app.get("/api/ad-groups/:adGroupId/ads", async (req, res) => {
    try {
      const adGroupId = parseInt(req.params.adGroupId);
      if (isNaN(adGroupId)) {
        return res.status(400).json({ message: "Invalid ad group ID" });
      }
      
      const ads = await storage.getAdsByAdGroup(adGroupId);
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads by ad group:", error);
      res.status(500).json({ message: "Failed to fetch ads for ad group" });
    }
  });

  app.get("/api/ads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ad ID" });
      }
      
      const ad = await storage.getAd(id);
      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }
      
      res.json(ad);
    } catch (error) {
      console.error("Error fetching ad:", error);
      res.status(500).json({ message: "Failed to fetch ad" });
    }
  });

  app.post("/api/ads", async (req, res) => {
    try {
      const validatedData = insertAdSchema.parse(req.body);
      const ad = await storage.createAd(validatedData);
      res.status(201).json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error creating ad:", error);
      res.status(500).json({ message: "Failed to create ad" });
    }
  });

  app.put("/api/ads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ad ID" });
      }

      const validatedData = insertAdSchema.partial().parse(req.body);
      const ad = await storage.updateAd(id, validatedData);
      
      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }
      
      res.json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error updating ad:", error);
      res.status(500).json({ message: "Failed to update ad" });
    }
  });

  app.delete("/api/ads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ad ID" });
      }

      const deleted = await storage.deleteAd(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ad not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ad:", error);
      res.status(500).json({ message: "Failed to delete ad" });
    }
  });

  // Programs routes
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }
      
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error creating program:", error);
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.put("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }

      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, validatedData);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error updating program:", error);
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  app.delete("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }

      const deleted = await storage.deleteProgram(id);
      if (!deleted) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
