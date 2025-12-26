const dbConnection = require("../dbFunctions/connection");
const Customer = require("../schema/customerSchema");
const exportFunction = module.exports = {};


exportFunction.logOutByUserName = async(userName) =>{
    //await dbConnection.open();
    await Customer.find({userName : userName}) 
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
    //await dbConnection.close();
}