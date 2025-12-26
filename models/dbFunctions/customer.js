const chalk = require("chalk");
const Customer = require("../schema/customerSchema");
const Hash = require("../customTools/hash");
const exportFunction = module.exports = {};



exportFunction.findAllCustomers = async(userName) => {
    customers = await Customer.find({"stylistUserName" : userName}) 
        .then(async(customers) =>{
            return customers;
        })
        .catch((error) => {
            console.log(chalk.red(`\n\nError in customer.findCustomer\n
                file path ./models/dbFunctions/customer.js\n\n
                ${error.stack}`));
        });
    return customers;
};

exportFunction.findByCustomerUserName = async(customerUserName) =>{
    currentCustomer = await Customer.findOne({"customerUserName" : customerUserName});
    return currentCustomer;
}

exportFunction.findByEmail = async(email)=>{
    currentCustomer = await Customer.findOne({email : email});
    return currentCustomer;
}

exportFunction.logInByUserName = async(userName, password) =>{
    currentCustomer = await Customer.findOne({"userName" : userName});
    if(currentCustomer.password !== null){
        if(currentCustomer.password === password){
            return currentCustomer;
        }
    }
    
}


exportFunction.newCustomer = async(userName, password, firstName, lastName, customerUserName, email, phoneNumber, profileImage)=>{
    let docID = await Hash.getObjectId();
    if(password === undefined){
        await Customer.create({
            _id : docID,
            firstName : firstName,
            lastName : lastName,
            customerUserName : customerUserName,
            stylistUserName : userName,
            password : null,
            email : email,
            phoneNumber : phoneNumber,
            profileImage : profileImage
        })
        .catch((error) =>{
            console.log(`There was an error in saving new customer\n${error.stack}`);
        });
    }
    else{
        password = await Hash.sha256(password);
        await Customer.create({
            _id : docID,
            firstName : firstName,
            lastName : lastName,
            customerUserName : customerUserName,
            stylistUserName : userName,
            password : password,
            email : email,
            phoneNumber : phoneNumber,
            profileImage : profileImage
        })
        .catch((error) =>{
            console.log(`There was an error in saving new customer\n${error.stack}`);
        });
    }
    return docID;
};



exportFunction.findCustomerByID = async(customerId) => {
    currentCustomer = await Customer.find({_id:customerId});
    return currentCustomer;
};


exportFunction.editCustomer = async(customerId, newName, newPhoneNumber, newEmail) => {
    
    let nameArray = newName.split(" ");
    let firstName = nameArray[0];
    let lastName = nameArray[1];
    await Customer.updateOne(
        {
            _id : customerId  
        },
        {
            $set : {
                firstName : firstName,
                lastName : lastName,
                email : newEmail,
                phoneNumber : newPhoneNumber
            }
        }
    );
    currentCustomer = await Customer.find({ _id : customerId });
    return currentCustomer;
};


exportFunction.getImage = async(appointments) => {
    imagePaths = [];
    for(let x =0; x < appointments.length; x++){
        if(appointments[x].services[0] === "Break" || appointments[x].services[0] === "Day Off"){
            imagePaths[x] = "/profilePic/filler.png";
        }
        else{
            try{
                customer = await Customer.findOne({ "_id" : appointments[x].customerID });
                imagePaths[x] = customer.profileImage;
            }
            catch(error){
                imagePaths[x] = "/profilePic/filler.png";
                console.log(`\n\nx : ${x}\n${error.stack}\nLooking for customer profile image that wasn't found\ncustomer object : ${customer}`);
            }
        }
        
    }
    return imagePaths;
    
}


exportFunction.deleteCustomerByID = async(customerID) =>{
    await Customer.deleteOne({ "_id" : customerID });
}


exportFunction.setPassword = async(userName, password) =>{
    await Customer.findOneAndUpdate({
        customerUserName : userName
    },
    {
        password : password
    });
}


exportFunction.updatePerferedStylist = async(customerUserName, stylistID, stylistName, stylistImage, stylistUserName)=>{
    await Customer.findOneAndUpdate({
        customerUserName : customerUserName
    },
    {
        stylistUserName : stylistUserName,
        savedStylistID : stylistID,
        savedStylistName : stylistName,
        savedStylistPic : stylistImage
    });
}




    