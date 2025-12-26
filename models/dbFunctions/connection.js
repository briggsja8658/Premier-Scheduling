//Dependencies
const mongoose = require("mongoose");
const chalk = require("chalk");
const url = 'mongodb://localhost:27017/premier-scheduling';
const exportFuntion = module.exports = {};

db = mongoose.connection;

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser:true, useFindAndModify:false})
    .catch((error)=>{
        console.log(`There was an error in opening the data base: ${error.stack}`);
    });


exportFuntion.open = () => {
    mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser:true})
    .catch((error)=>{
        console.log(`There was an error in opening the data base: ${error.stack}`);
    });
}
exportFuntion.close = () => {
    db.close();
}