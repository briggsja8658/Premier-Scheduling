

function scheduleInit() {
	customerListeners();
	servicesListeners();
	submitListener();
}


function submitListener(){
	document.getElementById("submitAppointmentButton").addEventListener("click", createNewAppointment);
}
function createNewAppointment() {

	customers = document.getElementsByClassName("customerSelection");
	customersIDs = document.getElementsByClassName("customersIDs");
	services = document.getElementsByClassName("serviceSelection");
	serviceTimes = document.getElementsByClassName("time");
	serviceIDs = document.getElementsByClassName("serviceIDs");
	dayStrings = document.getElementsByClassName("dayString");
	timeID = document.getElementsByClassName("timeID");

	//Get the error messages on the page
	customerError = document.getElementById("customerError");
	serviceError = document.getElementById("servicesError");
	timeError = document.getElementById("timeError");


	errors = checkForSchedulingErrors(customers, services, serviceTimes, customerError, serviceError, timeError);

	if (errors === false) {
		let i = 0;
		while (i < services.length) {
			if (services[i].classList.contains("selected") === true) {
				sibling = services[i].nextElementSibling;
				slotCount = Number(sibling.innerText);
			}
			i++;
		}

		for (let x = 0; x < customers.length; x++) {
			if (customers[x].classList.contains("selected") === true) {
				customerName = customers[x].innerText;
				customerID = customersIDs[x].innerText;
			}
		}


		requestedServices = [];
		requestedServiceIDs = [];
		serviceCount = 0;
		for (let x = 0; x < services.length; x++) {
			if (services[x].classList.contains("selected") === true) {
				requestedServices[serviceCount] = services[x].innerText;
				requestedServiceIDs[serviceCount] = serviceIDs[x].innerText;
				serviceCount++;
			}
		}


		requestedTimes = [];
		requestedTimeIDs = [];
		timeCount = 0;

		for (let x = 0; x < serviceTimes.length; x++) {
			if (serviceTimes[x].classList.contains("selected") === true) {

				if (timeCount === 0) {
					dayString = dayStrings[x].innerText;
				}
				requestedTimes[timeCount] = serviceTimes[x].innerText;
				for (let y = 0; y < slotCount; y++) {
					if (y === 0) {
						serviceTime = Number(timeID[x].innerText);
						requestedTimeIDs[timeCount] = serviceTime;
						timeCount++;
					}
					else {
						serviceTime = serviceTime + 1800000;
						requestedTimeIDs[timeCount] = serviceTime;
						timeCount++;
					}
				}
			}
		}


		fetch("/schedule", {
			method: "post",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"customerName": customerName,
				"customerID": customerID,
				"serviceNames": requestedServices,
				"serviceTimes": requestedTimes,
				"requestedServiceIDs": requestedServiceIDs,
				"requestedTimeIDs": requestedTimeIDs,
				"dayString": dayString,
				"slotCount": slotCount
			})
		})
			.then(async (data) => {
				data = await data.json();
				notifyResult(
					data.error,
					"There was an error creating appointment",
					data.slotTaken,
					"Slot was taken please pick another",
					data.complete,
					"Appointment was made"
				);
			});
	}
	else {
		scrollToFirstError();
	}
}




function customerListeners() {
	customers = document.getElementsByClassName("customerSelection");
	for (let x = 0; x < customers.length; x++) {
		customers[x].addEventListener("click", () => {
			toggleSelection(customers[x], "customer", customers);
		});
	}
}
function toggleSelection(currentElement, option, currentArray) {
	if (option === "customer" || option === "time") {
		for (let x = 0; x < currentArray.length; x++) {
			if (currentArray[x].classList.contains("selected") === true) {
				currentArray[x].classList.remove("selected");
			}
		}
	}

	//Toogle off the selection if the user request it
	if (currentElement.classList.contains("selected") === false) {
		currentElement.classList.add("selected");
	}
	else if (currentElement.classList.contains("selected") === true) {
		currentElement.classList.remove("selected");
	}

}




function findServiceTimeSlots(){
	selectedServices = document.querySelectorAll(".servicesContainer > div > .selected");
	timeSlots = 0;
	let i =0;
	let x = 0;
	while(i < selectedServices.length){
		parentNode = selectedServices[i].parentNode;
		children = parentNode.children;
		x = 0;
		while(x < children.length){
			if(children[x].classList.contains("timeSlots") === true){
				console.log(`timeSlot for ${parentNode.innerText} was ${children[x].innerText}`);
				timeSlots += Number(children[x].innerText);
			}
			x++;
		}
		i++;
	}

	return timeSlots;
	
}


function servicesListeners() {
	services = document.getElementsByClassName("serviceSelection");
	serviceIDs = document.getElementsByClassName("serviceIDs");
	for (let x = 0; x < services.length; x++) {
		services[x].addEventListener("click", () => {
			toggleSelection(services[x]);
			timeSlots = findServiceTimeSlots();
			appendTimes(timeSlots);
		});
	}
}
function appendTimes(timeSlots) {
	//The overall goal is to 
		//Determine if the time is open for scheduling
		//Determine if the open times are in the same day
		//Determine if the open times are in sequence based on the selected service
		//
	timeContainer = document.getElementById("timeContainer");

	while (timeContainer.firstChild) {
		timeContainer.removeChild(timeContainer.firstChild);
	}


	fetch("/timeFetch", {
		method : "get",
		mode : "cors"
	})
	.then(async (data) => {
		dataRaw = await data.json();
		times = dataRaw.time;
		filterTimes(times, timeSlots);
	});
}


function filterTimes(timeData, slotCount){
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
	timesContainer = document.getElementById("timeContainer");
    

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
                appendSequece(timeStartString, timeStart, slotCount, dayCount, dayString, timesContainer);
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
	showTimes();
	showSubmit();
}

function appendSequece(timeStartString, timeStart, slotCount, dayCount, dayString, timesContainer){
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

function checkForSameDay(currentDayIDs){
	let i =0;
	lastCheck = null;
	appendTime = true;
	while(i < currentDayIDs.length){
		if(lastCheck === null){
			lastCheck = currentDayIDs[0];
		}
		else{
			if(lastCheck !== currentDayIDs[i].dayID){
				appendTime === false;
			}
		}
		i++;
	}
	return appendTime;
}



function timeListeners(){
	timeSlots = document.getElementsByClassName("time");
	for(let i =0; i < timeSlots.length; i++){
		timeSlots[i].addEventListener("click", ()=>{
			toggleSelection(timeSlots[i], "time", timeSlots);
		});
	}
}


function showAllListener(){
    showAllButton = document.getElementById("showAllButton");
    showAllButton.removeEventListener("click", ()=>{
        allTimesToggle(showAllButton);
    });

    showAllButton.addEventListener("click", ()=>{
        allTimesToggle(showAllButton);
    });
}

function allTimesToggle(showAllButton){

    timeContainers = document.getElementsByClassName("timeContainer");
    dayContainers = document.getElementsByClassName("dayTitle");
    if(showAllButton.classList.contains("timesHidden") === true){

        showAllButton.innerHTML = "Hide Times";
        showAllButton.setAttribute("class", "buttonCaution col-12 elmSmallMarginTop centerText");
        
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
        showAllButton.setAttribute("class", "buttonNeutral timesHidden col-12 elmSmallMarginTop centerText");

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


function showTimes(){
	document.getElementById("timeContainer").classList.remove("hidden");
}

function showSubmit(){
	document.getElementById("submitAppointmentButton").classList.remove("hidden");
}












