-- Seed data for the live com.david.petstore schema (singular tables)

INSERT INTO category (name, description) VALUES
('Dogs', 'Loyal and friendly canine companions'),
('Cats', 'Independent and affectionate feline friends'),
('Birds', 'Colorful and vocal feathered pets'),
('Rabbits', 'Cute and gentle small animals'),
('Hamsters', 'Tiny and adorable rodents')
ON CONFLICT (name) DO NOTHING;

INSERT INTO pet (name, description, category_id) VALUES
('Max', 'A friendly golden retriever who loves to play fetch', (SELECT id FROM category WHERE name = 'Dogs')),
('Bella', 'A gentle German Shepherd with a protective nature', (SELECT id FROM category WHERE name = 'Dogs')),
('Charlie', 'An energetic border collie who loves herding', (SELECT id FROM category WHERE name = 'Dogs')),
('Whiskers', 'A fluffy Persian cat with a calm demeanor', (SELECT id FROM category WHERE name = 'Cats')),
('Luna', 'A sleek Siamese cat who loves attention', (SELECT id FROM category WHERE name = 'Cats')),
('Shadow', 'A mysterious black cat who enjoys quiet time', (SELECT id FROM category WHERE name = 'Cats')),
('Tweety', 'A colorful macaw who can mimic sounds', (SELECT id FROM category WHERE name = 'Birds')),
('Polly', 'A blue parakeet with a melodious chirp', (SELECT id FROM category WHERE name = 'Birds')),
('Hopper', 'A fluffy white rabbit with long ears', (SELECT id FROM category WHERE name = 'Rabbits')),
('Flopsy', 'A brown rabbit who loves to hop around', (SELECT id FROM category WHERE name = 'Rabbits')),
('Squeak', 'A golden hamster with an active personality', (SELECT id FROM category WHERE name = 'Hamsters')),
('Nibbles', 'A cute dwarf hamster who loves sunflower seeds', (SELECT id FROM category WHERE name = 'Hamsters'));

INSERT INTO pet_photo (pet_id, photo_url, display_order) VALUES
((SELECT id FROM pet WHERE name = 'Max'), 'https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400', 0),
((SELECT id FROM pet WHERE name = 'Max'), 'https://images.unsplash.com/photo-1612536315918-b36e1d6c9e7a?w=400', 1),
((SELECT id FROM pet WHERE name = 'Bella'), 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', 0),
((SELECT id FROM pet WHERE name = 'Charlie'), 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400', 0),
((SELECT id FROM pet WHERE name = 'Whiskers'), 'https://images.unsplash.com/photo-1514888286974-6c03bf1a4f8c?w=400', 0),
((SELECT id FROM pet WHERE name = 'Whiskers'), 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400', 1),
((SELECT id FROM pet WHERE name = 'Luna'), 'https://images.unsplash.com/photo-1518894917744-12107fb5c385?w=400', 0),
((SELECT id FROM pet WHERE name = 'Shadow'), 'https://images.unsplash.com/photo-1542652694d5-142483146814?w=400', 0),
((SELECT id FROM pet WHERE name = 'Tweety'), 'https://images.unsplash.com/photo-1544923408-75c3bae17b3f?w=400', 0),
((SELECT id FROM pet WHERE name = 'Polly'), 'https://images.unsplash.com/photo-1444464666175-1b9a92f2f841?w=400', 0),
((SELECT id FROM pet WHERE name = 'Hopper'), 'https://images.unsplash.com/photo-1585110396000-c9fbe2d08c54?w=400', 0),
((SELECT id FROM pet WHERE name = 'Flopsy'), 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400', 0),
((SELECT id FROM pet WHERE name = 'Squeak'), 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400', 0),
((SELECT id FROM pet WHERE name = 'Nibbles'), 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400', 0);

INSERT INTO health_status (pet_id, status) VALUES
((SELECT id FROM pet WHERE name = 'Max'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Bella'), 'VACCINATED'),
((SELECT id FROM pet WHERE name = 'Charlie'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Whiskers'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Luna'), 'VACCINATED'),
((SELECT id FROM pet WHERE name = 'Shadow'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Tweety'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Polly'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Hopper'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Flopsy'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Squeak'), 'HEALTHY'),
((SELECT id FROM pet WHERE name = 'Nibbles'), 'HEALTHY');