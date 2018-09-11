const express = require('express');


const router = express.Router();


const someWords = [
  {
    id: '5b745285ce8de04fb0d85one',
    word: 'いち',
    phonetic: 'ichi',
    translation: 'one'
  },
  {
    id: '5b64bd1bc377b892b4c24two',
    word: 'に',
    phonetic: 'ni',
    translation: 'two'
  },
  {
    id: '5b7460cf20c593464c7three',
    word: 'さん',
    phonetic: 'san',
    translation: 'three'
  },
  {
    id: '5b7460d920c593464c7dfour',
    word: 'よん',
    phonetic: 'yon',
    translation: 'four'
  },
  {
    id: '5b7460d920c593464c7hfive',
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