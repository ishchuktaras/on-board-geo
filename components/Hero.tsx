// components/Hero.tsx
"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-5xl lg:text-7xl font-extrabold leading-tight"
        >
          Tradiční SEO umírá. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-cyan-400">
            Přivítejte GEO.
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-lg"
        >
          Lidé už nehledají v odkazech, ptají se umělé inteligence. Služba GEO (Generative Engine Optimization) zajistí, že modely jako ChatGPT nebo Perplexity budou doporučovat právě vaši značku.
        </motion.p>
        
        <motion.ul 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }} 
          className="space-y-3 text-gray-300"
        >
          <li>🧠 <strong className="text-white">AI Autorita:</strong> Naučíme LLM modely znát vaše produkty.</li>
          <li>🔍 <strong className="text-white">Nová pravidla:</strong> Klíčová slova nestačí, budujeme kontext.</li>
          <li>🚀 <strong className="text-white">Náskok před konkurencí:</strong> Buďte první odpovědí, kterou AI vygeneruje.</li>
        </motion.ul>
      </div>

      <div className="relative h-[400px] w-full rounded-2xl bg-[#13234d] border border-blue-900/50 overflow-hidden flex items-center justify-center shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-[#0D1B3E] to-[#0D1B3E]"></div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 border border-blue-500/30 rounded-full border-dashed" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-48 h-48 border border-blue-400/50 rounded-full border-dotted" />
          <div className="z-10 w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-purple-600 rounded-full shadow-[0_0_30px_#3B82F6] flex items-center justify-center font-bold text-xs">AI</div>
          <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
          <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]" />
          <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />
          <div className="absolute bottom-4 text-xs font-mono text-blue-400 tracking-widest">NEURAL NETWORK PROCESSING</div>
      </div>
    </section>
  );
}