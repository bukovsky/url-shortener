import mongoose from 'mongoose';

import '../schemas/ShortenerSchema';

import config from '../../config/config.json';

const Shortener = mongoose.model('Shortener');

export function setUpConnection() {
  mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true }); // Node попросил использовать useNewUrlParser, т.к. старый способ не будет поддерживаться в следующих версиях
}

export function listOriginalUrls() {
  return Shortener.find(); // возвращаем промисы
}

export function createUrl(data) {
  const url = new Shortener({
    originalUrl: data.orig, 
    shortUrl: data.short,
    createdAt: new Date()
  });
  return url.save(); // возвращаем промисы
}

export function deleteUrl(id) { // может понадобиться в будущем для удаления ссылки по истечении времени
  return Shortener.findById(id).remove(); // возвращаем промисы
}