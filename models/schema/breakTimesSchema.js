const mongoose = require("mongoose");

const BreakTimes = mongoose.Schema({
    _id : String,
    dayID : Number,
    stylistID : String,
    userName : String,
    stylistName : String,
    breakStart : Number,
    breakEnd : Number,
    breakDuration : Number,
    dayName : String
});

module.exports = mongoose.model("BreakTimes", BreakTimes);