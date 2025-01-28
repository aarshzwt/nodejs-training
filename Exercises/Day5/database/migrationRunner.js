const fs = require('fs');
const path = require('path');
const pool = require('./connection'); 

const migrationsFolder = path.join(__dirname, 'migrations');

async function runMigrations() {
  const files = fs.readdirSync(migrationsFolder);
  files.sort(); 

  for (let file of files) {
    const migrationFilePath = path.join(migrationsFolder, file);

    // Only process .sql files
    if (path.extname(file) === '.sql') {
      try {
        console.log(`Running migration: ${file}`);

        // Read the SQL file content
        const sql = fs.readFileSync(migrationFilePath, 'utf-8');

        // Execute the migration
        await pool.query(sql);

        console.log(`Migration ${file} executed successfully.`);
      } catch (err) {
        console.error(`Error executing migration ${file}:`, err);
        process.exit(1);  
      }
    }
  }
}

(async function () {
  try {
    await runMigrations();
    console.log('All migrations completed successfully.');
  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    try {
      await pool.end();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
  }
})();
