
const Services = require("../schema/servicesSchema");
const Stylist = require("./stylist");
const hash = require("../customTools/hash");
const exportFunction = module.exports = {};


exportFunction.findService = async(serviceID) =>{
    serviceData = await Services.findOne({"_id" : serviceID})
        .then(async(serviceData) => {
            return serviceData;
        })
        .catch((error) => {
            console.log("Error in find Services");
        });
    return serviceData;
    
};


exportFunction.findAllServices = async(userName) => {
    
    services = await Services.find({"userName" : userName}).sort({serviceName : 1})
        .then(async(services) => {
            return services;
        })
        .catch((error) => {
            console.log("Error in find Services");
        });
    
    return services;
};

exportFunction.findAllServicesByID = async(stylistID)=>{
    services = await Services.find({"stylistID" : stylistID}).sort({serviceName : 1})
        .then(async(services) => {
            return services;
        })
        .catch((error) => {
            console.log("Error in find Services");
        });
    
    return services;
}


exportFunction.newService = async (userName, serviceName, charge, timeSelectValues, timeSelectCount)=>{
    let docID = await hash.getObjectId();
    let error = null;
    let complete = null;

    await Services.create({
        _id : docID,
        userName : userName,
        serviceName : serviceName,
        charge : Number(charge),
        timeSlots : Number(timeSelectCount),
        slotType : timeSelectValues
    })
    .then(()=>{
        error = false;
        complete = true;
    })
    .catch((error) => {
        error = true;
        complete = false;
        console.log(`Error in new service\n\n${error.stack}`);
    });

    return {
        error,
        complete
    };
}



exportFunction.editService = async(userName, serviceName, charge, serviceID, timeSelectValues, timeSelectCount, stylistID) => {
    let error = null;
    let complete = null;
    await Services.findOneAndDelete({ "_id" : serviceID });
    docID = await hash.getObjectId();
    await Services.create({
        _id : docID,
        userName : userName,
        serviceName : serviceName,
        charge : Number(charge),
        timeSlots : timeSelectCount,
        slotType : timeSelectValues,
        stylistID : stylistID
    })
    .then(()=>{
        error = false;
        complete = true;
    })
    .catch((error) => {
        error = true;
        complete = false;
        console.log(`Error in edit service\n\n${error.stack}`);
    });
       
    return {
        error,
        complete
    }
    
}



exportFunction.defaultServices = async(firstName, lastName, userName, stylistID)=>{
    serviceNames = ["Women's Haircut", "Men's Haircut", "Nails", "Hair Highlight", "Hair Coloring", "Beard Trim", "Bangs Trim", "Child Haircut"];
    stylistName = `${firstName} ${lastName}`;
    for(let x = 0; x < serviceNames.length; x++){
        docID = await hash.getObjectId();
        Services.create({
            _id : docID,
            stylistID, stylistID,
            userName : userName,
            stylistName : stylistName,
            serviceName : serviceNames[x],
            charge : 30,
            timeSlots : 1,
            slotType : [true]
        })
        .catch((error) => {
            console.log(`Error in new service\n\n${error.stack}`);
        });
    }
}


exportFunction.deleteService = async(serviceID)=>{
    let error = null;
    let complete = null;
    await Services.deleteOne({_id : serviceID})
    .then(()=>{
        error = false;
        complete = true;
    })
    .catch((deleteError)=>{
        console.log(`Error in delete service ${deleteError}`)
        error = true;
        complete = false;
    });
    return {
        error,
        complete
    }
}


exportFunction.getServicesByStylistID = async(stylistID) =>{
    let services = await Services.find({"stylistID" : stylistID});
    return services;
}











