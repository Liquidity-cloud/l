
import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// --- VALIDATION HELPERS ---
const validateSection = (req: Request, res: Response, next: Function) => {
    const { title_mn, content_mn } = req.body;
    if (!title_mn || !content_mn) {
        return res.status(400).json({ error: 'Title and Content (Mongolian) are required' });
    }
    next();
};

const validateStat = (req: Request, res: Response, next: Function) => {
    const { label_mn, label_en, value } = req.body;
    if (!label_mn || !label_en || !value) {
        return res.status(400).json({ error: 'Labels and Value are required' });
    }
    next();
};

const validateTeam = (req: Request, res: Response, next: Function) => {
    const { name_mn, name_en, position_mn, position_en } = req.body;
    if (!name_mn || !name_en || !position_mn || !position_en) {
        return res.status(400).json({ error: 'Name and Position are required (MN and EN)' });
    }
    next();
};

// --- GET ALL ---
router.get('/', async (req: Request, res: Response) => {
    try {
        console.log('[Backend] GET /api/about request received');

        const sectionsFn = pool.query('SELECT * FROM about_section ORDER BY display_order');
        const teamFn = pool.query('SELECT * FROM team_member ORDER BY display_order');
        const statsFn = pool.query('SELECT * FROM company_stat ORDER BY display_order');

        const [sections, team, stats] = await Promise.all([sectionsFn, teamFn, statsFn]);

        res.json({
            sections: sections.rows,
            team: team.rows,
            stats: stats.rows
        });
    } catch (error) {
        console.error('Error fetching about data:', error);
        res.status(500).json({ error: 'Failed to fetch about data' });
    }
});

// --- SECTIONS ---
router.put('/sections/:id', validateSection, async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`[Backend] PUT /about/sections/${id}`, req.body);

    if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid ID:', id);
        return res.status(400).json({ error: 'Invalid Section ID' });
    }
    const { title_mn, title_en, content_mn, content_en, image_url, display_order } = req.body;

    try {
        const result = await pool.query(
            `UPDATE about_section 
             SET title_mn = $1, title_en = $2, content_mn = $3, content_en = $4, image_url = $5, display_order = $6
             WHERE section_id = $7 RETURNING *`,
            [title_mn, title_en, content_mn, content_en, image_url, display_order || 0, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Section not found' });
        }

        res.json({ message: 'Section updated successfully', section: result.rows[0] });
    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ error: 'Failed to update section' });
    }
});

// --- TEAM MEMBERS ---
router.post('/team', validateTeam, async (req: Request, res: Response) => {
    const { name_mn, name_en, position_mn, position_en, email, phone, image_url, display_order } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO team_member (name_mn, name_en, position_mn, position_en, email, phone, image_url, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name_mn, name_en, position_mn, position_en, email, phone, image_url, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating team member:', error);
        res.status(500).json({ error: 'Failed to create team member' });
    }
});

router.put('/team/:id', validateTeam, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name_mn, name_en, position_mn, position_en, email, phone, image_url, display_order } = req.body;
    try {
        const result = await pool.query(
            `UPDATE team_member 
             SET name_mn = $1, name_en = $2, position_mn = $3, position_en = $4, email = $5, phone = $6, image_url = $7, display_order = $8
             WHERE member_id = $9 RETURNING *`,
            [name_mn, name_en, position_mn, position_en, email, phone, image_url, display_order, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Team member not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({ error: 'Failed to update team member' });
    }
});

router.delete('/team/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('DELETE FROM team_member WHERE member_id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Team member not found' });
        res.json({ message: 'Team member deleted' });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ error: 'Failed to delete team member' });
    }
});

// --- STATS ---
router.post('/stats', validateStat, async (req: Request, res: Response) => {
    const { label_mn, label_en, value, icon, display_order } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO company_stat (label_mn, label_en, value, icon, display_order)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [label_mn, label_en, value, icon, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating stat:', error);
        res.status(500).json({ error: 'Failed to create stat' });
    }
});

router.put('/stats/:id', validateStat, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { label_mn, label_en, value, icon, display_order } = req.body;
    try {
        const result = await pool.query(
            `UPDATE company_stat 
             SET label_mn = $1, label_en = $2, value = $3, icon = $4, display_order = $5
             WHERE stat_id = $6 RETURNING *`,
            [label_mn, label_en, value, icon, display_order, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Stat not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating stat:', error);
        res.status(500).json({ error: 'Failed to update stat' });
    }
});

router.delete('/stats/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('DELETE FROM company_stat WHERE stat_id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Stat not found' });
        res.json({ message: 'Stat deleted' });
    } catch (error) {
        console.error('Error deleting stat:', error);
        res.status(500).json({ error: 'Failed to delete stat' });
    }
});

export default router;
