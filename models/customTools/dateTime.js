const exportFunction = module.exports = {};
Time = require("../dbFunctions/time");
WorkingHours = require("../dbFunctions/workingHours");

exportFunction.leapYear = () => {
    dateTime = new Date();
    currentYear = `${dateTime.getFullYear()}`;
    if (currentYear % 4 === 0) {//check for if the year is divisable by 4
        if (currentYear % 100 === 0) {//by 100
            if (currentYear % 400 === 0) {//by 400
                days = 29;
            }
            else {
                days = 28;
            }//End of leftover by 400
        }
        else {
            days = 29;
        }//End of leftover by 100
    }
    else {
        days = 28;
    }//End of lefover by 4
    //End of leap year script
    return days;
}


exportFunction.findTimeSlots = (timeStart, timeEnd) =>{
    timeDiff = timeEnd - timeStart;
    timeSlots = timeDiff / 1800000;
    return timeSlots;
}


exportFunction.toStringMonth = (monthNumber) => {
    switch (monthNumber) {
        case 1:
            returnMonthString = "January";
            break;
        case 2:
            returnMonthString = "February";
            break;
        case 3:
            returnMonthString = "March";
            break;
        case 4:
            returnMonthString = "April";
            break;
        case 5:
            returnMonthString = "May";
            break;
        case 6:
            returnMonthString = "June";
            break;
        case 7:
            returnMonthString = "July";
            break;
        case 8:
            returnMonthString = "August";
            break;
        case 9:
            returnMonthString = "September";
            break;
        case 10:
            returnMonthString = "October";
            break;
        case 11:
            returnMonthString = "November";
            break;
        case 12:
            returnMonthString = "December";
            break;

    }
    return returnMonthString;
}


exportFunction.getWeekID = () => {
    //86,400,000 is 24 hours in ms
    //604,800,000 is 1 week in ms
    oneDay = 86400000;
    oneWeek = 604800000;
    timeNow = Date.now();
    timeDiff = timeNow % oneWeek;
    weekIDRaw = timeNow - timeDiff;
    weekID = weekIDRaw + (oneDay * 3);
    //Because Date.now() is based on Jan 1st 1970 there needs to be a 3 day offset to get to sunday which is the start of the working week 
    return weekID;
}


exportFunction.findTimeDuration = (startValue, endValue) => {
    timeString = [];
    timeSlots = [];

    if (typeof startValue === "string") {
        offsetHigh = false;
        offsetLow = false;

        if ((Number(startValue) - 30) % 100 === 0) { //Check to see if the start time is the bottom of the hour
            currentStart = Number(startValue) - 30; //Remove the 30 mins to be able to do math on this number
            offsetHigh = true; //Set to true to check if 30 mins need to be added on later
        }
        else {
            currentStart = Number(startValue);
        }

        if ((Number(endValue) - 30) % 100 === 0) {
            currentEnd = Number(endValue) - 30;
            offsetLow = true;
        }
        else {
            currentEnd = Number(endValue);
        }


        let breakDuration = ((currentEnd - currentStart) / 100); //Find how many hours without the 30 min offset
        if (breakDuration >= 1) { //Greater than 1 hour
            if (offsetHigh === true && offsetLow === false) { //If time is high lower by 30 mins
                timeSlots = (breakDuration - .5) * 2; // * 2 to repersent timeslots which are 30 mins
                timeString = `${breakDuration - .5} Hours`;
            }
            else if (offsetLow === true && offsetHigh === false) { //If time is low rase by 30 mins
                timeSlots = (breakDuration + .5) * 2;
                timeString = `${breakDuration + .5} Hours`;
            }
            else { //If there is no offset record slots and string
                timeSlots = breakDuration * 2;
                timeString = `${breakDuration} Hours`;
            }
        }
        else if (breakDuration === 1) {
            timeString = "30 Mins";
            timeSlots = 1;
        }
    }
    else {
        for (let x = 0; x < startValue.length; x++) {
            offsetHigh = false;
            offsetLow = false;

            if ((Number(startValue[x]) - 30) % 100 === 0) {//Check to see if the start time is the bottom of the hour
                currentStart = Number(startValue[x]) - 30; //Remove the 30 mins to be able to do math on this number
                offsetHigh = true; //Set to true to check if 30 mins need to be added on later
            }
            else {
                currentStart = Number(startValue[x]);
            }

            if ((Number(endValue[x]) - 30) % 100 === 0) {
                currentEnd = Number(endValue[x]) - 30;
                offsetLow = true;
            }
            else {
                currentEnd = Number(endValue[x]);
            }


            let breakDuration = ((currentEnd - currentStart) / 100); //Find how many hours without the 30 min offset
            if (breakDuration >= 1) { //Greater than 1 hour
                if (offsetHigh === true && offsetLow === false) { //If time is high reduce by 30 mins
                    timeSlots[x] = (breakDuration - .5) * 2; // * 2 to repersent timeslots which are 30 mins
                    timeString[x] = `${breakDuration - .5} Hours`;
                }
                else if (offsetLow === true && offsetHigh === false) { //If time is low rase by 30 mins
                    timeSlots[x] = (breakDuration + .5) * 2;
                    timeString[x] = `${breakDuration + .5} Hours`;
                }
                else { //If there is no offset record slots and string
                    timeSlots[x] = breakDuration * 2;
                    timeString[x] = `${breakDuration} Hours`;
                }
            }
            else if (breakDuration === 0) {
                timeString[x] = "30 Mins";
                timeSlots[x] = 1;
            }

        }
    }
    return {
        timeString,
        timeSlots
    }

}


exportFunction.getMonthDays = (monthNumber) => {
    currentMonthType = monthNumber % 2;
    if(currentMonthType === 0 && monthNumber === 2) {
        monthDays = leapYear(); //Get month days for feb
    }
    else if(currentMonthType === 0 && monthNumber !== 8) {
        monthDays = 30;
    }
    else if(currentMonthType === 0 && monthNumber === 8) {
        monthDays = 31; //There are 31 days in august
    }
    else if(currentMonthType === 1 && monthNumber === 9){
        monthDays = 30;  //Because July and August have 31 days Sep must be set manually
    }
    else{
        monthDays = 31;
    }

    return monthDays;
}


exportFunction.getDayID = () => {
    oneDay = 86400000;
    timeNow = Date.now();
    timeDiff = timeNow % oneDay;
    dayID = timeNow - timeDiff;
    return dayID;
}


exportFunction.findAppointmentDayID = (appointmentTime)=>{
    oneDay = 86400000;
    timeDiff = appointmentTime % oneDay;
    dayID = appointmentTime - timeDiff;
    return dayID;
}


exportFunction.oneTimeIDFromMilitaryTime = (breakStart, dayID, timeZoneOffset) => {
    let timeID;
    switch (breakStart) {
        case 0000:
            timeID = (dayID + (1800000 * 0) + timeZoneOffset);
            break;
        case 0030:
            timeID = (dayID + (1800000 * 1) + timeZoneOffset);
            break;
        case 0100:
            timeID = (dayID + (1800000 * 2) + timeZoneOffset);
            break;
        case 0130:
            timeID = (dayID + (1800000 * 3) + timeZoneOffset);
            break;
        case 0200:
            timeID = (dayID + (1800000 * 4) + timeZoneOffset);
            break;
        case 0230:
            timeID = (dayID + (1800000 * 5) + timeZoneOffset);
            break;
        case 0300:
            timeID = (dayID + (1800000 * 6) + timeZoneOffset);
            break;
        case 0330:
            timeID = (dayID + (1800000 * 7) + timeZoneOffset);
            break;
        case 0400:
            timeID = (dayID + (1800000 * 8) + timeZoneOffset);
            break;
        case 0430:
            timeID = (dayID + (1800000 * 9) + timeZoneOffset);
            break;
        case 0500:
            timeID = (dayID + (1800000 * 10) + timeZoneOffset);
            break;
        case 0530:
            timeID = (dayID + (1800000 * 11) + timeZoneOffset);
            break;
        case 0600:
            timeID = (dayID + (1800000 * 12) + timeZoneOffset);
            break;
        case 0630:
            timeID = (dayID + (1800000 * 13) + timeZoneOffset);
            break;
        case 0700:
            timeID = (dayID + (1800000 * 14) + timeZoneOffset);
            break;
        case 0730:
            timeID = (dayID + (1800000 * 15) + timeZoneOffset);
            break;
        case 0800:
            timeID = (dayID + (1800000 * 16) + timeZoneOffset);
            break;
        case 0830:
            timeID = (dayID + (1800000 * 17) + timeZoneOffset);
            break;
        case 0900:
            timeID = (dayID + (1800000 * 18) + timeZoneOffset);
            break;
        case 0930:
            timeID = (dayID + (1800000 * 19) + timeZoneOffset);
            break;
        case 1000:
            timeID = (dayID + (1800000 * 20) + timeZoneOffset);
            break;
        case 1030:
            timeID = (dayID + (1800000 * 21) + timeZoneOffset);
            break;
        case 1100:
            timeID = (dayID + (1800000 * 22) + timeZoneOffset);
            break;
        case 1130:
            timeID = (dayID + (1800000 * 23) + timeZoneOffset);
            break;
        case 1200:
            timeID = (dayID + (1800000 * 24) + timeZoneOffset);
            break;
        case 1230:
            timeID = (dayID + (1800000 * 25) + timeZoneOffset);
            break;
        case 1300:
            timeID = (dayID + (1800000 * 26) + timeZoneOffset);
            break;
        case 1330:
            timeID = (dayID + (1800000 * 27) + timeZoneOffset);
            break;
        case 1400:
            timeID = (dayID + (1800000 * 28) + timeZoneOffset);
            break;
        case 1430:
            timeID = (dayID + (1800000 * 29) + timeZoneOffset);
            break;
        case 1500:
            timeID = (dayID + (1800000 * 30) + timeZoneOffset);
            break;
        case 1530:
            timeID = (dayID + (1800000 * 31) + timeZoneOffset);
            break;
        case 1600:
            timeID = (dayID + (1800000 * 32) + timeZoneOffset);
            break;
        case 1630:
            timeID = (dayID + (1800000 * 33) + timeZoneOffset);
            break;
        case 1700:
            timeID = (dayID + (1800000 * 34) + timeZoneOffset);
            break;
        case 1730:
            timeID = (dayID + (1800000 * 35) + timeZoneOffset);
            break;
        case 1800:
            timeID = (dayID + (1800000 * 36) + timeZoneOffset);
            break;
        case 1830:
            timeID = (dayID + (1800000 * 37) + timeZoneOffset);
            break;
        case 1900:
            timeID = (dayID + (1800000 * 38) + timeZoneOffset);
            break;
        case 1930:
            timeID = (dayID + (1800000 * 39) + timeZoneOffset);
            break;
        case 2000:
            timeID = (dayID + (1800000 * 40) + timeZoneOffset);
            break;
        case 2030:
            timeID = (dayID + (1800000 * 41) + timeZoneOffset);
            break;
        case 2100:
            timeID = (dayID + (1800000 * 42) + timeZoneOffset);
            break;
        case 2130:
            timeID = (dayID + (1800000 * 43) + timeZoneOffset);
            break;
        case 2200:
            timeID = (dayID + (1800000 * 44) + timeZoneOffset);
            break;
        case 2230:
            timeID = (dayID + (1800000 * 45) + timeZoneOffset);
            break;
        case 2300:
            timeID = (dayID + (1800000 * 46) + timeZoneOffset);
            break;
        case 2330:
            timeID = (dayID + (1800000 * 47) + timeZoneOffset);
            break;
    }
    return timeID;
}


exportFunction.militaryToTimeID = (timeIDStart, dayID, timeZoneOffset) => {
    timeID = [];
    if (typeof timeIDStart === "string") {
        switch (Number(timeIDStart)) {
            case 0:
                timeID[0] = (dayID + (1800000 * 0) + timeZoneOffset);
                break;
            case 30:
                timeID[0] = (dayID + (1800000 * 1) + timeZoneOffset);
                break;
            case 100:
                timeID[0] = (dayID + (1800000 * 2) + timeZoneOffset);
                break;
            case 130:
                timeID[0] = (dayID + (1800000 * 3) + timeZoneOffset);
                break;
            case 200:
                timeID[0] = (dayID + (1800000 * 4) + timeZoneOffset);
                break;
            case 230:
                timeID[0] = (dayID + (1800000 * 5) + timeZoneOffset);
                break;
            case 300:
                timeID[0] = (dayID + (1800000 * 6) + timeZoneOffset);
                break;
            case 330:
                timeID[0] = (dayID + (1800000 * 7) + timeZoneOffset);
                break;
            case 400:
                timeID[0] = (dayID + (1800000 * 8) + timeZoneOffset);
                break;
            case 430:
                timeID[0] = (dayID + (1800000 * 9) + timeZoneOffset);
                break;
            case 500:
                timeID[0] = (dayID + (1800000 * 10) + timeZoneOffset);
                break;
            case 530:
                timeID[0] = (dayID + (1800000 * 11) + timeZoneOffset);
                break;
            case 600:
                timeID[0] = (dayID + (1800000 * 12) + timeZoneOffset);
                break;
            case 630:
                timeID[0] = (dayID + (1800000 * 13) + timeZoneOffset);
                break;
            case 700:
                timeID[0] = (dayID + (1800000 * 14) + timeZoneOffset);
                break;
            case 730:
                timeID[0] = (dayID + (1800000 * 15) + timeZoneOffset);
                break;
            case 800:
                timeID[0] = (dayID + (1800000 * 16) + timeZoneOffset);
                break;
            case 830:
                timeID[0] = (dayID + (1800000 * 17) + timeZoneOffset);
                break;
            case 900:
                timeID[0] = (dayID + (1800000 * 18) + timeZoneOffset);
                break;
            case 930:
                timeID[0] = (dayID + (1800000 * 19) + timeZoneOffset);
                break;
            case 1000:
                timeID[0] = (dayID + (1800000 * 20) + timeZoneOffset);
                break;
            case 1030:
                timeID[0] = (dayID + (1800000 * 21) + timeZoneOffset);
                break;
            case 1100:
                timeID[0] = (dayID + (1800000 * 22) + timeZoneOffset);
                break;
            case 1130:
                timeID[0] = (dayID + (1800000 * 23) + timeZoneOffset);
                break;
            case 1200:
                timeID[0] = (dayID + (1800000 * 24) + timeZoneOffset);
                break;
            case 1230:
                timeID[0] = (dayID + (1800000 * 25) + timeZoneOffset);
                break;
            case 1300:
                timeID[0] = (dayID + (1800000 * 26) + timeZoneOffset);
                break;
            case 1330:
                timeID[0] = (dayID + (1800000 * 27) + timeZoneOffset);
                break;
            case 1400:
                timeID[0] = (dayID + (1800000 * 28) + timeZoneOffset);
                break;
            case 1430:
                timeID[0] = (dayID + (1800000 * 29) + timeZoneOffset);
                break;
            case 1500:
                timeID[0] = (dayID + (1800000 * 30) + timeZoneOffset);
                break;
            case 1530:
                timeID[0] = (dayID + (1800000 * 31) + timeZoneOffset);
                break;
            case 1600:
                timeID[0] = (dayID + (1800000 * 32) + timeZoneOffset);
                break;
            case 1630:
                timeID[0] = (dayID + (1800000 * 33) + timeZoneOffset);
                break;
            case 1700:
                timeID[0] = (dayID + (1800000 * 34) + timeZoneOffset);
                break;
            case 1730:
                timeID[0] = (dayID + (1800000 * 35) + timeZoneOffset);
                break;
            case 1800:
                timeID[0] = (dayID + (1800000 * 36) + timeZoneOffset);
                break;
            case 1830:
                timeID[0] = (dayID + (1800000 * 37) + timeZoneOffset);
                break;
            case 1900:
                timeID[0] = (dayID + (1800000 * 38) + timeZoneOffset);
                break;
            case 1930:
                timeID[0] = (dayID + (1800000 * 39) + timeZoneOffset);
                break;
            case 2000:
                timeID[0] = (dayID + (1800000 * 40) + timeZoneOffset);
                break;
            case 2030:
                timeID[0] = (dayID + (1800000 * 41) + timeZoneOffset);
                break;
            case 2100:
                timeID[0] = (dayID + (1800000 * 42) + timeZoneOffset);
                break;
            case 2130:
                timeID[0] = (dayID + (1800000 * 43) + timeZoneOffset);
                break;
            case 2200:
                timeID[0] = (dayID + (1800000 * 44) + timeZoneOffset);
                break;
            case 2230:
                timeID[0] = (dayID + (1800000 * 45) + timeZoneOffset);
                break;
            case 2300:
                timeID[0] = (dayID + (1800000 * 46) + timeZoneOffset);
                break;
            case 2330:
                timeID[0] = (dayID + (1800000 * 47) + timeZoneOffset);
                break;
        }
    }
    else {
        for (let x = 0; x < timeIDStart.length; x++) {
            switch (Number(timeIDStart[x])) {
                case 0000:
                timeID[x] = (dayID + (1800000 * 0) + timeZoneOffset);
                break;
            case 0030:
                timeID[x] = (dayID + (1800000 * 1) + timeZoneOffset);
                break;
            case 0100:
                timeID[x] = (dayID + (1800000 * 2) + timeZoneOffset);
                break;
            case 0130:
                timeID[x] = (dayID + (1800000 * 3) + timeZoneOffset);
                break;
            case 0200:
                timeID[x] = (dayID + (1800000 * 4) + timeZoneOffset);
                break;
            case 0230:
                timeID[x] = (dayID + (1800000 * 5) + timeZoneOffset);
                break;
            case 0300:
                timeID[x] = (dayID + (1800000 * 6) + timeZoneOffset);
                break;
            case 0330:
                timeID[x] = (dayID + (1800000 * 7) + timeZoneOffset);
                break;
            case 0400:
                timeID[x] = (dayID + (1800000 * 8) + timeZoneOffset);
                break;
            case 0430:
                timeID[x] = (dayID + (1800000 * 9) + timeZoneOffset);
                break;
            case 0500:
                timeID[x] = (dayID + (1800000 * 10) + timeZoneOffset);
                break;
            case 0530:
                timeID[x] = (dayID + (1800000 * 11) + timeZoneOffset);
                break;
            case 0600:
                timeID[x] = (dayID + (1800000 * 12) + timeZoneOffset);
                break;
            case 0630:
                timeID[x] = (dayID + (1800000 * 13) + timeZoneOffset);
                break;
            case 0700:
                timeID[x] = (dayID + (1800000 * 14) + timeZoneOffset);
                break;
            case 0730:
                timeID[x] = (dayID + (1800000 * 15) + timeZoneOffset);
                break;
            case 0800:
                timeID[x] = (dayID + (1800000 * 16) + timeZoneOffset);
                break;
            case 0830:
                timeID[x] = (dayID + (1800000 * 17) + timeZoneOffset);
                break;
            case 0900:
                timeID[x] = (dayID + (1800000 * 18) + timeZoneOffset);
                break;
            case 0930:
                timeID[x] = (dayID + (1800000 * 19) + timeZoneOffset);
                break;
            case 1000:
                timeID[x] = (dayID + (1800000 * 20) + timeZoneOffset);
                break;
            case 1030:
                timeID[x] = (dayID + (1800000 * 21) + timeZoneOffset);
                break;
            case 1100:
                timeID[x] = (dayID + (1800000 * 22) + timeZoneOffset);
                break;
            case 1130:
                timeID[x] = (dayID + (1800000 * 23) + timeZoneOffset);
                break;
            case 1200:
                timeID[x] = (dayID + (1800000 * 24) + timeZoneOffset);
                break;
            case 1230:
                timeID[x] = (dayID + (1800000 * 25) + timeZoneOffset);
                break;
            case 1300:
                timeID[x] = (dayID + (1800000 * 26) + timeZoneOffset);
                break;
            case 1330:
                timeID[x] = (dayID + (1800000 * 27) + timeZoneOffset);
                break;
            case 1400:
                timeID[x] = (dayID + (1800000 * 28) + timeZoneOffset);
                break;
            case 1430:
                timeID[x] = (dayID + (1800000 * 29) + timeZoneOffset);
                break;
            case 1500:
                timeID[x] = (dayID + (1800000 * 30) + timeZoneOffset);
                break;
            case 1530:
                timeID[x] = (dayID + (1800000 * 31) + timeZoneOffset);
                break;
            case 1600:
                timeID[x] = (dayID + (1800000 * 32) + timeZoneOffset);
                break;
            case 1630:
                timeID[x] = (dayID + (1800000 * 33) + timeZoneOffset);
                break;
            case 1700:
                timeID[x] = (dayID + (1800000 * 34) + timeZoneOffset);
                break;
            case 1730:
                timeID[x] = (dayID + (1800000 * 35) + timeZoneOffset);
                break;
            case 1800:
                timeID[x] = (dayID + (1800000 * 36) + timeZoneOffset);
                break;
            case 1830:
                timeID[x] = (dayID + (1800000 * 37) + timeZoneOffset);
                break;
            case 1900:
                timeID[x] = (dayID + (1800000 * 38) + timeZoneOffset);
                break;
            case 1930:
                timeID[x] = (dayID + (1800000 * 39) + timeZoneOffset);
                break;
            case 2000:
                timeID[x] = (dayID + (1800000 * 40) + timeZoneOffset);
                break;
            case 2030:
                timeID[x] = (dayID + (1800000 * 41) + timeZoneOffset);
                break;
            case 2100:
                timeID[x] = (dayID + (1800000 * 42) + timeZoneOffset);
                break;
            case 2130:
                timeID[x] = (dayID + (1800000 * 43) + timeZoneOffset);
                break;
            case 2200:
                timeID[x] = (dayID + (1800000 * 44) + timeZoneOffset);
                break;
            case 2230:
                timeID[x] = (dayID + (1800000 * 45) + timeZoneOffset);
                break;
            case 2300:
                timeID[x] = (dayID + (1800000 * 46) + timeZoneOffset);
                break;
            case 2330:
                timeID[x] = (dayID + (1800000 * 47) + timeZoneOffset);
                break;
            }
        }
    }

    return timeID;

}


exportFunction.militaryToStringTime = (militaryTime) => {
    switch (militaryTime) {
        case 0000:
            stringTime = "12 am";
            break;

        case 0030:
            stringTime = "12:30 am";
            break;

        case 0100:
            stringTime = "1 am";
            break;

        case 0130:
            stringTime = "1:30 am";
            break;

        case 0200:
            stringTime = "2 am";
            break;

        case 0230:
            stringTime = "2:30 am";
            break;

        case 0300:
            stringTime = "3 am";
            break;

        case 0330:
            stringTime = "3:30 am";
            break;

        case 0400:
            stringTime = "4 am";
            break;

        case 0430:
            stringTime = "4:30 am";
            break;

        case 0500:
            stringTime = "5 am";
            break;

        case 0530:
            stringTime = "5:30 am";
            break;

        case 0600:
            stringTime = "6 am";
            break;

        case 0630:
            stringTime = "6:30 am";
            break;

        case 0700:
            stringTime = "7 am";
            break;

        case 0730:
            stringTime = "7:30 am";
            break;

        case 0800:
            stringTime = "8 am";
            break;

        case 0830:
            stringTime = "8:30 am";
            break;

        case 0900:
            stringTime = "9 am";
            break;

        case 0930:
            stringTime = "9:30 am";
            break;

        case 1000:
            stringTime = "10 am";
            break;

        case 1030:
            stringTime = "10:30 am";
            break;

        case 1100:
            stringTime = "11 am";
            break;

        case 1130:
            stringTime = "11:30 am";
            break;

        case 1200:
            stringTime = "12 pm";
            break;

        case 1230:
            stringTime = "12:30 pm";
            break;

        case 1300:
            stringTime = "1 pm";
            break;

        case 1330:
            stringTime = "1:30 pm";
            break;

        case 1400:
            stringTime = "2 pm";
            break;

        case 1430:
            stringTime = "2:30 pm";
            break;

        case 1500:
            stringTime = "3 pm";
            break;

        case 1530:
            stringTime = "3:30 pm";
            break;

        case 1600:
            stringTime = "4 pm";
            break;

        case 1630:
            stringTime = "4:30 pm";
            break;

        case 1700:
            stringTime = "5 pm";
            break;

        case 1730:
            stringTime = "5:30 pm";
            break;

        case 1800:
            stringTime = "6 pm";
            break;

        case 1830:
            stringTime = "6:30 pm";
            break;

        case 1900:
            stringTime = "7 pm";
            break;

        case 1930:
            stringTime = "7:30 pm";
            break;

        case 2000:
            stringTime = "8 pm";
            break;

        case 2030:
            stringTime = "8:30 pm";
            break;

        case 2100:
            stringTime = "9 pm";
            break;

        case 2130:
            stringTime = "9:30 pm";
            break;

        case 2200:
            stringTime = "10 pm";
            break;

        case 2230:
            stringTime = "10:30 pm";
            break;

        case 2300:
            stringTime = "11 pm";
            break;

        case 2330:
            stringTime = "11:30 pm";
            break;

    }
    return stringTime;
}


exportFunction.miltaryToTwelveHour = (breakStart) => {
    stringTime = [];
    for (let x = 0; x < breakStart.length; x++) {
        switch (Number(breakStart[x])) {
            case 0000:
                stringTime[x] = "12 am";
                break;

            case 0030:
                stringTime[x] = "12:30 am";
                break;

            case 0100:
                stringTime[x] = "1 am";
                break;

            case 0130:
                stringTime[x] = "1:30 am";
                break;

            case 0200:
                stringTime[x] = "2 am";
                break;

            case 0230:
                stringTime[x] = "2:30 am";
                break;

            case 0300:
                stringTime[x] = "3 am";
                break;

            case 0330:
                stringTime[x] = "3:30 am";
                break;

            case 0400:
                stringTime[x] = "4 am";
                break;

            case 0430:
                stringTime[x] = "4:30 am";
                break;

            case 0500:
                stringTime[x] = "5 am";
                break;

            case 0530:
                stringTime[x] = "5:30 am";
                break;

            case 0600:
                stringTime[x] = "6 am";
                break;

            case 0630:
                stringTime[x] = "6:30 am";
                break;

            case 0700:
                stringTime[x] = "7 am";
                break;

            case 0730:
                stringTime[x] = "7:30 am";
                break;

            case 0800:
                stringTime[x] = "8 am";
                break;

            case 0830:
                stringTime[x] = "8:30 am";
                break;

            case 0900:
                stringTime[x] = "9 am";
                break;

            case 0930:
                stringTime[x] = "9:30 am";
                break;

            case 1000:
                stringTime[x] = "10 am";
                break;

            case 1030:
                stringTime[x] = "10:30 am";
                break;

            case 1100:
                stringTime[x] = "11 am";
                break;

            case 1130:
                stringTime[x] = "11:30 am";
                break;

            case 1200:
                stringTime[x] = "12 pm";
                break;

            case 1230:
                stringTime[x] = "12:30 pm";
                break;

            case 1300:
                stringTime[x] = "1 pm";
                break;

            case 1330:
                stringTime[x] = "1:30 pm";
                break;

            case 1400:
                stringTime[x] = "2 pm";
                break;

            case 1430:
                stringTime[x] = "2:30 pm";
                break;

            case 1500:
                stringTime[x] = "3 pm";
                break;

            case 1530:
                stringTime[x] = "3:30 pm";
                break;

            case 1600:
                stringTime[x] = "4 pm";
                break;

            case 1630:
                stringTime[x] = "4:30 pm";
                break;

            case 1700:
                stringTime[x] = "5 pm";
                break;

            case 1730:
                stringTime[x] = "5:30 pm";
                break;

            case 1800:
                stringTime[x] = "6 pm";
                break;

            case 1830:
                stringTime[x] = "6:30 pm";
                break;

            case 1900:
                stringTime[x] = "7 pm";
                break;

            case 1930:
                stringTime[x] = "7:30 pm";
                break;

            case 2000:
                stringTime[x] = "8 pm";
                break;

            case 2030:
                stringTime[x] = "8:30 pm";
                break;

            case 2100:
                stringTime[x] = "9 pm";
                break;

            case 2130:
                stringTime[x] = "9:30 pm";
                break;

            case 2200:
                stringTime[x] = "10 pm";
                break;

            case 2230:
                stringTime[x] = "10:30 pm";
                break;

            case 2300:
                stringTime[x] = "11 pm";
                break;

            case 2330:
                stringTime[x] = "11:30 pm";
                break;

        }
    }


    return stringTime;
}


exportFunction.calcTimes = (timeNow, currentDay, timeZoneOffset) => {
    if (currentDay !== 0) {
        timeNow = timeNow + (currentDay * 86400000); // set timeNow for each new day
    }

    timeDiff = timeNow % 86400000; //Divide by 24 hours the left over is the time that has occord today
    timeStartPoint = timeNow - timeDiff; //Find midnight
    dayID = timeStartPoint;

    time = [];
    timeID = [];
    timeOpen = [];
    active = [];
    let hour = findHour(dayID, timeZoneOffset);
    time = createStringTime(hour);
    for (let x = 0; x <= 47; x++) { //This is default time for est
        switch (hour) {
            case 0: //0000 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 1: //0030 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 2: //0100 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 3: //0130 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 4: //0200 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 5: //0230 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 6: //0300 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 7: //0330 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 8: //0400 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 9: //0430 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 10: //0500 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 11: //0530 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 12: //0600 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 13: //0630 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 14: //0700 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 15: //0730 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 16: //0800 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 17: //0830 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 18: //0900 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 19: //0930 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 20: //1000 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 21: //1030 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 22: //1100 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 23: //1130 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 24: //1200 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 25: //1230 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 26: //1300 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 27: //1330 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 28: //1400 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 29: //1430 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 30: //1500 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 31: //1530 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 32: //1600 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 33: //1630 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = true;
                active[x] = false;
                break;

            case 34: //1700 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 35: //1730 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 36: //1800 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 37: //1830 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 38: //1900 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 39: //1930 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 40: //2000 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 41: //2030 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 42: //2100 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 43: //2130 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 44: //2200 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 45: //2230 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 46: //2300 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;

            case 47: //2330 GMT
                timeID[x] = timeStartPoint;
                timeOpen[x] = false;
                active[x] = true;
                break;
        }
        timeStartPoint = timeStartPoint + 1800000;
        if (hour === 47) {
            hour = 0;
        }
        else {
            hour++;
        }
    }

    return {
        time,
        timeID,
        dayID,
        timeOpen,
        active
    }
}


exportFunction.createStringTime = (timeID, timeZoneOffset) => {
    timeID = timeID + timeZoneOffset;
    leftOverDay = timeID % 86400000;
    hour = leftOverDay / 1800000;
    switch (hour) {
        case 0000:
            stringTime = "12 am";
            break;

        case 0030:
            stringTime = "12:30 am";
            break;

        case 0100:
            stringTime = "1 am";
            break;

        case 0130:
            stringTime = "1:30 am";
            break;

        case 0200:
            stringTime = "2 am";
            break;

        case 0230:
            stringTime = "2:30 am";
            break;

        case 0300:
            stringTime = "3 am";
            break;

        case 0330:
            stringTime = "3:30 am";
            break;

        case 0400:
            stringTime = "4 am";
            break;

        case 0430:
            stringTime = "4:30 am";
            break;

        case 0500:
            stringTime = "5 am";
            break;

        case 0530:
            stringTime = "5:30 am";
            break;

        case 0600:
            stringTime = "6 am";
            break;

        case 0630:
            stringTime = "6:30 am";
            break;

        case 0700:
            stringTime = "7 am";
            break;

        case 0730:
            stringTime = "7:30 am";
            break;

        case 0800:
            stringTime = "8 am";
            break;

        case 0830:
            stringTime = "8:30 am";
            break;

        case 0900:
            stringTime = "9 am";
            break;

        case 0930:
            stringTime = "9:30 am";
            break;

        case 1000:
            stringTime = "10 am";
            break;

        case 1030:
            stringTime = "10:30 am";
            break;

        case 1100:
            stringTime = "11 am";
            break;

        case 1130:
            stringTime = "11:30 am";
            break;

        case 1200:
            stringTime = "12 pm";
            break;

        case 1230:
            stringTime = "12:30 pm";
            break;

        case 1300:
            stringTime = "1 pm";
            break;

        case 1330:
            stringTime = "1:30 pm";
            break;

        case 1400:
            stringTime = "2 pm";
            break;

        case 1430:
            stringTime = "2:30 pm";
            break;

        case 1500:
            stringTime = "3 pm";
            break;

        case 1530:
            stringTime = "3:30 pm";
            break;

        case 1600:
            stringTime = "4 pm";
            break;

        case 1630:
            stringTime = "4:30 pm";
            break;

        case 1700:
            stringTime = "5 pm";
            break;

        case 1730:
            stringTime = "5:30 pm";
            break;

        case 1800:
            stringTime = "6 pm";
            break;

        case 1830:
            stringTime = "6:30 pm";
            break;

        case 1900:
            stringTime = "7 pm";
            break;

        case 1930:
            stringTime = "7:30 pm";
            break;

        case 2000:
            stringTime = "8 pm";
            break;

        case 2030:
            stringTime = "8:30 pm";
            break;

        case 2100:
            stringTime = "9 pm";
            break;

        case 2130:
            stringTime = "9:30 pm";
            break;

        case 2200:
            stringTime = "10 pm";
            break;

        case 2230:
            stringTime = "10:30 pm";
            break;

        case 2300:
            stringTime = "11 pm";
            break;

        case 2330:
            stringTime = "11:30 pm";
            break;

    }
    return stringTime;
}


exportFunction.checkForDST = (checkTimeID) => {
    monthStart = getMonthID(checkTimeID);
    monthStartDateObject = new Date(monthStart);
    oneYearInMil = 31557600000;
    oneMonthInMil = 2629800000;
    oneWeekInMil = 604800016;
    oneDayInMil = 86400000;
    dst = false;
    dayFound = false;
    dayCheck =0;


    //Find if timeID is after the second sunday of March
    currentYear = checkTimeID % oneYearInMil; //Find the year
    currentMonth = currentYear / oneMonthInMil; //Find the month
    currentMonthLeftOver = currentYear % oneMonthInMil;
    if(currentMonth >= 3 && currentMonth < 12){ //Check to see if the month range is correct
        currentWeekLeftOver = currentMonthLeftOver % oneWeekInMil; 
        
        if(currentMonth >= 3 && currentMonth < 4){ //If month is March check too see if it's passed the second sunday
            currentDay = monthStartDateObject.getDay();

            while(dayCheck < 7 && dayFound === false){
                if(currentDay === dayCheck){
                    firstSunday = currentWeekLeftOver + (oneDayInMil * dayCheck);
                    if((firstSunday + oneWeekInMil) <= checkTimeID){ //Check to see if the second Sunday time is less than the checking time. If so then dst is true
                        dst = true;
                        dayFound = true;
                    }
                }
                dayCheck++;
            }
            
            
        }
        else if(currentMonth >= 11 && currentMonth < 12){
            currentDay = monthStartDateObject.getDay();
            while(dayCheck < 7 && dayFound === false){
                if(currentDay === dayCheck){
                    firstSunday = currentWeekLeftOver + (oneDayInMil * dayCheck);
                    if(firstSunday <= checkTimeID){ //Check to see if the second Sunday time is less than the checking time. If so then dst is true
                        dst = true;
                        dayFound = true;
                    }
                }
                dayCheck++;
            }
            
        }

    }

    return dst;
}

exportFunction.getTimeIDs = (timeSlots, timeIDStart) =>{
    let i = 1;
    let timeIDs = [];
    timeIDs[0] = timeIDStart;
    while(i < timeSlots){
        timeIDs[i] = timeIDStart += 1800000;
        i++;
    }
    return timeIDs;
}

exportFunction.createReadableDay = (milSeconds)=>{
    let localDate = new Date();
    let localTimeZone = localDate.getTimezoneOffset();
    let dateGMT = new Date(milSeconds + (localTimeZone * 60000));
    rawString = dateGMT.toDateString();
    returnString = rawString.slice(0, 10);
    return returnString;
}


function getMonthID(checkTimeID){
    oneMonth = 2629800000;
    timeDiff = checkTimeID % oneMonth;
    monthID = checkTimeID - timeDiff;
    return monthID;
}

function findHour(timeID, timeZoneOffset) {
    timeID = timeID - timeZoneOffset;
    leftOverDay = timeID % 86400000;
    hour = leftOverDay / 1800000;
    return hour;
}


function createStringTime(hour) {
    time = [];
    for (let x = 0; x <= 47; x++) {
        switch (hour) {
            case 0:
                time[x] = "12 am";
                break;
            case 1:
                time[x] = "12:30 am";
                break;
            case 2:
                time[x] = "1 am";
                break;
            case 3:
                time[x] = "1:30 am";
                break;
            case 4:
                time[x] = "2 am";
                break;
            case 5:
                time[x] = "2:30 am";
                break;
            case 6:
                time[x] = "3 am";
                break;
            case 7:
                time[x] = "3:30 am";
                break;
            case 8:
                time[x] = "4 am";
                break;
            case 9:
                time[x] = "4:30 am";
                break;
            case 10:
                time[x] = "5 am";
                break;
            case 11:
                time[x] = "5:30 am";
                break;
            case 12:
                time[x] = "6 am";
                break;
            case 13:
                time[x] = "6:30 am";
                break;
            case 14:
                time[x] = "7 am";
                break;
            case 15:
                time[x] = "7:30 am";
                break;
            case 16:
                time[x] = "8 am";
                break;
            case 17:
                time[x] = "8:30 am";
                break;
            case 18:
                time[x] = "9 am";
                break;
            case 19:
                time[x] = "9:30 am";
                break;
            case 20:
                time[x] = "10 am";
                break;
            case 21:
                time[x] = "10:30 am";
                break;
            case 22:
                time[x] = "11 am";
                break;
            case 23:
                time[x] = "11:30 am";
                break;
            case 24:
                time[x] = "12 pm";
                break;
            case 25:
                time[x] = "12:30 pm";
                break;
            case 26:
                time[x] = "1 pm";
                break;
            case 27:
                time[x] = "1:30 pm";
                break;
            case 28:
                time[x] = "2 pm";
                break;
            case 29:
                time[x] = "2:30 pm";
                break;
            case 30:
                time[x] = "3 pm";
                break;
            case 31:
                time[x] = "3:30 pm";
                break;
            case 32:
                time[x] = "4 pm";
                break;
            case 33:
                time[x] = "4:30 pm";
                break;
            case 34:
                time[x] = "5 pm";
                break;
            case 35:
                time[x] = "5:30 pm";
                break;
            case 36:
                time[x] = "6 pm";
                break;
            case 37:
                time[x] = "6:30 pm";
                break;
            case 38:
                time[x] = "7 pm";
                break;
            case 39:
                time[x] = "7:30 pm";
                break;
            case 40:
                time[x] = "8 pm";
                break;
            case 41:
                time[x] = "8:30 pm";
                break;
            case 42:
                time[x] = "9 pm";
                break;
            case 43:
                time[x] = "9:30 pm";
                break;
            case 44:
                time[x] = "10 pm";
                break;
            case 45:
                time[x] = "10:30 pm";
                break;
            case 46:
                time[x] = "11 pm";
                break;
            case 47:
                time[x] = "11:30 pm";
                break;
        }
        if (hour === 47) {
            hour = 0;
        }
        else {
            hour++;
        }

    }
    return time;
}


function leapYear() {
    dateTime = new Date();
    currentYear = `${dateTime.getFullYear()}`;
    currentMonth = `${dateTime.getMonth() + 1}`;
    if (currentYear % 4 === 0) {//check for if the year is divisable by 4
        if (currentYear % 100 === 0) {//by 100
            if (currentYear % 400 === 0) {//by 400
                days = 29;
            }
            else {
                days = 28;
            }//End of div by 400
        }
        else {
            days = 29;
        }//End of div by 100
    }
    else {
        days = 28;
    }//End of div by 4
    //End of leap year script
    return days;
}