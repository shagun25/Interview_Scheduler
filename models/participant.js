const mongoose=require('mongoose');

const participantSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  }
})

const Participant=mongoose.model('Participant',participantSchema);

module.exports=Participant;