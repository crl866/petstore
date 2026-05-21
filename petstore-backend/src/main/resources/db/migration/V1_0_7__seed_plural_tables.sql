-- V1_0_7__seed_plural_tables.sql
-- Idempotent seed: insert demo categories, pets, photos, and health statuses

-- Insert categories (plural table) - uses existing unique constraint on name
INSERT INTO categories (name, species_type, created_at)
VALUES
  ('Dogs', 'Dog', NOW()),
  ('Cats', 'Cat', NOW()),
  ('Birds', 'Bird', NOW()),
  ('Rabbits', 'Rabbit', NOW()),
  ('Hamsters', 'Hamster', NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert pets if they do not already exist (use names as identifier)
INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Max', 'Dog', 'Golden Retriever', 1, 'A friendly golden retriever who loves to play fetch', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Dogs'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Max');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Bella', 'Dog', 'German Shepherd', 3, 'A gentle German Shepherd with a protective nature', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Dogs'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Bella');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Charlie', 'Dog', 'Border Collie', 2, 'An energetic border collie who loves herding', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Dogs'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Charlie');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Whiskers', 'Cat', 'Persian', 4, 'A fluffy Persian cat with a calm demeanor', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Cats'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Whiskers');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Luna', 'Cat', 'Siamese', 1, 'A sleek Siamese cat who loves attention', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Cats'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Luna');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Shadow', 'Cat', NULL, 3, 'A mysterious black cat who enjoys quiet time', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Cats'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Shadow');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Tweety', 'Bird', 'Macaw', 2, 'A colorful macaw who can mimic sounds', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Birds'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Tweety');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Polly', 'Bird', 'Parakeet', 1, 'A blue parakeet with a melodious chirp', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Birds'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Polly');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Hopper', 'Rabbit', NULL, 2, 'A fluffy white rabbit with long ears', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Rabbits'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Hopper');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Flopsy', 'Rabbit', NULL, 1, 'A brown rabbit who loves to hop around', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Rabbits'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Flopsy');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Squeak', 'Hamster', NULL, 1, 'A golden hamster with an active personality', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Hamsters'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Squeak');

INSERT INTO pets (name, species, breed, age, bio, category_id, created_at, updated_at)
SELECT 'Nibbles', 'Hamster', 'Dwarf', 1, 'A cute dwarf hamster who loves sunflower seeds', c.id, NOW(), NOW()
FROM categories c WHERE c.name = 'Hamsters'
AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.name = 'Nibbles');

-- Insert pet photos (only if not already present for that pet and URL)
INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400', 0
FROM pets p WHERE p.name = 'Max'
AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id = p.id AND pp.photo_url = 'https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400');

INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1612536315918-b36e1d6c9e7a?w=400', 1
FROM pets p WHERE p.name = 'Max'
AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id = p.id AND pp.photo_url = 'https://images.unsplash.com/photo-1612536315918-b36e1d6c9e7a?w=400');

INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', 0
FROM pets p WHERE p.name = 'Bella'
AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id = p.id AND pp.photo_url = 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400');

INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400', 0
FROM pets p WHERE p.name = 'Charlie'
AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id = p.id AND pp.photo_url = 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400');

INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1514888286974-6c03bf1a4f8c?w=400', 0
FROM pets p WHERE p.name = 'Whiskers'
AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id = p.id AND pp.photo_url = 'https://images.unsplash.com/photo-1514888286974-6c03bf1a4f8c?w=400');

INSERT INTO pet_photos (pet_id, photo_url, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400', 1
FROM pets p WHERE p.name = 'Whiskers'
AND NOT EXISTS (SELECT 1 FROM pet_photos pp WHERE pp.pet_id = p.id AND pp.photo_url = 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400');

-- Insert health statuses if missing
INSERT INTO health_statuses (pet_id, status, notes, updated_at)
SELECT p.id, 'HEALTHY', NULL, NOW() FROM pets p WHERE p.name = 'Max'
AND NOT EXISTS (SELECT 1 FROM health_statuses hs WHERE hs.pet_id = p.id);

INSERT INTO health_statuses (pet_id, status, notes, updated_at)
SELECT p.id, 'VACCINATED', NULL, NOW() FROM pets p WHERE p.name = 'Bella'
AND NOT EXISTS (SELECT 1 FROM health_statuses hs WHERE hs.pet_id = p.id);

INSERT INTO health_statuses (pet_id, status, notes, updated_at)
SELECT p.id, 'HEALTHY', NULL, NOW() FROM pets p WHERE p.name = 'Charlie'
AND NOT EXISTS (SELECT 1 FROM health_statuses hs WHERE hs.pet_id = p.id);

INSERT INTO health_statuses (pet_id, status, notes, updated_at)
SELECT p.id, 'HEALTHY', NULL, NOW() FROM pets p WHERE p.name = 'Whiskers'
AND NOT EXISTS (SELECT 1 FROM health_statuses hs WHERE hs.pet_id = p.id);

INSERT INTO health_statuses (pet_id, status, notes, updated_at)
SELECT p.id, 'VACCINATED', NULL, NOW() FROM pets p WHERE p.name = 'Luna'
AND NOT EXISTS (SELECT 1 FROM health_statuses hs WHERE hs.pet_id = p.id);
