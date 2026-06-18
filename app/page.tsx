"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import Hero from "@/components/Hero"; // Import tvé nové komponenty

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.message.trim()) {
      setIsFormSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D1B3E] text-white font-sans selection:bg-[#3B82F6] selection:text-white relative pb-20">
      <header className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-blue-900/50">
        <div className="text-2xl font-bold tracking-tighter">GEO<span className="text-[#3B82F6]">Optima</span></div>
      </header>

      <Hero />

      <section className="max-w-3xl mx-auto px-6 mt-32">
        <div className="bg-[#1e2a4a] p-8 rounded-2xl border border-blue-900 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Získejte GEO audit vaší značky</h2>
          
          {!isFormSubmitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Vaše jméno" className="w-full bg-[#0D1B3E] border border-blue-900 p-3 rounded text-white outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required type="url" placeholder="URL vašeho webu" className="w-full bg-[#0D1B3E] border border-blue-900 p-3 rounded text-white outline-none focus:border-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <textarea required placeholder="Na jaké dotazy by vás měla AI doporučovat?" rows={4} className="w-full bg-[#0D1B3E] border border-blue-900 p-3 rounded text-white outline-none focus:border-blue-500" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              <button type="submit" className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded shadow-lg transition-all">Spustit AI analýzu</button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-4">
              <h3 className="text-2xl font-bold text-green-400">Data se zpracovávají!</h3>
              <p className="text-gray-300">Náš AI analytik právě prověřuje viditelnost vašeho webu. Spojuje se s vámi v pravém dolním rohu obrazovky.</p>
            </div>
          )}
        </div>
      </section>

      {isFormSubmitted && (
        <ChatBox 
          initialMessage={formData.message} 
          userName={formData.name}
          userEmail={formData.email}
          onClose={() => setIsFormSubmitted(false)} 
        />
      )}
    </main>
  );
}