"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0D1B3E] flex flex-col justify-center items-center relative">
      {/* Předáváme funkci pro otevření chatu do Hero komponenty */}
      <Hero />
      
      {/* "Hack" pro propojení buttonu - pokud button v Hero jen loguje, 
          můžeš jednoduše přidat tuto pevnou pozici nebo upravit Hero */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 bg-[#3B82F6] text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all"
        >
          💬 Chat
        </button>
      )}

      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </main>
  );
}