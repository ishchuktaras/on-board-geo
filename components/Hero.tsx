// components/Hero.tsx
"use client";

import { motion } from "framer-motion";

export default function Hero() {
  const handleChatOpen = () => {
    console.log("Otevřít chat");
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section 
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
      aria-labelledby="hero-heading"
    >
      <motion.h1
        id="hero-heading"
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Zástupný text pro hlavní nadpis
      </motion.h1>

      <motion.h2
        className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium mb-10 max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        Toto je zástupný text pro H2. Doplňuje hlavní myšlenku, vysvětluje přidanou hodnotu a plynule navádí uživatele k hlavní akci.
      </motion.h2>

      <motion.button
        type="button"
        onClick={handleChatOpen}
        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/50 active:scale-95"
        aria-label="Otevřít chat s podporou"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      >
        Začít konverzaci
      </motion.button>
    </section>
  );
}