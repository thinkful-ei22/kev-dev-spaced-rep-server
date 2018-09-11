const express = require('express');

// const Word = require('../db/models/wordSchema');

const router = express.Router();

//temp dummy data
const someWords = [
  {
    id: '5b745285ce8de04fbwatashi',
    untranslated: 'わたし',
    phonetic: 'watashi',
    translation: ['me', 'I', 'myself']
  },
  {
    id: '5b745285ce8de04fb0d85one',
    untranslated: 'いち',
    phonetic: 'ichi',
    translation: ['one']
  },
  {
    id: '5b64bd1bc377b892b4c24two',
    untranslated: 'に',
    phonetic: 'ni',
    translation: ['two']
  },
  {
    id: '5b7460cf20c593464c7three',
    untranslated: 'さん',
    phonetic: 'san',
    translation: ['three']
  },
  {
    id: '5b7460d920c593464c7dfour',
    untranslated: 'よん',
    phonetic: 'yon',
    translation: ['four']
  },
  {
    id: '5b7460d920c593464c7hfive',
    untranslated: 'ご',
    phonetic: 'go',
    translation: ['five']
  },

];

router.get('/random', (req, res, next)=>{
  const wordIdx = Math.floor(Math.random()*someWords.length);


  res.json(someWords[wordIdx]);

});

router.get('/:id', (req, res, next)=>{
  const id = req.params.id;

  const word = someWords.filter(word => word.id === id);

  if(word[0])
    res.json(word[0]);
  else
    next();
    
});


module.exports = router;