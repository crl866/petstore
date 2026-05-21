-- V1_0_8__seed_both_table_variants.sql
-- Ensure seed rows exist in both singular and plural table name variants.

-- Categories (both names)
INSERT INTO categories (name, species_type, created_at)
VALUES ('Dogs','Dog',NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO category (name, description, created_at)
SELECT name, species_type, NOW() FROM categories c WHERE c.name = 'Dogs' AND NOT EXISTS (SELECT 1 FROM category cat WHERE cat.name = c.name);

INSERT INTO categories (name, species_type, created_at)
VALUES ('Cats','Cat',NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO category (name, description, created_at)
SELECT name, species_type, NOW() FROM categories c WHERE c.name = 'Cats' AND NOT EXISTS (SELECT 1 FROM category cat WHERE cat.name = c.name);

INSERT INTO categories (name, species_type, created_at)
VALUES ('Birds','Bird',NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO category (name, description, created_at)
SELECT name, species_type, NOW() FROM categories c WHERE c.name = 'Birds' AND NOT EXISTS (SELECT 1 FROM category cat WHERE cat.name = c.name);

INSERT INTO categories (name, species_type, created_at)
VALUES ('Rabbits','Rabbit',NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO category (name, description, created_at)
SELECT name, species_type, NOW() FROM categories c WHERE c.name = 'Rabbits' AND NOT EXISTS (SELECT 1 FROM category cat WHERE cat.name = c.name);

INSERT INTO categories (name, species_type, created_at)
VALUES ('Hamsters','Hamster',NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO category (name, description, created_at)
SELECT name, species_type, NOW() FROM categories c WHERE c.name = 'Hamsters' AND NOT EXISTS (SELECT 1 FROM category cat WHERE cat.name = c.name);

-- Pets into plural table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pets WHERE name = 'Max') THEN
    INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
    SELECT 'Max','Dog','Golden Retriever',1,'A friendly golden retriever who loves to play fetch',c.id,NOW(),NOW() FROM categories c WHERE c.name='Dogs' LIMIT 1;
  END IF;
END$$;

-- Also insert into singular `pet` if it exists and not already present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='pet') THEN
    IF NOT EXISTS (SELECT 1 FROM pet WHERE name='Max') THEN
      INSERT INTO pet (name, description, category_id, created_at, updated_at)
      SELECT 'Max','A friendly golden retriever who loves to play fetch', (SELECT id FROM category WHERE name='Dogs' LIMIT 1), NOW(), NOW();
    END IF;
  END IF;
END$$;

-- Repeat for a subset of pets to ensure UI shows examples (Max, Whiskers, Goldie)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pets WHERE name = 'Whiskers') THEN
    INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
    SELECT 'Whiskers','Cat','Persian',4,'A fluffy Persian cat with a calm demeanor',c.id,NOW(),NOW() FROM categories c WHERE c.name='Cats' LIMIT 1;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='pet') THEN
    IF NOT EXISTS (SELECT 1 FROM pet WHERE name='Whiskers') THEN
      INSERT INTO pet (name, description, category_id, created_at, updated_at)
      SELECT 'Whiskers','A fluffy Persian cat with a calm demeanor', (SELECT id FROM category WHERE name='Cats' LIMIT 1), NOW(), NOW();
    END IF;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pets WHERE name = 'Goldie') THEN
    INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
    SELECT 'Goldie','Fish',NULL,1,'Goldfish, 3 inches',c.id,NOW(),NOW() FROM categories c WHERE c.name='Fish' LIMIT 1;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='pet') THEN
    IF NOT EXISTS (SELECT 1 FROM pet WHERE name='Goldie') THEN
      INSERT INTO pet (name, description, category_id, created_at, updated_at)
      SELECT 'Goldie','Goldfish, 3 inches', (SELECT id FROM category WHERE name='Fish' LIMIT 1), NOW(), NOW();
    END IF;
  END IF;
END$$;

-- Pet photos and health statuses: try inserting into plural tables where available
INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id,'https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400',0 FROM pets p WHERE p.name='Max' AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id=p.id AND pp.photo_url LIKE '%1633722715463%');

INSERT INTO health_statuses (pet_id, status, notes, updated_at)
SELECT p.id,'HEALTHY',NULL,NOW() FROM pets p WHERE p.name='Max' AND NOT EXISTS (SELECT 1 FROM health_statuses hs WHERE hs.pet_id=p.id);
