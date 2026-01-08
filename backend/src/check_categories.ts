
import pool from './db';

const checkCategories = async () => {
    try {
        const res = await pool.query('SELECT * FROM news_category_reference');
        console.log('Categories:', res.rows);
        const res2 = await pool.query('SELECT * FROM news_type_reference');
        console.log('Types:', res2.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
};

checkCategories();
