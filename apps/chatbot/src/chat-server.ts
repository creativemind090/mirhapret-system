import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { GUEST_TOOLS, AUTH_TOOLS } from './tools/definitions';
import { executeTool } from './tools/executor';
import { getUserProfile } from './api-client';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required in .env');
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are Mira, MirhaPret's warm and knowledgeable shopping assistant. MirhaPret is a premium Pakistani fashion brand based in Lahore, specialising in pret and haute couture for the modern Pakistani woman.

Your personality: elegant, helpful, friendly, and knowledgeable about fashion. You reflect the brand's premium identity.

You can help with:
- Discovering trending and new collections
- Searching for specific styles, colours, or items
- Sharing product details and pricing
- Answering questions about shipping, returns, and sizing policy
- For logged-in customers: tracking orders and checking order history

Store information:
- Website: mirhapret.com | Instagram: @mirhapret
- Based in Lahore, Pakistan — Est. 2026
- Shipping: Free on orders over PKR 5,000, otherwise PKR 300 flat
- Delivery: 3–5 working days across Pakistan
- Returns: Within 7 days of delivery in original condition
- Payment: Cash on Delivery (COD)
- Sizes: XS, S, M, L, XL, XXL (refer to size guide on product page)
- Contact: hello@mirhapret.com

Guidelines:
- Keep responses concise and conversational
- Always use PKR for prices
- When showing products, encourage the customer to visit the product page
- You understand both English and Urdu — reply in whichever language the customer uses
- Never make up product names or prices — always use the tools to fetch real data
- If asked something you cannot help with, politely direct them to WhatsApp or email`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function buildTools(tools: any[]): OpenAI.Chat.Completions.ChatCompletionTool[] {
  return tools.map(t => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }));
}

app.post('/chat', async (req, res) => {
  try {
    const { message, history = [], token } = req.body as {
      message: string;
      history: ChatMessage[];
      token?: string;
    };

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Resolve auth context
    let userProfile: any = null;
    if (token) {
      userProfile = await getUserProfile(token);
    }
    const isAuthenticated = !!userProfile;
    const ctx = { token, userId: userProfile?.id };

    const toolSet = isAuthenticated ? [...GUEST_TOOLS, ...AUTH_TOOLS] : GUEST_TOOLS;

    const systemContent =
      SYSTEM_PROMPT +
      (isAuthenticated
        ? `\n\nThe customer is logged in as: ${userProfile.first_name} ${userProfile.last_name} (${userProfile.email}). Address them by their first name.`
        : '\n\nThe customer is browsing as a guest. You cannot look up their orders.');

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...history.slice(-10).map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const tools = buildTools(toolSet);
    let collectedProducts: any[] = [];

    // Agentic loop — keep executing tool calls until model stops requesting them
    while (true) {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        tool_choice: 'auto',
      });

      const msg = response.choices[0].message;
      messages.push(msg);

      if (!msg.tool_calls?.length) {
        const reply = msg.content ?? '';
        if (!reply) {
          return res.status(500).json({ error: 'No response from AI. Please try again.' });
        }
        return res.json({
          reply,
          products: collectedProducts.length ? collectedProducts : undefined,
          isAuthenticated,
          userName: userProfile?.first_name ?? null,
        });
      }

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        msg.tool_calls.map(async (tc) => {
          let args: Record<string, any> = {};
          try { args = JSON.parse(tc.function.arguments); } catch {}
          const result = await executeTool(tc.function.name, args, ctx);
          if (result.products?.length) collectedProducts = result.products;
          return {
            role: 'tool' as const,
            tool_call_id: tc.id,
            content: result.text,
          };
        })
      );

      messages.push(...toolResults);
    }
  } catch (err: any) {
    console.error('[Chat API Error]', err.message);
    if (err.status === 429) {
      return res.status(429).json({ error: 'Mira is a little busy right now. Please try again in a moment.' });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'mirhapret-chatbot', model: MODEL })
);

export default app;
