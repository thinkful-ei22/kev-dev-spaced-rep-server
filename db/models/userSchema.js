const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {type: String, require: true},
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  progressHead: {type: Number, required: true}, //always ++ by one, references idx in progress
  progress: [
    {
      wordId: {type: mongoose.Schema.Types.ObjectId, required: true},
      untranslated: {type: String, required: true},
      phonetic: {type: String, required: true},
      translation: [{type: String, required: true}],
      m: {type: Number, required: true}, //m+=2 on success, m=1 on wrong. Determines how far to shove
      next: {type: Number, required: true} //Refers to index in this array
    }
  ]
});

userSchema.set('timestamps', true);

userSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.password;
  }
});

// Note: Use `function` (not an `arrow function`) to allow setting `this`
userSchema.methods.validatePassword = function (pwd) {
  const currentUser = this;
  return bcrypt.compare(pwd, currentUser.password);
};

userSchema.statics.hashPassword = function (pwd) {
  return bcrypt.hash(pwd, 10);
};

module.exports = mongoose.model('User', userSchema);