const mongoose = require("mongoose");

const Customer = mongoose.Schema({
    _id : String,
    firstName : String,
    lastName : String,
    customerUserName : String,
    stylistUserName : String,
    password : String,
    email : String,
    phoneNumber : String,
    profileImage : String,
    savedStylistID : String,
    savedStylistName : String,
    savedStylistPic : String
});

module.exports = mongoose.model("Customer", Customer);