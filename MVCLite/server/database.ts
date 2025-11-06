import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { campaigns, adGroups, ads, programs } from '@shared/schema';
import path from 'path';
import fs from 'fs';

// Create database file in data directory
const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

// Ensure data directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(path.dirname(dbPath), { recursive: true });
} catch (error) {
  // Directory might already exist
}

const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite);

// Initialize database tables
export function initializeDatabase() {
  // Create campaigns table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medio TEXT,
      programa_interes TEXT,
      tipo_campana TEXT,
      nomenclatura_programa TEXT,
      modalidad_estudio TEXT,
      linea TEXT,
      facultad TEXT,
      nomenclatura_modalidad TEXT,
      nomenclatura_linea TEXT,
      nomenclatura_tipo_campana TEXT,
      nomenclatura_modalidad3 TEXT,
      nombre_sf TEXT,
      url_programa TEXT,
      lista_pardot TEXT,
      nombre_campania TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create ad_groups table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ad_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      fsa TEXT,
      cohorte TEXT,
      tipo_publico TEXT,
      numero_grupo INTEGER,
      nomenclatura_pardot TEXT,
      nombre_grupo TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    )
  `);

  // Create ads table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad_group_id INTEGER NOT NULL,
      tipo_anuncio TEXT,
      numero_grupo INTEGER,
      nomenclatura_pardot TEXT,
      nombre_anuncio TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ad_group_id) REFERENCES ad_groups(id) ON DELETE CASCADE
    )
  `);

  // Create programs table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_programa TEXT,
      nomenclatura_programa TEXT,
      linea_negocio TEXT,
      modalidad TEXT,
      facultad TEXT,
      nomenclatura_facultad TEXT,
      codigo_banner TEXT,
      lista_pardot TEXT,
      periodo TEXT,
      codigo_carrera TEXT,
      nombre_programa2 TEXT,
      link_programa TEXT,
      pp1 TEXT,
      pp1d TEXT,
      pp2 TEXT,
      pp2d TEXT,
      pp3 TEXT,
      pp3d TEXT,
      pp4 TEXT,
      pp4d TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for better performance
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_ad_groups_campaign_id ON ad_groups(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_ad_groups_numero_grupo ON ad_groups(numero_grupo);
    CREATE INDEX IF NOT EXISTS idx_ads_ad_group_id ON ads(ad_group_id);
    CREATE INDEX IF NOT EXISTS idx_ads_numero_grupo ON ads(numero_grupo);
    CREATE INDEX IF NOT EXISTS idx_programs_nomenclatura ON programs(nomenclatura_programa);
    CREATE INDEX IF NOT EXISTS idx_programs_facultad ON programs(facultad);
  `);

  console.log('Database tables initialized successfully');
}

// Seed database with initial data if empty
export function seedDatabase() {
  const existingCampaigns = sqlite.prepare('SELECT COUNT(*) as count FROM campaigns').get() as { count: number };
  
  if (existingCampaigns.count === 0) {
    console.log('Seeding database with initial data...');

    // Insert sample campaigns
    const insertCampaign = sqlite.prepare(`
      INSERT INTO campaigns (
        medio, programa_interes, tipo_campana, nombre_campania, facultad, 
        modalidad_estudio, linea, lista_pardot, url_programa, nombre_sf
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const campaign1 = insertCampaign.run(
      'Google Ads', 'MBA Ejecutivo', 'Conversión', 'MBA Ejecutivo 2024',
      'Administración', 'Presencial', 'Postgrado', 'LST-MBA-001',
      'https://universidad.edu/mba-ejecutivo', 'MBA Ejecutivo SF'
    );

    const campaign2 = insertCampaign.run(
      'Facebook Ads', 'Ingeniería de Sistemas', 'Reconocimiento', 'Ingeniería de Sistemas Digital',
      'Ingeniería', 'Virtual', 'Pregrado', 'LST-ING-SIS-001',
      'https://universidad.edu/ingenieria-sistemas', 'Ingeniería Sistemas SF'
    );

    const campaign3 = insertCampaign.run(
      'LinkedIn Ads', 'Derecho Empresarial', 'Conversión', 'Derecho Corporativo Premium',
      'Derecho', 'Híbrida', 'Especialización', 'LST-DER-CORP-001',
      'https://universidad.edu/derecho-corporativo', 'Derecho Empresarial SF'
    );

    // Insert sample ad groups
    const insertAdGroup = sqlite.prepare(`
      INSERT INTO ad_groups (
        campaign_id, nombre_grupo, numero_grupo, fsa, cohorte, tipo_publico
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const group1 = insertAdGroup.run(campaign1.lastInsertRowid, 'Ejecutivos Senior', 1, 'FSA-EXE-001', '2024-Q1', 'Ejecutivos C-Level');
    const group2 = insertAdGroup.run(campaign1.lastInsertRowid, 'Profesionales Mid-Level', 2, 'FSA-PRO-002', '2024-Q2', 'Profesionales 5-10 años');
    const group3 = insertAdGroup.run(campaign2.lastInsertRowid, 'Estudiantes Tecnología', 1, 'FSA-TEC-003', '2024-SEM1', 'Estudiantes 17-22 años');
    const group4 = insertAdGroup.run(campaign3.lastInsertRowid, 'Abogados Corporativos', 1, 'FSA-ABG-004', '2024-CORP', 'Abogados 3+ años');

    // Insert sample ads
    const insertAd = sqlite.prepare(`
      INSERT INTO ads (
        ad_group_id, nombre_anuncio, tipo_anuncio, nomenclatura_pardot, numero_grupo
      ) VALUES (?, ?, ?, ?, ?)
    `);

    insertAd.run(group1.lastInsertRowid, 'MBA para Líderes Corporativos', 'Texto Expandido', 'AD-MBA-LDR-001', 1);
    insertAd.run(group1.lastInsertRowid, 'Acelera tu Carrera Ejecutiva', 'Display Responsivo', 'AD-MBA-CAR-002', 1);
    insertAd.run(group2.lastInsertRowid, 'MBA para Profesionales', 'Búsqueda', 'AD-MBA-PRO-004', 2);
    insertAd.run(group3.lastInsertRowid, 'Futuro en Tecnología', 'Imagen', 'AD-ING-FUT-006', 1);
    insertAd.run(group3.lastInsertRowid, 'Programación y Desarrollo', 'Carrusel', 'AD-ING-PROG-007', 1);
    insertAd.run(group4.lastInsertRowid, 'Especialización Legal Corporativa', 'Sponsored Content', 'AD-DER-ESP-008', 1);

    console.log('Database seeded with initial data');
  }
}

// Import programs from CSV
export function importProgramsFromCSV() {
  const csvPath = path.join(process.cwd(), 'programs_data.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.log('Programs CSV file not found, skipping import');
    return;
  }

  const existingPrograms = sqlite.prepare('SELECT COUNT(*) as count FROM programs').get() as { count: number };
  
  if (existingPrograms.count > 0) {
    console.log('Programs table already has data, skipping import');
    return;
  }

  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    if (lines.length <= 1) {
      console.log('CSV file is empty or has no data rows');
      return;
    }

    // Skip header row
    const dataLines = lines.slice(1);
    
    const insertProgram = sqlite.prepare(`
      INSERT INTO programs (
        nombre_programa, nomenclatura_programa, linea_negocio, modalidad, facultad,
        nomenclatura_facultad, codigo_banner, lista_pardot, periodo, codigo_carrera,
        nombre_programa2, link_programa, pp1, pp1d, pp2, pp2d, pp3, pp3d, pp4, pp4d
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let importedCount = 0;
    
    for (const line of dataLines) {
      if (!line.trim()) continue;
      
      // Split by semicolon and handle potential quoted values
      const fields = line.split(';').map(field => field.trim());
      
      if (fields.length < 20) {
        console.log(`Skipping line with insufficient fields: ${line.substring(0, 100)}...`);
        continue;
      }

      try {
        insertProgram.run(
          fields[0] || null,  // nombre_programa
          fields[1] || null,  // nomenclatura_programa
          fields[2] || null,  // linea_negocio
          fields[3] || null,  // modalidad
          fields[4] || null,  // facultad
          fields[5] || null,  // nomenclatura_facultad
          fields[6] || null,  // codigo_banner
          fields[7] || null,  // lista_pardot
          fields[8] || null,  // periodo
          fields[9] || null,  // codigo_carrera
          fields[10] || null, // nombre_programa2
          fields[11] || null, // link_programa
          fields[12] || null, // pp1
          fields[13] || null, // pp1d
          fields[14] || null, // pp2
          fields[15] || null, // pp2d
          fields[16] || null, // pp3
          fields[17] || null, // pp3d
          fields[18] || null, // pp4
          fields[19] || null  // pp4d
        );
        importedCount++;
      } catch (error) {
        console.error(`Error importing program line: ${line.substring(0, 100)}...`, error);
      }
    }

    console.log(`Successfully imported ${importedCount} programs from CSV`);
  } catch (error) {
    console.error('Error reading CSV file:', error);
  }
}