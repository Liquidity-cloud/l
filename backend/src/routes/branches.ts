import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET all branches with location details
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.branch_id,
                b.branch_name,
                b.address,
                b.work_days,
                b.work_hours,
                b.latitude,
                b.longitude,
                p.province_name,
                p.province_id,
                d.district_name,
                d.district_id,
                r.region_name,
                ARRAY_AGG(bp.phone_number) FILTER (WHERE bp.phone_number IS NOT NULL) as phone_numbers
            FROM branch b
            LEFT JOIN province p ON b.province_id = p.province_id
            LEFT JOIN district d ON b.district_id = d.district_id
            LEFT JOIN region r ON p.region_id = r.region_id
            LEFT JOIN branch_phone bp ON b.branch_id = bp.branch_id
            GROUP BY b.branch_id, p.province_name, p.province_id, d.district_name, d.district_id, r.region_name
            ORDER BY b.branch_id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

// POST - Create new branch
router.post('/', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { branch_name, address, work_days, work_hours, province_id, district_id, latitude, longitude, phone_numbers } = req.body;

        console.log('Creating branch with data:', { branch_name, address, province_id, latitude, longitude });

        // Insert branch (province_id is optional now)
        const branchResult = await client.query(
            `INSERT INTO branch (branch_name, address, work_days, work_hours, province_id, district_id, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING branch_id`,
            [branch_name, address, work_days || null, work_hours || null, province_id || null, district_id || null, latitude || null, longitude || null]
        );

        const branchId = branchResult.rows[0].branch_id;
        console.log('Branch created with ID:', branchId);

        // Insert phone numbers if provided
        if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
            for (const phone of phone_numbers) {
                if (phone && phone.trim()) {
                    await client.query(
                        'INSERT INTO branch_phone (branch_id, phone_number) VALUES ($1, $2)',
                        [branchId, phone.trim()]
                    );
                }
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ branch_id: branchId, message: 'Branch created successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating branch:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to create branch', details: errorMessage });
    } finally {
        client.release();
    }
});

// PUT - Update branch
router.put('/:id', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const branchId = req.params.id;
        const { branch_name, address, work_days, work_hours, province_id, district_id, latitude, longitude, phone_numbers } = req.body;

        // Update branch
        await client.query(
            `UPDATE branch 
             SET branch_name = $1, address = $2, work_days = $3, work_hours = $4, 
                 province_id = $5, district_id = $6, latitude = $7, longitude = $8
             WHERE branch_id = $9`,
            [branch_name, address, work_days || null, work_hours || null, province_id || null, district_id || null, latitude || null, longitude || null, branchId]
        );

        // Delete existing phone numbers
        await client.query('DELETE FROM branch_phone WHERE branch_id = $1', [branchId]);

        // Insert new phone numbers
        if (phone_numbers && Array.isArray(phone_numbers) && phone_numbers.length > 0) {
            for (const phone of phone_numbers) {
                if (phone && phone.trim()) {
                    await client.query(
                        'INSERT INTO branch_phone (branch_id, phone_number) VALUES ($1, $2)',
                        [branchId, phone.trim()]
                    );
                }
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Branch updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating branch:', error);
        res.status(500).json({ error: 'Failed to update branch' });
    } finally {
        client.release();
    }
});

// DELETE - Remove branch
router.delete('/:id', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const branchId = req.params.id;

        // Delete phone numbers first (foreign key constraint)
        await client.query('DELETE FROM branch_phone WHERE branch_id = $1', [branchId]);

        // Delete branch
        await client.query('DELETE FROM branch WHERE branch_id = $1', [branchId]);

        await client.query('COMMIT');
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting branch:', error);
        res.status(500).json({ error: 'Failed to delete branch' });
    } finally {
        client.release();
    }
});

export default router;
