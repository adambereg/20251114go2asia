/**
 * Seed script for importing data from CSV files
 * 
 * Usage:
 *   DATABASE_URL=postgresql://... pnpm tsx src/db/seed-import.ts
 */

import { createDb } from './index';
import { countries, cities, places, events, articles } from './schema';
import { sql, eq } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load .env from project root
const possiblePaths = [
  resolve(__dirname, '../../../.env'),
  resolve(process.cwd(), '.env'),
];

for (const envPath of possiblePaths) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    break;
  }
}

interface CsvRow {
  [key: string]: string;
}

// Helper function to parse CSV
function parseCsv(filePath: string): CsvRow[] {
  const content = readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  }) as CsvRow[];
}

// Helper function to parse JSONB coordinates
function parseCoordinates(coordsStr: string | null | undefined): { lat: string; lng: string } | null {
  const normalized = normalizeValue(coordsStr);
  if (!normalized) return null;
  try {
    const parsed = JSON.parse(normalized);
    const lat = parsed.lat || parsed.latitude;
    const lng = parsed.lng || parsed.longitude;
    if (!lat || !lng) return null;
    return {
      lat: String(lat),
      lng: String(lng),
    };
  } catch {
    return null;
  }
}

// Helper function to normalize empty values
function normalizeValue(value: string | null | undefined): string | null {
  if (!value || value === 'NULL' || value === '' || value.trim() === '') return null;
  return value;
}

// Helper function to parse JSON array
function parseJsonArray(jsonStr: string | null | undefined): string[] {
  const normalized = normalizeValue(jsonStr);
  if (!normalized || normalized === '[]') return [];
  try {
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

// Helper function to parse JSON object
function parseJsonObject(jsonStr: string | null | undefined): any {
  const normalized = normalizeValue(jsonStr);
  if (!normalized) return null;
  try {
    return JSON.parse(normalized);
  } catch {
    return null;
  }
}

// Helper function to map media files
function mapMediaFiles(
  mediaFiles: CsvRow[],
  entityType: string,
  entityId: string
): string[] {
  return mediaFiles
    .filter((mf) => mf.entity_type === entityType && mf.entity_id === entityId)
    .sort((a, b) => {
      const orderA = parseInt(a.order_index || '0', 10);
      const orderB = parseInt(b.order_index || '0', 10);
      return orderA - orderB;
    })
    .map((mf) => mf.url)
    .filter((url) => url && url !== 'NULL' && url !== '');
}

async function seedCountries(db: ReturnType<typeof createDb>, csvData: CsvRow[]) {
  console.log('Importing countries...');
  
  for (const row of csvData) {
    try {
      await db.insert(countries).values({
        id: row.id,
        name: row.name,
        code: row.code,
        flag: normalizeValue(row.flag),
        description: normalizeValue(row.description),
        capital: normalizeValue(row.capital),
        population: normalizeValue(row.population),
        currency: normalizeValue(row.currency),
        language: normalizeValue(row.language),
        area: normalizeValue(row.area),
        timezone: normalizeValue(row.timezone),
        nameEn: normalizeValue(row.nameEn),
        heroImage: normalizeValue(row.heroImage),
        gallery: parseJsonArray(row.gallery),
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      }).onConflictDoUpdate({
        target: countries.id,
        set: {
          name: sql`excluded.name`,
          code: sql`excluded.code`,
          updatedAt: sql`now()`,
        },
      });
    } catch (error) {
      console.error(`Error importing country ${row.id}:`, error);
    }
  }
  
  console.log(`✓ Imported ${csvData.length} countries`);
}

async function seedCities(
  db: ReturnType<typeof createDb>,
  csvData: CsvRow[],
  mediaFiles: CsvRow[]
) {
  console.log('Importing cities...');
  
  for (const row of csvData) {
    try {
      const coords = parseCoordinates(row.coordinates);
      const images = mapMediaFiles(mediaFiles, 'city', row.id);
      
      await db.insert(cities).values({
        id: row.id,
        name: row.name,
        countryId: row.country_id,
        description: normalizeValue(row.description),
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        image: images[0] || normalizeValue(row.image) || null,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      }).onConflictDoUpdate({
        target: cities.id,
        set: {
          name: sql`excluded.name`,
          updatedAt: sql`now()`,
        },
      });
    } catch (error) {
      console.error(`Error importing city ${row.id}:`, error);
    }
  }
  
  console.log(`✓ Imported ${csvData.length} cities`);
}

async function seedPlaces(
  db: ReturnType<typeof createDb>,
  csvData: CsvRow[],
  mediaFiles: CsvRow[]
) {
  console.log('Importing places...');
  
  let skipped = 0;
  for (const row of csvData) {
    try {
      const coords = parseCoordinates(row.coordinates);
      if (!coords) {
        console.warn(`Skipping place ${row.id}: no coordinates`);
        skipped++;
        continue;
      }
      
      if (!row.city_id || row.city_id === 'NULL' || row.city_id === '') {
        console.warn(`Skipping place ${row.id}: no city_id`);
        skipped++;
        continue;
      }
      
      const images = mapMediaFiles(mediaFiles, 'place', row.id);
      const photos = images.length > 0 ? images : parseJsonArray(row.images);
      
      await db.insert(places).values({
        id: row.id,
        name: row.name,
        cityId: row.city_id,
        description: normalizeValue(row.description),
        latitude: coords.lat,
        longitude: coords.lng,
        type: normalizeValue(row.category),
        categories: parseJsonArray(row.tags),
        photos: photos,
        address: normalizeValue(row.address),
        rating: row.rating && row.rating !== 'NULL' ? parseInt(row.rating, 10) : null,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      }).onConflictDoUpdate({
        target: places.id,
        set: {
          name: sql`excluded.name`,
          updatedAt: sql`now()`,
        },
      });
    } catch (error) {
      console.error(`Error importing place ${row.id}:`, error);
    }
  }
  
  console.log(`✓ Imported ${csvData.length - skipped} places (skipped ${skipped})`);
}

async function seedEvents(
  db: ReturnType<typeof createDb>,
  csvData: CsvRow[],
  citiesData: CsvRow[]
) {
  console.log('Importing events...');
  
  // Helper to find city_id by address or coordinates
  async function findCityId(address: string | null, coords: { lat: string; lng: string } | null): Promise<string | null> {
    if (!address && !coords) return null;
    
    // Try to match by city name in address
    if (address) {
      const addressLower = address.toLowerCase();
      for (const city of citiesData) {
        const cityNameLower = city.name.toLowerCase();
        if (addressLower.includes(cityNameLower)) {
          return city.id;
        }
      }
    }
    
    // Try to match by coordinates (simple distance check)
    if (coords) {
      let closestCity: { id: string; distance: number } | null = null;
      const threshold = 0.5; // ~50km
      
      for (const city of citiesData) {
        const cityCoords = parseCoordinates(city.coordinates);
        if (cityCoords) {
          const latDiff = Math.abs(parseFloat(coords.lat) - parseFloat(cityCoords.lat));
          const lngDiff = Math.abs(parseFloat(coords.lng) - parseFloat(cityCoords.lng));
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
          
          if (distance < threshold && (!closestCity || distance < closestCity.distance)) {
            closestCity = { id: city.id, distance };
          }
        }
      }
      
      if (closestCity) {
        return closestCity.id;
      }
    }
    
    return null;
  }
  
  let skipped = 0;
  for (const row of csvData) {
    try {
      const coords = parseCoordinates(row.coordinates);
      const cityId = await findCityId(row.address || null, coords);
      
      if (!cityId) {
        console.warn(`Skipping event ${row.id}: could not determine city_id`);
        skipped++;
        continue;
      }
      
      await db.insert(events).values({
        id: row.id,
        title: row.title,
        description: normalizeValue(row.description),
        startTime: row.start_date ? new Date(row.start_date) : new Date(),
        endTime: row.end_date ? new Date(row.end_date) : null,
        cityId: cityId,
        placeId: null,
        type: normalizeValue(row.type),
        category: null,
        organizerId: normalizeValue(row.organizer),
        address: normalizeValue(row.address),
        contact: parseJsonObject(row.contact),
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      }).onConflictDoUpdate({
        target: events.id,
        set: {
          title: sql`excluded.title`,
          updatedAt: sql`now()`,
        },
      });
    } catch (error) {
      console.error(`Error importing event ${row.id}:`, error);
    }
  }
  
  console.log(`✓ Imported ${csvData.length - skipped} events (skipped ${skipped})`);
}

async function seedArticles(
  db: ReturnType<typeof createDb>,
  csvData: CsvRow[],
  mediaFiles: CsvRow[]
) {
  console.log('Importing articles...');
  
  for (const row of csvData) {
    try {
      const images = mapMediaFiles(mediaFiles, 'article', row.id);
      const articleImages = images.length > 0 ? images : parseJsonArray(row.images);
      const coverImage = articleImages[0] || null;
      
      await db.insert(articles).values({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: normalizeValue(row.excerpt),
        content: row.content,
        authorId: normalizeValue(row.author_id) || 'system',
        category: normalizeValue(row.category),
        tags: parseJsonArray(row.tags),
        coverImage: coverImage,
        publishedAt: row.published_at ? new Date(row.published_at) : null,
        featured: row.featured === 'true' || row.featured === '1',
        views: row.views && row.views !== 'NULL' ? parseInt(row.views, 10) : 0,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      }).onConflictDoUpdate({
        target: articles.slug,
        set: {
          title: sql`excluded.title`,
          updatedAt: sql`now()`,
        },
      });
    } catch (error) {
      console.error(`Error importing article ${row.id}:`, error);
    }
  }
  
  console.log(`✓ Imported ${csvData.length} articles`);
}

async function main() {
  const db = createDb({ DATABASE_URL: process.env.DATABASE_URL });
  
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }
  
  const importDir = join(__dirname, '../../data/import');
  
  console.log('Starting data import from CSV files...\n');
  
  try {
    // Parse CSV files
    const countriesData = parseCsv(join(importDir, 'countries.csv'));
    const citiesData = parseCsv(join(importDir, 'cities.csv'));
    const placesData = parseCsv(join(importDir, 'places.csv'));
    const eventsData = parseCsv(join(importDir, 'events.csv'));
    const articlesData = parseCsv(join(importDir, 'articles.csv'));
    const mediaFilesData = parseCsv(join(importDir, 'media_files.csv'));
    
    // Import in order (respecting foreign keys)
    await seedCountries(db, countriesData);
    await seedCities(db, citiesData, mediaFilesData);
    await seedPlaces(db, placesData, mediaFilesData);
    await seedEvents(db, eventsData, citiesData);
    await seedArticles(db, articlesData, mediaFilesData);
    
    console.log('\n✅ Data import completed successfully!');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

