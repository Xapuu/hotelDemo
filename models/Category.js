const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let catSchema = new mongoose.Schema({
    catName:{type:String,required:true,unique:true},
    hotels:[{type:ObjectId,ref:'Hotel'}]
    
})

module.exports = mongoose.model('Category',catSchema)