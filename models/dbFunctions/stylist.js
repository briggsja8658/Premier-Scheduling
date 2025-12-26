
const Stylist = require("../schema/stylistSchema");
const hash = require("../customTools/hash");
const WorkingHours = require("../dbFunctions/workingHours");
const chalk = require("chalk");
const exportFunction = module.exports = {};


exportFunction.findStylist = async(stylistID) =>{
    stylistData = await Stylist.findById({"_id" : stylistID})
        .then((stylistData)=>{
            return stylistData;
        })
        .catch((error)=>{
            console.log("There was an error in findStylist");
        });
    return stylistData;
}


exportFunction.findAllStylists = async() =>{
    stylistData = await Stylist.find({})
        .then(async(stylistData)=>{
            return stylistData;
        })
        .catch((error)=>{
            console.log("There was an error in findStylist");
        });
    return stylistData;
}


exportFunction.findStylistByUserName = async(userName) =>{ 
    stylist = await Stylist.findOne({ userName : userName})
        .then(async(stylistData)=>{
            return stylistData;
        })
        .catch((error)=>{
            console.log(chalk.magentaBright(`There was an error in findStylistByName\n
                file path: /models/dbFunctions/stylist.js\n
                ${error.stack}`));
        });
    
    return stylist;
}


exportFunction.findStylistByEmail = async(email) =>{ 
    stylist = await Stylist.findOne({ email : email})
        .then(async(stylistData)=>{
            return stylistData;
        })
        .catch((error)=>{
            console.log(chalk.magentaBright(`There was an error in findStylistByName\n
                file path: /models/dbFunctions/stylist.js\n
                ${error.stack}`));
        });
    
    return stylist;
}


exportFunction.newStylist = async(firstName, lastName, userName, email, password, phoneNumber, profileImage, timeZoneOffset, businessName, streetAddress, city, state, zipCode)=>{
    docID = await hash.getObjectId();
    if(profileImage !== null){
        await Stylist.create({
            _id : docID,
            firstName : firstName,
            lastName : lastName,
            userName, userName,
            email : email,
            password : password,
            phoneNumber : phoneNumber,
            profileImage : profileImage.relativePath,
            timeZoneOffset : timeZoneOffset,
            businessName : businessName,
            streetAddress : streetAddress,
            city : city,
            state : state,
            zipCode : Number(zipCode)
        })
        .catch((error)=>{
            console.log(`\n\nThere was an error in newStylist\n\nThis is the error\n${error}\n\nThis is the error stack\n${error.stack}\n\n`);
        });
    }
    else{
        await Stylist.create({
            _id : docID,
            firstName : firstName,
            lastName : lastName,
            userName, userName,
            email : email,
            password : password,
            phoneNumber : phoneNumber,
            profileImage : "/image/userImages/filler.png",
            businessName : businessName,
            streetAddress : streetAddress,
            city : city,
            state : state,
            zipcode : Number(zipcode)
        })
        .catch((error)=>{
            console.log(`\n\nThere was an error in newStylist\n\nThis is the error\n${error}\n\nThis is the error stack\n${error.stack}\n\n`);
        });
    }
    
}


exportFunction.editStylist = async(id, newFirstName, newLastName, newEmail, newPhoneNumber, newProfileImage)=>{
    if(newProfileImage !== null){ //Run with profile Image update
        await Stylist.updateOne(
            {
                _id : id
            },
            {
                firstName : newFirstName,
                lastName : newLastName, 
                email : newEmail,
                phoneNumber : newPhoneNumber,
                profileImage : newProfileImage.relativePath
            }
        )
        .catch((error)=>{
            console.log("There was an error in edit stylist");
        });
    }
    else{
        await Stylist.updateOne( //Run without profile image update
            {
                _id : id
            },
            {
                firstName : newFirstName,
                lastName : newLastName, 
                email : newEmail,
                phoneNumber : newPhoneNumber
            }
        )
        .catch((error)=>{
            console.log("There was an error in edit stylist");
        });
    }
    
}


exportFunction.stylistProfileImage = async(imageData, userName)=>{
    Stylist.updateOne(
        {
            userName : userName
        },
        {
            profileImage : imageData
        }
    )
    .catch((error)=>{
        console.log("There was an error in newStylist");
    });
}


exportFunction.logInByUserName = async(userName, password) =>{
    password = await hash.sha256(password);
    foundStylist = await Stylist.find({$and: [{"userName" : userName},{"password" : password}]}) 
        .then((foundStylist) => {
            
            return foundStylist;
        })
        .catch((error) => {
            console.log(chalk.red(`\n\nError in logInByUserName\n
                file path ./models/auth/logIn.js\n\n
                ${error.stack}`));
        });
    return foundStylist[0];
}


exportFunction.logInByEmail = async(email, password) =>{
    password = await hash.sha256(password);
    await Stylist.find({email : email}, {password : password}) 
        .then(async(foundStylist) => {
            
            return foundStylist;
        })
        .catch((error) => {
            console.log(chalk.red(`\n\nError in logInByEmail\n
                file path ./models/auth/logIn.js\n\n
                ${error.stack}`));
        });
}

exportFunction.logOutByUserName = async(userName) =>{
    await Stylist.find({userName : userName}) 
        .then(async(foundCustomer) => {
            
            if(foundCustomer === null){
                return false;
            }
            else{
                return true;
            }
        })
        .catch((error) => {
            console.log(chalk.red(`\n\nError in logInByUserName\n
                file path ./models/auth/logIn.js\n\n
                ${error.stack}`));
        });
}



