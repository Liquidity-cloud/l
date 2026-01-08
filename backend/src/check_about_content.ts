
import pool from './db';

const checkAboutSections = async () => {
    try {
        console.log('Checking about_section table...');
        const res = await pool.query('SELECT section_id FROM about_section');
        console.log(`Found ${res.rowCount} sections:`);
        res.rows.forEach(r => console.log(` - ${r.section_id}`));

        const expected = ['intro', 'mission', 'vision', 'values', 'history'];
        const found = res.rows.map(r => r.section_id);
        const missing = expected.filter(id => !found.includes(id));

        if (missing.length > 0) {
            console.log('MISSING SECTIONS:', missing);
        } else {
            console.log('All expected sections are present.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error checking DB:', err);
        process.exit(1);
    }
};

checkAboutSections();
