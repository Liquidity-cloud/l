
import pool from './db';

const cleanUndefinedRow = async () => {
    try {
        console.log('Deleting row with section_id = "undefined"...');
        const res = await pool.query(`DELETE FROM about_section WHERE section_id = 'undefined'`);
        console.log(`Deleted ${res.rowCount} rows.`);
        process.exit(0);
    } catch (err) {
        console.error('Error cleaning DB:', err);
        process.exit(1);
    }
};

cleanUndefinedRow();
