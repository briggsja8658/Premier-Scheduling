function mainInit(){
    searchForStylistListener();
    newAppointmentListener();
    createAppointmentListener();
    savedStylistServices();
    savedAppointmentListener();
    editTemplateListener();
    submitTemplateEditListener();
    stopBubble();
    templateAppointmentListner();
    templateSumbitAppointmentListener();
    deleteTemplateListener();
}

function stopBubble(){
    inputs = document.getElementsByTagName("input");
    textBoxs = document.getElementsByTagName("textarea");
    buttons = document.querySelectorAll(".buttonPrimary, .buttonNeutral, .buttonCaution, .buttonSecondary");
    rows = document.getElementsByClassName("row");
    templateTimesConatiner = document.getElementsByClassName("templateTimeContainer");

    for(let i =0; i < inputs.length; i++){
        inputs[i].removeEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }
    for(let i =0; i < inputs.length; i++){
        inputs[i].addEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }


    for(let i =0; i < textBoxs.length; i++){
        textBoxs[i].removeEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }
    for(let i =0; i < textBoxs.length; i++){
        textBoxs[i].addEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }


    for(let i =0; i < buttons.length; i++){
        buttons[i].removeEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }
    for(let i =0; i < buttons.length; i++){
        buttons[i].addEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }
    

    for(let i =0; i < templateTimesConatiner.length; i++){
        templateTimesConatiner[i].removeEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }
    for(let i =0; i < templateTimesConatiner.length; i++){
        templateTimesConatiner[i].addEventListener("click", (event)=>{
            event.cancelBubble = true;
        });
    }

}

function appendSortedStylist(sortedStylistList){
    if(sortedStylistList.length > 0){
        stylistFoundContainer = document.getElementById("stylistFoundContainer");
        let i = 0;
        while(i < sortedStylistList.length){
            //Container for stylist so it can work with flexbox
            stylistContainer = document.createElement("div");
            stylistContainer.setAttribute("class", "col-12 col-md-6 stylistContainer elmSmallMarginTop");
            stylistFoundContainer.appendChild(stylistContainer);
            
            //Main anchor to select the stylist
            stylistAnchor = document.createElement("a");
            stylistAnchor.setAttribute("class", "stylist row no-gutters buttonNeutral");
            stylistContainer.appendChild(stylistAnchor);
    
            //Profile image container
            imageContainer = document.createElement("div");
            imageContainer.setAttribute("class", "col-4 imageContainer");
            stylistAnchor.appendChild(imageContainer);
            
            //Profile image
            stylistImage = document.createElement("img");
            stylistImage.src = `${sortedStylistList[i].profileImage}`;
            stylistImage.setAttribute("class", "stylistImage");
            imageContainer.appendChild(stylistImage);
    
            //Stylist Name Container
            detailsContainer = document.createElement("div");
            detailsContainer.setAttribute("class", "col-8 stylistDetails");
            stylistAnchor.appendChild(detailsContainer);
    
            //Stylist Name Info
            stylistName = document.createElement("div");
            stylistName.setAttribute("class", "stylistName");
            stylistName.innerHTML = `${sortedStylistList[i].firstName} ${sortedStylistList[i].lastName}`;
            detailsContainer.appendChild(stylistName);
    
            //Street Address
            businessName = document.createElement("div");
            businessName.setAttribute("class", "businessName");
            businessName.innerHTML = `${sortedStylistList[i].businessName}`;
            detailsContainer.appendChild(businessName);
            
            //City
            city = document.createElement("div");
            city.setAttribute("class", "cityState");
            city.innerHTML = `${sortedStylistList[i].city}, ${sortedStylistList[i].state}`;
            detailsContainer.appendChild(city);

            //Stylist ID
            stylistID = document.createElement("div");
            stylistID.setAttribute("class", "stylistID hidden");
            stylistID.innerHTML = `${sortedStylistList[i]._id}`;
            detailsContainer.appendChild(stylistID);
    
            i++;
        }
    }
}

function removeServices(){
    currentServices = document.getElementById("serviceContainer").children;
    let i =0; 
    while(i < currentServices.length){
        currentServices[i].remove();
    }
}

function getServices(stylistID){
    fetch("/getServicesByID", {
        method : "post",
        mode : "cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({"stylistID" : stylistID})
    })
    .then(async(response) =>{
        serviceData = await response.json();
        appendServices(serviceData);
    });
}
function appendServices(serviceData){
    //Set up container and row
    serviceContainer = document.getElementById("serviceContainer");
    serviceRow = createDiv("class", "row no-gutters");
    serviceContainer.appendChild(serviceRow);

    let i =0;
    while(i < serviceData.length){
        service = createDiv("class","col-12 col-md-6 service buttonNeutral centerText elmSmallestMarginTop", `${serviceData[i].serviceName}`);
        serviceRow.appendChild(service);

        serviceID = createDiv("class", "serviceID hidden", `${serviceData[i]._id}`);
        service.appendChild(serviceID);

        timeSlot = createDiv("class", "timeSlot hidden", `${serviceData[i].timeSlots}`);
        service.appendChild(timeSlot);

        i++;
    }

    serviceListeners();

}
function serviceListeners(){
    services = document.getElementsByClassName("service");
    for(let i =0; i < services.length; i++){
        services[i].addEventListener("click", ()=>{
            clearTimes();
            serviceSelector(services[i]);
            getTimes();
        });
    }
}

function clearTimes(){
    timesContainer = document.getElementById("timesContainer");

    //Remove any prior times
    priorTimes = timesContainer.children;
    if(priorTimes.length > 1){
        let i =0;
        while(i < priorTimes.length){
            priorTimes[i].remove();

        }
    }

}

function clearStylist(){
    stylistContainer = document.getElementById("stylistFoundContainer");

    //Remove any prior stylist
    priorList = stylistContainer.children;
    if(priorList.length > 0){
        priorList[0].remove();
    }
    
}

function clearServices(){
    serviceContainer = document.getElementById("serviceContainer");

    //Remove any prior times
    priorList = serviceContainer.children;
    if(priorList.length > 0){
        priorList[0].remove();
    }
}

function serviceSelector(currentService){
    //Toogle off the selection if the user request it
	if (currentService.classList.contains("selected") === false) {
		currentService.classList.add("selected");
	}
	else if (currentService.classList.contains("selected") === true) {
		currentService.classList.remove("selected");
	}
}

function getStylistID(){
    allStylist = document.getElementsByClassName("stylist");
    allIDs = document.getElementsByClassName("stylistID");
    let numberOfStylist = allStylist.length;
    let i = 0; 
    let stylistID = null;
    while(i < numberOfStylist){
        if(allStylist[i].classList.contains("selected") === true){
            stylistID = allIDs[i].innerHTML;
            i = numberOfStylist;
        }
        i++;
    }
    return stylistID;
}

function getTimes(){
    
    stylistID = getStylistID();
    fetch("/getTimesByID",{
        method : "post",
        mode : "cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({"stylistID" :stylistID})
    })
    .then(async(response) =>{
        timeData = await response.json();
        appendTimes(timeData, null);
    });
}

function appendTimes(timeData){
    //Set up container and row
    timesRow = createDiv("class","row no-gutters");
    timesContainer.appendChild(timesRow);
    
    //Init vars for time filter
    sequenceTest = timeData[1].timeID;
    
    timeStart = timeData[0].timeID;
    timeStartString = timeData[0].time;
    currentTime = timeData[0].timeID;
    
    currentDay = 0;
    dayString = timeData[0].day;
    
    currentCount = 0;
    dayCount = 1;
    timesLength = timeData.length - 1;
    hiddenTimes = false;
    

    //Get the number of time slots the customer is looking for
    slotCount = getSlotCount();
    

    //Loop to find appointment times
    let i = 0;
    
    while(i < timesLength){
        varReset = false;
        if((timeData[i].timeID + 1800000) === timeData[i + 1].timeID){ //See if the next time in the array is a half hour from the last test
            currentCount++;
            if(currentCount === slotCount){ //When there is enough time slots for the requested appointment append the start of the sequence
                //Append the day if last day appened is different
                if(currentDay !== timeData[i].dayID){
                    dayCount++;
                    dayString = timeData[i].day;
                    if(dayCount <= 14){
                        dayDiv = createDiv("class", "col-12 dayTitle title2 elmSmallMarginTop", `${dayString}`);
                    }
                    else if(dayCount > 14){
                        dayDiv = createDiv("class", "col-12 hidden dayTitle dayToggle title2 elmSmallMarginTop", `${dayString}`);
                        hiddenTimes = true;
                    }
                    timesRow.appendChild(dayDiv);
                    currentDay = timeData[i].dayID;
                }

                appendAvalibleTime(timeStartString, timeStart, timesRow, slotCount, dayCount, dayString);
                varReset = true;
            }
        }
        else{
            varReset = true;
        }

        i++;

        if(varReset === true && i < timesLength){
            timeStartString = timeData[i].time;
            timeStart = timeData[i].timeID;
            currentCount = 0;
        }
    }

    if(hiddenTimes === true){
        showAllButton = createATag(["id", "class"], ["showAllButton","buttonNeutral timesHidden col-12 elmSmallMarginTop"], "Show All");
        timesContainer.appendChild(showAllButton);
        showAllListener();
    }

    timeListeners();
}

function showAllListener(){
    showAllButton = document.getElementById("showAllButton");

    showAllButton.addEventListener("click", ()=>{
        allTimesToggle(showAllButton);
    });
}

function allTimesToggle(showAllButton){

    timeContainers = document.getElementsByClassName("timeContainer");
    dayContainers = document.getElementsByClassName("dayTitle");
    if(showAllButton.classList.contains("timesHidden") === true){

        showAllButton.innerHTML = "Hide Times";
        showAllButton.setAttribute("class", "buttonCaution");
        
        let i = 0;
        while(i < timeContainers.length){
            if(timeContainers[i].classList.contains("hidden") === true){
                timeContainers[i].classList.remove("hidden");
            }
            i++;
        }

        i = 0;
        while(i < dayContainers.length){
            if(dayContainers[i].classList.contains("hidden") === true){
                dayContainers[i].classList.remove("hidden");
            }
            i++;
        }

    }
    else{
        showAllButton.innerHTML = "Show All";
        showAllButton.setAttribute("class", "buttonNeutral timesHidden");

        let i = 0;
        while(i < timeContainers.length){
            if(timeContainers[i].classList.contains("timeToggle") === true){
                timeContainers[i].classList.add("hidden");
            }
            i++;
        }

        i = 0;
        while(i < dayContainers.length){
            if(dayContainers[i].classList.contains("dayToggle") === true){
                dayContainers[i].classList.add("hidden");
            }
            i++;
        }
    }


}

function timeListeners(){
    times = document.getElementsByClassName("time");
    for(let i=0; i < times.length; i++){
        times[i].addEventListener("click", ()=>{
            timeToggle(times[i], times);
        });
    }
}

function timeToggle(currentTimeButton, times){
    let i = 0;
    while(i < times.length){
        times[i].classList.remove("selected");
        i++;
    }

    currentTimeButton.classList.add("selected");

}


function appendAvalibleTime(timeString, timeID, timesRow, timeSlots, dayCount, dayString){

    if(dayCount <= 14){
        timeContainer = createDiv("class", "timeContainer col-6 col-md-6 col-lg-4 elmSmallestMarginTop");
    }
    else{
        timeContainer = createDiv("class", "timeContainer col-6 col-md-6 col-lg-4 hidden timeToggle elmSmallestMarginTop");
    }
    timesRow.appendChild(timeContainer);

    timeIDDiv = createDiv("class", "hidden timeID", `${timeID}`);
    timeContainer.appendChild(timeIDDiv);

    dayStringDiv = createDiv("class", "hidden dayString", `${dayString}`);
    timeContainer.appendChild(dayStringDiv);

    slotCountDiv = createDiv("class", "hidden slotCount", `${timeSlots}`);
    timeContainer.appendChild(slotCountDiv);

    timeSelector = createATag("class", "buttonNeutral time", `${timeString}`);
    timeContainer.appendChild(timeSelector);
}

function getSlotCount(){
    services = document.getElementsByClassName("service");
    timeSlots = document.getElementsByClassName("timeSlot");
    slotCount = 0;

    let i =0;
    while(i < services.length){
        if(services[i].classList.contains("selected") === true){
            slotCount = slotCount + Number(timeSlots[i].innerHTML);
        }
        i++;
    }

    return slotCount;
}


function stylistToggleListener(){
    stylist = document.getElementsByClassName("stylist");
    stylistIDs = document.getElementsByClassName("stylistID");
	for(let i=0; i < stylist.length; i++){
		stylist[i].removeEventListener("click", () => {
			stylistToggle(stylist[i], stylist);
            removeServices();
            getServices(stylistIDs[i].innerHTML);
		});
	}
	for(let i=0; i < stylist.length; i++){
		stylist[i].addEventListener("click", () => {
			stylistToggle(stylist[i], stylist);
            removeServices();
            getServices(stylistIDs[i].innerHTML);
		});
	}
}
function stylistToggle(currentStylist, stylistArray){
    let i =0;
    while(i < stylistArray.length){
        if(stylistArray[i].classList.contains("selected") === true){
            stylistArray[i].classList.remove("selected"); //Remove selected state from the currently selected stylsit
        }
        i++;
    }
    currentStylist.classList.add("selected");
}


function savedStylistServices(){
    stylistSavedID = document.getElementsByClassName("stylistID");
    if(stylistSavedID.length !== 0){
        getServices(stylistSavedID[0].innerText);
    }
}

function searchForStylistListener(){
    searchInput = document.getElementById("search");
    searchInit = "";
    searchInput.addEventListener("input", ()=>{
        setTimeout(()=>{
            searchValue = searchInput.value;
            if(searchInit !== searchValue){
                searchInit = searchValue;
                searchForStylist(searchValue);
            }
        }, 1500);
    })
}

function searchForStylist(searchString){
    removeAllStylist();
    matchedStylist = fetch("/findStylistBySearch",{
        method : "POST",
        mode : "cors",
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({"searchString" : searchString})
    })
    .then(async(response) =>{
        sortedStylistList = await response.json();
        appendSortedStylist(sortedStylistList);
        stylistToggleListener();
    });
}


function removeAllStylist(){
    stylistFoundContainer = document.getElementById("stylistFoundContainer");
    let stylist = stylistFoundContainer.children;
    numberOfStylist = stylist.length;
    if(numberOfStylist > 0){
        let i = 0;
        while(i < numberOfStylist){
            stylist[i].remove();
            numberOfStylist--;
        }
    }
}


function createAppointmentListener(){
    document.getElementById("newAppointmentButton").addEventListener("click", createAppointment);
}
function createAppointment(){

    //Find appointment name for new appointment with error checking
    nameValues = findAppointmentName();

    //Find stylist id for new appointment with error checking
    stylistIDValues = findStylistID();

    //Find if the appointment needs to be saved
    saveAppointemnt = document.getElementById("saveAppointment").value;

    //Find if the stylist needs to be saved
    perferedStylist = document.getElementById("perferedStylist").value;

    //Find service list for new appointment with error checking
    serviceListValues = findServiceList();

    //Find service list for new appointment with error checking
    try{
        if(serviceListValues.serviceError === false){
            timeValues = findTimeContent();
        }
    }
    catch(error){
        timeValues = {};
        timeValues.timeError = true;
        console.log(`timeValues error\n ${error}`);
    }

    //Appointment Notes
    appointmentNotes = document.getElementById("appointmentsNotes").value;

    //Appontment Image
    allCanvas = document.getElementsByClassName("imgPreviewNoCrop");
    appointmentImage = allCanvas[allCanvas.length - 1].toDataURL("image/png", 1);

    //Get time slots
    timeSlots = getSlotCount();

    
    //Send Data
    //Note that there is no header set because the browswer will do it for us. 
    //Even if you try and set the header with a boundary it will not let us which is needed
    //for the image upload
    if(nameValues.nameError === false && stylistIDValues.stylistError === false && serviceListValues.serviceError === false && timeValues.timeError === false){
        //Create form
        //NOTE a form object is needed to send the pic so you do not get a "Boundary error"
        customerAppointmentForm = new FormData();
        customerAppointmentForm.append("newAppointmentName", nameValues.newAppointmentName);
        
        customerAppointmentForm.append("saveAppointemnt", saveAppointemnt);
        customerAppointmentForm.append("stylistID", stylistIDValues.selectedStylistID);
        
        customerAppointmentForm.append("perferedStylist", perferedStylist);
        
        customerAppointmentForm.append("serviceList", serviceListValues.serviceList);
        customerAppointmentForm.append("serviceIDList", serviceListValues.serviceIDList);
        
        customerAppointmentForm.append("timeID", timeValues.timeID);
        customerAppointmentForm.append("timeString", timeValues.timeString);
        customerAppointmentForm.append("dayString", timeValues.dayString);
        customerAppointmentForm.append("timeSlots", timeSlots);

        customerAppointmentForm.append("appointmentNotes", appointmentNotes);
        customerAppointmentForm.append("appointmentImage", appointmentImage);

        let blankCanvas = getBlankCanvas();
        customerAppointmentForm.append("blankCanvas", blankCanvas);

        showNotification("Appointment sent");
        fetch("/customerAppointment", {
            method : "post",
            mode : "cors",
            body : customerAppointmentForm
        })
        .then(async(res)=>{
            res = await res.json();
            if(res.error === true){
                showNotification("Error in creating appointment");
            }
            else if(res.taken === true){
                showNotification("Slot taken, please pick another");
            }
            else if(res.complete === true){
                showNotification("Appointment made");
                document.getElementById("appointmentToggle").click(); //Close and clear new appointment
            }
        });
    }
    else{
        showFirstError();
    }

}

function findTimeContent(){
    //Time ID, Time String, and Day String
    timeContainers = document.getElementsByClassName("time");
    timesLength = timeContainers.length;
    selectTimeError = document.getElementById("timeError");
    timeID = "";

    i = 0;
    while(i < timesLength){
        if(timeContainers[i].classList.contains("selected") === true){
            timeChildren = timeContainers[i].parentNode.children;
            let x =0; 
            while(x < timeChildren.length){
                if(timeChildren[x].classList.contains("dayString") === true){
                    dayString = timeChildren[x].innerText;
                }
                else if(timeChildren[x].classList.contains("timeID") === true){
                    timeID = timeChildren[x].innerText;
                }
                else if(timeChildren[x].classList.contains("time") === true){
                    timeString = timeChildren[x].innerText;
                }

                x++;
            }
            i = timesLength;
        }
        i++;
    }
    if(timeID === ""){
        errorState(selectTimeError, true);
        timeError = true;
    }
    else{
        errorState(selectTimeError, false);
        timeError = false;
    }

    return{
        dayString,
        timeID,
        timeString,
        timeError
    }
}

function findServiceList(){
    //Service list
    services = document.getElementsByClassName("service");
    serviceIDs = document.getElementsByClassName("serviceID");
    selectServiceError = document.getElementById("serviceError");
    serviceList = [];
    serviceIDList = [];
    serviceCount = 0;
    i = 0;
    while(i < services.length){
        if(services[i].classList.contains("selected") === true){
            serviceList[serviceCount] = services[i].innerText;
            serviceIDList[serviceCount] = serviceIDs[i].innerText;
            serviceCount++;
        } 
        i++;
    }
    if(serviceCount === 0){
        errorState(selectServiceError, true);
        serviceError = true;
    }
    else{
        errorState(selectServiceError, false);
        serviceError = false;
    }

    return{
        serviceList,
        serviceError,
        serviceIDList
    }
}

function findAppointmentName(){
    //AppointmentName with error check
    newAppointmentName = document.getElementById("newAppointmentNameInput").value;
    nameInputError = document.getElementById("newAppointmentNameError");
    if(newAppointmentName === ""){
        errorState(nameInputError, true);
        nameError = true;
    }
    else{
        errorState(nameInputError, false);
        nameError = false;
    }

    return{
        newAppointmentName,
        nameError
    }
}

function findStylistID(){
    //Get Selected Stylist
    allStylist = document.getElementsByClassName("stylist");
    selectStylistError = document.getElementById("stylistError");
    selectedStylistID = "";
    let i = 0;
    objectFound = false;
    while(i < allStylist.length){
        if(allStylist[i].classList.contains("selected") === true){
            stylistChildren = allStylist[i].children;
            
            let x =0;
            while(x < stylistChildren.length && objectFound === false){
                if(stylistChildren[x].classList.contains("stylistDetails") === true){
                    currentDetailsContainer = stylistChildren[x];
                    objectFound = true;
                }
                x++;
            }

            x =0;
            objectFound = false;
            while(x < currentDetailsContainer.children.length && objectFound === false){
                if(currentDetailsContainer.children[x].classList.contains("stylistID") === true){
                    selectedStylistID = currentDetailsContainer.children[x].innerText;
                    objectFound = true;
                }
                x++;
            }
        }
        i++;
    }


    if(selectedStylistID === ""){
        errorState(selectStylistError, true);
        stylistError = true;
    }
    else{
        errorState(selectStylistError, false);
        stylistError = false;
    }

    

    return {
        selectedStylistID,
        stylistError
    };
}


function errorState(currentError, errorState){
    if(errorState === true){
        if(currentError.classList.contains("hidden") === true){
            currentError.classList.remove("hidden");
        }
    }
    else if(errorState === false){
        if(currentError.classList.contains("hidden") === false){
            currentError.classList.add("hidden");
        }
    }

    showFirstError();
}



function newAppointmentListener(){
    appointmentToggle = document.getElementById("appointmentToggle");
    newAppointmentContainer = document.getElementById("newAppointmentContainer");
    appointmentToggle.addEventListener("click", ()=>{
        slideAndFadeAnimation(newAppointmentContainer);
        newAppointmentToggle(appointmentToggle);
        verticalAlignParentNode();
    });
}

function newAppointmentToggle(appointmentToggle){
    if(appointmentToggle.innerText === "New Appointment"){
        appointmentToggle.innerText = "Cancel";
        appointmentToggle.classList.remove("buttonPrimary");
        appointmentToggle.classList.add("buttonCaution");
    }
    else if(appointmentToggle.innerText === "Cancel"){
        appointmentToggle.innerText = "New Appointment";
        appointmentToggle.classList.add("buttonPrimary");
        appointmentToggle.classList.remove("buttonCaution");
        newAppointmentReset();
    }
}


function newAppointmentReset(){
    document.getElementById("newAppointmentNameInput").value = "";
    document.getElementById("saveAppointment").selectedIndex = 0;
    document.getElementById("perferedStylist").selectedIndex = 0;
    document.getElementById("appointmentsNotes").value = "";
    imgResetNewAppointment();
    clearStylist();
    clearServices();
    clearTimes();
}


function savedAppointmentListener(){
    savedAppointmentContainers = document.getElementsByClassName("savedContainer");
    savedDetailsContainer = document.getElementsByClassName("savedDetailsContainer");
    for(let i =0; i < savedAppointmentContainers.length; i++){
        savedAppointmentContainers[i].addEventListener("click", (event)=>{
            console.log(event);
            //toggleDetails(savedDetailsContainer[i]);
            slideAndFadeAnimation(savedDetailsContainer[i]);
        });
    }
}

function toggleDetails(currentSavedDetails){
    if(currentSavedDetails.classList.contains("hidden") === true){
        currentSavedDetails.classList.remove("hidden");
    }
    else if(currentSavedDetails.classList.contains("hidden") === false){
        currentSavedDetails.classList.add("hidden");
    }
}


function templateListener(){
    templateButtons = document.getElementsByClassName("newFromTemplate");
    let appointmentToggleButton = document.getElementById("appointmentToggle");
    for(let i =0; i < editAppointmentButtons.length; i++){
        editAppointmentButtons[i].addEventListener("click", ()=>{
            appointmentToggleButton.click();
            fillWithSavedData(i);
        });
    }
}
function fillWithSavedData(currentAppointment){
    savedData = getSavedData(currentAppointment);
    document.getElementById("newAppointmentNameInput").value = savedData.appointmentName;

    //Hide stylist search and saved containers
    document.getElementById("stylistFilterContainer").classList.add("hidden");
    document.getElementById("savedStylistContainer").classList.add("hidden");
    setSylist(savedData.stylistID);
    getServices(savedData.stylistID);
    setServices(savedData.savedServiceIDs);
    document.getElementById("appointmentNotes").value = savedData.savedNotes;
    
}

function getSavedData(currentAppointment){
    savedContainerChildren = document.getElementsByClassName("savedDetailsContainer")[currentAppointment].children;
    savedValues = [];
    savedServiceIDs = [];
    serviceIDCounter = 0;
    let i =0;
    while(i < savedContainerChildren.length){
        if(savedContainerChildren[i].classList.contains("savedID") === true){
            savedID = savedContainerChildren[i].innerText;
        }
        else if(savedContainerChildren[i].classList.contains("savedStylistID") === true){
            savedStylistID = savedContainerChildren[i].innerText;  
        }
        else if(savedContainerChildren[i].classList.contains("appointmentName") === true){
            appointmentName = savedContainerChildren[i].innerText;
        }
        else if(savedContainerChildren[i].classList.contains("savedNotes") === true){
            savedNotes = savedContainerChildren[i].innerText;
        }
        else if(savedContainerChildren[i].classList.contains("savedServiceID") === true){
            savedServiceIDs[serviceIDCounter] = savedContainerChildren[i].innerText;
            serviceIDCounter++;
        }
        i++;
    }

    return{
        savedID,
        savedStylistID,
        savedNotes,
        savedServiceIDs,
        appointmentName
    }
}

function setStylist(currentStylistID){
    fetch("/findStylistByID",{
        method : "post",
        headers : {
            "Content-Type" : "applicaiton/json"
        },
        body : JSON.stringify({"stylistID" : currentStylistID})
    })
    .then(async (data) => {
        stylistData[0] = await data.json();//The array of stylist is for the append function that needs an array to work
        appendSortedStylist(stylistData[0]);
    });
}

function setServices(savedServiceIDs){
    serviceIDs = document.getElementsByClassName("serviceID").innerText;
    let i = 0;
    let x = 0;
    while(x < serviceIDs.length){
        while(i < savedServiceIDs.length){
            if(savedServiceIDs[i] === serviceIDs[x]){
                serviceIDs.parentNode.classList.add("selected");
            }
            i++;
        }
        x++;
    }
}

function editTemplateListener(){
    editTemplateButtons = document.getElementsByClassName("editTemplateButton");
    editContainers = document.getElementsByClassName("editDetails");
    viewContainers = document.getElementsByClassName("viewDetials");
    closeEditButton = document.getElementsByClassName("closeEdit");

    
    for(let i =0; i < editTemplateButtons.length; i++){
        editTemplateButtons[i].addEventListener("click", (event)=>{
            toggleEdit(editContainers[i]);
            toggleView(viewContainers[i]);
            getServicesForEdit(document.getElementsByClassName("savedStylistID")[i].innerText, i);
            event.cancelBubble = true;
        });
        
    }

    for(let i =0; i < closeEditButton.length; i++){
        closeEditButton[i].addEventListener("click", (event)=>{
            toggleEdit(editContainers[i]);
            toggleView(viewContainers[i]);
            event.cancelBubble = true;
        });
        
    }
}

function toggleEdit(currentEditContainer){
    if(currentEditContainer.classList.contains("hidden") === true){
        currentEditContainer.classList.remove("hidden");
    }
    else if(currentEditContainer.classList.contains("hidden") === false){
        currentEditContainer.classList.add("hidden");
    }
}

function toggleView(currentViewContainer){
    if(currentViewContainer.classList.contains("hidden") === true){
        currentViewContainer.classList.remove("hidden");
    }
    else if(currentViewContainer.classList.contains("hidden") === false){
        currentViewContainer.classList.add("hidden");
    }
}


function submitTemplateEditListener(){
    submitEditButtons = document.getElementsByClassName("submitEdit");
    for(let i =0; i < submitEditButtons.length; i++){
        submitEditButtons[i].addEventListener("click", (event)=>{
            submitTemplateEdit(i);
            event.cancelBubble = true;
        });
    }
}

function submitTemplateEdit(currentEdit){

    //Find templateID for the edit
    templateID = document.getElementsByClassName("templateID")[currentEdit].innerText;

    //Find appointment name for the edit with error checking
    nameValues = findAppointmentNameEdit(currentEdit);

    //Find service list for new appointment with error checking
    serviceListValues = findServiceListEdit(currentEdit);

    //Appointment Notes
    appointmentNotes = document.getElementsByClassName("savedNotesEdit")[currentEdit].value;

    //Appontment Image
    allCanvas = document.getElementsByClassName("imgPreviewNoCrop");
    appointmentImage = allCanvas[currentEdit].toDataURL("image/png", .7);

    //Find if there is an image
    let blankCanvas = getBlankCanvas();

    
    //Send Data
    //Note that there is no header set because the browswer will do it for us. 
    //Even if you try and set the header with a boundary it will not let us which is needed
    //for the image upload
    if(nameValues.nameError === false){
        //Create form
        //NOTE a form object is needed to send the pic so you do not get a "Boundary error"
        templateUpdate = new FormData();
        templateUpdate.append("templateID", templateID);
        templateUpdate.append("appointmentNameEdit", nameValues.newAppointmentNameEdit);
        
        templateUpdate.append("serviceList", serviceListValues.serviceList);
        templateUpdate.append("serviceIDList", serviceListValues.serviceIDList);

        templateUpdate.append("appointmentNotes", appointmentNotes);
        templateUpdate.append("appointmentImage", appointmentImage);

        templateUpdate.append("blankCanvas", blankCanvas);

        showNotification("Template edit sent");
        fetch("/updateTemplate", {
            method : "post",
            mode : "cors",
            body : templateUpdate
        })
        .then(async(res)=>{
            res = await res.json();
            if(res.error === true){
                showNotification("Error in template edit");
            }
            else if(res.complete === true){
                showNotification("Template edit complete");
            }
        });
    }
}

function getServicesForEdit(stylistID, currentEdit){
    fetch("/getServicesByID", {
        method : "post",
        mode : "cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({"stylistID" : stylistID})
    })
    .then(async(response) =>{
        serviceData = await response.json();
        appendServicesForEdit(serviceData, currentEdit);
    });
}
function appendServicesForEdit(serviceData, currentEdit){
    //Set up container and row
    serviceContainer = document.getElementsByClassName("savedServiceContainerEdit")[currentEdit];

    let i =0;
    while(i < serviceData.length){
        service = createDiv("class","serviceEdit buttonNeutral centerText elmSmallestMarginTop", `${serviceData[i].serviceName}`);
        serviceContainer.appendChild(service);

        serviceID = createDiv("class", "serviceIDEdit hidden", `${serviceData[i]._id}`);
        service.appendChild(serviceID);

        timeSlot = createDiv("class", "timeSlotEdit hidden", `${serviceData[i].timeSlots}`);
        service.appendChild(timeSlot);

        i++;
    }

    serviceListenersEdit();
    showServicesListener();

}

function showServicesListener(){
    showServicesButtons = document.getElementsByClassName("showServices");
    savedServicesContainerEdit = document.getElementsByClassName("savedServiceContainerEdit");
    for(let i =0; i < showServicesButtons.length; i++){
        showServicesButtons[i].removeEventListener("click", (event)=>{
            toggleServiceView(savedServicesContainerEdit[i], showServicesButtons[i]);
            event.cancelBubble = true;
        });
    }
    for(let i =0; i < showServicesButtons.length; i++){
        showServicesButtons[i].addEventListener("click", (event)=>{
            toggleServiceView(savedServicesContainerEdit[i], showServicesButtons[i]);
            event.cancelBubble = true;
        });
    }
}

function toggleServiceView(currentServiceContainer, currentButton){
    if(currentServiceContainer.classList.contains("hidden") === true){
        currentServiceContainer.classList.remove("hidden");
        currentButton.innerText = "Close Services";
    }
    else if(currentServiceContainer.classList.contains("hidden") === false){
        currentServiceContainer.classList.add("hidden");
        currentButton.innerText = "Change Services";
    }
}



function serviceListenersEdit(){
    servicesEdit = document.getElementsByClassName("serviceEdit");
    for(let i =0; i < servicesEdit.length; i++){
        servicesEdit[i].removeEventListener("click", (event)=>{
            toggleServiceEdit(servicesEdit[i]);
            event.cancelBubble = true;
        });
    }
    for(let i =0; i < servicesEdit.length; i++){
        servicesEdit[i].addEventListener("click", (event)=>{
            toggleServiceEdit(servicesEdit[i]);
            event.cancelBubble = true;
        });
    }
}

function toggleServiceEdit(currentServiceEdit){
    if(currentServiceEdit.classList.contains("selected") === false){
        currentServiceEdit.classList.add("selected");
    }
    else if(currentServiceEdit.classList.contains("selected") === true){
        currentServiceEdit.classList.remove("selected");
    }
}

function findAppointmentNameEdit(currentEdit){
    //AppointmentNameEdit with error check
    newAppointmentNameEdit = document.getElementsByClassName("appointmentNameEdit")[currentEdit].value;
    nameInputErrorEdit = document.getElementsByClassName("appointmentNameEditError")[currentEdit];
    if(newAppointmentNameEdit === ""){
        errorState(nameInputErrorEdit, true);
        nameError = true;
    }
    else{
        errorState(nameInputErrorEdit, false);
        nameError = false;
    }

    return{
        newAppointmentNameEdit,
        nameError
    }
}

function findServiceListEdit(currentEdit){
    //Service list
    services = document.getElementsByClassName("savedServiceContainerEdit")[currentEdit].children;
    serviceList = [];
    serviceIDList = [];
    idCount = 0;
    let i = 0;
    let x = 0;
    while(i < services.length){
        if(services[i].classList.contains("selected") === true){
            serviceList[serviceCount] = services[i].innerText;
            x =0;
            servicesChildren = services[i].children;
            while(x < servicesChildren.length){
                if(servicesChildren[x].classList.contains("serviceIDEdit") === true){
                    serviceIDList[idCount] = servicesChildren[x].innerText;
                    idCount++;
                }
                x++
            }
        } 
        i++;
    }

    return{
        serviceList,
        serviceIDList
    }
}



function templateAppointmentListner(){
    savedTimeSlots = document.getElementsByClassName("savedTimeSlots");
    savedStylistIDs = document.getElementsByClassName("savedStylistID");
    templateTimesConatiner = document.getElementsByClassName("templateTimeContainer");
    templateAppointmentButtons = document.getElementsByClassName("newFromTemplate");
    for(let i =0; i < templateAppointmentButtons.length; i++){
        templateAppointmentButtons[i].addEventListener("click", ()=>{
            templateTimesConatiner[i].cancelBubble = true;
            clearTemplateTimes(templateTimesConatiner[i]);
            templateGetTimes(savedStylistIDs[i].innerHTML, Number(savedTimeSlots[i].innerHTML), templateTimesConatiner[i]);
            templateAppointmentToggle(templateTimesConatiner[i].parentNode, templateAppointmentButtons[i]);
        });
    }
}

function clearTemplateTimes(currentTemplateContainer){
    while(currentTemplateContainer.firstChild){
        currentTemplateContainer.removeChild(currentTemplateContainer.firstChild);
    }
}


function templateGetTimes(stylistID, timeSlots, templateTimeContainer){
    fetch("/getTimesByID", {
        method : "post",
        mode : "cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({ "stylistID" : stylistID })
    })
    .then(async(response) =>{
        timeData = await response.json();
        templateFilterTime(timeData, timeSlots, templateTimeContainer);
    });
}

function templateFilterTime(timeData, slotCount, timesContainer){
    
    //Init vars for time filter
    timeStart = timeData[0].timeID;
    timeStartString = timeData[0].time;
    currentTime = timeData[0].timeID;
    
    currentDay = 0;
    dayString = timeData[0].day;
    
    currentCount = 0;
    dayCount = 1;
    timesLength = timeData.length -1;
    hiddenTimes = false;
    

    //Loop to find appointment times
    let i = 0;
    while(i < timesLength){
        varReset = false;
        if((timeData[i].timeID + 1800000) === timeData[i + 1].timeID){ //See if the next time in the array is a half hour from the last test
            currentCount++;

            if(currentCount === slotCount){ //When there is enough time slots for the requested appointment append the start of the sequence
                //Append the day if last day appened is different
                if(currentDay !== timeData[i].dayID){
                    dayCount++;
                    dayString = timeData[i].day;
                    if(dayCount <= 14){
                        dayDiv = createDiv("class", "col-12 dayTitle title2 elmSmallMarginTop", `${dayString}`);
                    }
                    else if(dayCount > 14){
                        dayDiv = createDiv("class", "col-12 hidden dayTitle dayToggle title2 elmSmallMarginTop", `${dayString}`);
                        hiddenTimes = true;
                    }
                    timesContainer.appendChild(dayDiv);
                    currentDay = timeData[i].dayID;
                }
                templateAppendTime(timeStartString, timeStart, slotCount, dayCount, dayString, timesContainer);
                varReset = true;
            }
        }
        else{
            varReset = true;
        }

        i++;

        if(varReset === true && i < timesLength){
            timeStartString = timeData[i].time;
            timeStart = timeData[i].timeID;
            currentCount = 0;
        }
    }

    if(hiddenTimes === true){
        showAllButton = createATag(["id", "class"], ["showAllButton","buttonNeutral timesHidden col-12 elmSmallMarginTop"], "Show All");
        timesContainer.appendChild(showAllButton);
        showAllListener();
    }

    templateTimeListeners();
    stopBubble();
}

function templateAppendTime(timeStartString, timeStart, slotCount, dayCount, dayString, timesContainer){
    if(dayCount <= 14){
        timeContainer = createDiv("class", "timeContainer col-6 col-md-6 elmSmallestMarginTop");
    }
    else{
        timeContainer = createDiv("class", "timeContainer col-6 col-md-6 hidden timeToggle elmSmallestMarginTop");
    }
    timesContainer.appendChild(timeContainer);

    timeIDDiv = createDiv("class", "hidden timeID", `${timeStart}`);
    timeContainer.appendChild(timeIDDiv);

    dayStringDiv = createDiv("class", "hidden dayString", `${dayString}`);
    timeContainer.appendChild(dayStringDiv);

    slotCountDiv = createDiv("class", "hidden slotCount", `${slotCount}`);
    timeContainer.appendChild(slotCountDiv);

    timeSelector = createATag("class", "buttonNeutral time", `${timeStartString}`);
    timeContainer.appendChild(timeSelector);
}

function templateAppointmentToggle(currentTimeContainer, currentButton){
    if(currentTimeContainer.classList.contains("hidden") === true){
        currentTimeContainer.classList.remove("hidden");
        currentButton.innerText = "Close";
        currentButton.classList.remove("buttonPrimary");
        currentButton.classList.add("buttonSecondary");
    }
    else if(currentTimeContainer.classList.contains("hidden") === false){
        currentTimeContainer.classList.add("hidden");
        currentButton.innerText = "Make Appointment";
        currentButton.classList.remove("buttonSecondary");
        currentButton.classList.add("buttonPrimary");
    }
}


function templateSumbitAppointmentListener(){
    newFromTemplateButtons = document.getElementsByClassName("newFromTemplate");
    templateAppointmentButton = document.getElementsByClassName("templateAppointmentButton");
    for(let i =0; i < templateAppointmentButton.length; i++){
        templateAppointmentButton[i].addEventListener("click", ()=>{
            templateAppointmentButton[i].cancelBubble = true;
            templateData = getTemplateAppointmentData(i);
            makeTemplateAppointment(templateData);
            newFromTemplateButtons[i].click();
        });
    }
}


function getTemplateAppointmentData(currentTemplate){
    templateTimeContainer = document.getElementsByClassName("templateTimeContainer")[currentTemplate];
    let templateTimeChildren = templateTimeContainer.children;
    let currentTimeContainers = [];
    let timeContainerCount = 0;


    let y =0;
    while(y < templateTimeChildren.length){
        if(templateTimeChildren[y].classList.contains("timeContainer") === true){
            currentTimeContainers[timeContainerCount] = templateTimeChildren[y];
            timeContainerCount++;
        }
        y++;
    }
    
    
    let selectedTimeID = "";
    let dayString = "";
    let timeString = "";
    timeIDFound = false;
    dayStringFound = false;
    timeStringFound = false;

    
    let i = 0;
    let x = 0;
    while(i < currentTimeContainers.length){
        if(currentTimeContainers[i].lastChild.classList.contains("selected") === true){
            selectedContainerChildren = currentTimeContainers[i].children;
            while(x < selectedContainerChildren.length){
                if(selectedContainerChildren[x].classList.contains("timeID") === true){
                    selectedTimeID = selectedContainerChildren[x].innerHTML;
                }
                else if(selectedContainerChildren[x].classList.contains("dayString") === true){
                    dayString = selectedContainerChildren[x].innerHTML;
                }
                else if(selectedContainerChildren[x].classList.contains("time") === true){
                    timeString = selectedContainerChildren[x].innerHTML;
                }
                x++
            }
        }
        i++;
    }

    templateID = document.getElementsByClassName("templateID")[currentTemplate].innerHTML;

    return {
        selectedTimeID,
        templateID,
        timeString,
        dayString,
    };
}


function templateTimeListeners(){
    times = document.getElementsByClassName("time");
    for(let i=0; i < times.length; i++){
        times[i].addEventListener("click", ()=>{
            timeToggle(times[i], times);
        });
    }
}


function makeTemplateAppointment(templateData){
    selectedTimeID = templateData.selectedTimeID;
    templateID = templateData.templateID;
    timeString = templateData.timeString;
    dayString = templateData.dayString;

    showNotification("Appointment sent");
    fetch("/templateAppointment",{
        method : "post",
        mode : "cors",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({selectedTimeID, templateID, timeString, dayString})
    })
    .then(async(res)=>{
        res = res.json();
        if(res.error === true){
            showNotification("Error creating appointment");
        }
        else if(res.taken === true){
            showNotification("Slot taken, please pick another");
        }
        else if(res.complete === true){
            showNotification("Appointment made");
        }
    });
}


function deleteTemplateListener(){
    deleteSavedButtons = document.getElementsByClassName("deleteSavedAppointment");
    savedTemplateIDs = document.getElementsByClassName("templateID");
    savedContainers = document.getElementsByClassName("savedContainer"); 

    for(let i = 0; i < deleteSavedButtons.length; i++){
        deleteSavedButtons[i].addEventListener("click", ()=>{
            let currentTemplateID = savedTemplateIDs[i].innerHTML;
            let currentSavedContainer = savedContainers[i];
            deleteTemplate(currentTemplateID, currentSavedContainer);
        });
    } 
}


function deleteTemplate(currentTemplateID, currentSavedContainer){
    fetch("/deleteTemplate", {
        method : "post",
        mode : "cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({ currentTemplateID })
    })
    .then(async(rawJson)=>{
        data = await rawJson.json();
        notifyResult(
            data.error,
            "There was an error in deleting template",
            null,
            "",
            data.complete,
            "Template deleted page will refresh"
        );

        if(data.complete === true){
            setTimeout(()=>{
                window.location.href = "/main";
            }, 2000);
        }
    });
}