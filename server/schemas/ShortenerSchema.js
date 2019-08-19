import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShortenerSchema = new Schema({ // благодаря mongoose можно использовать схемы для простой типизации документов(строк базы данных)
  originalUrl: { type: String, required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  visitsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Shortener', ShortenerSchema); // определяем модель с именем и привязкой к схеме