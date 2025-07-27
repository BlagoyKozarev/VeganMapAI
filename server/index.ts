import express from 'express';
import { registerRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start server
registerRoutes(app).then((server: any) => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] serving on port ${PORT}`);
  });
}).catch((error: any) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});