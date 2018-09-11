const express = require('express');


const router = express.Router();


const someWords = [
  {
    word: 'いち',
    phonetic: 'ichi',
    translation: 'one'
  },
  {
    word: 'に',
    phonetic: 'ni',
    translation: 'two'
  },
  {
    word: 'さん',
    phonetic: 'san',
    translation: 'three'
  },
  {
    word: 'よん',
    phonetic: 'yon',
    translation: 'four'
  },
  {
    word: 'ご',
    phonetic: 'go',
    translation: 'five'
  },

];

router.get('/random', (req, res, next)=>{
  const wordIdx = Math.floor(Math.random()*someWords.length);

  res.json(someWords[wordIdx]);

});

router.get('/:id', (req, res, next)=>{

});


module.exports = router;