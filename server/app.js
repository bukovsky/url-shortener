import express from "express";

import bodyParser from "body-parser";

import {serverPort} from "../config/config.json";

import * as db from "./models/Shortener.js";

db.setUpConnection();

const app = express();
const router = express.Router();

// Приложение
app.use( bodyParser.json() ); // указываем что нужно использовать парсер и выбираем тип json

app.listen(serverPort, ()=>{
  console.log(`Server is up and running on port ${serverPort}`); // `` - позволяет выводить переменные в ${}
});

app.get('/', (req, res) => {
  db.listOriginalUrls().then(data => res.send(data)); // благодаря mongoos запросы к ДБ возвращают промисы
});

app.post('/', (req, res) => {
  db.createUrl(req.body).then(() => res.send('Ссылка успешно добавлена'), err => res.send('Ошибка: '+err));
});

// Маршрутизация
router.get('/:shortUrl', (req, res) => {
  
});

// Применяем маршрутизацию к приложению
app.use('/', router);