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

app.post('/', (req, res) => {
  if (req.body.type == "getLinkFromOriginal") {
    let originalURL = req.body.originalURL;
    db.findOriginalURL(originalURL).then(data => {
      if (data && data.hash) {
        let shortURL = apiPrefix + '/' + data.hash,
            clientResponse = {'hash': data.hash, 'shortURL': shortURL, 'notifications': 'Short link is loaded from base'};
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
                  shortURL = apiPrefix + '/' + hash,
                  clientResponse = {'hash': hash, 'shortURL': shortURL};
              db.createUrl({
                originalURL: originalURL,
                hash: clientResponse.hash
              }).then(data => {
                clientResponse.notifications = 'Short link is successfully generated';
                return res.status(200).send(clientResponse);
              }, err => {
                console.error('error:', error);
                return res.status(500).send('Unexpected database error');
              });
            } else {
              return res.status(400).send('Resource is not found');
            }
          });
        } catch (exception) {
          console.error('error:', exception);
          return res.status(500).send('Unexpected server error');
        }
      }
    });
  } else if (req.body.type == "getLinkFromHash") {
    let shortURL = apiPrefix + '/' + req.body.hash,
        clientResponse = {'shortURL': shortURL},
        originalURL = req.body.originalUrl;
    db.findHash(req.body.hash).then(data => {
      if (data) {
        return res.status(400).send('This short code is already attached');
      } else {
        if (req.body.hash == '')
          return res.status(400).send('Short code is empty');
        if (originalURL) {
          request(originalURL, function (error, response, body) {
            if (error !== undefined && error !== null) {
              console.error('error:', error);
              return res.status(400).send('URL is not valid');
            }
            if (response && response.statusCode == 200) {
              db.findOriginalURL(originalURL).then(data => {
                if (data && data._id) {
                  db.updateUrlById({
                    _id: data._id,
                    hash: req.body.hash
                  }).then(data => {
                    clientResponse.notifications = 'Short code is successfully replaced';
                    return res.status(200).send(clientResponse);
                  }, err => {
                    console.error('error:', error);
                    return res.status(500).send('Unexpected database error');
                  });
                } else {
                  db.createUrl({
                    originalURL: req.body.originalUrl,
                    hash: req.body.hash
                  }).then(data => {
                    clientResponse.notifications = 'Short link is successfully generated';
                    return res.status(200).send(clientResponse);
                  }, err => {
                    console.error('error:', err);
                    return res.status(500).send('Unexpected database error');
                  });
                }
              }, err => {
                console.error('error:', error);
                return res.status(500).send('Unexpected database error');
              });
            } else {
              return res.status(400).send('Resource is not found');
            }
          });
        } else {
          return res.status(400).send('Original URL is empty');
        }
      }
    }, err => {
      console.error('error:', error);
      return res.sendStatus(400);
    });
  }
});

// Маршрутизация
router.get('/:hash', (req, res) => {
  db.findHash(req.params.hash).then(data => {
    if (data && data.originalUrl) {
      res.redirect(data.originalUrl);
    } else {
      return res.status(404).send('404: Page not found');
    }
  }, err => {
    console.log(err);
    return res.sendStatus(500);
  });
});

router.get('/', (req, res) => {
  res.redirect('http://localhost:8090/')
});

// Применяем маршрутизацию к приложению
app.use('/', router);