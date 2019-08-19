import mongoose from 'mongoose';

import '../schemas/ShortenerSchema';

import config from '../../config/config.json';

const Shortener = mongoose.model('Shortener');

export function setUpConnection() {
  mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true }); // Node попросил использовать useNewUrlParser, т.к. старый способ не будет поддерживаться в следующих версиях
}

export function getAllDocuments() {
  return Shortener.find();
}

export function deleteUrl(id) { // может понадобиться в будущем для удаления ссылки по истечении времени
  return Shortener.findById(id).remove();
}

export function deleteAllUrls() { 
  return Shortener.deleteMany();
}

export function incrementVisitsCount(id) { 
  return Shortener.updateOne({_id :id}, {$inc : {'visitsCount' : 1}});
}

export function findOriginalURL(url) {
  return Shortener.findOne({
      originalUrl: url
    }).exec();
}

export function createUrl(data) {
  const url = new Shortener({
    originalUrl: data.originalURL, 
    hash: data.hash,
    createdAt: new Date()
  });
  return url.save();
}

export function updateUrlById(data) {
  return Shortener.updateOne({ _id: data._id }, { hash: data.hash });
}

export function findHash(hash) {
  return Shortener.findOne({
    hash: hash
  }, 'originalUrl _id').exec();
}