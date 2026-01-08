import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET all loan products with details
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                lp.loan_product_id,
                lp.loan_product_name,
                lpt.loan_type_name,
                lpd.loan_product_amount,
                lpd.loan_product_fee,
                lpd.loan_product_interest_rate,
                lpd.loan_product_term_months,
                lpd.loan_product_processing_minute
            FROM loan_products lp
            LEFT JOIN loan_product_type lpt ON lp.loan_product_type_id = lpt.loan_product_type_id
            LEFT JOIN loan_product_details lpd ON lp.loan_product_id = lpd.loan_product_id
            ORDER BY lp.loan_product_id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

export default router;
