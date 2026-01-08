
import pool from './db';

const migrate = async () => {
    try {
        console.log('Adding news_summary column...');
        await pool.query('ALTER TABLE news ADD COLUMN IF NOT EXISTS news_summary TEXT');
        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        pool.end();
    }
};

migrate();
