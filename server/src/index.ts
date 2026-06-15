import express from "express";
import cors from "cors";
import templatesRouter from "./routes/templates";
import worksRouter from "./routes/works";
import generateRouter from "./routes/generate";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1/templates', templatesRouter);
app.use('/api/v1/works', worksRouter);
app.use('/api/v1/generate', generateRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
  console.log('Available routes:');
  console.log('  GET  /api/v1/health');
  console.log('  GET  /api/v1/templates');
  console.log('  GET  /api/v1/templates/:id');
  console.log('  GET  /api/v1/works');
  console.log('  GET  /api/v1/works/:id');
  console.log('  DELETE /api/v1/works/:id');
  console.log('  POST /api/v1/generate');
});
