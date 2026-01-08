import pool from './db';

const migrateAbout = async () => {
    try {
        console.log('Starting About page migration...');

        // About Sections Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS about_section (
                section_id VARCHAR(50) PRIMARY KEY,
                title_mn VARCHAR(200),
                title_en VARCHAR(200),
                content_mn TEXT,
                content_en TEXT,
                image_url VARCHAR(500),
                display_order INT DEFAULT 0
            );
        `);
        console.log('Created about_section table');

        // Team Members Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS team_member (
                member_id SERIAL PRIMARY KEY,
                name_mn VARCHAR(100) NOT NULL,
                name_en VARCHAR(100),
                position_mn VARCHAR(100),
                position_en VARCHAR(100),
                image_url VARCHAR(500),
                email VARCHAR(100),
                phone VARCHAR(50),
                display_order INT DEFAULT 0
            );
        `);
        console.log('Created team_member table');

        // Company Stats Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS company_stat (
                stat_id SERIAL PRIMARY KEY,
                label_mn VARCHAR(100),
                label_en VARCHAR(100),
                value VARCHAR(50),
                icon VARCHAR(50),
                display_order INT DEFAULT 0
            );
        `);
        console.log('Created company_stat table');

        // Insert default data if empty
        const sectionCount = await pool.query('SELECT COUNT(*) FROM about_section');
        if (parseInt(sectionCount.rows[0].count) === 0) {
            console.log('Inserting default About sections...');
            await pool.query(`
                INSERT INTO about_section (section_id, title_mn, title_en, content_mn, content_en, image_url, display_order)
                VALUES 
                ('intro', 'Бидний тухай', 'About Us', 'Бичил Глобус ББСБ нь 2010 оноос хойш санхүүгийн үйлчилгээ үзүүлж ирсэн туршлагатай компани юм.', 'Bichil Globus NBFI has been providing financial services since 2010.', '/images/about-hero.jpg', 1),
                ('mission', 'Эрхэм зорилго', 'Mission', 'Монгол улсын иргэдэд чанартай, шуурхай санхүүгийн үйлчилгээ үзүүлж, тэдний амьдралын түвшинг дээшлүүлэхэд хувь нэмэр оруулах.', 'To provide quality and prompt financial services to Mongolian citizens.', NULL, 2),
                ('vision', 'Алсын хараа', 'Vision', 'Монгол улсын тэргүүлэх санхүүгийн байгууллагуудын нэг болж, олон улсын түвшинд өрсөлдөхүйц үйлчилгээ үзүүлэгч болох.', 'To become one of the leading financial institutions in Mongolia.', NULL, 3),
                ('values', 'Үнэт зүйлс', 'Values', '• Итгэл найдвар\n• Шударга ёс\n• Үйлчлүүлэгч төвтэй', '• Trust\n• Integrity\n• Customer-centric', NULL, 4),
                ('history', 'Түүхэн замнал', 'Our History', '2010 онд байгуулагдсан цагаасаа хойш тасралтгүй хөгжиж ирсэн.', 'Since established in 2010, we have grown continuously.', '/images/about-history.jpg', 5);
            `);
        }

        console.log('About page migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Don't close pool here as it might be used by app, but for script it's fine
        // await pool.end(); 
        process.exit();
    }
};

migrateAbout();
