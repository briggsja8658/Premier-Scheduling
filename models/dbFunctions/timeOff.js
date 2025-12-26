const TimeOff = require("../schema/timeOffSchema");
const Hash = require("../customTools/hash");
const DateTime = require("../customTools/dateTime");

const exportFunction = module.exports = {};


exportFunction.createTimeOff = async(stylistID, userName, stylistName, timeStart, timeEnd)=>{
    let docID = await Hash.getObjectId();
    timeStartString = DateTime.createReadableDay(timeStart);
    timeEndString = DateTime.createReadableDay(timeEnd);
    TimeOff.create({
        "_id" : docID,
        "stylistID" : stylistID, 
        "userName" : userName, 
        "stylistName" : stylistName, 
        "startTime" : timeStart, 
        "endTime" : timeEnd,
        "stringTime" : `From ${timeStartString} to ${timeEndString}`
    });
}


exportFunction.getTimeOff = async(stylistID)=>{
    timeTaken = TimeOff.find({ "stylistID" : stylistID });
    return timeTaken;
}

exportFunction.getTimeOffByID = async(timeOffID) =>{
    currentTimeOff = TimeOff.findOne({ "_id" : timeOffID });
    return currentTimeOff;
}


exportFunction.deleteTimeOff = async(timeOffID)=>{
    let results = await TimeOff.deleteOne({_id : timeOffID});
    return results.deletedCount;
}