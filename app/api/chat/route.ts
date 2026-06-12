export const maxDuration = 60; 

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
      return NextResponse.json({ error: 'Chybí parametry nebo API klíč' }, { status: 400 });
    }

    if (isFirstMessage) {
       await sendTelegramNotification(`🟢 Nový lead na webu!\nJméno: ${userName}\nEmail: ${userEmail}\nZpráva: ${message}`);
    }

    // Inicializace oficiálního Google SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Použití stabilního modelu s instrukcemi
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: "Jsi expert na GEO (Generative Engine Optimization). Zákazníkům vysvětluješ, jak optimalizovat weby pro ChatGPT a Perplexity. Pokud neznáš odpověď nebo si klient vyžádá kontakt, vlož na začátek odpovědi tag [ESKALACE] a vyzvi ho, že se na to doptáš majitelů."
    });

    // Přeformátování historie pro SDK
    const formattedHistory = history.map((msg: { role: string, content: string }) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Otevření chatu s historií
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Odeslání zprávy
    const result = await chat.sendMessage(message);
    let responseText = result.response.text();

    // Kontrola eskalace
    if (responseText.includes('[ESKALACE]')) {
      responseText = responseText.replace('[ESKALACE]', '').trim();
      await sendTelegramNotification(`⚠️ [ESKALACE] Dotaz: "${message}"`);
    }

    return NextResponse.json({ response: responseText });

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}