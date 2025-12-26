
const Service = require("./services");
const Appointment = require("./appointment");
const Time = require("../schema/timeSchema");
const DateTime = require("../customTools/dateTime");
const WorkingHours = require("../dbFunctions/workingHours");
const Hash = require("../customTools/hash");

const chalk = require("chalk");

const exportFunction = module.exports = {};
const { PerformanceObserver, performance } = require("perf_hooks");


exportFunction.defaultFillTimeWithBreak = async (stylist, timeIDs, timeSlots) => {
    for (let x = 0; x < stylist.length; x++) {
        for (let y = 0; y < timeIDs.length; y++) {
            timeID = timeIDs[y];
            for (let z = 0; z < timeSlots; z++) {
                Time.findOneAndUpdate({
                    $and: [{ "userName" : stylist[x].userName }, { "timeID" : timeID }]
                },
                    {
                        timeOpen: false,
                        timeSlotActive: true //Time slot needs to be active so there is not an ablity to make an appointment durning a break
                    })
                    .catch((error) => {
                        console.log(`There was an error in Fill Time\n\n${error.stack}`);
                    });

                timeID += 1800000;
            }
        }
    }
}


exportFunction.fillTimeWithBreak = async (stylistID, timeBreakID, timeSlots) => {
    for (let x = 0; x < timeBreakID.length; x++) {
        weekCount = 0;
        while(weekCount < 12){
            let currentTimeID = timeBreakID[x] + (604800000 * weekCount);

            for(let y =0; y < timeSlots[x]; y++){
                await Time.updateOne(
                    { 
                        stylistID : stylistID, timeID : currentTimeID
                    },
                    {
                        timeOpen: false,
                        timeSlotActive: true //Time slot needs to be active so there is not an ablity to make an appointment durning a break
                    })
                    .catch((error) => {
                        console.log(`There was an error in Fill Time\n\n${error.stack}`);
                    });
        
                    currentTimeID += 1800000;
            }
            weekCount++;
        }
        
    }
}


exportFunction.updateDayOff = async(stylistID) =>{
    //When new time is created check for time off
    workingHours = await WorkingHours.findWorkingHoursByID(stylistID);
    times = await getTimesByID(stylistID[0]._id);
    let i = 0;
    let x = 0;
    let updated = false;
    while(i < workingHours.length){
        x = 0;
        updated = false;
        while(x < times.length){
            if(workingHours[i].dayID === times[x].dayID){
                if(workingHours[i].dayOff === true && updated === false){
                    await Time.updateMany(
                        { "dayID" : times[x].dayID },
                        { timeOpen : false, timeSlotActive : true }
                    )
                    updated = true;
                }
            }
            x++;
        }
        i++;
    }
}


exportFunction.updateBreakTime = async (stylist) => {
    for (let x = 0; x < stylist.length; x++) {
        breakTimes = await Appointment.findBreaks(stylist[x].userName);
        for (let y = 0; y < breakTimes.length; y++) {
            newTimeID = breakTimes[y].timeID + (86400000 * 7);
            Time.updateOne(
                {
                    "timeID" : newTimeID,
                    "userName" : stylist[x].userName
                },
                {
                    timeOpen : false,
                    timeSlotActive : true
                }
            );
        }
    }
}


exportFunction.openTimesFromDayOff = (userName, timeID) => {
    weekCount =0;
    orginalTimeID = timeID;
    while(weekCount < 12){
        timeID = orginalTimeID + (weekCount * 604800000);
        for (let x = 0; x <= 47; x++) {
            Time.findOneAndUpdate(
                { "userName": userName, "timeID": timeID },
                {
                    timeOpen: true,
                    timeSlotActive : false
                }
            )
                .then((data) => {
                    console.log(data);
                });
            timeID += 1800000;
        }
        weekCount++;
    }

}


exportFunction.fillTime = async (userName, rawTimeIDs, rawServiceIDs) => {
    slotTypes = [];
    slotTaken = false;

    requestedTimeIDs = [];
    if(rawTimeIDs.length === undefined){
        requestedTimeIDs[0] = rawTimeIDs;
    }
    else{
        let i =0;
        while(i < rawTimeIDs.length){
            requestedTimeIDs[i] = rawTimeIDs[i];
            i++;
        }
    }

    requestedServiceIDs = [];
    if(typeof rawServiceIDs === "string"){
        seperateIDs = rawServiceIDs.split(",");
        let y = 0;
        while(y < seperateIDs.length){
            requestedServiceIDs[y] = seperateIDs[y];
            y++;
        }
    }
    else{
        let i =0;
        while(i < rawServiceIDs.length){
            requestedServiceIDs[i] = rawServiceIDs[i];
            i++;
        }
    }

    for (let x = 0; x < requestedServiceIDs.length; x++) {
        currentTimeSlot = await findTimeSlot(requestedTimeIDs[x], userName);

        if(currentTimeSlot.timeOpen === false && currentTimeSlot.timeSlotActive === true){
            slotTaken = true;
            return slotTaken;
        }
        else{
            currentService = await Service.findService(requestedServiceIDs[x]);
            i = 0;
            while(i < currentService.timeSlots){
                await Time.findOneAndUpdate({
                    "userName": userName,  
                    "timeID": requestedTimeIDs[i]
                },
                    {
                        timeOpen: false,
                        timeSlotActive: currentService.slotType[i]
                    })
                    .then(data => {
                        console.log(`Result from time fill : ${data}`);
                    })
                    .catch((error) => {
                        console.log(`There was an error in Fill Time\n\n${error.stack}`);
                    });
                i++;
            }
        }
    }
    return slotTaken;
}


exportFunction.freeTime = async (timeID, workingDuration, stylistID) => {
    weekCount =0;
    let localTimeID = timeID[0];
    while(weekCount < 12){
        localTimeID = timeID[0] + (weekCount * 604800000);
        for(let x =0; x <= workingDuration; x++){
            await Time.findOneAndUpdate(
                { stylistID : stylistID,  timeID : localTimeID },
                {
                    timeOpen: true,
                    timeSlotActive: false
                });
            localTimeID += 1800000; //Advance to the next time slot which is 30 mins
        }
        weekCount++;
    }
}


async function checkDate(checkDate, userName) {
    foundDay = await Time.find({ $and: [{ dayID: checkDate }, { userName: userName }] })
        .then((foundDay) => {
            if (foundDay.length === 0) {
                return false;
            }
            else {
                return true;
            }
        })
        .catch((error) => {
            console.log(error, "There was an error in checkDate");
        });
    return foundDay;
}




exportFunction.createTime = async (stylist) => {
    t0 = performance.now();
    date = new Date();
    timeNow = Date.now();
    let currentDay = date.getDate();
    monthNumber = date.getMonth() + 1;
    monthString = DateTime.toStringMonth(monthNumber);
    monthDays = DateTime.getMonthDays(monthNumber);
    if(stylist.length !== undefined){
        stylistLength = stylist.length;
    }
    else{
        stylistLength = 1;
        stylist[0] = stylist;
    }



    for(let y = 0; y < stylistLength; y++) {
        timeZoneOffset = stylist[y].timeZoneOffset;
        for (let x = 0; x < 90; x++) { //Loop for creating days
            let timeData = await DateTime.calcTimes(timeNow, x, timeZoneOffset); //Times for each day
            if (currentDay <= monthDays) {
                foundDate = await checkDate(timeData.dayID, stylist[y].userName);
                if (foundDate === false) {
                    for (let z = 0; z <= 47; z++) {
                        docID = await Hash.getObjectId();
                        dstOffset = DateTime.checkForDST(timeData.timeID[z]);
                        if(dstOffset === true){
                            timeData.timeID[z] = timeData.timeID[z] + 3600000;
                        }
                        await Time.create({
                            _id : docID,
                            userName : stylist[y].userName,
                            stylistID : stylist[y]._id,
                            name : stylist[y].name,
                            day : `${monthString} ${currentDay}`,
                            dayID : timeData.dayID,
                            timeID : timeData.timeID[z],
                            time : timeData.time[z],
                            timeOpen : timeData.timeOpen[z],
                            timeSlotActive : timeData.active[z],
                            vacationTime : false
                        })
                        .catch((error) => {
                            console.log(`There was an error in creating this months times:\n${error}\n${error.stack}`);
                        });
                        
                    }
                }
                currentDay++;
            }
            else {
                //Reset for the next month
                monthNumber++;
                currentMonthType = monthNumber % 2;
                monthString = DateTime.toStringMonth(monthNumber);
                monthDays = DateTime.getMonthDays(monthNumber);
                currentDay = 1;

                foundDate = await checkDate(timeData.dayID, stylist[y].userName);
                if (foundDate === false) {
                    for (let z = 0; z <= 47; z++) {
                        docID = await Hash.getObjectId();
                        dstOffset = DateTime.checkForDST(timeData.timeID[z]);
                        if(dstOffset === true){
                            timeData.timeID[z] = timeData.timeID[z] + 3600000;
                        }
                        await Time.create({
                            _id : docID,
                            userName : stylist[y].userName,
                            stylistID : stylist[y]._id,
                            name : stylist[y].name,
                            day : `${monthString} ${currentDay}`,
                            dayID : timeData.dayID,
                            timeID : timeData.timeID[z],
                            time : timeData.time[z],
                            timeOpen : timeData.timeOpen[z],
                            timeSlotActive : timeData.active[z],
                            vacationTime : false
                        })
                        .catch((error) => {
                            console.log(`There was an error in creating this months times:\n${error}\n${error.stack}`);
                        });
                        
                    }
                }
                currentDay++;
            }
        }
        t1 = performance.now();
        console.log(chalk.redBright(`\n\nTime to create schedual: ${t1 - t0}\n\n`));

    }
}


exportFunction.removeTime = () => {
    timeNow = Date.now();
    timeDiff = timeNow % 86400000;
    startingDayPoint = timeNow - timeDiff; //Find midnight
    Time.deleteMany({ timeID: { $lt: startingDayPoint } });
}


exportFunction.findTime = async (userName) => {
    let currentTime = Date.now(); //18,000,000 is the adjustment for est time zone to gtm
    times = await Time.find({
        $and : [
            { "userName" : userName },
            { "timeID" : { $gt : currentTime }},
            { 
                $or : [
                    { "timeOpen" : true },
                    { "timeSlotActive" : false }
                ] 
            }
        ]
    });
    return times;
}


exportFunction.findAllTimeSlots = async (userName) => {
    currentTime = Date.now();
    times = await Time.find({
        $and: [{ userName: userName },
        { timeID: { $gte: currentTime } }]
    });
    return times;
}


exportFunction.changeWorkingHours = async (stylistID, timeSlots, timeID, dayID, toDayOff) => {
    currentTime = Date.now();
    let localTimeID = dayID; //localTimeID is used in the loop repersenting the current day
    let savedDayID = dayID;
    let y = 0;
    while(y < 12){
        for(x = 0; x < 47; x++){ //This will take all the times for the day off so no one can request an appointment
            await Time.findOneAndUpdate({ //Clear prior hours
                stylistID : stylistID,  "timeID" : localTimeID
            },
            {
                timeOpen : false,
                timeSlotActive : true
                //Time slot needs to be active so there is not an ablity to make an appointment durning a break
            })
            .catch((error) => {
                console.log(`There was an error in Fill Time\n\n${error.stack}`);
            });
            localTimeID += 1800000;
        }
        dayID = dayID + 604800000;
        localTimeID = dayID;
        y++;
    }
        
    if(toDayOff === "No"){
        y = 0;
        savedTimeID = timeID[0];
        localTimeID = savedTimeID;
        while(y < 12){
            for (x = 0; x <= timeSlots; x++) {
                await Time.findOneAndUpdate({ //Create new hours
                    stylistID : stylistID, "timeID": localTimeID 
                },
                {
                    timeOpen : true,
                    timeSlotActive : false 
                })
                .catch((error) => {
                    console.log(`There was an error in Fill Time\n\n${error.stack}`);
                });
        
                localTimeID += 1800000;
            }
            savedTimeID += 604800000;
            localTimeID = savedTimeID;
            y++;
        }
    }
}



exportFunction.getTimesByID = async (stylistID) =>{
    let currentTime = Date.now();
    times = await Time.find({ 
        $and : [
            { "stylistID" : stylistID },
            { "timeID" : { $gt : currentTime }},
            { 
                $or : [
                    { "timeOpen" : true },
                    { "timeSlotActive" : false }
                ] 
            }
        ]
    });
    console.log(`Time data \n${times[0]}`);
    return times;
}


exportFunction.clearTime = async(stylistID, timeStart, timeSlots)=>{
    let i =0;
    while(i < timeSlots){
        await Time.updateOne({
            "stylistID" : stylistID,
            timeID : timeStart
        },
        {
            timeOpen : false,
            timeSlotActive : true,
            vacationTime : true
        });
        timeStart += 1800000;
        i++;
    }
}


exportFunction.openTime = async(stylistID, timeStart, timeSlots)=>{
    let i =0;
    while(i < timeSlots){
        await Time.updateOne({
            "stylistID" : stylistID,
            timeID : timeStart
        },
        {
            timeOpen : true,
            timeSlotActive : false,
            vacationTime : false
        });
        timeStart += 1800000;
        i++;
    }
}


async function getTimesByID(stylistID){
    times = await Time.find({"stylistID" : stylistID});
    return times;
}


async function findTimeSlot(timeID, userName){
    timeSlot = await Time.findOne({"timeID" : timeID, "userName" : userName});
    return timeSlot;
}
