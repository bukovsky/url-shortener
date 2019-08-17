import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShortenerSchema = new Schema({ // благодаря mongoose можно использовать схемы для простой типизации документов(строк базы данных)
  originalUrl: { type: String },
  shortUrl: { type: String },
  createdAt: { type: Date }
});

module.exports = mongoose.model('Shortener', ShortenerSchema); // определяем модель с именем и привязкой к схеме