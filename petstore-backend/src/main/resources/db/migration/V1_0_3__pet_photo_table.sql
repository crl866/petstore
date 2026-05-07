CREATE TABLE IF NOT EXISTS pet_photo (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL,
    photo_url VARCHAR(1024) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pet_photo_pet FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

CREATE INDEX idx_pet_photo_pet_id ON pet_photo(pet_id);
CREATE INDEX idx_pet_photo_display_order ON pet_photo(pet_id, display_order);
