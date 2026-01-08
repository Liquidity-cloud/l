
import pool from './db';

const cleanUndefined = async () => {
    try {
        console.log('Cleaning "undefined" strings from database...');

        // About Section
        const aboutRes = await pool.query(`UPDATE about_section SET image_url = '' WHERE image_url = 'undefined' OR image_url = 'null'`);
        console.log(`Updated ${aboutRes.rowCount} rows in about_section`);

        // Team Member
        const teamRes = await pool.query(`UPDATE team_member SET image_url = '' WHERE image_url = 'undefined' OR image_url = 'null'`);
        console.log(`Updated ${teamRes.rowCount} rows in team_member`);

        // News
        // Assuming news table has thumbnail
        const newsRes = await pool.query(`UPDATE news SET thumbnail = '' WHERE thumbnail = 'undefined' OR thumbnail = 'null'`);
        console.log(`Updated ${newsRes.rowCount} rows in news`);

        process.exit(0);
    } catch (err) {
        console.error('Error cleaning DB:', err);
        process.exit(1);
    }
};

cleanUndefined();
