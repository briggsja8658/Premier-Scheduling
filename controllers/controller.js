//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const app = express();
const chalk = require("chalk");
const mainRouter = express.Router();
const schedule = require('node-schedule');
const upload = multer({
    limits: {
        fieldSize: 1024 * 100 * 50000 //50 MB limit, its too much but testing will determine how low it should go 
    },
    storage: multer.memoryStorage()
});



//Models and Imports
const Hash = require("../models/customTools/hash");
const DateTime = require("../models/customTools/dateTime");
const Image = require("../models/customTools/image");
const Customer = require("../models/dbFunctions/customer");
const Services = require("../models/dbFunctions/services");
const Stylist = require("../models/dbFunctions/stylist");
const Appointment = require("../models/dbFunctions/appointment");
const Time = require("../models/dbFunctions/time");
const WorkingHours = require("../models/dbFunctions/workingHours");
const BreakTimes = require("../models/dbFunctions/breakTimes");
const SavedAppointments = require("../models/dbFunctions/savedAppointments");
const Sorting = require("../models/customTools/sorting");
const TimeOff = require("../models/dbFunctions/timeOff");

const { PerformanceObserver, performance } = require("perf_hooks");


//Configs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Main page route shows all appointments for the day
mainRouter.route("/today")
    .get(async (req, res) => {
        let { userName, name } = req.cookies;
        appointmentsToday = await Appointment.findTodaysAppointments(userName);
        customerImages = await Customer.getImage(appointmentsToday);
        res.status(200).render("today", {
            name,
            appointmentsToday,
            customerImages
        });
    });


mainRouter.route("/getAppointments")
    .get(async (req, res) =>{
        let { userName } = req.cookies;
        appointmentsToday = await Appointment.findTodaysAppointments(userName);
        customerImages = await Customer.getImage(appointmentsToday);
        res.json({"appointmentsToday" : appointmentsToday, "customerImages" : customerImages});
    });


//Customer Routes
//This page displays all the customers relative to the stylist
mainRouter.route("/customers")
    .get(async (req, res) => {
        let { userName, name } = req.cookies;
        customers = await Customer.findAllCustomers(userName);
        res.status(200).render("customers", {
            name,
            customers
        });
    });


mainRouter.route("/newCustomer")
    .post(upload.single("profileImage"), async (req, res) => {
        //userName is the stylist so we can attach the new customer to the right stylist
        try{
            let { firstName, lastName, customerUserName, password, email, phoneNumber, profileImage, blankCanvas } = req.body;
            res.cookie("userName", customerUserName);
            res.cookie("customerUserName", customerUserName);
            res.cookie("name", firstName);
            res.cookie("stylist", false);
    
    
            if (blankCanvas === true){
                profileImage = "/profilePic/filler.png";
            }
            else if (blankCanvas === false) {
                profileImage = await Image.saveImage(profileImage, customerUserName); //Save with username
                await Image.formatImage(profileImage.rawPath);
            }
    
            customerID = await Customer.newCustomer(customerUserName, password, firstName, lastName, customerUserName, email, phoneNumber, profileImage.relativePath); //Returns the id of the newly made customer
            newCustomer = await Customer.findCustomerByID(customerID); //Get the new customer data and send it to the client to be appended to the dom
            res.json({ "error" : false, "complete" : true });
        }
        catch(error){
            res.json({ "error" : true, "complete" : false });
        }
    });


mainRouter.route("/newCustomerByStylist")
    .post(upload.single("profileImage"), async (req, res) => {
        //userName is the stylist so we can attach the new customer to the right stylist
        try{
            let { firstName, lastName, customerUserName, password, email, phoneNumber, profileImage } = req.body;
            let { userName } = req.cookies;
    
    
            if (profileImage !== undefined) {
                profileImage = await Image.saveImage(profileImage, customerUserName); //Save with username
                await Image.formatImage(profileImage.rawPath);
    
            }
            else {
                profileImage = "/profilePic/filler.png";
            }
    
            customerID = await Customer.newCustomer(userName, password, firstName, lastName, customerUserName, email, phoneNumber, profileImage.relativePath); //Returns the id of the newly made customer
            newCustomer = await Customer.findCustomerByID(customerID); //Get the new customer data and send it to the client to be appended to the dom
            res.json({ "error" : false, "complete" : true });
        }
        catch(error){
            res.json({ "error" : true, "complete" : false });
        }
    });


mainRouter.route("/editCustomer")
    .post(async (req, res) => {
        let { name, email, phoneNumber, customerId } = req.body;

        customerEdit = await Customer.editCustomer(customerId, name, phoneNumber, email);
        res.json(customerEdit);
    });


mainRouter.route("/deleteCustomer")
    .post(async (req, res) => {
        let { customerID } = req.body;
        try{
            await Customer.deleteCustomerByID(customerID);
            res.json({"complete" : true, "error" : false});
        }
        catch(error){
            console.log(`There was an error in deleting customer\n${error}\n\n${error.stack}`);
            res.json({"complete" : true, "error" : false});
        }
    });


//Appointment Routes
mainRouter.route("/schedule")
    .get(async (req, res) => {
        let name = req.cookies.name;
        customers = await Customer.findAllCustomers(req.cookies.userName);
        services = await Services.findAllServices(req.cookies.userName);
        res.status(200).render("schedule", {
            name,
            customers,
            services
        });
    })
    .post(async (req, res) => {
        try{
            let { userName } = req.cookies;
            let { 
                customerName, customerID, serviceNames, 
                serviceTimes, requestedServiceIDs, requestedTimeIDs, 
                dayString, slotCount 
            } = req.body;
    
            currentStylist = await Stylist.findStylistByUserName(userName);
            let dayID = DateTime.findAppointmentDayID(requestedTimeIDs[0]);
            slotTaken = await Time.fillTime(userName, requestedTimeIDs, requestedServiceIDs);
            if(slotTaken === false){
                await Appointment.makeAppointment(
                    customerName, customerID, userName, serviceNames, 
                    serviceTimes, requestedTimeIDs, dayString, slotCount,
                    currentStylist._id, "No Notes", "", 
                    `${currentStylist.firstName} ${currentStylist.lastName}`,
                    dayID
                );
            }

            if(slotTaken === true){
                res.json({complete : true, slotTaken : true, error : false});
            }
            else{
                res.json({complete : true, slotTaken : false, error : false});
            }
        }
        catch(error){
            console.log(`There was and error in making appointment in /schedule\n${error}\n\n\n${error.stack}`);
            res.json({complete : false, slotTaken : false, error : true})
        }
        
    });


//Services Routes
mainRouter.route("/services")
    .get(async (req, res) => {
        let { userName, name } = req.cookies;
        allServices = await Services.findAllServices(userName);
        res.render("services", {
            name,
            allServices
        });
    })
    .post(async (req, res) => {
        let { serviceName, charge, serviceID, timeSelectValues, timeSelectCount } = req.body;
        let { userName } = req.cookies;
        let stylist = await Stylist.findStylistByUserName(userName);
        let results = await Services.editService(
            req.cookies.userName,
            serviceName,
            charge,
            serviceID,
            timeSelectValues,
            timeSelectCount,
            stylist._id
        );
        res.json({ "error" : results.error, "complete" : results.complete });
    })
    .delete(async (req, res) => {
        let { serviceID } = req.body;
        result = await Services.deleteService(serviceID);
        res.json({ "error" : result.error, "complete" : result.complete })
    });


mainRouter.route("/allServices")
    .post(async(req, res)=>{
        let { stylistUserName } = req.body;
        allServices = await Services.findAllServices(userName);
        res.json(allServices);
    })


mainRouter.route("/newService")
    .post(async (req, res) => {
        t1 = performance.now();
        let { userName } = req.cookies;
        let { serviceName, charge, timeSelectValues, timeSelectCount } = req.body;
        let results = await Services.newService(userName, serviceName, charge, timeSelectValues, timeSelectCount);
        res.json({ "error" : results.error, "complete" : results.complete });
        console.log(`Time to make new service ${performance.now() - t1}`);
    });


//Stylist Routes
mainRouter.route("/newProfile")
    .get((req, res) => {
        //Define name of null so the template engine can print "welcome" on newStylist page
        let name = null;
        res.status(200).render("newProfile", {
            name
        });
    })


mainRouter.route("/newStylist")
    .post(upload.single("profileImage"),  (req, res) => {
        //Get data from req.body and req.file 
        //Note that req.file is from multer
        let { 
            firstName, lastName, userName, 
            email, password, phoneNumber, 
            profileImage, timeZoneOffset,
            businessName, streetAddress,
            city, state, zipCode, blankCanvas } = req.body;

        
            
        //Set cookies to get data relative to the user in other parts of the software
        (async()=>{
            res.cookie("userName", userName);
            res.cookie("customerUserName", userName);
            res.cookie("name", firstName);
            res.cookie("stylist", true);
                
            if(blankCanvas === "true"){
                profileImage = "/profilePic/filler.png";
            }
            else if (blankCanvas === "false") {
                profileImage = await Image.saveImage(profileImage, userName); //Save with username
                await Image.formatImage(profileImage.rawPath);
            }
    
            password = await Hash.sha256(password); //hash and return password to properly store it
            await Stylist.newStylist(
                firstName, lastName, userName, 
                email, password, phoneNumber, 
                profileImage, timeZoneOffset,
                businessName, streetAddress,
                city, state, zipCode 
            );
            
    
    
            stylist = await Stylist.findStylistByUserName(userName);
            await Time.createTime(stylist);
            //Enter the sytlist in the customer list 
            customerID = await Customer.newCustomer(userName, password, `${stylist.firstName}`, `${stylist.lastName}`, userName, email, phoneNumber, profileImage.relativePath); //Returns the id of the newly made customer
            timeIDs = await Appointment.defaultFillAppointmentsWithBreak(
                `${stylist.firstName} ${stylist.lastName}`, 
                stylist._id,
                stylist.userName, 
                stylist.timeZoneOffset,
                customerID
            );
            await Time.defaultFillTimeWithBreak(stylist, timeIDs, 2);
            await Services.defaultServices(firstName, lastName, userName, stylist._id);
            await WorkingHours.defaultWorkingHours(stylist._id, stylist.userName, firstName, lastName);
            await BreakTimes.defaultBreaks(stylist._id, stylist.userName, firstName, lastName);
        })();
        res.json({}); //close the cors conection
    });


mainRouter.route("/allStylist")
    .get(async (req, res) =>{
        allStylist = await Stylist.findAllStylists();
        res.json(allStylist);
    });


mainRouter.route("/findStylistBySearch")
    .post(async (req, res) => {
        start = performance.now();
        let { searchString } = req.body;
        allStylist = await Stylist.findAllStylists();
        sortedStylistList = Sorting.filterStylistBySearch(allStylist, searchString);
        res.json(sortedStylistList);
        console.log(`searchTime : ${performance.now() - start} Mils`)
    });

mainRouter.route("/findStylistByID")
    .post(async(req, res) =>{
        let { stylistID } = req.body;
        let stylist = await Stylist.findStylist(stylistID);
        res.send(stylist);
    });

mainRouter.route("/profile")
    .get(async (req, res) => {
        let { userName, name } = req.cookies;
        stylist = await Stylist.findStylistByUserName(userName);
        timeTaken = await TimeOff.getTimeOff(stylist._id);
        res.status(200).render("profile", {
            name,
            stylist,
            timeTaken
        });
    })
    .post(upload.single("profileImage"), async (req, res) => {
        try{
            let { newFirstName, newLastName, newEmail, newPhoneNumber, newProfileImage, stylistID, blankCanvas } = req.body;
            
            res.cookie("name", newFirstName);
            if (blankCanvas === "false") {
                formatedImage = await Image.saveImage(newProfileImage, req.cookies.userName); //Save with username
                await Image.formatImage(formatedImage.rawPath);
                await Stylist.editStylist(stylistID, newFirstName, newLastName, newEmail, newPhoneNumber, formatedImage);
            }
            else {
                await Stylist.editStylist(stylistID, newFirstName, newLastName, newEmail, newPhoneNumber, null);
            }
            res.json({ error : false, complete : true });
        }
        catch{
            res.json({ error : true, complete : false });
        }
    });


mainRouter.route("/checkUserName")
    .post(async (req, res) => {
        let { userName } = req.body;
        stylistUserName = await Stylist.findStylistByUserName(userName);
        if(stylistUserName !== undefined){
            res.send(false)
        }
        else{
            res.json(true);
        }

    });


mainRouter.route("/getTimesByID")
    .post(async (req, res)=>{
       let { stylistID } = req.body;
       avalibleTime = await Time.getTimesByID(stylistID);
       res.json(avalibleTime);
    });


mainRouter.route("/getServicesByID")
    .post(async (req, res)=>{
       let { stylistID } = req.body;
       services = await Services.getServicesByStylistID(stylistID);
       res.json(services);
    });


//Authentication Routes
mainRouter.route("/login")
    .get((req, res) => {
        let name = null;
        res.status(200).render("logIn", {
            name
        });
    })
    .post(async (req, res) => {
        let { userName, password } = req.body;

        isEmail = userName.match(/@/g);
        password = await Hash.sha256(password);

        if (isEmail !== null) {
            customer = await Customer.findByEmail(userName);
            stylist = await Stylist.findStylistByEmail(userName); //userName is the email string here
        }
        else {
            customer = await Customer.findByCustomerUserName(userName); 
            stylist = await Stylist.findStylistByUserName(userName); //userName is the "userName" here
        }

        if(stylist !== null) { //Check to see if the stylist was found. Note each stylist has a customer profile for there own breaks
            if(stylist.password === password){
                res.cookie("userName", stylist.userName);
                res.cookie("customerUserName", stylist.userName);
                res.cookie("name", stylist.firstName);
                res.cookie("stylist", "true");
                res.json({ 
                    "found" : true, 
                    "userName" : stylist.userName 
                });
            }
            else{
                res.json({ "found" : false });
            }
        }
        else if(customer !== null){ //Check to see if the customer was found.
            if(customer.password === null){ //If the customer exist but doesn't have a password. Make the user set a password
                res.cookie("userName", customer.customerUserName);
                res.cookie("customerUserName", customer.customerUserName);
                res.cookie("name", customer.customerName);
                res.cookie("stylist", false);
                res.json({ 
                    "found": true, 
                    "userName": customer.customerUserName, 
                    "name" : customer.firstName, 
                    "setPassword" : true 
                });
            }
            else if(customer.password === password){
                res.cookie("userName", customer.customerUserName);
                res.cookie("customerUserName", customer.customerUserName);
                res.cookie("name", customer.firstName);
                res.cookie("stylist", false);
                res.json({ 
                    "found": true, 
                    "userName": customer.customerUserName, 
                    "name" : customer.firstName, 
                    "customer" : true 
                });
            }
            else{
                res.json({ "found" : false });
            }
        }
        else {
            res.json({ "found" : false });
        }
    });


mainRouter.route("/logOut")
    .get((req, res) => {
        res.cookie("userName", "");
        res.cookie("customerUserName", "");
        res.cookie("name", "");
        res.cookie("stylist", "");
        res.redirect("/");
    });


mainRouter.route("/appointments")
    .get(async (req, res) => {
        let { userName, name } = req.cookies;

        appointments = await Appointment.findAllAppointments(userName);
        customerImages = await Customer.getImage(appointments);
        services = await Services.findAllServices(userName);
        times = await Time.findAllTimeSlots(userName);
        res.render("appointments", {
            name,
            appointments,
            customerImages,
            services,
            times
        });
    })
    .post(async (req, res) => {
        let { appointmentID, services, timeStart } = req.body;

        currentAppointment = await Appointment.findByID(appointmentID);
        await Appointment.editAppointment(appointmentID, services, timeStart, currentAppointment);


        res.json({
            "customerName" : currentAppointment[0].customerName,
            "day" : currentAppointment[0].day,
            "time" : currentAppointment[0].time,
            "services" : services
        });


    })
    .delete(async (req, res) =>{
        try{
            let { appointmentID } = req.body;
            currentAppointment = await Appointment.findAppointment(appointmentID);
            await Appointment.deleteByID(appointmentID);
            await Time.freeTime([Number(currentAppointment.timeID)], currentAppointment.timeSlots, currentAppointment.stylistID);

            res.json({ "complete" : true, "error" : false });
        }
        catch(error){
            res.json({ "complete" : false, "error" : true });
            console.log(`Error in appointment delete\n${error}\n\n${error.stack}`);
        }
        
        
    });

    //Get all services for a fetch request 

mainRouter.route("/appointmentFetch")
    .get(async (req, res) => {
        let { userName } = req.cookies;
        services = await Services.findAllServices(userName);
        times = await Time.findTime(userName);
        appointments = await Appointment.findAllUpcoming(userName);
        customerImages = await Customer.getImage(appointments);
        
        res.json({
            "services": services,
            "times": times,
            "appointments": appointments,
            "customerImages" : customerImages
        });
    })
    .post(async (req, res) => {
        let { appointmentID } = req.body;
        let { userName } = req.cookies;

        appointment = await Appointment.findAppointment(appointmentID);
        services = await Services.findAllServices(userName);
        times = await Time.findAllTimeSlots(userName);

        res.json({
            "appointment": appointment,
            "services": services,
            "times": times
        })

    });


mainRouter.route("/timeFetch")
    .get(async (req, res) => {
        userName = req.cookies.userName;
        time = await Time.findTime(userName);
        stylist = await Stylist.findStylistByUserName(userName);
        res.json({ "time": time, "timeOffset" : stylist.timeZoneOffset });
    })
    .post(async (req, res) =>{
        let { userName } = req.cookies;
        let { serviceID } = req.body;

        let time = await Time.findTime(userName);
        let currentService = await Services.findService(serviceID);

        res.json({ "time" : time, "timeSlots" : currentService.timeSlots });
    });



//Global Routes

//Find size of buffer
mainRouter.route("/imageSize")
    .post(upload.single("previewImg"), (req, res) => {
        let { previewImg } = req.body;
        image = Image.getImageSize(previewImg);
        res.send(image);
    })

//Everyday at 2 am add the next day for all users
schedule.scheduleJob("* * 2 * * *", () => {
    stylists = Stylist.findAllStylists();
    WorkingHours.update(stylists);
    BreakTimes.update(stylists);
    Appointment.updateAppointmentWithBreak(stylists);
    Time.updateBreakTime(stylists);
    Time.removeTime();
});


//Temp route for creating time to troubleshoot with
mainRouter.route("/createTime")
    .get(async (req, res) => {
        stylist = await Stylist.findAllStylists();
        await Time.createTime(stylist);
        await WorkingHours.update(stylist);
        await BreakTimes.update(stylist);
        await Appointment.updateAppointmentWithBreak(stylist);
        await Time.updateBreakTime(stylist);
        await Time.updateDayOff(stylist);
        res.send("done");
    });



//Customer routes
mainRouter.route("/main")
    .get(async(req, res) =>{
        if(req.cookies.customerUserName !== undefined){
            currentCustomer = await Customer.findByCustomerUserName(req.cookies.customerUserName);
            saved = await SavedAppointments.getSavedAppointments(req.cookies.customerUserName);
            upcoming = await Appointment.findUpcomingCustomerAppointments(currentCustomer._id);
            let name = req.cookies.name;
            savedStylist = { 
                "name": currentCustomer.savedStylistName, 
                "image" : currentCustomer.savedStylistPic,
                "stylistID" : currentCustomer.savedStylistID
            }
            res.render("customer/main",{
                saved,
                name,
                upcoming,
                savedStylist
            });
        }
        else{
            res.redirect("/");
        }
    });


mainRouter.route("/profileData")
    .get(async (req, res) => {
        let { userName } = req.cookies;
        breakTimes = await BreakTimes.findFilteredBreaks(userName);
        workingHours = await WorkingHours.findWorkingHours(userName);
        res.json({ "breakTimes": breakTimes, "workingHours": workingHours });
    });


mainRouter.route("/hoursEdit")
    .post(async (req, res) => {
        let {
            dayID,
            dayName,
            toDayOff,
            workStartValue,
            workEndValue,
            breakIDValue,
            breakStartValue,
            breakEndValue,
            wasDayOff,
            stylistID
        } = req.body;
        let { userName } = req.cookies;

        try{
            dayID = Number(dayID);
    
            stylist = await Stylist.findStylistByUserName(userName);
            stylistCustomer = await Customer.findByCustomerUserName(userName)
            let timeIDBreak = await DateTime.militaryToTimeID(breakStartValue, dayID, stylist.timeZoneOffset);
            let timeIDWork = await DateTime.militaryToTimeID(workStartValue, dayID, stylist.timeZoneOffset);
            let breakDuration = await DateTime.findTimeDuration(breakStartValue, breakEndValue);
            let workingDuration = await DateTime.findTimeDuration(workStartValue, workEndValue);
            if (toDayOff === "No" && wasDayOff === "true") {
                await Appointment.openAppointmentFromDayOff(stylistID, dayID);
                await Time.openTimesFromDayOff(stylistID, dayID);
            }
            else{
                await Time.freeTime(timeIDWork, workingDuration.timeSlots, stylistID);
            }
            await WorkingHours.edit(toDayOff, dayID, workStartValue, workEndValue, stylistID);
            await BreakTimes.edit(
                userName,
                stylistID,
                dayID,
                dayName,
                breakIDValue,
                breakStartValue,
                breakEndValue,
                breakDuration.timeSlots
            );
            await Appointment.removeStylistBreaks(stylistID, dayID);
            await Appointment.fillAppointmentWithBreak(
                `${stylist.firstName} ${stylist.lastName}`,
                stylistID,
                userName,
                breakStartValue,
                breakDuration.timeString,
                dayName,
                dayID,
                breakDuration.timeSlots,
                toDayOff,
                timeIDBreak,
                stylist.timeZoneOffset,
                stylistCustomer._id
            );
            await Time.changeWorkingHours(stylistID, workingDuration.timeSlots, timeIDWork, dayID, toDayOff);
            await Time.fillTimeWithBreak(stylistID, timeIDBreak, breakDuration.timeSlots);
            console.log(`Completed ${dayName}`);
            res.json({error : false, complete : true});
        }
        catch{
            res.json({error : false, complete : true});
        }
    });


mainRouter.route("/setPassword")
    .post((req, res)=>{
        let { userName, password } = req.body;
        Customer.setPassword(userName, password);
    });



mainRouter.route("/customerAppointment")
    .post(upload.single("appointmentImage"), async(req, res)=>{
        try{
            timeStart = performance.now();
            let { 
                newAppointmentName, saveAppointemnt, stylistID, 
                perferedStylist, serviceList, serviceIDList, timeID, 
                timeString, appointmentNotes, appointmentImage, dayString,
                timeSlots, blankCanvas
            } = req.body;
    
            let { customerUserName } = req.cookies;
    
            currentCustomer = await Customer.findByCustomerUserName(customerUserName);
            currentStylist = await Stylist.findStylist(stylistID);

            
            if(blankCanvas === "true"){
                appointmentImage = "/icon/default.webp";
            }
            
    
            if(saveAppointemnt === "true"){
                await SavedAppointments.saveAppointment(
                    newAppointmentName, stylistID, serviceList, 
                    serviceIDList, appointmentNotes, appointmentImage, 
                    customerUserName, currentCustomer, 
                    `${currentStylist.firstName} ${currentStylist.lastName}`,
                    appointmentImage, timeSlots
                );
            }
    
            if(perferedStylist === "true"){
                await Customer.updatePerferedStylist(
                    customerUserName, stylistID,
                    `${currentStylist.firstName} ${currentStylist.lastName}`, 
                    `${currentStylist.profileImage}`, currentStylist.userName
                );
            }
            
            timeIDs = DateTime.getTimeIDs(timeSlots, Number(timeID)); //This is to get all the time ids that we didn't get from the client / DOM
            slotTaken = await Time.fillTime(currentStylist.userName, timeIDs, serviceIDList, timeSlots);
    
            if(slotTaken === false){
                dayID = DateTime.getDayID();
                await Appointment.makeAppointment(
                    `${currentCustomer.firstName} ${currentCustomer.lastName}`,
                    currentCustomer._id, currentStylist.userName, serviceList, timeString, Number(timeID),
                    dayString, timeSlots, stylistID, appointmentNotes, appointmentImage,
                    `${currentStylist.firstName} ${currentStylist.lastName}`, dayID, newAppointmentName
                );
        
        
                timeEnd = performance.now();
                console.log(`${timeEnd - timeStart} mils`);
            }

            if(slotTaken === true){
                res.json({error : false, complete : false, slotTaken : true});
            }
            else{
                res.json({error : false, complete : true, slotTaken : false});
            }
        }
        catch(error){
            console.log(`There was an error in creating customer new appointment\n${error}\n\n${error.stack}`);
            res.json({error : true, complete : false, slotTaken : false});
        }



    });


mainRouter.route("/updateTemplate")
    .post(upload.single("appointmentImage"), async(req, res)=>{
        let { templateID, appointmentNameEdit, serviceList, serviceIDList, timeSlots, appointmentNotes, appointmentImage, blankCanvas } = req.body;
    
        if(blankCanvas === "true"){
            appointmentImage = "/icon/default.webp";
        }

        await SavedAppointments.editTemplate(
            templateID, appointmentNameEdit, serviceList, 
            serviceIDList, appointmentNotes, appointmentImage,
            req.cookies.customerUserName
        );
    });

mainRouter.route("/getStylistServices")
    .post(async(req, res)=>{
        let { stylistID } = req.body;
        stylistServices = await Services.findAllServicesByID(stylistID);
        res.json(stylistServices);
    });

mainRouter.route("/templateAppointment")
    .post(async(req, res)=>{
        let { selectedTimeID, templateID, timeString, dayString } = req.body;

        try{
            currentTemplate = await SavedAppointments.findTemplateByID(templateID);
            currentStylist = await Stylist.findStylist(currentTemplate.stylistID);
            dayID = DateTime.findAppointmentDayID(selectedTimeID);
            
            timeIDs = await DateTime.getTimeIDs(currentTemplate.timeSlots, Number(selectedTimeID)); //This is to get all the time ids that we didn't get from the client / DOM
            slotTaken = await Time.fillTime(currentStylist.userName, timeIDs, currentTemplate.serviceIDList, currentTemplate.timeSlots);
            if(slotTaken === false){
                await Appointment.makeAppointment(
                    `${currentTemplate.customerName}`,
                    currentTemplate.customerID, currentStylist.userName, 
                    currentTemplate.serviceList, 
                    timeString, Number(selectedTimeID), dayString, 
                    currentTemplate.timeSlots, currentTemplate.stylistID, 
                    currentTemplate.notes, currentTemplate.servicePic,
                    `${currentStylist.firstName} ${currentStylist.lastName}`,
                    dayID
                );
        
            }
            res.json({"complete" : true, "error" : false});
        }
        catch(error){
            console.log(`There was an error in template appointment\n${error}`);
            res.json({"error" : true, "complete" : true});
        }


    });


mainRouter.route("/deleteTemplate")
    .post(async(req, res)=>{
        try{
            let { currentTemplateID } = req.body;
            await SavedAppointments.deleteTemplate(currentTemplateID);
            res.json({error: false, complete : true});
        }
        catch(error){
            res.json({error: true, complete : false});
        }
    });



mainRouter.route("/timeOff")
    .post(async(req, res) =>{
        let { stylistID, timeStart, timeEnd } = req.body;
        let { userName } = req.cookies;

        try {
            timeStart = Number(timeStart);
            timeEnd = Number(timeEnd);

            let currentStylist = await Stylist.findStylist(stylistID);
            TimeOff.createTimeOff(stylistID, userName, `${currentStylist.firstName} ${currentStylist.lastName}`, timeStart, timeEnd);
            timeSlots = DateTime.findTimeSlots(timeStart, timeEnd);
            Time.clearTime(stylistID, timeStart, timeSlots);
            res.json({ 
                "complete" : true, 
                "error" : false,
                "timeStart" : timeStart,
                "timeEnd" : timeEnd 
            });
        }
        catch(error){
            console.log(`There was an error in creating time off\n${error}\n\n${error.stack}`);
            res.json({ "complete" : false, "error" : true });
        }
    })
    .delete(async(req, res)=>{
        let { timeOffID } = req.body;
        try{
            currentTimeOff = await TimeOff.getTimeOffByID(timeOffID);
            let deleted = await TimeOff.deleteTimeOff(timeOffID);
            if(deleted >= 1){
                timeSlots = DateTime.findTimeSlots(currentTimeOff.startTime, currentTimeOff.endTime);
                await Time.openTime(currentTimeOff.stylistID, currentTimeOff.startTime, timeSlots);
                let stylist = [];
                stylist[0] = currentTimeOff.stylistID;
                await WorkingHours.update(stylist);
                res.json({complete : true, error : false});
            }
            else{
                res.json({complete : false, error : true});
            }
        }
        catch(error){
            console.log(`There was an error deleting timeOff\n${error}\n\n${error.stack}`);
            res.json({complete : false, error : true});
        }
    });


module.exports = mainRouter;