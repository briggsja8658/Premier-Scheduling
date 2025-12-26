const Appointment = require("../schema/appointmentSchema");
const Time = require("./time");
const Stylist = require("./stylist");
const Services = require("./services");
const Hash = require("../customTools/hash");
const Image = require("../customTools/image");
const DateTime = require("../customTools/dateTime");
const exportFunction = module.exports = {};


//Find customers with appointments today
exportFunction.findTodaysAppointments = async (userName) => {
    currentTime = Date.now();//Need to check for time zone. Right now this only works for eastern
    dayDifference = (currentTime % 86400000);
    midNight = (currentTime - dayDifference) + 86400000;
    foundAppointments = await Appointment.find({
        $and: [
            { "userName" : userName },
            { "timeID": { $lt: midNight }}
        ]
    }).sort({ timeID: 1 });


    checkedTimes = false;
    while(checkedTimes === false && foundAppointments.length !== 0){
        if(foundAppointments[0].timeID < currentTime){
            foundAppointments.splice(0,1);
        }
        else{
            checkedTimes = true;
        }
    }

    return foundAppointments;
}



exportFunction.findAppointment = async(appointmentID) => {
    currentAppointment = await Appointment.findById(appointmentID);
    return currentAppointment
}



exportFunction.openAppointmentFromDayOff = async(stylistID, timeID )=>{
    await Appointment.findOneAndDelete({$and : [{"stylistID" : stylistID}, {"timeID" : timeID}]});
}


exportFunction.makeAppointment = async(
    customerName, customerID, userName, serviceNamesRaw, serviceTimes, rawTimeIDs, 
    serviceDay, timeSlots, stylistID, appointmentNotes, appointmentPic, stylistName,
    dayID, newAppointmentName) => {

    docID = await Hash.getObjectId();
    timeSlots = Number(timeSlots);
    requestedTimeIDs = [];
    if(rawTimeIDs.length === undefined){ //If not given an array put one id into an array to be used later
        requestedTimeIDs[0] = rawTimeIDs;
    }
    else{
        let i =0; //If more than one id change the name of it
        while(i < rawTimeIDs.length){
            requestedTimeIDs[i] = rawTimeIDs[i];
            i++;
        }
    }

    serviceNames = [];
    if(typeof serviceNamesRaw === "string"){
        seperateServiceNames = serviceNamesRaw.split(",");
        let y = 0;
        while(y < seperateServiceNames.length){
            serviceNames[y] = seperateServiceNames[y];
            y++;
        }
    }
    else{
        let i =0;
        while(i < serviceNamesRaw.length){
            serviceNames[i] = serviceNamesRaw[i];
            i++;
        }
    }


    //create readable string for service name
    serviceLength = serviceNames.length;
    if (serviceLength === 1) {
        serviceNamesString = serviceNames[0];
    }
    else if (serviceLength === 2) {
        serviceNamesString = `${serviceNames[0]} and ${serviceNames[1]}`;
    }
    else {
        for (let x = 0; x < serviceLength; x++) {
            if (x === 0) {
                serviceNamesString = `${serviceNames[0]}`;
            }
            else if (x < (serviceLength - 1)) {
                serviceNamesString = `${serviceNamesString}, ${serviceNames[x]}`;
            }
            else if (x === (serviceLength - 1)) {
                serviceNamesString = `${serviceNamesString}, and ${serviceNames[x]}`;
            }

        }
    }


    if (timeSlots === 1) {
        serviceTimeString = `${serviceTimes} (30 Mins)`;
    }
    else {
        serviceTimeNumber = (30 * timeSlots) / 60;
        serviceTimeString = `${serviceTimes} (${serviceTimeNumber} Hours)`;
    }


    
    imageString = await Image.saveAppointmentImage(appointmentPic, userName, newAppointmentName);
    


    await Appointment.create({
        "_id" : docID,
        "day" : serviceDay,
        "customerID" : customerID,
        "customerName" : customerName,
        "userName" : userName,
        "stylistID" : stylistID,
        "serviceName" : serviceNamesString,
        "services" : serviceNames,
        "numberOfServices" : serviceLength,
        "timeSlots" : timeSlots,
        "timeID" : requestedTimeIDs[0],
        "time" : serviceTimeString,
        "appointmentNotes" : appointmentNotes,
        "appointmentPic" : imageString,
        "stylistName" : stylistName,
        "dayID" : dayID
    });
}


exportFunction.defaultFillAppointmentsWithBreak = async (stylistName, stylistID, userName, timeZoneOffset, customerID )=>{
    timeIDs = [];
    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];
    dayOffset = 86400000;
    let dayID = DateTime.getWeekID();
    for(let x =0; x < 84; x++){
        docID = await Hash.getObjectId();
        timeID = DateTime.oneTimeIDFromMilitaryTime(1200, dayID, timeZoneOffset);
        timeIDs[x] = timeID;
        startTime = DateTime.militaryToStringTime(1200);
        await Appointment.create({
            "_id" : docID,
            "day" : dayNames[x],
            "customerID" : customerID,
            "stylistID" : stylistID,
            "customerName" : stylistName,
            "userName" : userName,
            "serviceName" : "Break",
            "service" : ["Break"],
            "numberOfServices" : 1,
            "timeSlots" : 2,
            "timeID" : timeID,
            "time" : `${startTime} (1 Hour)`,
            "dayID" : dayID
        });
        dayID = dayID + dayOffset;
    }
    
    return timeIDs;
}


exportFunction.fillAppointmentWithBreak = async(customerName, stylistID, userName, breakStart, serviceTimeString, dayName, dayID, timeSlots, toDayOff, timeIDBreak, timeZoneOffset, stylistCustomerID) => {
    let startTime = DateTime.militaryToTimeID(breakStart, dayID, timeZoneOffset);
    if (toDayOff === "Yes") {
        for(let x =0; x < 12; x++){
            docID = await Hash.getObjectId();
            await Appointment.deleteMany({ "timeID" : startTime[0], "customerID" : stylistCustomerID });//stylistID is in customerID because we are creating a break for the stylist
            await Appointment.create({
                "_id" : docID,
                "day" : dayName,
                "stylistID" : stylistID,
                "customerID" : stylistCustomerID,
                "customerName" : customerName,
                "userName" : userName,
                "serviceName" : "Day Off",
                "service" : ["Day Off"],
                "numberOfServices" : 1,
                "timeSlots" : timeSlots[0],
                "timeID" : startTime[0],
                "time" : `12am (${serviceTimeString})`,
                "dayID" : dayID.toString()
            });
            dayID += 604800000;
            startTime[0] += 604800000; //Advance one week
        }
    }
    else {
        for(let y =0; y < 12; y++){
            for (x = 0; x < startTime.length; x++) {
                docID = await Hash.getObjectId();
                await Appointment.deleteMany({ timeID: startTime[x], "customerID" : stylistID });
                await Appointment.create({
                    "_id" : docID,
                    "day" : dayName,
                    "stylistID" : stylistID,
                    "customerID" : stylistCustomerID,
                    "customerName" : customerName,
                    "userName" : userName,
                    "serviceName" : "Break",
                    "service" : ["Break"],
                    "numberOfServices" : 1,
                    "timeSlots" : timeSlots[x],
                    "timeID" : startTime[x],
                    "time" : `${serviceTimeString[x]}`,
                    "dayID" : dayID.toString()
                });
            }
            dayID += 604800000;
            startTimeCount = 0;
            while(startTimeCount < startTime.length){
                startTime[startTimeCount] = startTime[startTimeCount] + 604800000; //Advance one week
                startTimeCount++;
            }
        }
    }


}


exportFunction.updateAppointmentWithBreak = async (stylist)=>{
    for(let x = 0; x < stylist.length; x++){
        timeOff = await Appointment.find({"userName" : stylist[x].userName, "serviceName" : "Break"});
        
        for(let y = 0; y < timeOff.length; y++){
            timeNow = Date.now();
            if(timeOff[y].timeID < timeNow){
                newTimeID = timeOff[y].timeID + (86400000 * 7);
                await Appointment.updateOne(
                    {
                        "userName" : stylist[x].userName,
                        "serviceName" : "Break"
                    },
                    {
                        "timeID" : newTimeID
                    }
                );
            }
        }
    }
}


exportFunction.editAppointment = async (appointmentID, appointmentStart, services, currentAppointment) => {
    
    timeSlotsArray = [];
    servicesNameArray = [];
    let i =0;
    while (i < services.length){
        currentService = Services.findService(services[i]);
        timeSlotsArray[i] = currentService.timeSlots;
        servicesNameArray[i] = currentService.name;
        i++
    }

    

    

}


exportFunction.findAllAppointments = async (userName) => {
    appointments = Appointment.find({ "userName": userName });
    return appointments;

}


exportFunction.findAllUpcoming = async (userName) => {
    date = new Date();
    currentTime = Date.now();//Need to check for time zone. Right now this only works for eastern
    upcomming = await Appointment.find({ $and: [{ userName: userName }, { timeID: { $gte: currentTime } }] }).sort({ timeID: 1 })

    return upcomming;
}


exportFunction.findByID = async (appointmentID) => {
    appointment = Appointment.find({ "_id": appointmentID });
    return appointment;
}


exportFunction.findBreaks = async (userName)=>{
    allBreaks = Appointment.find({"userName" : userName, "service1" : "break"});
    return allBreaks;
}


exportFunction.findUpcomingCustomerAppointments = async(customerID)=>{
    timeNow = Date.now();
    upcoming = await Appointment.find({$and : [
        { "customerID" : customerID },
        { "timeID" : { $gt : timeNow }}
    ]});
    return upcoming;
}



exportFunction.removeStylistBreaks = async(stylistID, dayID)=>{
    let i =0;
    while(i < 12){
        await Appointment.deleteMany({ "stylistID" : stylistID, "dayID" : dayID });
        i++;
        dayID += 604800000;
    }
}



exportFunction.deleteByID = async(appointmentID) => {
    deletedAppointment = false;
    await Appointment.findOneAndDelete({"_id" : appointmentID})
    .then(()=>{
        deletedAppointment = true;
    })
    .catch((error)=>{
        console.log(`There was an error in deleting appointment\n${error}`);
    });
    return deletedAppointment;
}