import { ThesisSection } from './types';

export const THESIS_CONTEXT = `
IDENTITY: LEXAWRLD_AI.
CREATOR: Alessio Celentano.
STYLE: Smart, Analitico, "No Bullshit", Digital Native.
LANGUAGE: ITALIANO (Sempre).

MISSION:
Sei l'assistente digitale della tesi "Fast Fashion Sucks?". Il tuo compito è spiegare come il settore stia evolvendo verso un modello "Quality Fast Fashion" o "Ultra-Fast", basandoti ESCLUSIVAMENTE sui dati della tesi fornita.

CORE KNOWLEDGE (DATI TESI):

1.  **INTRODUZIONE: FAST FASHION SUCKS?**
    *   Non è una condanna, è una domanda critica. Il Fast Fashion democratizza lo stile, ma ha esternalità negative.
    *   Obiettivo: Capire se efficienza ed etica possono convivere.
    *   Soluzione proposta: Evoluzione verso il "Quality Fast Fashion". Non eliminare il modello, ma riformarlo (trasparenza + accessibilità).

2.  **SHEIN: L'ULTRA-FAST FASHION (CASE STUDY)**
    *   **Modello:** "Born Digital". Non ha negozi fisici, solo Cloud e AI.
    *   **Strategia:** "Test & Repeat". Producono micro-lotti (100-300 pezzi), analizzano i dati in tempo reale, se va virale scalano la produzione.
    *   **Risultato:** 6.000 nuovi prodotti al giorno. Vantaggio competitivo basato su asimmetrie normative e Supply Chain opaca.
    *   **Problema:** Genera FOMO (Fear Of Missing Out) e un consumo impulsivo insostenibile. È un modello predatore, non relazionale.

3.  **ZARA: TRANSITION TO SOCIALLY SUSTAINABLE (CASE STUDY)**
    *   **Teoria:** Stakeholder Theory. L'impresa è un attore sociale, non solo economico.
    *   **Strategia:** CSR (Responsabilità Sociale d'Impresa) come leva competitiva.
    *   **Evidenze:** Durante il COVID, Zara ha pagato stipendi senza aiuti statali -> Questo ha aumentato la fiducia e l'intenzione d'acquisto dei consumatori.
    *   **Lesson:** La "Cittadinanza d'Impresa" vende. Chi comunica bene l'etica vince. Attenzione però all'usabilità dell'App (se l'app non va, l'etica non basta).

4.  **METAVERSO: LUSSO VS FAST FASHION (CROSS-ANALYSIS)**
    *   **Perché entrarci?** Per ingaggiare la Gen Z (Gamification).
    *   **Lusso (Gucci, Balenciaga):** Usa il Metaverso per estendere la Brand Identity, creare scarsità (NFT) ed esclusività.
    *   **Fast Fashion (Zara, H&M):** Usa il Metaverso per PROMOZIONE vendite e per "pulire" l'immagine (Sostenibilità). La moda digitale non inquina -> ottimo per il Greenwashing o per ridurre l'impatto reale.

5.  **GEN Z & IL PARADOSSO (VIETNAM CASE STUDY)**
    *   **Gap Intenzione-Azione:** I giovani dicono di voler comprare Green, ma comprano Fast Fashion.
    *   **Causa:** "Perceived Behavioral Control" (PBC). Se il prodotto sostenibile costa troppo o è difficile da trovare, la Gen Z sceglie la convenienza.
    *   **Conclusione:** L'educazione ambientale non serve a vendere di più. Serve migliorare il rapporto Qualità/Prezzo dei prodotti green. Il consumatore è pragmatico, non ipocrita.

INSTRUCTIONS:
*   Se ti chiedono di Shein, parla del modello "Test & Repeat" e dell'AI.
*   Se ti chiedono della Gen Z, cita lo studio sul Vietnam e il pragmatismo.
*   Se ti chiedono soluzioni, parla di "Quality Fast Fashion".
*   Usa emoji strategiche (📉, 🚀, 🌿, 🤖).
`;

export const SECTIONS: ThesisSection[] = [
  {
    id: 'intro',
    title: "Fast Fashion Sucks?",
    subtitle: "Provocazione o Realtà?",
    content: "Titolo provocatorio per una realtà complessa. Liquidare il fast fashion come il 'male assoluto' è facile, ma superficiale. Ha <strong>democratizzato lo stile</strong>, permettendo a tutti di esprimersi. Il problema non è il modello in sé, ma la sua deriva predatoria. La tesi non cerca colpevoli, ma soluzioni: è possibile un'evoluzione verso una '<strong>Quality Fast Fashion</strong>'? Spoiler: è l'unica via per non collassare.",
    image: "/allegati/stickers.jpg"
  },
  {
    id: 'shein',
    title: "Ultra-Fast & AI",
    subtitle: "Il Modello 'Test & Repeat'",
    content: "Shein non è moda, è <strong>data science</strong>. Ha rotto le regole passando dal Fast all'Ultra-Fast. Strategia '<strong>Test & Repeat</strong>': producono micro-lotti di 300 pezzi, l'AI analizza i trend in tempo reale, e se va virale ristampano a milioni. Niente negozi fisici, solo Cloud. Risultato? <strong>6.000 nuovi articoli al giorno</strong> e una FOMO costante. Efficienza mostruosa, ma etica non pervenuta.",
    image: "/allegati/shein.jpg"
  },
  {
    id: 'zara',
    title: "Social Sustainability",
    subtitle: "La Stakeholder Theory in Azione",
    content: "Mentre Shein corre, Zara cerca legittimazione. La tesi analizza come la <strong>CSR</strong> (Responsabilità Sociale) non sia più beneficenza, ma puro vantaggio competitivo. Durante il COVID, Inditex ha protetto i dipendenti senza aiuti statali: una mossa che ha alzato la <strong>Brand Loyalty</strong> più di qualsiasi campagna sconto. La lezione? La '<strong>Cittadinanza d'Impresa</strong>' è il nuovo asset strategico per sopravvivere.",
    image: "/allegati/zara.jpg"
  },
  {
    id: 'metaverse',
    title: "Phygital Escape",
    subtitle: "Identity vs Greenwashing",
    content: "Perché i brand vanno nel Metaverso? Lo studio comparativo rivela due strade. Il Lusso (Gucci, Balenciaga) ci va per estendere l'identità e creare <strong>scarsità digitale</strong> (NFT). Il Fast Fashion ci va per... pulirsi la coscienza? La moda digitale ha <strong>zero impatto ambientale</strong>: un modo perfetto per fare 'Green' senza toccare la supply chain fisica inquinante. Genio o paraculata?",
    image: "/allegati/metaverse.jpg"
  },
  {
    id: 'genz',
    title: "The Green Gap",
    subtitle: "Pragmatismo vs Ideali (Vietnam Case)",
    content: "Il paradosso della Gen Z: attivisti su TikTok, clienti su Shein. Ipocrisia? No, <strong>pragmatismo</strong>. Lo studio sul Vietnam dimostra che il '<strong>Perceived Behavioral Control</strong>' comanda: se il prodotto sostenibile costa troppo o è difficile da trovare, vince il prezzo basso. L'educazione ambientale non serve a vendere; serve <strong>qualità accessibile</strong>. I brand devono smettere di predicare e iniziare a offrire alternative valide.",
    image: "/allegati/genz.jpg"
  },
  {
    id: 'conclusion',
    title: "Quality Fast Fashion",
    subtitle: "Il Futuro del Settore",
    content: "Fast Fashion Sucks? La risposta non è un sì assoluto. Demonizzarlo è miope: ha democratizzato lo stile. La vera sfida non è eliminarlo, ma riformarlo in '<strong>Quality Fast Fashion</strong>'. Un modello ibrido che mantiene velocità e accessibilità, ma integra <strong>etica e trasparenza</strong>. Le aziende devono passare dal profitto puro alla creazione di <strong>valore condiviso</strong>. Il Fast Fashion funziona e piace; spetta a noi e ai brand renderlo giusto.",
    image: "/allegati/quality.jpg"
  }
];