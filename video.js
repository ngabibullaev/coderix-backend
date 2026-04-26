const express = require('express'); // Добавьте этот импорт
const path = require('path');

function Video(app) {
  // Укажите путь к директории с видео
  const videosDir = path.join(__dirname, "videos");

  // Обслуживайте статические файлы из директории videos
  app.use("/videos", express.static(videosDir));

  app.get("/videos", (req, res) => {
    res.send(`
      <h1>Воспроизведение видео</h1>
      <video width="640" height="480" controls>
        <source src="/videos/video.webm" type="video/webm">
        Ваш браузер не поддерживает тег video.
      </video>
    `);
  });

  // Обработчик ошибок
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, error: err.message });
  });
}

module.exports = { Video };
