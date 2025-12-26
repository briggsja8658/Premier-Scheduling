const mongoose = require("mongoose");

const Time = mongoose.Schema({
    _id : String,
    userName: String,
    stylistID : String,
    name : String,
    day : String,
    dayID : Number,
    timeID : Number,
    time : String,
    timeOpen : Boolean,
    timeSlotActive : Boolean,
    vacationTime : Boolean
    
});

module.exports = mongoose.model("Time", Time);