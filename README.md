# Dokumentace projektu: GEO Landing Page & AI Agent

## 1. Důležité odkazy
* **Live verze (Vercel):** https://on-board-geo.vercel.app/
* **GitHub repozitář:** https://github.com/ishchuktaras/on-board-geo.git

## 2. Architektura a volba technologií
* **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion. Zvoleno pro maximální kontrolu nad kódem, striktní mobile-first přístup, perfektní SEO a přístupnost.
* **Backend:** Next.js Route Handlers (`/api/chat`).
* **Persistence dat (Řešení zadání):** Záměrně nevyužívám žádnou klasickou relační ani NoSQL databázi. Jde o neefektivní over-engineering. Persistenci konverzace řeším nativně přes **OpenAI Assistants API**. Frontend si po prvním dotazu uloží vygenerované `thread_id` (do state/localStorage) a posílá ho s každou další zprávou. OpenAI tak samo drží kontext vlákna.
* **Notifikace a eskalace:** Telegram Bot API. Webhook je volán z API routy při zachycení specifického stavu nebo chyby. Zvoleno pro nejjednodušší integraci a okamžité doručení na mobilní zařízení klientů.

## 3. Záznam o využití AI (Prompting)
AI jsem nevyužíval jako generátor celého projektu, ale jako vývojářského parťáka pro izolované úkoly. Projekt byl rozdělen do 3 logických vláken:

1. **https://gemini.google.com/share/671c9b64f4d2** - Tvorba B2B textů, pochopení konceptu GEO a copywriting.
2. **https://gemini.google.com/share/c306402c1383** - Tvorba UI komponent (Tailwind, Framer Motion animace).
3. **https://gemini.google.com/share/49995d0ec0aa** - Logika pro backend, OpenAI API integrace a Telegram webhook.

**Ukázka klíčového promptu (Backend):**
> "Navrhni Next.js Route Handler pro komunikaci s OpenAI Assistants API. Zásadní architektonické rozhodnutí: NEBUDEME používat databázi pro ukládání historie. K persistenci využijeme nativní 'Threads'. Frontend bude posílat `threadId`. Přidej funkci pro odeslání notifikace na Telegram přes Bot API při chybě."

## 4. Časový rozpis (cca 6 hodin)
* **1.0 h** - Analýza zadání, setup projektu, Vercel deploy, nastavení Telegram bot infrastruktury a `.env`.
* **1.5 h** - Návrh a kódování UI (Landing page, barvy, texty, Framer animace).
* **2.0 h** - Implementace AI Agenta (API routa, OpenAI thread management, Telegram eskalace).
* **1.5 h** - Propojení frontendu s API, debugging, finalizace a sepsání dokumentace.

## 5. Co bych udělal jinak (Další fáze)
Pro produkční nasazení bych přidal **Zod** pro striktní validaci vstupů z formuláře na backendu. Dále bych nasadil Redis pro rate-limiting API, abych ochránil projekt před vyčerpáním OpenAI kreditů, a doimplementoval ukládání získaných leadů přímo do CRM klienta přes webhook.

---

## Část B: Zkušenosti s tvorbou webů
Jsem OSVČ, tvořím weby a aplikace na míru. Zastávám strategický přístup s důrazem na discovery fázi a reálné ROI pro klienta. Můj primární tech stack je Next.js, Tailwind a moderní headless řešení. Kód píšu čistě, s ohledem na SEO a přístupnost. Mám zkušenosti s vývojem SaaS řešení (např. systém APIS pro beauty segment) i s budováním firemních identit s napojením na automatizace. K vývoji přistupuji racionálně, bez iluzí – zajímá mě stabilita kódu a byznysový výsledek.