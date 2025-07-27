import express from 'express';
import { registerRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start server with proper host binding
registerRoutes(app).then((server: any) => {
  server.listen(PORT, () => {
    console.log(`[express] serving on port ${PORT} (all interfaces)`);
  });
}).catch((error: any) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});