const express = require('express');
const userController = require("../controller/userController");
const userRouter = express.Router(); 
    
userRouter.get('/', async(req, res, next) => { 
    user = await userController.get();
    res.status(200).send(user);
})

userRouter.post('/', async(req, res, next) => {    
    user = await userController.post(req.body);
    res.status(200).send(user);
})


module.exports = userRouter;
