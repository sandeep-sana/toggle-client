export default defineNuxtPlugin((nuxtApp) => {

    const speak = (message) => {
        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = 'hi-IN';
        speech.volume = 1;   // Volume: 0 to 1
        speech.rate = 1;     // Speed: 0.1 to 10
        speech.pitch = 1;    // Pitch: 0 to 2
        window.speechSynthesis.speak(speech);
    }

    // Provide the speak function globally
    nuxtApp.provide('speak', speak);
});
