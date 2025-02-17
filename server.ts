import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the dist directory
  app.use(express.static(path.resolve(__dirname, 'dist')));

  // API routes
  app.use('/api/process-image', (req, res) => {
    // Your image processing logic here
    res.json({ message: 'Image processing endpoint' });
  });

  // All other routes should serve the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
}); 