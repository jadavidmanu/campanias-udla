import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medio: text("medio"),
  programa_interes: text("programa_interes"),
  tipo_campana: text("tipo_campana"),
  nomenclatura_programa: text("nomenclatura_programa"),
  modalidad_estudio: text("modalidad_estudio"),
  linea: text("linea"),
  facultad: text("facultad"),
  nomenclatura_modalidad: text("nomenclatura_modalidad"),
  nomenclatura_linea: text("nomenclatura_linea"),
  nomenclatura_tipo_campana: text("nomenclatura_tipo_campana"),
  nomenclatura_modalidad3: text("nomenclatura_modalidad3"),
  nombre_sf: text("nombre_sf"),
  url_programa: text("url_programa"),
  lista_pardot: text("lista_pardot"),
  nombre_campania: text("nombre_campania"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const adGroups = sqliteTable("ad_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaign_id: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  fsa: text("fsa"),
  cohorte: text("cohorte"),
  tipo_publico: text("tipo_publico"),
  numero_grupo: integer("numero_grupo"),
  nomenclatura_pardot: text("nomenclatura_pardot"),
  nombre_grupo: text("nombre_grupo"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ads = sqliteTable("ads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ad_group_id: integer("ad_group_id").notNull().references(() => adGroups.id, { onDelete: "cascade" }),
  tipo_anuncio: text("tipo_anuncio"),
  numero_grupo: integer("numero_grupo"),
  nomenclatura_pardot: text("nomenclatura_pardot"),
  nombre_anuncio: text("nombre_anuncio"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const programs = sqliteTable("programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre_programa: text("nombre_programa"),
  nomenclatura_programa: text("nomenclatura_programa"),
  linea_negocio: text("linea_negocio"),
  modalidad: text("modalidad"),
  facultad: text("facultad"),
  nomenclatura_facultad: text("nomenclatura_facultad"),
  codigo_banner: text("codigo_banner"),
  lista_pardot: text("lista_pardot"),
  periodo: text("periodo"),
  codigo_carrera: text("codigo_carrera"),
  nombre_programa2: text("nombre_programa2"),
  link_programa: text("link_programa"),
  pp1: text("pp1"),
  pp1d: text("pp1d"),
  pp2: text("pp2"),
  pp2d: text("pp2d"),
  pp3: text("pp3"),
  pp3d: text("pp3d"),
  pp4: text("pp4"),
  pp4d: text("pp4d"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  medio: z.string().min(1, "Medio es requerido"),
  programa_interes: z.string().min(1, "Programa de interés es requerido"),
  tipo_campana: z.string().min(1, "Tipo de campaña es requerido"),
  nombre_campania: z.string().min(1, "Nombre de campaña es requerido"),
});

export const insertAdGroupSchema = createInsertSchema(adGroups).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  nombre_programa: z.string().min(1, "Nombre del programa es requerido"),
});

// Types
export type Campaign = typeof campaigns.$inferSelect;
export type AdGroup = typeof adGroups.$inferSelect;
export type Ad = typeof ads.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertAdGroup = z.infer<typeof insertAdGroupSchema>;
export type InsertAd = z.infer<typeof insertAdSchema>;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
