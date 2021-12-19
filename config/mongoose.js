const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/to_do_list');

const db=mongoose.connection;

db.on('error',console.error.bind(console,'error in connecting to db'));

db.once('open',function(){
console.log('successfully connected to database');
})