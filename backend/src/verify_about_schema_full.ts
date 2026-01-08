
import pool from './db';

const verifySchema = async () => {
    try {
        const tables = ['about_section', 'team_member', 'company_stat'];
        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            console.log(`\n--- ${table} columns ---`);
            res.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifySchema();
