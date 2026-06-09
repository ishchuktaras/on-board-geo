"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChatBox from "@/components/ChatBox";

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
        <div className="text-2xl font-bold tracking-tighter">GEO<span className="text-[#3B82F6]">Intelligence</span></div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-5xl lg:text-7xl font-extrabold leading-tight"
          >
            Oslovte zákazníky <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-cyan-400">
              ve vašem okolí.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-lg"
          >
            Služba GEO propojuje reálný pohyb lidí s přesně cílenou digitální reklamou. Zjistěte, kdo se pohybuje kolem vaší pobočky, a proměňte kolemjdoucí v platící zákazníky.
          </motion.p>
          
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-3 text-gray-300">
            <li>🎯 <strong className="text-white">Přesné cílení:</strong> Reklama jen těm, co jsou poblíž.</li>
            <li>📉 <strong className="text-white">Nulový odpad:</strong> Neplatíte za kliky z jiných měst.</li>
            <li>📈 <strong className="text-white">Vyšší ROI:</strong> Ideální pro retail, gastro a služby.</li>
          </motion.ul>
        </div>

        {/* Dynamický prvek - GEO Radar */}
        <div className="relative h-[400px] w-full rounded-2xl bg-[#13234d] border border-blue-900/50 overflow-hidden flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-[#0D1B3E] to-[#0D1B3E]"></div>
            <motion.div animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} className="absolute w-24 h-24 border-2 border-[#3B82F6] rounded-full" />
            <motion.div animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} className="absolute w-24 h-24 border-2 border-[#3B82F6] rounded-full" />
            <div className="z-10 w-4 h-4 bg-[#3B82F6] rounded-full shadow-[0_0_15px_#3B82F6]"></div>
            
            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]" />
            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]" />
            <div className="absolute bottom-4 text-xs font-mono text-blue-400 tracking-widest">LIVE LOCATION TRACKING</div>
        </div>
      </section>

      {/* Formulářová sekce */}
      <section className="max-w-3xl mx-auto px-6 mt-32">
        <div className="bg-[#1e2a4a] p-8 rounded-2xl border border-blue-900 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Zjistěte potenciál vaší lokality</h2>
          
          {!isFormSubmitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Vaše jméno" className="w-full bg-[#0D1B3E] border border-blue-900 p-3 rounded text-white outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required type="email" placeholder="Pracovní e-mail" className="w-full bg-[#0D1B3E] border border-blue-900 p-3 rounded text-white outline-none focus:border-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <textarea required placeholder="Jaký byznys provozujete a kde? Co je vaším cílem?" rows={4} className="w-full bg-[#0D1B3E] border border-blue-900 p-3 rounded text-white outline-none focus:border-blue-500" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              <button type="submit" className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded shadow-lg transition-all">Odeslat poptávku</button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-4">
              <h3 className="text-2xl font-bold text-green-400">Formulář byl odeslán!</h3>
              <p className="text-gray-300">Váš dotaz právě převzal náš AI analytik a spojuje se s vámi v pravém dolním rohu obrazovky.</p>
            </div>
          )}
        </div>
      </section>

      {/* Spuštění chatu po odeslání formuláře */}
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