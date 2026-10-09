// Web Speech API text-to-speech for Duolingo pronunciation
// Supports Spanish (es-ES / es-MX), Japanese (ja-JP), and automatic language detection

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function isJapaneseText(text: string): boolean {
  if (!text) return false;
  // Matches Hiragana, Katakana, and CJK Kanji
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

export function detectLanguage(text: string, defaultLang: string = "es-ES"): string {
  if (isJapaneseText(text)) {
    return "ja-JP";
  }
  return defaultLang;
}

export function speakText(text: string, lang?: string, rate: number = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech for zero-latency response

    // Auto-detect Japanese if not explicitly specified or if text contains kana/kanji
    const resolvedLang = (lang && !isJapaneseText(text)) ? lang : detectLanguage(text, lang || "es-ES");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = resolvedLang;
    utterance.rate = rate; // Configurable speech rate (0.9 default, 0.65 for slow turtle)

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const prefix = resolvedLang.toLowerCase().slice(0, 2);
    
    // Find best matching voice (preferring local/natural voices)
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
                  voices.find((v) => v.lang.toLowerCase().includes(prefix));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {}
}
