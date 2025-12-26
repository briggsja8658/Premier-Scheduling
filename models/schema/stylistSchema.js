const mongoose = require("mongoose");

const Stylist = mongoose.Schema({
    _id : String,
    userName : String,
    firstName : String,
    lastName : String,
    userName : String,
    email : String,
    password : String,
    phoneNumber : String,
    profileImage : String,
    timeZoneOffset : Number,
    businessName : String,
    streetAddress : String,
    city : String,
    state : String,
    zipcode : Number
});

module.exports = mongoose.model("Stylist", Stylist);