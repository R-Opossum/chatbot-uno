import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(request) {
  const { message, clientId } = await request.json();

  const { data: knowledge } = await supabase
    .from('knowledge')
    .select('topic, content')
    .eq('client_id', clientId);

  const { data: client } = await supabase
    .from('clients')
    .select('business_name, bot_name')
    .eq('id', clientId)
    .single();

  const context = knowledge
    .map(k => `${k.topic}: ${k.content}`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Eres el asistente virtual de ${client.business_name}. 
Tu nombre es ${client.bot_name}.
Responde SOLO usando la siguiente información del negocio:

${context}

Si no sabes la respuesta, di amablemente que no tienes esa información 
y que contacten directamente con el negocio.`
      },
      { role: 'user', content: message }
    ],
    max_tokens: 1024,
  });

  await supabase.from('conversations').insert({
    client_id: clientId,
    user_message: message,
    bot_response: response.choices[0].message.content,
  });

  return Response.json({ reply: response.choices[0].message.content });
}