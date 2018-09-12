const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../db/models/userSchema');

const router = express.Router();

//Authenticate
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


router.get('/next', (req, res, next) =>{
  const userId = req.user.id;

  User.findById(userId)
    .then(results =>{
      const headIdx = results.progressHead;
      const nextWord = results.progress[headIdx];
      res.json(nextWord);
    })
    .catch(err =>{
      next(err);
    });
});

router.put('/answer', (req, res, next) =>{
  const userId = req.user.id;
  const isCorrect = req.body.isCorrect;

  //TODO: handle 

  User.findById(userId)
    .then(results =>{
      const headIdx = results.progressHead;
      let progressArr = results.progress;
      let updateObj = {};
      
      if(isCorrect){
        progressArr[headIdx].m++;
      }else{
        progressArr[headIdx].m = 1;
      }

      const amountToMove = 
        progressArr[headIdx].m >= progressArr.length ? progressArr.length-1
          : progressArr[headIdx].m;

      const newHeadIdx = progressArr[headIdx].next;
      let targetIdx = headIdx; //put current node after this

      for(let i = 0; i < amountToMove; i++){
        targetIdx = progressArr[targetIdx].next;
      }

      let tailIdx = headIdx;
      for(let i = 0; i < progressArr.length; i++){
        tailIdx = progressArr[targetIdx].next;
      }

      console.log('headIdx: ', headIdx, 'tailIdx: ', tailIdx, 'targetIdx: ', targetIdx);
    
      progressArr[headIdx].next = progressArr[targetIdx].next;
      progressArr[targetIdx].next = headIdx;
      progressArr[tailIdx].next = newHeadIdx;




    })
    .catch(err =>{
      next(err);
    });

  console.log(isCorrect);
  
  res.json();
});


module.exports = router;