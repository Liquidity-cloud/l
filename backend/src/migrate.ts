import pool from './db';

const migrate = async () => {
    try {
        console.log('Running migration to make province_id nullable...');

        // Make province_id nullable
        await pool.query('ALTER TABLE branch ALTER COLUMN province_id DROP NOT NULL;');

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
};

migrate();
