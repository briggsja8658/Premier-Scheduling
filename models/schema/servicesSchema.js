const mongoose = require("mongoose");

const Services = mongoose.Schema({
    _id : String,
    userName : String,
    stylistID : String,
    serviceName : String,
    charge : Number,
    timeSlots : Number,
    slotType : Array
});

module.exports = mongoose.model("Services", Services);