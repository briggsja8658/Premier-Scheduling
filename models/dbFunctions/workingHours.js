const WorkingHours = require("../schema/workingHoursSchema");
const DateTime = require("../customTools/dateTime");
const Appointment = require("../dbFunctions/appointment");
const Hash = require("../customTools/hash");
const chalk = require("chalk");
const exportFunction = module.exports = {};


exportFunction.defaultWorkingHours = async (stylistID, userName, firstName, lastName) => {

    stylistName = `${firstName} ${lastName}`;
    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];
    let dayID = DateTime.getWeekID();
    dayOffset = 86400000;
    for (let x = 0; x < 7; x++) {
        docID = await Hash.getObjectId();
        await WorkingHours.create({
            _id: docID,
            stylistID: stylistID,
            stylistName: stylistName,
            userName: userName,
            startTime: 0900,
            endTime: 1630,
            dayName: dayNames[x],
            dayID: dayID,
            dayOff: false
        });
        dayID = dayID + dayOffset;
    }
}


exportFunction.update = async(stylist) => {

    for (let x = 0; x < stylist.length; x++) {
        workingHours = await WorkingHours.find({"stylistID" : stylist[x]._id});
        timeNow = Date.now();
        for(let y =0; y < workingHours.length; y++){
            if(workingHours[y].dayID < timeNow){
                newDayID = workingHours[y].dayID + 604800000; //604800000 is one week offset in ms
                await WorkingHours.updateOne(
                    {
                        "dayID" : workingHours[y].dayID,
                        "vacationTime" : false
                    },
                    {
                        dayID: newDayID
                    }
                );
            }
        }
    }
}   


exportFunction.findWorkingHours = async (userName) => {
    let workingHours = await WorkingHours.find({ userName: userName }).sort({ "dayID": 1 });
    return workingHours;
}


exportFunction.findWorkingHoursByID = async (stylistID) => {
    let workingHours = await WorkingHours.find({ "stylistID": stylistID }).sort({ "dayID": 1 });
    return workingHours;
}


exportFunction.edit = async (toDayOff, dayID, workStartValue, workEndValue, stylistID) => {
    
    if (toDayOff === "No") {
        for(let x =0; x < 12; x++){
            await WorkingHours.findOneAndUpdate(
                {  "dayID" : dayID , "stylistID" : stylistID },
                {
                    startTime: Number(workStartValue),
                    endTime: Number(workEndValue),
                    dayOff: false
                }
            )
            .catch((error) => {
                console.log(`There was an error in edit day hours\n\n${error.stack}`);
            });
            dayID += 604800000;
        }
    }
    else {
        for(let x =0; x < 12; x++){
            await WorkingHours.findOneAndUpdate(
                { "dayID": dayID, "stylistID": stylistID },
                {
                    dayOff: true
                }
            )
            .catch((error) => {
                console.log(`There was an error in edit day hours\n\n${error.stack}`);
            });
            dayID += 604800000;
            
        }
    }

}