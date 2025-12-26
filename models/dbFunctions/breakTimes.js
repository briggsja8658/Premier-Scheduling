const BreakTimes = require("../schema/breakTimesSchema");
const Stylist = require("../dbFunctions/stylist");
const Time = require("../dbFunctions/time");
const DateTime = require("../customTools/dateTime");
const Hash = require("../customTools/hash");
const chalk = require("chalk");
const exportFunction = module.exports = {};


exportFunction.defaultBreaks = async (stylistID, userName, firstName, lastName)=>{
    stylistName = `${firstName} ${lastName}`;
    dayID = DateTime.getWeekID();
    dayOffset = 86400000;
    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];
    for(let x =0; x < 7; x++){
        docID = await Hash.getObjectId();
        
        await BreakTimes.create({
            _id : docID,
            dayID : dayID,
            dayName : dayNames[x],
            stylistID : stylistID,
            userName : userName,
            stylistName : stylistName,
            breakStart : 1200,
            breakEnd : 1300,
            breakDuration : 2,
        });

        dayID = dayID + dayOffset;
    }
    
}


exportFunction.update = async (stylist)=>{

    currentDayID = DateTime.getDayID(); //This function only updates the breakTimes database and does not update the Times database
    for(let x = 0; x < stylist.length; x++){
        breakTimes = await BreakTimes.find({ "userName" : stylist[x].userName });
        for(let y = 0; y < breakTimes.length; y++){
            if(Number(breakTimes[y].dayID) <= currentDayID){
                newDayID = Number(breakTimes[y].dayID) + (86400000 * 7);
                BreakTimes.updateOne(
                    {
                        "userName" : stylist[x].userName,
                        "dayID" : breakTimes[y].dayID
                    },
                    {
                        "dayID" : newDayID.toString()
                    }
                )
                .catch((data)=>{
                    console.log(`Result of breakTime update:\n\n${data}`);
                });
            }
        }
    }
}


exportFunction.findFilteredBreaks = async (userName)=>{
    let breakTimes = [];
    breakCounter = 0;
    dayCounter = 0;
    weekCounter = 0;
    currentBreakCounter = 0;
    dayID = DateTime.getWeekID();
    dayID += 604800000; //Jump to the next week to get all the breakTimes

    
    while(dayCounter < 7){ //Only get the breaks for one week, becuase they are all the same for the 12 weeks
        currentDayBreaks = await BreakTimes.find({ userName : userName, dayID : dayID }); //Use find because there could be more than one break per day
        if(currentDayBreaks !== null){ //Check to make sure that there are breaks for the day
            while(currentBreakCounter < currentDayBreaks.length){ //Loop to add found breaks
                breakTimes[breakCounter] = currentDayBreaks[currentBreakCounter];
                currentBreakCounter++;
                breakCounter++;
            }
            currentBreakCounter = 0;
        }
        dayCounter++;
        dayID += 86400000;
    }


    return breakTimes;
}


exportFunction.findAllBreaks = (userName)=>{
    let breakTimes = BreakTimes.find({userName : userName});
    return breakTimes;
}


exportFunction.findBreakDuration = async (userName, breakID)=>{
    currentBreak = await BreakTimes.find({"userName" : userName, "_id" : breakID});
    breakDuration = currentBreak[0].breakDuration;
    return breakDuration;
}


exportFunction.edit = async(userName, stylistID, dayID, dayName, breakIDValue, breakStartValue, breakEndValue, breakDuration)=>{
    
    if(breakIDValue.typeOf !== "string"){
        breakIDLength = breakIDValue.length;
    }
    else{
        breakIDLength = 1;
    }

    dayIDOrginal = dayID;
    
    let i=0;
    while(i <= 12){
        result = await BreakTimes.deleteMany({ "stylistID" : stylistID, "dayID" : dayID})

            .catch((error) =>{
                console.log(`There was an error in deleting a break\n\n${error.stack}`);
            });
            dayID += 604800000;
        i++;
    }
    
    weekCounter =0;
    i = 0;
    dayID = dayIDOrginal;
    while(weekCounter <= 12){
        i = 0;
        while(i < breakIDLength){
            breakID = await Hash.getObjectId();
            await BreakTimes.create({
                "_id" : breakID,
                "dayID" : dayID,
                "stylistID" : stylistID,
                "userName" : userName,
                "breakStart" : breakStartValue[i],
                "breakEnd" : breakEndValue[i],
                "breakDuration" : breakDuration[i],
                "dayName" : dayName
            })
            .catch((error)=>{
                console.log(`Error in creating break times \n\n${error}`);
            });
            i++;
        }
        dayID += 604800000;
        weekCounter++;
    }
}