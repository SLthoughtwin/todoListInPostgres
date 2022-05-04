const express = require('express');
const app = express();
const {port} = require('./config/')
require('./config/db.connect')
const { errorHandler } = require('./config/');
const {userRoute,taskRoute} = require('./routes/')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/v1/todo',userRoute)
app.use('/v1/task',taskRoute)
app.use('*',(req,res,next)=>{
    return next(new ApiError(400, `this route is not define`));
})
app.use(errorHandler)
app.listen(port,()=>{
    console.log('server start')
})