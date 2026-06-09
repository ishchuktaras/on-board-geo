"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatBox({ onClose, initialMessage, userName, userEmail }: { onClose?: () => void, initialMessage?: string, userName?: string, userEmail?: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("geo-chat-history");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    localStorage.setItem("geo-chat-history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (overrideMessage?: string) => {
    const textToSend = overrideMessage || input;
    if (!textToSend.trim()) return;

    if (!overrideMessage) setInput("");
    const currentHistory = [...messages];
    
    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: currentHistory, isFirstMessage: !!overrideMessage, userName, userEmail }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setMessages((prev) => [...prev, { role: 'ai', content: `🚨 Systémová zpráva: ${data.error || 'Spojení se serverem selhalo.'}` }]);
        return;
      }
      setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: `🚨 Systémová chyba: Aplikaci se nepodařilo odeslat dotaz.` }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialMessage && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => sendMessage(initialMessage), 0);
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-[#0D1B3E] border border-blue-900 shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 z-50">
      <div className="p-4 bg-[#1e2a4a] flex justify-between items-center text-white font-bold">
        <span>AI Asistent (Gemini)</span>
        <div className="flex gap-4">
          <button onClick={() => { setMessages([]); localStorage.removeItem("geo-chat-history"); }} className="text-xs text-gray-400 hover:text-red-400">Smazat</button>
          {onClose && <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-[#3B82F6] ml-auto text-white max-w-[80%]' : 'bg-gray-700 mr-auto text-white max-w-[80%]'}`}>{m.content}</div>
        ))}
        {loading && <div className="text-gray-400 text-sm">Asistent zpracovává data...</div>}
      </div>
      <div className="p-4 border-t border-blue-900 flex gap-2">
        <input className="flex-1 bg-transparent border border-blue-900 text-white p-2 rounded outline-none focus:border-blue-500" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Pokračovat..." />
        <button onClick={() => sendMessage()} className="bg-[#3B82F6] text-white px-4 py-2 rounded">Poslat</button>
      </div>
    </div>
  );
}