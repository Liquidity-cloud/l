import fs from 'fs';
import path from 'path';
import pool from './db';

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema initialization...');
        await pool.query(schemaSql);
        console.log('Schema initialization completed successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
};

initDb();
