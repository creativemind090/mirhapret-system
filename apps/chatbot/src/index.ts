import 'dotenv/config';
import app from './chat-server';

const PORT = parseInt(process.env.PORT ?? '3004', 10);

app.listen(PORT, () => {
  console.log(`MirhaPret Chatbot API running on http://localhost:${PORT}`);
  console.log(`  POST http://localhost:${PORT}/chat  — web chat endpoint`);
  console.log(`  GET  http://localhost:${PORT}/health — health check`);
  console.log(`\nFor MCP stdio server: npm run mcp`);
});
