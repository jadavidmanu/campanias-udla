import { 
  type Campaign, 
  type AdGroup, 
  type Ad,
  type Program,
  type InsertCampaign, 
  type InsertAdGroup, 
  type InsertAd,
  type InsertProgram
} from "@shared/schema";
import { db, initializeDatabase, seedDatabase, importProgramsFromCSV } from "./database";
import { campaigns, adGroups, ads, programs } from "@shared/schema";
import { eq, like, and, desc } from "drizzle-orm";

// Initialize database when storage is imported
initializeDatabase();
seedDatabase();
importProgramsFromCSV();

export interface IStorage {
  // Campaign methods
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Ad Group methods
  getAdGroups(): Promise<AdGroup[]>;
  getAdGroupsByCampaign(campaignId: number): Promise<AdGroup[]>;
  getAdGroup(id: number): Promise<AdGroup | undefined>;
  createAdGroup(adGroup: InsertAdGroup): Promise<AdGroup>;
  updateAdGroup(id: number, adGroup: Partial<InsertAdGroup>): Promise<AdGroup | undefined>;
  deleteAdGroup(id: number): Promise<boolean>;
  
  // Ad methods
  getAds(): Promise<Ad[]>;
  getAdsByAdGroup(adGroupId: number): Promise<Ad[]>;
  getAd(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, ad: Partial<InsertAd>): Promise<Ad | undefined>;
  deleteAd(id: number): Promise<boolean>;
  
  // Search methods
  searchCampaigns(filters: {
    nombre_campania?: string;
    medio?: string;
    programa_interes?: string;
    facultad?: string;
    tipo_campana?: string;
  }): Promise<Array<Campaign & { grupo_count: number; anuncio_count: number }>>;
  
  // Complete view methods
  getCompleteHierarchy(): Promise<Array<Campaign & {
    adGroups: Array<AdGroup & {
      ads: Ad[];
    }>;
  }>>;
  
  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.created_at));
  }
  
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0];
  }
  
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values({
      ...campaign,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    return result[0];
  }
  
  async updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const result = await db.update(campaigns)
      .set({ ...campaign, updated_at: new Date().toISOString() })
      .where(eq(campaigns.id, id))
      .returning();
    return result[0];
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    const result = await db.delete(campaigns).where(eq(campaigns.id, id));
    return result.changes > 0;
  }
  
  // Ad Group methods
  async getAdGroups(): Promise<AdGroup[]> {
    return await db.select().from(adGroups).orderBy(desc(adGroups.created_at));
  }
  
  async getAdGroupsByCampaign(campaignId: number): Promise<AdGroup[]> {
    return await db.select().from(adGroups)
      .where(eq(adGroups.campaign_id, campaignId))
      .orderBy(adGroups.numero_grupo);
  }
  
  async getAdGroup(id: number): Promise<AdGroup | undefined> {
    const result = await db.select().from(adGroups).where(eq(adGroups.id, id)).limit(1);
    return result[0];
  }
  
  async createAdGroup(adGroup: InsertAdGroup): Promise<AdGroup> {
    const result = await db.insert(adGroups).values({
      ...adGroup,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    return result[0];
  }
  
  async updateAdGroup(id: number, adGroup: Partial<InsertAdGroup>): Promise<AdGroup | undefined> {
    const result = await db.update(adGroups)
      .set({ ...adGroup, updated_at: new Date().toISOString() })
      .where(eq(adGroups.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAdGroup(id: number): Promise<boolean> {
    const result = await db.delete(adGroups).where(eq(adGroups.id, id));
    return result.changes > 0;
  }
  
  // Ad methods
  async getAds(): Promise<Ad[]> {
    return await db.select().from(ads).orderBy(desc(ads.created_at));
  }
  
  async getAdsByAdGroup(adGroupId: number): Promise<Ad[]> {
    return await db.select().from(ads)
      .where(eq(ads.ad_group_id, adGroupId))
      .orderBy(ads.numero_grupo);
  }
  
  async getAd(id: number): Promise<Ad | undefined> {
    const result = await db.select().from(ads).where(eq(ads.id, id)).limit(1);
    return result[0];
  }
  
  async createAd(ad: InsertAd): Promise<Ad> {
    const result = await db.insert(ads).values({
      ...ad,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    return result[0];
  }
  
  async updateAd(id: number, ad: Partial<InsertAd>): Promise<Ad | undefined> {
    const result = await db.update(ads)
      .set({ ...ad, updated_at: new Date().toISOString() })
      .where(eq(ads.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAd(id: number): Promise<boolean> {
    const result = await db.delete(ads).where(eq(ads.id, id));
    return result.changes > 0;
  }
  
  // Search methods
  async searchCampaigns(filters: {
    nombre_campania?: string;
    medio?: string;
    programa_interes?: string;
    facultad?: string;
    tipo_campana?: string;
  }): Promise<Array<Campaign & { grupo_count: number; anuncio_count: number }>> {
    // For now, we'll do a simple implementation and enhance with proper JOIN later
    const allCampaigns = await this.getCampaigns();
    
    let filtered = allCampaigns;
    
    if (filters.nombre_campania) {
      filtered = filtered.filter(c => 
        c.nombre_campania?.toLowerCase().includes(filters.nombre_campania!.toLowerCase())
      );
    }
    if (filters.medio) {
      filtered = filtered.filter(c => c.medio === filters.medio);
    }
    if (filters.programa_interes) {
      filtered = filtered.filter(c => 
        c.programa_interes?.toLowerCase().includes(filters.programa_interes!.toLowerCase())
      );
    }
    if (filters.facultad) {
      filtered = filtered.filter(c => c.facultad === filters.facultad);
    }
    if (filters.tipo_campana) {
      filtered = filtered.filter(c => c.tipo_campana === filters.tipo_campana);
    }
    
    // Add counts
    const result = [];
    for (const campaign of filtered) {
      const groups = await this.getAdGroupsByCampaign(campaign.id);
      let adCount = 0;
      for (const group of groups) {
        const groupAds = await this.getAdsByAdGroup(group.id);
        adCount += groupAds.length;
      }
      
      result.push({
        ...campaign,
        grupo_count: groups.length,
        anuncio_count: adCount
      });
    }
    
    return result;
  }
  
  // Complete view methods
  async getCompleteHierarchy(): Promise<Array<Campaign & {
    adGroups: Array<AdGroup & {
      ads: Ad[];
    }>;
  }>> {
    const allCampaigns = await this.getCampaigns();
    
    const result = [];
    for (const campaign of allCampaigns) {
      const campaignAdGroups = await this.getAdGroupsByCampaign(campaign.id);
      
      const adGroupsWithAds = [];
      for (const adGroup of campaignAdGroups) {
        const groupAds = await this.getAdsByAdGroup(adGroup.id);
        adGroupsWithAds.push({
          ...adGroup,
          ads: groupAds
        });
      }
      
      result.push({
        ...campaign,
        adGroups: adGroupsWithAds
      });
    }
    
    return result;
  }
  
  // Program methods
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs).orderBy(desc(programs.created_at));
  }
  
  async getProgram(id: number): Promise<Program | undefined> {
    const result = await db.select().from(programs).where(eq(programs.id, id)).limit(1);
    return result[0];
  }
  
  async createProgram(program: InsertProgram): Promise<Program> {
    const result = await db.insert(programs).values({
      ...program,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning();
    return result[0];
  }
  
  async updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined> {
    const result = await db.update(programs)
      .set({ ...program, updated_at: new Date().toISOString() })
      .where(eq(programs.id, id))
      .returning();
    return result[0];
  }
  
  async deleteProgram(id: number): Promise<boolean> {
    const result = await db.delete(programs).where(eq(programs.id, id));
    return result.changes > 0;
  }
}

export const storage = new DatabaseStorage();