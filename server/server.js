const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dealSchema = require('./models/Deal');

const app = express();

app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ta_deal_tracker',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database schema
const initDB = async () => {
  try {
    // Test the connection first
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
    
    // Create tables
    await pool.query(dealSchema);
    console.log('Database schema initialized');
  } catch (err) {
    if (err.code === '3D000') {
      console.error('Database does not exist. Please create it first:');
      console.error('1. Run: psql postgres');
      console.error('2. In psql, run: CREATE DATABASE ta_deal_tracker;');
      process.exit(1);
    } else {
      console.error('Database initialization error:', err);
      process.exit(1);
    }
  }
};

// Start server only after database is initialized
const startServer = async () => {
  await initDB();
  
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

// Get all deals
app.get('/api/deals', async (req, res) => {
  try {
    const dealsResult = await pool.query(`
      SELECT d.*, 
             json_agg(json_build_object(
               'id', v.id,
               'versionNumber', v.version_number,
               'useCases', v.use_cases,
               'roadblocks', v.roadblocks,
               'solutionRecommendations', v.solution_recommendations,
               'additionalComments', v.additional_comments,
               'editedBy', v.edited_by,
               'timestamp', v.timestamp
             ) ORDER BY v.version_number) as versions
      FROM deals d
      LEFT JOIN versions v ON d.id = v.deal_id
      GROUP BY d.id
      ORDER BY d.created_date DESC
    `);
    res.json(dealsResult.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new deal
app.post('/api/deals', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { dealId, customerName, currentStage, TAOwner, version } = req.body;

    // Insert deal
    const dealResult = await client.query(
      `INSERT INTO deals (deal_id, customer_name, current_stage, ta_owner)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [dealId, customerName, currentStage, TAOwner]
    );

    // Insert first version
    await client.query(
      `INSERT INTO versions (deal_id, version_number, use_cases, roadblocks, 
                           solution_recommendations, additional_comments, edited_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [dealResult.rows[0].id, 1, version.useCases, version.roadblocks,
       version.solutionRecommendations, version.additionalComments, version.editedBy]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Add new version to existing deal
app.post('/api/deals/:id/versions', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { version, currentStage } = req.body;

    // Get current version number
    const versionResult = await client.query(
      'SELECT MAX(version_number) FROM versions WHERE deal_id = $1',
      [req.params.id]
    );
    const newVersionNumber = (versionResult.rows[0].max || 0) + 1;

    // Update deal stage if provided
    if (currentStage) {
      await client.query(
        'UPDATE deals SET current_stage = $1 WHERE id = $2',
        [currentStage, req.params.id]
      );
    }

    // Insert new version
    await client.query(
      `INSERT INTO versions (deal_id, version_number, use_cases, roadblocks,
                           solution_recommendations, additional_comments, edited_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.params.id, newVersionNumber, version.useCases, version.roadblocks,
       version.solutionRecommendations, version.additionalComments, version.editedBy]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}); 