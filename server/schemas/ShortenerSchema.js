import mongoose from 'mongoose';

const Schema = mongoose.set('useCreateIndex', true).Schema;

const ShortenerSchema = new Schema({ // благодаря mongoose можно использовать схемы для простой типизации документов(строк базы данных)
  originalUrl: { type: String, required: true },
  hash: { type: String, required: true },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '15d' },
  },
  visitsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Shortener', ShortenerSchema); // определяем модель с именем и привязкой к схеме