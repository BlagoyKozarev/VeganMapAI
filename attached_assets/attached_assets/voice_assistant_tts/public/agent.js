
let mediaRecorder;
let audioChunks = [];

async function recordAudio() {
  const status = document.getElementById("status");
  status.textContent = "🎙️ Записвам...";

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append("audio", blob);

    status.textContent = "⏳ Изпращам към сървъра...";

    const res = await fetch("/api/audio", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    const recognizedText = data.text;
    const responseText = data.reply;

    document.getElementById("recognized").textContent = recognizedText;
    document.getElementById("response").textContent = responseText;
    status.textContent = "✅ Готово";

    // Автоматично TTS на отговора
    const utterance = new SpeechSynthesisUtterance(responseText);

    // Засичане на език
    const isBulgarian = /[а-яА-Я]/.test(responseText);
    utterance.lang = isBulgarian ? "bg-BG" : "en-US";
    speechSynthesis.speak(utterance);

    audioChunks = [];
  };

  mediaRecorder.start();
  setTimeout(() => mediaRecorder.stop(), 5000);
}
