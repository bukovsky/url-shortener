import express from "express";
import cors from 'cors'; // разрешает использовать междоменные ajax запросы
import parse from 'url-parse';
import request from 'request';

import bodyParser from "body-parser";

import {serverPort, apiPrefix} from "../config/config.json";

import * as db from "./models/Shortener.js";

db.setUpConnection();

const app = express();
app.use(cors());
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
//  db.createUrl(req.body).then(() => res.send('Ссылка успешно добавлена'), err => res.send('Ошибка: '+err));
  try {
    var result = parse(req.body.originalLink, true),
        status = 200,
        response = ''; // The second argument for a query parsing
    request(req.body.originalLink, function (error, response, body) {
      if (error !== undefined && error !== null) {
        status = 400;
        response = 'URL is not valid';
        console.error('error:', error);
      }
      if (response && response.statusCode == 200) {
        status = 200;
        var hash = [...Array(8)].map(i=>(~~(Math.random()*36)).toString(36)).join(''),
            originalHost = req.headers.host,
            shortLink = apiPrefix + '/' + hash;
        response = {'hash': hash, 'shortLink': shortLink};
      }
      return res.status(status).send(response);
    });
  } catch (exception) {
    console.log(exception);
    return res.status(500).send('Unexpected error').end();
  }
});

// Маршрутизация
router.get('/:shortUrl', (req, res) => {
  
});

// Применяем маршрутизацию к приложению
app.use('/', router);