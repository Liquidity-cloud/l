import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
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
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { title, summary, content, thumbnail, categoryId } = req.body;
    try {
        const id = Date.now().toString().slice(-10); // Simple ID generation fitting VARCHAR(10)
        const result = await pool.query(
            'INSERT INTO news (news_id, news_title, news_summary, news_content, thumbnail, news_category_ref_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, title, summary, content, thumbnail, categoryId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ error: 'Failed to create news' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, summary, content, thumbnail, categoryId } = req.body;
    try {
        const result = await pool.query(
            'UPDATE news SET news_title = $1, news_summary = $2, news_content = $3, thumbnail = $4, news_category_ref_id = $5 WHERE news_id = $6 RETURNING *',
            [title, summary, content, thumbnail, categoryId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM news WHERE news_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
});

export default router;
