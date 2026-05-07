-- Insert sample categories
INSERT INTO category (name, description) VALUES
('Dogs', 'Loyal and friendly canine companions'),
('Cats', 'Independent and affectionate feline friends'),
('Birds', 'Colorful and vocal feathered pets'),
('Rabbits', 'Cute and gentle small animals'),
('Hamsters', 'Tiny and adorable rodents');

-- Insert sample pets
INSERT INTO pet (name, description, category_id) VALUES
('Max', 'A friendly golden retriever who loves to play fetch', 1),
('Bella', 'A gentle German Shepherd with a protective nature', 1),
('Charlie', 'An energetic border collie who loves herding', 1),
('Whiskers', 'A fluffy Persian cat with a calm demeanor', 2),
('Luna', 'A sleek Siamese cat who loves attention', 2),
('Shadow', 'A mysterious black cat who enjoys quiet time', 2),
('Tweety', 'A colorful macaw who can mimic sounds', 3),
('Polly', 'A blue parakeet with a melodious chirp', 3),
('Hopper', 'A fluffy white rabbit with long ears', 4),
('Flopsy', 'A brown rabbit who loves to hop around', 4),
('Squeak', 'A golden hamster with an active personality', 5),
('Nibbles', 'A cute dwarf hamster who loves sunflower seeds', 5);

-- Insert sample pet photos
INSERT INTO pet_photo (pet_id, photo_url, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400', 0),
(1, 'https://images.unsplash.com/photo-1612536315918-b36e1d6c9e7a?w=400', 1),
(2, 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', 0),
(3, 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400', 0),
(4, 'https://images.unsplash.com/photo-1514888286974-6c03bf1a4f8c?w=400', 0),
(4, 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400', 1),
(5, 'https://images.unsplash.com/photo-1518894917744-12107fb5c385?w=400', 0),
(6, 'https://images.unsplash.com/photo-1542652694d5-142483146814?w=400', 0),
(7, 'https://images.unsplash.com/photo-1544923408-75c3bae17b3f?w=400', 0),
(8, 'https://images.unsplash.com/photo-1444464666175-1b9a92f2f841?w=400', 0),
(9, 'https://images.unsplash.com/photo-1585110396000-c9fbe2d08c54?w=400', 0),
(10, 'https://images.unsplash.com/photo-1585110396000-c9fbe2d08c54?w=400', 0),
(11, 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400', 0),
(12, 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400', 0);

-- Insert sample health status
INSERT INTO health_status (pet_id, status) VALUES
(1, 'HEALTHY'),
(1, 'VACCINATED'),
(1, 'MICROCHIPPED'),
(2, 'HEALTHY'),
(2, 'VACCINATED'),
(3, 'HEALTHY'),
(4, 'HEALTHY'),
(5, 'VACCINATED'),
(6, 'HEALTHY'),
(7, 'HEALTHY'),
(8, 'HEALTHY'),
(9, 'VACCINATED'),
(10, 'HEALTHY'),
(11, 'HEALTHY'),
(12, 'HEALTHY');
