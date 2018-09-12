const express = require('express');

const Word = require('../db/models/wordSchema');

const router = express.Router();

router.get('/random', (req, res, next)=>{
  
  Word.find()
    .then(results =>{
      if(results.length > 0){
        const wordIdx = Math.floor(Math.random()*results.length);
        res.json(results[wordIdx]);
      }else{
        next();
      }
    })
    .catch(err =>{
      next(err);
    });
});

router.get('/:id', (req, res, next)=>{
  const id = req.params.id;

  Word.findById(id)
    .then(results =>{
      res.json(results);
    })
    .catch(err =>{
      next(err);
    });
    
});


module.exports = router;