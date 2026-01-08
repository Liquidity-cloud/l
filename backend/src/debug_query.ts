
import pool from './db';

const debug = async () => {
    try {
        console.log('Testing GET news query...');
        const result = await pool.query(`
            SELECT 
                n.news_id,
                n.news_title,
                n.news_summary,
                n.news_content,
                n.thumbnail,
                n.news_category_ref_id,
                ncr.news_category_ref_name,
                ntr.news_type_ref_name
            FROM news n
            LEFT JOIN news_category_reference ncr ON n.news_category_ref_id = ncr.news_category_ref_id
            LEFT JOIN news_type_reference ntr ON ncr.news_type_ref_id = ntr.news_type_ref_id
            ORDER BY n.news_id DESC
        `);
        console.log('GET success. Rows:', result.rows);

        console.log('Testing POST news query...');
        const id = Date.now().toString().slice(-10);
        const title = 'Debug News';
        const summary = 'Debug Summary';
        const content = 'Debug Content';
        const thumbnail = 'http://debug.com/img';
        const categoryId = 'NC_PROD';

        const insert = await pool.query(
            'INSERT INTO news (news_id, news_title, news_summary, news_content, thumbnail, news_category_ref_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, title, summary, content, thumbnail, categoryId]
        );
        console.log('POST success. Row:', insert.rows[0]);

        await pool.query('DELETE FROM news WHERE news_id = $1', [id]);

    } catch (err: any) {
        console.error('Debug Error:', err);
    } finally {
        pool.end();
    }
};

debug();
