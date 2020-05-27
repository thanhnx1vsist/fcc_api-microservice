const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExSchema = new Schema({
   userId :{
       type: String,
       required : true
   },
   description:{
       type: String,
       required: true
   },
   duration:{
       type:Number,
       required: true
   },
   date:{
       type: Date,
       required: true
   }

})

module.exports = mongoose.model('exsercise', ExSchema );