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
      
      if(isCorrect){
        progressArr[headIdx].m++;
      }else{
        progressArr[headIdx].m = 1;
      }

      const amountToMove = 
        progressArr[headIdx].m >= progressArr.length ? progressArr.length-1
          : progressArr[headIdx].m;

      //next item in the list
      const newHeadIdx = progressArr[headIdx].next;

      let targetIdx = headIdx; //put current head after this
      for(let i = 0; i < amountToMove; i++){
        targetIdx = progressArr[targetIdx].next;
      }

      //We need to make sure the list is circular, so we grab the end node
      let tailIdx = headIdx;
      for(let i = 0; i < progressArr.length-1; i++){
        // console.log(tailIdx, progressArr[tailIdx].next);
        tailIdx = progressArr[tailIdx].next;
      }
      // console.log('Final tailIdx:', tailIdx);
    
      //Shift indexes around accordingly
      if(amountToMove >= progressArr.length-1){
        /*m is >= length, so amountToMove will put current head at the end
          
          tailIdx already points to the head, so we put the current head at the end
          and point it to the new start of the list
        */
        progressArr[headIdx].next = newHeadIdx;
      }else{
        //sets current head before the node after the target
        progressArr[headIdx].next = progressArr[targetIdx].next;
        //sets target to point to the current head
        progressArr[targetIdx].next = headIdx;
        //ensures end of list loops to beginning properly
        progressArr[tailIdx].next = newHeadIdx;
      }

      // console.log(progressArr);

      const updateObj = {$set: {progress: progressArr, progressHead: newHeadIdx}};
      const options = {new: true};
      //send off modified progressArr and newHeadIdx
      return User.findByIdAndUpdate(userId, updateObj, options);
    })
    .then(results =>{
      // let head = results.progressHead;
      // const arr = [];
      // const limit = results.progress.length;
      // console.log(limit);
      // let cnt = 0;
      // while(cnt < limit){
      //   arr.push(head);
      //   head = results.progress[head].next;
      //   cnt++;
      // }
      // console.log(arr);

      if(results){
        res.sendStatus(200);
        // res.json(results);
      }else{
        next();
      }
    })
    .catch(err =>{
      next(err);
    });
});

/*
  Projected m values and linkedList order of five-word library assuming correct
  answers are given every time

      A	B	C	D	E	
  m		1	1	1	1	1	
  ABCDE
  -> correct
  m		2	1	1	1	1	
  BCADE
  -> correct
      2	2	1	1	1	
  CABDE
  -> correct
  m		2	2	2	1	1	
  ABCDE
  -> correct
  m		3	2	2	1	1	
  BCDAE
  -> correct
  m		3	3	2	1	1	
  CDABE
  -> correct
  m		3	3	3	1	1	
  DABCE
  -> correct
  m		3	3	3	2	1	
  ABDCE
  -> correct
  m		4	3	3	2	1	
  BDCEA
  -> correct
  m		4	4	3	2	1	
  DCEAB
  -> correct
  m		4	4	3	3	1	
  CEADB
  -> correct
  m		4	4	4	3	1	
  EADBC
  ->correct
  m		4	4	4	3	2	
  ADEBC
  ->correct
  m		5	4	4	3	2	
  DEBCA
*/

module.exports = router;