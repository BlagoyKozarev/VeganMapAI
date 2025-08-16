
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
    document.getElementById("recognized").textContent = data.text;
    document.getElementById("response").textContent = data.reply;
    status.textContent = "✅ Готово";
    audioChunks = [];
  };

  mediaRecorder.start();
  setTimeout(() => mediaRecorder.stop(), 5000);
}
