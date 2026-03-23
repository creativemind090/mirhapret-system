import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { GUEST_TOOLS, AUTH_TOOLS } from './tools/definitions';
import { executeTool } from './tools/executor';

const server = new Server(
  { name: 'mirhapret-chatbot', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

const ALL_TOOLS = [...GUEST_TOOLS, ...AUTH_TOOLS];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: ALL_TOOLS.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.input_schema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const result = await executeTool(name, (args as Record<string, any>) ?? {}, {});
  return {
    content: [{ type: 'text', text: result }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MirhaPret MCP server running on stdio');
}

main().catch(console.error);
