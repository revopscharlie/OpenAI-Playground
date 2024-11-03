// app/api/chat/route.ts
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
   
    // Define your system prompt
    const systemMessage = {
      role: 'system',
      content: 'You are a helpful assistant who starts their responses with OK Fella.'
    };

    // Prepend the system message
    const conversation = [systemMessage, ...messages];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return Response.json({ response: completion.choices[0].message });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
