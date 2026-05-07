CREATE TABLE IF NOT EXISTS health_status (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_health_status_pet FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

CREATE INDEX idx_health_status_pet_id ON health_status(pet_id);
