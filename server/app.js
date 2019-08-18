import express from "express";
import cors from 'cors'; // разрешает использовать междоменные ajax запросы
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
  if (req.body.originalURL) {
    let originalURL = req.body.originalURL;
    db.findOriginalURL(originalURL).then(data => {
      if (data && data.hash) {
        let shortURL = apiPrefix + '/' + data.hash,
            clientResponse = {'hash': data.hash, 'shortURL': shortURL};
        return res.status(200).send(clientResponse);
      } else {
        try {
          request(originalURL, function (error, response, body) {
            if (error !== undefined && error !== null) {
              console.error('error:', error);
              return res.status(400).send('URL is not valid');
            }
            if (response && response.statusCode == 200) {
              let hash = [...Array(8)].map(i=>(~~(Math.random()*36)).toString(36)).join(''),
                  shortURL = apiPrefix + '/' + hash;
              let clientResponse = {'hash': hash, 'shortURL': shortURL};
              db.createUrl({
                originalURL: originalURL,
                hash: clientResponse.hash
              }).then(data => {
                return res.status(200).send(clientResponse);
              }, err => {
                console.log(err);
                return res.status(500).send('Unexpected database error');
              });
            }
          });
        } catch (exception) {
          console.log(exception);
          return res.status(500).send('Unexpected server error');
        }
      }
    });
  } else if (req.body.shortURL) {
    let shortURL = req.body.originalURL;
  }
});

// Маршрутизация
router.get('/:shortUrl', (req, res) => {
  
});

// Применяем маршрутизацию к приложению
app.use('/', router);