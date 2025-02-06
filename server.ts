import express from 'express';
import { ViteDevServer } from 'vite';
import { createServer as createViteServer } from 'vite';

const app = express();

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  app.use(vite.middlewares);
  
  app.use('/api/process-image', async (req, res) => {
    try {
      const processImage = require('./src/api/process-image').default;
      await processImage(req, res);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(5173);
}

createServer(); 