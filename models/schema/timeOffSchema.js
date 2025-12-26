const mongoose = require("mongoose");

const TimeOff = mongoose.Schema({
    _id : String,
    stylistID : String,
    userName : String,
    stylistName : String,
    startTime : Number,
    endTime : Number,
    stringTime : String
});

module.exports = mongoose.model("TimeOff", TimeOff);