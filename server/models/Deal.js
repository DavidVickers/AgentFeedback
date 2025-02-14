// We'll replace this with PostgreSQL schema

const dealSchema = `
  CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    deal_id VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    current_stage VARCHAR(50) NOT NULL,
    ta_owner VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS versions (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id),
    version_number INTEGER NOT NULL,
    use_cases TEXT NOT NULL,
    roadblocks TEXT NOT NULL,
    solution_recommendations TEXT NOT NULL,
    additional_comments TEXT,
    edited_by VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

module.exports = dealSchema; 