const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

function Client(app) {
    // Middleware для обработки статических файлов
    app.use(express.static('client'));

    // Путь к вашему JSON файлу
    const filePath = path.join(__dirname, 'data.json');

    // Роут для получения данных
    app.get('/data', (req, res) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Ошибка чтения файла');
            }
            res.json(JSON.parse(data).reverse());
        });
    });

    app.post('/addData', (req, res) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Ошибка чтения файла');
            }
            
            const dataArray = JSON.parse(data);

            // Генерация уникального ID
            const id = dataArray.length > 0 ? dataArray[dataArray.length - 1].id + 1 : 1;
            
            const newData = { id, name: req.body.name, social: req.body.social };
            dataArray.push(newData);

            fs.writeFile(filePath, JSON.stringify(dataArray), (err) => {
                if (err) {
                    return res.status(500).send('Ошибка записи файла');
                }
            });
        });
    });
}

module.exports = { Client };
