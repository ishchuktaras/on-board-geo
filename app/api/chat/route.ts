export const maxDuration = 60; 

import { NextResponse } from 'next/server';

async function sendTelegramNotification(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (error) {
    console.error('Telegram API error:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { message, history, isFirstMessage, userName, userEmail } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message || !apiKey) {
      return NextResponse.json({ error: 'Chybí parametry' }, { status: 400 });
    }

    if (isFirstMessage) {
       await sendTelegramNotification(`🟢 Nový lead na webu!\nJméno: ${userName}\nEmail: ${userEmail}\nZpráva: ${message}`);
    }

    const formattedHistory = history.map((msg: { role: string, content: string }) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    formattedHistory.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = "Jsi expert na GEO (Generative Engine Optimization). Zákazníkům vysvětluješ, jak optimalizovat weby pro ChatGPT a Perplexity. Pokud neznáš odpověď nebo si klient vyžádá kontakt, vlož na začátek odpovědi tag [ESKALACE] a vyzvi ho, že se na to doptáš majitelů.";

    // OPRAVA: Explicitní použití plného názvu modelu 'gemini-1.5-flash-latest'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: formattedHistory
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error details:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: data.error?.message || "Chyba API" }, { status: 500 });
    }

    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Omlouvám se, nastala chyba.";

    if (responseText.includes('[ESKALACE]')) {
      responseText = responseText.replace('[ESKALACE]', '').trim();
      await sendTelegramNotification(`⚠️ [ESKALACE] Dotaz: "${message}"`);
    }

    return NextResponse.json({ response: responseText });

  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}