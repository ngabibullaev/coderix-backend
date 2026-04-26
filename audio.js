const express = require('express'); // Импортируем express
const path = require('path');

function Audio(app) {
  // Укажите путь к директории с аудио
  const audioDir = path.join(__dirname, "audio");

  // Обслуживайте статические файлы из директории audio
  app.use("/audio", express.static(audioDir));

  app.get("/anivar", (req, res) => {
    res.send(`
      <audio controls>
        <source src="/audio/Anivar.ogg" type="audio/ogg"> <!-- Исправленный MIME-тип -->
        Ваш браузер не поддерживает тег audio.
      </audio>
    `);
  });

  app.get("/gayazov", (req, res) => {
    res.send(`
      <audio controls>
        <source src="/audio/Gayazov.ogg" type="audio/ogg"> <!-- Исправленный MIME-тип -->
        Ваш браузер не поддерживает тег audio.
      </audio>
    `);
  });

  app.get("/insta", (req, res) => {
    res.send(`
      <audio controls>
        <source src="/audio/Insta.ogg" type="audio/ogg"> <!-- Исправленный MIME-тип -->
        Ваш браузер не поддерживает тег audio.
      </audio>
    `);
  });

  // Обработчик ошибок
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, error: err.message });
  });
}

module.exports = { Audio };
