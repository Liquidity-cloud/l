import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import pool from './db';
import productsRouter from './routes/products';
import branchesRouter from './routes/branches';
import newsRouter from './routes/news';
import aboutRouter from './routes/about';
import uploadRouter from './routes/upload';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'],
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/branches', branchesRouter);
app.use('/api/products', productsRouter);
app.use('/api/news', newsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/admin/about', aboutRouter);
app.use('/api/upload', uploadRouter);

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));


app.get('/', (req: Request, res: Response) => {
    res.send('Backend API is running');
});

app.post('/generate', (req: Request, res: Response) => {
    console.log('Received generate request');
    const frontendDir = path.join(__dirname, '../../frontend');

    console.log(`Executing build in: ${frontendDir}`);

    exec('npm run build', { cwd: frontendDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Build error: ${error.message}`);
            return res.status(500).json({ error: 'Build failed', details: error.message, stderr });
        }
        if (stderr) {
            console.warn(`Build stderr: ${stderr}`);
        }
        console.log(`Build stdout: ${stdout}`);
        res.json({ message: 'Build triggered successfully', output: stdout });
    });
});

app.listen(port, async () => {
    console.log(`Backend server listening on port ${port}`);
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected successfully:', res.rows[0]);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
});
