
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/audio', upload.single('audio'), async (req, res) => {
  const filePath = req.file.path;
  try {
    // Whisper транскрипция
    const audioData = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append('file', audioData);
    formData.append('model', 'whisper-1');
    formData.append('language', 'bg');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    const whisperData = await whisperRes.json();
    const userText = whisperData.text;

    // GPT-4o отговор
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Ти си гласов асистент, наречен VeganMap Асистент. Отговаряй много кратко и учтиво на български или английски. Помагай с намиране на веган ресторанти, ястия или препоръки. Не философствай. Използвай максимум 2 изречения. Отговаряй на същия език, на който е въпросът.'
          },
          {
            role: 'user',
            content: userText
          }
        ]
      })
    });

    const gptData = await gptRes.json();
    const reply = gptData.choices[0].message.content;

    res.json({ text: userText, reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('Грешка при обработка');
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
