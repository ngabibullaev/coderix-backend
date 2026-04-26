const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { Bot } = require("./bot");
const { Video } = require("./video");
const { Audio } = require("./audio");
const { Client } = require("./client");
const path = require('path');
require('dotenv').config();

const app = express();

// ============ ПРОСТОЙ CORS ============
app.use(cors({
  origin: 'https://coderix.ru', // ← только твой домен
  credentials: true
}));

// ============ ОБРАБОТКА OPTIONS ============
app.options('*', cors()); // ← без параметров

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Кодовые слова для доступа к странице /add
const secretCode1 = process.env.MY_SECRET_CODE_1;
const secretCode2 = process.env.MY_SECRET_CODE_2;

let loginAttempts = {};

// ============ МАРШРУТЫ ============
app.get('/', (req, res) => {
  // УБРАТЬ ручной CORS заголовок!
  // middleware cors() уже добавит его
  res.sendFile(path.join(__dirname, 'code.html'));
});

// Health check endpoint для мониторинга
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'coderix-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API информация
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Coderix API',
    version: '1.0.0',
    documentation: 'https://api.coderix.ru/docs',
    endpoints: {
      health: '/health',
      info: '/api/info'
    }
  });
});

Bot(app);
Video(app);
Audio(app);
Client(app);

app.post('/add', (req, res) => {
  const code1 = req.body.code1;
  const code2 = req.body.code2;

  const ipAddress = req.ip;
  
  console.log(`Попытка входа с IP: ${ipAddress}, Codes: ${code1}, ${code2}`);
  
  if (!loginAttempts[ipAddress]) {
    loginAttempts[ipAddress] = 1;
  } else {
    loginAttempts[ipAddress]++;
  }
  
  if (loginAttempts[ipAddress] > 5) {
    console.log(`Блокировка IP ${ipAddress} - превышено количество попыток`);
    res.status(403).json({ 
      error: "Превышено количество попыток ввода пароля.",
      attempts: loginAttempts[ipAddress]
    });
    return;
  }

  if (code1 === secretCode1 && code2 === secretCode2) {
    console.log(`Успешный вход с IP: ${ipAddress}`);
    res.sendFile(path.join(__dirname, 'index.html'));
    loginAttempts[ipAddress] = 0;
  } else {
    console.log(`Неудачная попытка входа с IP: ${ipAddress}`);
    res.status(403).json({ 
      error: "Неверный логин или пароль",
      remainingAttempts: 5 - loginAttempts[ipAddress]
    });
  }
});

// Обработка 404 ошибок
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Маршрут ${req.method} ${req.url} не найден`,
    timestamp: new Date().toISOString()
  });
});

// Обработка ошибок сервера
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так',
    timestamp: new Date().toISOString()
  });
});

// Запуск сервера
const PORT = process.env.PORT || 4444;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log("========================================");
  console.log("🚀 Сервер запущен!");
  console.log(`📡 Порт: ${PORT}`);
  console.log(`🌐 Хост: ${HOST}`);
  console.log(`🔗 API URL: http://${HOST}:${PORT}`);
  console.log(`🌍 Доступ через Nginx: https://api.coderix.ru`);
  console.log(`⚡ Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log("========================================");
  console.log("\n✅ CORS настроен для: https://coderix.ru");
  console.log("========================================");
});