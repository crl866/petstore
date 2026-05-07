-- V1_0_0__initial_schema.sql
-- Initial database schema for Petstore application

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    species_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_species ON categories(species_type);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT,
    bio TEXT,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pets_category ON pets(category_id);
CREATE INDEX IF NOT EXISTS idx_pets_availability ON pets(availability_status);
CREATE INDEX IF NOT EXISTS idx_pets_name ON pets(name);

-- Create pet_photos table
CREATE TABLE IF NOT EXISTS pet_photos (
    id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    display_order INT
);

CREATE INDEX IF NOT EXISTS idx_pet_photos_pet ON pet_photos(pet_id);

-- Create health_statuses table
CREATE TABLE IF NOT EXISTS health_statuses (
    id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL UNIQUE REFERENCES pets(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_statuses_pet ON health_statuses(pet_id);

-- Create adoption_applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
    id SERIAL PRIMARY KEY,
    applicant_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    home_type VARCHAR(50),
    form_answers JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON adoption_applications(submitted_at);

-- Insert initial categories
INSERT INTO categories (name, species_type) VALUES
    ('Dogs', 'Dog'),
    ('Cats', 'Cat'),
    ('Birds', 'Bird'),
    ('Fish', 'Fish')
ON CONFLICT (name) DO NOTHING;
