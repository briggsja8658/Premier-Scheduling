const mongoose = require("mongoose");

const savedAppointments = mongoose.Schema({
    _id : String,
    customerID : String,
    customerName : String,
    customerUserName : String,
    stylistUserName : String,
    servicePic : String,
    notes : String,
    stylistID : String,
    stylistName : String,
    appointmentName : String,
    appointmentPic : String,
    serviceList : Array,
    serviceIDList : Array,
    timeSlots : Number
});

module.exports = mongoose.model("savedAppointments", savedAppointments);