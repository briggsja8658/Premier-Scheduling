const mongoose = require("mongoose");

const Appointments = mongoose.Schema({
    _id : String,
    stylistID : String,
    customerID : String,
    customerName : String,
    userName : String,
    serviceName : String,
    services : Array,
    numberOfServices : Number,
    timeSlots : Number,
    timeID : Number,
    time : String,
    day : String,
    stylistName : String,
    appointmentPic : String,
    dayID : String,
    notes : String,
    exampleImage : String
});

module.exports = mongoose.model("Appointments", Appointments);