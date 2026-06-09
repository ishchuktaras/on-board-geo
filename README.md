# Dokumentace projektu: GEO Landing Page & AI Agent

## 1. Důležité odkazy
* **Live verze (Vercel):** https://on-board-geo.vercel.app/
* **GitHub repozitář:** https://github.com/ishchuktaras/on-board-geo.git

## 2. Architektura a volba technologií
* **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion. Zvoleno pro maximální kontrolu nad kódem, striktní mobile-first přístup, perfektní SEO a přístupnost.
* **Backend & LLM:** Next.js Route Handlers (`/api/chat`). Původně zamýšlené placené OpenAI API jsem nahradil modelem **Google Gemini 1.5 Flash**. Důvodem byla optimalizace nákladů a extrémně rychlá odezva pro tento konkrétní use-case.
* **Persistence dat (Řešení zadání):** Záměrně nevyužívám žádnou klasickou relační ani NoSQL databázi. Jde o neefektivní over-engineering. Backend je plně *stateless*. Persistenci řeším architektonicky na straně klienta – celá historie konverzace se ukládá do `localStorage` a s každým odesláním se předává API routě. Tímto přístupem je zajištěna 100% persistence při refreshi okna, s nulovými nároky na backendovou infrastrukturu.
* **Notifikace a eskalace (Human-in-the-loop):** Telegram Bot API. Webhook je volán z API routy při detekci tagu `[ESKALACE]`, který AI vygeneruje, pokud nezná odpověď nebo si klient vyžádá člověka.

## 3. Záznam o využití AI (Prompting)
AI jsem nevyužívala jako generátor celého projektu, ale jako vývojářského parťáka pro izolované úkoly. Projekt byl rozdělen do 3 logických vláken:

1. **https://gemini.google.com/share/671c9b64f4d2** - Pochopení konceptu GEO a copywriting.
2. **https://gemini.google.com/share/c306402c1383** - Tvorba UI komponent (Tailwind, Framer animace).
3. **https://gemini.google.com/share/49995d0ec0aa** - Prvotní návrh backendu a Telegram webhooku.

*Poznámka k vývoji: Odkazy výše reflektují prvotní návrh architektury. Během implementace jsem se rozhodl provést architektonický pivot na Gemini API (stateless přístup k persistenci). Přepis logiky a nastavení promptů přímo do kódu jsem již realizoval samostatně.*

## 4. Časový rozpis (cca 6 hodin)
* **1.0 h** - Analýza zadání, setup projektu, Vercel deploy, nastavení Telegram bot infrastruktury a `.env`.
* **1.5 h** - Návrh a kódování UI (Landing page, barvy, texty, Framer animace).
* **2.0 h** - Implementace AI Agenta (API routa, Gemini integrace, stateless persistence, Telegram eskalace).
* **1.5 h** - Propojení frontendu s API, debugging, refaktoring konceptu a sepsání dokumentace.

## 5. Co bych udělal jinak (Další fáze)
Pro produkční nasazení bych přidal **Zod** pro striktní validaci vstupů z formuláře na backendu. Nasadil bych Redis pro rate-limiting API, abych ochránil projekt před zneužitím, a doimplementoval bych ukládání získaných leadů přímo do CRM klienta přes webhook.

---

## Část B: Zkušenosti s tvorbou webů a přístup k vývoji

Jsem OSVČ a od začátku své kariéry se striktně zaměřuji na vývoj webů a aplikací na míru pomocí moderního JavaScript/TypeScript ekosystému. K vývoji přistupuji racionálně, jako inženýr – zajímá mě čistá architektura, stabilita kódu a byznysový výsledek.

**1. Zkušenosti s krabicovými řešeními (WordPress, Shoptet, Shopify, Framer, Webflow)**
Budu naprosto upřímný: s těmito nástroji nemám praktické zkušenosti a nepracuji s nimi. Záměrně jsem se vyhnul učení se klikání v page builderech a administracích CMS systémů. Místo toho jsem veškerý svůj čas a energii investoval do hlubokého pochopení programování a vlastního kódu (React, Next.js, Node.js). Volím tento přístup proto, že mi dává absolutní kontrolu nad výkonem, bezpečností a SEO, a umožňuje mi tvořit komplexní SaaS aplikace nebo nativní integrace s AI, kde krabicová řešení naráží na své limity.

**2. Můj typický postup (Od briefu po nasazení)**
1. **Discovery fáze:** Než napíšu řádek kódu, musím znát cíl. Kdo je koncový uživatel? Jaké je ROI projektu?
2. **Návrh architektury:** Výběr optimálního stacku. Můj standard je Next.js (App Router), Tailwind CSS, TypeScript. Data stavím na moderních headless řešeních (např. Sanity) nebo vlastních databázích.
3. **Vývoj:** Píšu čistý kód. Striktně mobile-first přístup. Využívám komponentový vývoj pro maximální znovupoužitelnost.
4. **Nasazení a infrastruktura:** CI/CD pipeline přes Vercel. Automatizace webhooků (např. odesílání leadů do Telegramu nebo CRM klientů).

**3. Co mě na tvorbě webů baví a co ne**
* **Co mě baví:** Řešení reálných byznysových problémů logikou a kódem. Návrh architektury, integrace AI modelů do reálného využití, práce s daty a optimalizace výkonu. Baví mě ta moc vytvořit z prázdného souboru plně funkční aplikaci s vysokou přidanou hodnotou.
* **Co mě nebaví:** Omezující mantinely no-code nástrojů, závislost na pluginech třetích stran, "lepení" vizuálu pomocí drag-and-drop editorů a práce bez jasně definovaného zadání.