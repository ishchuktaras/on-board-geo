"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatBox({ onClose, initialMessage, userName, userEmail }: { onClose?: () => void, initialMessage?: string, userName?: string, userEmail?: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  
  const [threadId, setThreadId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("on-board-thread-id");
    }
    return null;
  });

  const sendMessage = async (overrideMessage?: string) => {
    const textToSend = overrideMessage || input;
    if (!textToSend.trim()) return;

    if (!overrideMessage) setInput("");
    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: textToSend, 
          threadId,
          isFirstMessage: !!overrideMessage,
          userName,
          userEmail
        }),
      });

      const data = await res.json();

      // Zpracování chyby ze serveru (ochrana před prázdnou bublinou)
      if (!res.ok || data.error) {
        setMessages((prev) => [...prev, { role: 'ai', content: `🚨 Systémová zpráva: ${data.error || 'Spojení se serverem selhalo.'}` }]);
        return;
      }

      if (data.threadId) {
        setThreadId(data.threadId);
        localStorage.setItem("on-board-thread-id", data.threadId);
      }

      setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error("Chyba:", error);
      // Zpracování chyby sítě (když API vůbec neodpoví)
      setMessages((prev) => [...prev, { role: 'ai', content: `🚨 Systémová chyba: Aplikaci se nepodařilo odeslat dotaz.` }]);
    } finally {
      setLoading(false);
    }
  };

  // Automatické odeslání zprávy z formuláře při otevření chatu
  useEffect(() => {
    if (initialMessage && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      // Odložení řeší konflikt synchronního updatu state v efektu
      setTimeout(() => {
        sendMessage(initialMessage);
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-[#0D1B3E] border border-blue-900 shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 z-50">
      <div className="p-4 bg-[#1e2a4a] flex justify-between items-center text-white font-bold">
        <span>AI Asistent</span>
        {onClose && <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-[#3B82F6] ml-auto text-white max-w-[80%]' : 'bg-gray-700 mr-auto text-white max-w-[80%]'}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">Asistent zpracovává data...</div>}
      </div>

      <div className="p-4 border-t border-blue-900 flex gap-2">
        <input 
          className="flex-1 bg-transparent border border-blue-900 text-white p-2 rounded outline-none focus:border-blue-500"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Pokračovat v konverzaci..."
        />
        <button onClick={() => sendMessage()} className="bg-[#3B82F6] text-white px-4 py-2 rounded">Poslat</button>
      </div>
    </div>
  );
}