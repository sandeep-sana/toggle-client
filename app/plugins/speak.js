export default defineNuxtPlugin((nuxtApp) => {
  let voices = [];
  let voicesReady = false;

  // Load voices properly
  const initVoices = () => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;

      const load = () => {
        voices = synth.getVoices();
        if (voices.length > 0) {
          voicesReady = true;
          resolve(voices);
        } else {
          setTimeout(load, 200);
        }
      };

      load();
    });
  };

  // Call once on plugin init
  if (process.client) {
    initVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      voicesReady = true;
    };
  }

  const speak = async (message, lang = "hi-IN") => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    if (!voicesReady) {
      await initVoices();
    }

    const synth = window.speechSynthesis;
    console.log(voices)

    // Choose best voice
    const selectedVoice =
      voices.find(v => v.lang === lang) ||
      voices.find(v => /Google हिन्दी/i.test(v.name)) ||
      voices[0];

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice?.lang || lang;
    utterance.rate = 1;
    utterance.pitch = 1;

    synth.cancel(); // clear previous speech
    synth.speak(utterance);
  };

  nuxtApp.provide("speak", speak);
});
