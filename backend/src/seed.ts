import pool from './db';
import fs from 'fs';
import path from 'path';

const seed = async () => {
    const client = await pool.connect();
    try {
        console.log('Connected');
        console.log('Seeding database...');

        // Drop all tables/schema to ensure a clean slate
        console.log('Dropping schema...');
        await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema.sql
        console.log('Executing schema.sql...');
        await client.query(schemaSql);

        // --- Seed Reference Data ---
        console.log('Seeding reference data...');

        // 1. News Types
        await client.query(`
            INSERT INTO news_type_reference (news_type_ref_id, news_type_ref_name) VALUES 
            ('NT001', 'General'),
            ('NT002', 'Promotion')
            ON CONFLICT (news_type_ref_id) DO NOTHING;
        `);

        // 2. News Categories
        await client.query(`
            INSERT INTO news_category_reference (news_category_ref_id, news_category_ref_name, news_type_ref_id) VALUES 
            ('NC_PROD', 'Product', 'NT002'),
            ('NC_ADV', 'Advice', 'NT001'),
            ('NC_VID', 'Video', 'NT001'),
            ('NC_COMM', 'Community', 'NT001'),
            ('NC001', 'Company News', 'NT001'),
            ('NC002', 'Product Updates', 'NT002')
            ON CONFLICT (news_category_ref_id) DO NOTHING;
        `);

        // 3. News Items (Optional, but good for demo)
        await client.query(`
            INSERT INTO news (news_id, news_title, news_content, thumbnail, news_category_ref_id) VALUES 
            ('NEWS001', 'New Branch Opening', 'We are excited to announce the opening of our new branch in the city center.', 'https://placehold.co/600x400', 'NC001'),
            ('NEWS002', 'Summer Loan Promotion', 'Get low interest rates this summer!', 'https://placehold.co/600x400', 'NC_PROD')
            ON CONFLICT (news_id) DO NOTHING;
        `);

        // --- Location Data ---
        console.log('Seeding locations...');
        // 1. Regions
        await client.query(`
            INSERT INTO region (region_id, region_name) VALUES 
            (1, 'Ulaanbaatar'),
            (2, 'Darkhan')
            ON CONFLICT (region_id) DO NOTHING;
        `);

        // 2. Provinces
        await client.query(`
            INSERT INTO province (province_id, province_name, region_id) VALUES 
            (1, 'Ulaanbaatar', 1),
            (2, 'Darkhan-Uul', 2)
            ON CONFLICT (province_id) DO NOTHING;
        `);

        // 3. Districts
        await client.query(`
            INSERT INTO district (district_id, district_name, province_id) VALUES 
            (1, 'Sukhbaatar', 1),
            (2, 'Chingeltei', 1),
            (3, 'Darkhan', 2)
            ON CONFLICT (district_id) DO NOTHING;
        `);

        // 4. Branches
        await client.query(`
            INSERT INTO branch (branch_id, branch_name, address, work_days, work_hours, province_id, district_id, latitude, longitude) VALUES 
            (1, 'Main Branch', 'Sukhbaatar Square, Ulaanbaatar', 'Mon-Fri', '09:00-18:00', 1, 1, 47.9184, 106.9177),
            (2, 'Darkhan Branch', 'Old City, Darkhan', 'Mon-Fri', '09:00-17:00', 2, 3, 49.4867, 105.9278)
            ON CONFLICT (branch_id) DO NOTHING;
        `);

        // 5. Branch Phones
        await client.query(`
            INSERT INTO branch_phone (branch_id, phone_number) VALUES 
            (1, '7700-0001'),
            (1, '7700-0002'),
            (2, '7700-0003')
            ON CONFLICT DO NOTHING;
        `);

        // --- About Data ---
        console.log('Seeding about data...');
        await client.query(`
            INSERT INTO about_section (section_id, title_mn, title_en, content_mn, content_en, image_url, display_order) VALUES 
            ('intro', 'Бидний тухай', 'About Us', 'Бичил Глобус ББСБ нь 2010 оноос хойш санхүүгийн үйлчилгээ үзүүлж ирсэн туршлагатай компани юм.', 'Bichil Globus NBFI has been providing financial services since 2010.', '/images/about-hero.jpg', 1),
            ('mission', 'Эрхэм зорилго', 'Mission', 'Монгол улсын иргэдэд чанартай, шуурхай санхүүгийн үйлчилгээ үзүүлж, тэдний амьдралын түвшинг дээшлүүлэхэд хувь нэмэр оруулах.', 'To provide quality and prompt financial services to Mongolian citizens.', NULL, 2),
            ('vision', 'Алсын хараа', 'Vision', 'Монгол улсын тэргүүлэх санхүүгийн байгууллагуудын нэг болж, олон улсын түвшинд өрсөлдөхүйц үйлчилгээ үзүүлэгч болох.', 'To become one of the leading financial institutions in Mongolia.', NULL, 3),
            ('values', 'Үнэт зүйлс', 'Values', '• Итгэл найдвар\n• Шударга ёс\n• Үйлчлүүлэгч төвтэй', '• Trust\n• Integrity\n• Customer-centric', NULL, 4),
            ('history', 'Түүхэн замнал', 'Our History', '2010 онд байгуулагдсан цагаасаа хойш тасралтгүй хөгжиж ирсэн.', 'Since established in 2010, we have grown continuously.', '/images/about-history.jpg', 5)
            ON CONFLICT (section_id) DO NOTHING;
        `);

        // --- Product Data ---
        console.log('Seeding product data...');
        // 1. Loan Product Refer
        await client.query(`
            INSERT INTO loan_product_refer (loan_product_refer_id, loan_product_refer_name) VALUES 
            ('LPR001', 'Consumer Loans')
            ON CONFLICT (loan_product_refer_id) DO NOTHING;
        `);

        // 2. Type Loan Product Refer
        await client.query(`
            INSERT INTO type_loan_product_refer (type_loan_product_refer_id, type_loan_product_name_refer, loan_product_refer_id) VALUES 
            ('TLPR001', 'Personal Loans', 'LPR001')
            ON CONFLICT (type_loan_product_refer_id) DO NOTHING;
        `);

        // 3. Loan Product Type
        await client.query(`
            INSERT INTO loan_product_type (loan_product_type_id, loan_type_name, type_loan_product_refer_id) VALUES 
            ('LPT001', 'Salary Loan', 'TLPR001'),
            ('LPT002', 'Pension Loan', 'TLPR001')
            ON CONFLICT (loan_product_type_id) DO NOTHING;
        `);

        // 4. Loan Products
        await client.query(`
            INSERT INTO loan_products (loan_product_id, loan_product_name, loan_product_type_id) VALUES 
            ('LP001', 'Easy Salary Loan', 'LPT001'),
            ('LP002', 'Golden Years Pension Loan', 'LPT002')
            ON CONFLICT (loan_product_id) DO NOTHING;
        `);

        // 5. Loan Product Details
        await client.query(`
            INSERT INTO loan_product_details (loan_product_id, loan_type_det_id, loan_product_amount, loan_product_fee, loan_product_interest_rate, loan_product_term_months, loan_product_processing_minute) VALUES 
            ('LP001', 'DET001', 10000000, 10000, 1.5, 24, 30),
            ('LP002', 'DET002', 20000000, 5000, 1.2, 36, 15)
            ON CONFLICT (loan_product_id) DO NOTHING;
        `);

        // console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

seed();
