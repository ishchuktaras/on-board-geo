import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializace OpenAI klienta
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Pomocná funkce pro odeslání notifikace přes Telegram Bot API.
 */
async function sendTelegramNotification(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials nejsou nastaveny v proměnných prostředí.');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    if (!response.ok) {
      console.error('Chyba při odesílání Telegram notifikace:', await response.text());
    }
  } catch (error) {
    console.error('Selhalo spojení na Telegram API:', error);
  }
}

export async function POST(req: Request) {
  try {
    // 1. Validace vstupních dat
    const body = await req.json();
    const { message, threadId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Parametr message je povinný.' }, { status: 400 });
    }

    const assistantId = process.env.OPENAI_ASSISTANT_ID;
    if (!assistantId) {
      throw new Error('OPENAI_ASSISTANT_ID chybí v proměnných prostředí.');
    }

    let activeThreadId = threadId;

    // 2. Správa Threadu (použití existujícího nebo vytvoření nového)
    if (!activeThreadId) {
      const thread = await openai.beta.threads.create();
      activeThreadId = thread.id;
    }

    // 3. Přidání zprávy od uživatele do Threadu
    await openai.beta.threads.messages.create(activeThreadId, {
      role: 'user',
      content: message,
    });

    // 4. Spuštění Runa a čekání na jeho dokončení (createAndPoll)
    const run = await openai.beta.threads.runs.createAndPoll(activeThreadId, {
      assistant_id: assistantId,
    });

    // 5. Zpracování stavu Runa
    if (run.status === 'completed') {
      // Získání zpráv z vlákna (jsou řazeny od nejnovější po nejstarší)
      const messages = await openai.beta.threads.messages.list(activeThreadId);
      
      // Filtrace na nejnovější zprávu od asistenta
      const latestAssistantMessage = messages.data.find((msg) => msg.role === 'assistant');

      let responseText = '';
      if (latestAssistantMessage && latestAssistantMessage.content[0].type === 'text') {
        responseText = latestAssistantMessage.content[0].text.value;
      }

      // Návrat dat na frontend (včetně threadId pro budoucí persistenci)
      return NextResponse.json({
        response: responseText,
        threadId: activeThreadId,
      });

    } else if (run.status === 'requires_action') {
      // Zde bys v budoucnu obsluhoval volání funkcí (tool calls). 
      // Prozatím logujeme a notifikujeme admina.
      await sendTelegramNotification(`⚠️ Asistent vyžaduje externí akci (Tool Call) ve vlákně: ${activeThreadId}`);
      return NextResponse.json(
        { error: 'Asistent vyžaduje akci, která ještě není implementována.', threadId: activeThreadId }, 
        { status: 501 }
      );
    } else {
      // Stavy jako 'failed', 'cancelled', 'expired' atd.
      throw new Error(`Neočekávaný stav běhu (Run status): ${run.status}`);
    }

  } catch (error) {
    console.error('API Error /chat:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba.';
    
    // Notifikace majitele aplikace o kritickém selhání
    await sendTelegramNotification(`🚨 Došlo k chybě v API /api/chat:\n\n${errorMessage}`);

    return NextResponse.json(
      { error: 'Došlo k chybě při komunikaci s asistentem.' },
      { status: 500 }
    );
  }
}