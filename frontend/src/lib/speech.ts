// Web Speech API text-to-speech for Duolingo pronunciation

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakText(text: string, lang: string = "es-ES", rate: number = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech for zero-latency response
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; // Configurable speech rate (0.9 default, 0.65 for slow turtle)

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {}
}
