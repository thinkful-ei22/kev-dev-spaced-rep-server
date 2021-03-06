const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  untranslated: {type: String, required: true},
  phonetic: {type: String, required: true},
  translation: [{type: String, required: true}]
});

wordSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.password;
  }
});

module.exports = mongoose.model('Word', wordSchema);