export const maxDuration = 60; 

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    console.error('Selhalo spojení na Telegram API:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { message, threadId, isFirstMessage, userName, userEmail } = await req.json();
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!message || !assistantId) {
      return NextResponse.json({ error: 'Chybí parametry' }, { status: 400 });
    }

    let activeThreadId = threadId;

    // Pokud je to první zpráva z formuláře, upozorníme majitele
    if (!activeThreadId) {
      const thread = await openai.beta.threads.create();
      activeThreadId = thread.id;
      if (isFirstMessage) {
         await sendTelegramNotification(`🟢 Nový lead na webu!\nJméno: ${userName}\nEmail: ${userEmail}\nZpráva: ${message}`);
      }
    }

    await openai.beta.threads.messages.create(activeThreadId, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.createAndPoll(activeThreadId, {
      assistant_id: assistantId,
    });

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(activeThreadId);
      const latestAssistantMessage = messages.data.find((msg) => msg.role === 'assistant');

      let responseText = '';
      if (latestAssistantMessage && latestAssistantMessage.content[0].type === 'text') {
        responseText = latestAssistantMessage.content[0].text.value;
      }

      // HUMAN-IN-THE-LOOP LOGIKA
      if (responseText.includes('[ESKALACE]')) {
        responseText = responseText.replace('[ESKALACE]', '').trim();
        await sendTelegramNotification(`⚠️ [ESKALACE] Klient si vyžádal asistenci nebo AI nezná odpověď.\nDotaz: "${message}"\nZkontroluj web.`);
      }

      return NextResponse.json({ response: responseText, threadId: activeThreadId });

    } else {
      // Získáme detailní chybovou hlášku přímo z OpenAI
      const openaiError = run.last_error?.message || "Neznámý důvod";
      await sendTelegramNotification(`🔴 AI selhalo. Stav: ${run.status}\nDůvod: ${openaiError}`);
      return NextResponse.json({ error: openaiError }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error('API Error /chat:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    await sendTelegramNotification(`🚨 API Chyba: ${errorMessage}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}