
import pool from './db';

const seedNewsCategories = async () => {
    try {
        console.log('Seeding news categories...');
        const categories = [
            { id: 'NC_PROD', name: 'Product', type: 'NT002' },
            { id: 'NC_ADV', name: 'Advice', type: 'NT001' },
            { id: 'NC_VID', name: 'Video', type: 'NT001' },
            { id: 'NC_COMM', name: 'Community', type: 'NT001' },
        ];

        for (const cat of categories) {
            const check = await pool.query('SELECT * FROM news_category_reference WHERE news_category_ref_id = $1', [cat.id]);
            if (check.rows.length === 0) {
                await pool.query(
                    'INSERT INTO news_category_reference (news_category_ref_id, news_category_ref_name, news_type_ref_id) VALUES ($1, $2, $3)',
                    [cat.id, cat.name, cat.type]
                );
                console.log(`Created category: ${cat.name}`);
            } else {
                console.log(`Category exists: ${cat.name}`);
            }
        }

        console.log('Seeding complete.');

    } catch (err) {
        console.error('Error seeding categories:', err);
    } finally {
        pool.end();
    }
};

seedNewsCategories();
