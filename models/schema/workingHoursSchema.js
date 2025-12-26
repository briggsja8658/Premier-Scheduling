const mongoose = require("mongoose");

const WorkingHours = mongoose.Schema({
    _id : String,
    stylistID : String,
    userName : String,
    stylistName : String,
    startTime : Number,
    endTime : Number,
    dayName : String,
    dayID : Number,
    dayOff : Boolean
});

module.exports = mongoose.model("WorkingHours", WorkingHours);