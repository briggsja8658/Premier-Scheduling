//Client side appointment js 


//Init of the page 
function getAppointments(){
	fetch("/appointmentFetch", {
		method: "get",
		mode: "cors"
	})
	.then(async (rawData) => {
		data = await rawData.json();
		services = data.services;
		times = data.times;
		appointments = data.appointments;
		customerImages = data.customerImages;
		appendContent(services, times, appointments, customerImages);
	});
}




function appendContent(services, times, appointments, customerImages) {
	mainContainer = document.getElementById("mainContainer");

	appointmentLength = appointments.length;
	if(appointmentLength !== 0){
		
		let lastDay = null; //Set lastDay so the title can run on first loop

		//Main container for all appointments
		appointmentsContainerDiv = document.createElement("div");
		appointmentsContainerDiv.setAttribute("class", "row text");
		appointmentsContainerDiv.setAttribute("id", "appointmentsContainer");
		

		
		for(let x = 0; x < appointmentLength; x++){//Main loop for all the appointments
			
			//Used to append a new day so the appointments can be seperated on the dom
			let currentDay = appointments[x].dayID;
			if(lastDay !== currentDay){
				let dayTitleContainer = createDiv("class", "col-12 elmSmallMarginTop");
				appointmentsContainerDiv.appendChild(dayTitleContainer);
				

				//debugger;
				currentDayString = createReadableDay(Number(currentDay));
				let dayTitle = createDiv("class", "title2", currentDayString);
				dayTitleContainer.appendChild(dayTitle);
				lastDay = currentDay;
			}


			//Main container for a single appointment
			appointmentContainer = document.createElement("div");
			appointmentContainer.setAttribute("class","col-12 col-md-6 col-lg-4 elmSmallestMarginTop appointmentContainer");
			appointmentsContainerDiv.appendChild(appointmentContainer);
			
			//START OF MAIN CARD
			//Card for a single appontment
			appointmentCard = document.createElement("a");
			if(x % 2 === 0){
				appointmentCard.setAttribute("class", "altButtons2 appointment");
			}
			else{
				appointmentCard.setAttribute("class", "altButtons1 appointment");
			}
			appointmentContainer.appendChild(appointmentCard);

			//Hidden appointment ID
			appointmentID = document.createElement("div");
			appointmentID.setAttribute("class", "appointmentID hidden");
			appointmentID.innerHTML =`${appointments[x]._id}`;
			appointmentCard.appendChild(appointmentID);

			//Row for card content
			cardContentRow = document.createElement("div");
			cardContentRow.setAttribute("class", "row no-gutters");
			appointmentCard.appendChild(cardContentRow);

			//Image Container
			imageContainer = document.createElement("div");
			imageContainer.setAttribute("class", "col-4 imageContainer");
			cardContentRow.appendChild(imageContainer);

			//Image object
			appointmentImage = document.createElement("img");
			appointmentImage.src = `${customerImages[x]}`;
			appointmentImage.setAttribute("class", "customerImg");
			imageContainer.appendChild(appointmentImage);

			//AppointmentInfo Container
			appointmentInfoContainer = document.createElement("div");
			appointmentInfoContainer.setAttribute("class", "col-8 appointmentInfoContainer");
			cardContentRow.appendChild(appointmentInfoContainer);

			//Customer Name Div
			customerName = document.createElement("div");
			customerName.setAttribute("class","customerName");
			customerName.innerHTML = `${appointments[x].customerName}`;
			appointmentInfoContainer.appendChild(customerName);

			//Appointment Time Div
			appointmentTime = document.createElement("div");
			appointmentTime.setAttribute("class","appointmentTime");
			appointmentTime.innerHTML = `${appointments[x].time}`
			appointmentInfoContainer.appendChild(appointmentTime);

			//Appointment Type  Div
			appointmentType = document.createElement("div");
			appointmentType.setAttribute("class","appointmentType");
			appointmentType.innerHTML = `${appointments[x].serviceName}`;
			appointmentInfoContainer.appendChild(appointmentType);
			//END OF MAIN CARD



			//START OF EDIT SECTION
			//Main edit container
			editContainer = document.createElement("div");
			editContainer.setAttribute("class", "hidden editContainer cardBackground");
			appointmentContainer.appendChild(editContainer);

			//Row for edit content
			editRow = document.createElement("div");
			editRow.setAttribute("class", "row no-gutters elmPaddingTop elmSmallPaddingBottom");
			editContainer.appendChild(editRow);

			

			//Set the services
			let z = 0;
			serviceList = [];
			while(z < appointments[x].services.length){
				serviceList[z] = appointments[x].services[z];
				z++;
			}

			//Service Error Message
			serviceError = document.createElement("div");
			serviceError.setAttribute("class", "hidden error");
			serviceError.innerHTML = "Must have atlest one service";
			editRow.appendChild(serviceError);

			//Loop for the number of services that the appointment currently has
			currentServices = appointments[x].numberOfServices;
			for(let y =0; y < currentServices; y++){
				//Service Container
				serviceContainer = document.createElement("div");
				serviceContainer.setAttribute("class", "row no-gutters serviceContainer");
				editRow.appendChild(serviceContainer);


				//Select Container
				appointmentSelectContainer = document.createElement("div");
				appointmentSelectContainer.setAttribute("class","col-10 appointmentSelectContainer elmSmallMarginTop");
				serviceContainer.appendChild(appointmentSelectContainer);

				//Appointment Select
				appointmentSelect = document.createElement("select");
				appointmentSelect.setAttribute("class", "input inputStyle service");
				appointmentSelectContainer.appendChild(appointmentSelect);

				//Appointment Options
				found = false;
				for (let z = 0; z < services.length; z++) {

					serviceOption = document.createElement("option");
					serviceOptionText = document.createTextNode(`${services[z].serviceName}`);
					serviceOption.setAttribute("value", `${services[z].serviceName}`);
					serviceOption.appendChild(serviceOptionText);


					if (serviceList[0] === services[z].serviceName && found === false) {
						serviceOption.setAttribute("selected", "selected");
						serviceList.splice(0, 1);
						found = true;
					}
					else if (serviceList[1] === services[z].serviceName && found === false) {
						serviceOption.setAttribute("selected", "selected");
						serviceList.splice(1, 1);
						found = true;
					}
					else if (serviceList[2] === services[z].serviceName && found === false) {
						serviceOption.setAttribute("selected", "selected");
						serviceList.splice(2, 1);
						found = true;
					}
					else if (serviceList[3] === services[z].serviceName && found === false) {
						serviceOption.setAttribute("selected", "selected");
						serviceList.splice(3, 1);
						found = true;
					}
					else if (serviceList[4] === services[z].serviceName && found === false) {
						serviceOption.setAttribute("selected", "selected");
						serviceList.splice(4, 1);
						found = true;
					}
					

					appointmentSelect.add(serviceOption);

				}
				
				if(found === false){
					serviceOption = document.createElement("option");
					serviceOptionText = document.createTextNode(`Break`);
					serviceOption.setAttribute("value", `Break`);
					serviceOption.appendChild(serviceOptionText);
					serviceOption.setAttribute("selected", "selected");
					appointmentSelect.add(serviceOption);
				}
				
				//End of options loop

				// //Appointment Remove Container
				// appointmentRemoveContainer = document.createElement("div");
				// appointmentRemoveContainer.setAttribute("class", "col-2 appointmentRemoveContainer elmSmallMarginTop");
				// serviceContainer.appendChild(appointmentRemoveContainer);

				// //Appointment Remove Object
				// appointmentRemove = document.createElement("div");
				// appointmentRemove.setAttribute("class", "removeService");
				// appointmentRemove.innerHTML = `x`;
				// appointmentRemoveContainer.appendChild(appointmentRemove);

				//Appointment Time Container
				appointmentTimeContainer = document.createElement("div");
				appointmentTimeContainer.setAttribute("class","col-12 appointmentTimeContainer elmSmallMarginTop");
				editRow.appendChild(appointmentTimeContainer);

				//Appointment Time Select
				appointmentTimeSelect = document.createElement("select");
				appointmentTimeSelect.setAttribute("class","time input inputStyle");
				appointmentTimeContainer.appendChild(appointmentTimeSelect);

				//Appointment Time Options
				for (let y = 0; y < times.length; y++) {
					timeOption = document.createElement("option");
					timeOptionText = document.createTextNode(`${times[y].day} @ ${times[y].time}`);
					timeOption.setAttribute("value", `${times[y].timeID}`);
					timeOption.appendChild(timeOptionText);
					if (appointments[x].timeID === times[y].timeID) {
						timeOption.setAttribute("selected", "selected");
					}
					appointmentTimeSelect.add(timeOption);
				}


			if(y === (currentServices - 1)){
				//Add Service Button
				// if(currentServices !== 5){
				// 	addServiceButton = document.createElement("a");
				// 	addServiceButton.setAttribute("class", "buttonNeutral elmMarginTop addService");
				// 	addServiceButton.innerHTML = "Add Service";
				// }
				// else {
				// 	addServiceButton = document.createElement("a");
				// 	addServiceButton.setAttribute("class", "buttonNeutral elmSmallMarginTop addService hidden");
				// 	addServiceButton.innerHTML = "Add Service";
				// }
				// editRow.appendChild(addServiceButton);
	
				//Delete Button
				deleteButton = document.createElement("a");
				deleteButton.setAttribute("class","buttonCaution elmSmallMarginTop deleteAppointment");
				deleteButton.innerHTML = `Delete`;
				editRow.appendChild(deleteButton);
	
				//Cancel Button
				cancelButton = document.createElement("a");
				cancelButton.setAttribute("class","buttonSecondary elmSmallMarginTop cancel");
				cancelButton.innerHTML = `Cancel`;
				editRow.appendChild(cancelButton);
	
				//Submit Button
				// submitServiceButton = document.createElement("a");
				// submitServiceButton.setAttribute("class","buttonPrimary elmSmallMarginTop submit");
				// submitServiceButton.innerHTML = `Submit Changes`;
				// editRow.appendChild(submitServiceButton);
			}


				//END OF EDIT SECTION
			} //End of Edit Loop

			
		} //End of appointment loop


		//Append everything 
		mainContainer.appendChild(appointmentsContainerDiv);


		//Create page listeners
		createAppointmentListeners();
		//createAddServiceListeners(services);
		createCancelListeners(services, times, appointments);
		//createSubmitListeners();
		//createSelectListeners();
		//createRemoveServiceListeners();
		createDeleteListeners();

	}
	else{
		noAppointments = document.createElement("div");
		noAppointmentsText = document.createTextNode("You have no appointments upcomming");
		noAppointments.appendChild(noAppointmentsText);
		mainContainer.appendChild(noAppointments);
	}
}


function createDeleteListeners(){
	deleteButtons = document.getElementsByClassName("deleteAppointment");
	for (let x = 0; x < deleteButtons.length; x++) {
		deleteButtons[x].addEventListener("click", (event) => {
			event.cancelBubble = true;
			submitDelete(x);

		});
	}
}

function submitDelete(currentAppointment){
	currentAppointmentID = document.getElementsByClassName("appointmentID")[currentAppointment].innerText;
	fetch("/appointments",{
		method: "delete",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"appointmentID" : currentAppointmentID})
	})
	.then(async(response) => {
		response = await response.json();
		notifyResult(
			response.error,
			"Error in deleting appointment",
			null,
            "",
            response.complete,
            "Appointment deleted, page will refresh" 
		);

		if(response.complete === true){
            setTimeout(()=>{
                window.location.href = "/appointments";
            }, 2000);
        }
	});
}


//Listeners and function to submit changes on a appointment
function createSubmitListeners(){
	submitButtons = document.getElementsByClassName("submit");
	for (let x = 0; x < submitButtons.length; x++) {
		submitButtons[x].addEventListener("click", (event) => {
			event.stopPropagation();
			submitEditAppointment(x, submitButtons[x]);

		});
	}
}


function submitEditAppointment(currentAppointment, currentSubmitButton) {

	appointmentContainer = currentSubmitButton.parentNode;
	appointmentContainerNodes = appointmentContainer.childNodes;
	serviceSelect = [];
	serviceValues = [];

	serviceCounter = 0;
	for(let x =0; x < appointmentContainerNodes.length; x++){
		if(appointmentContainerNodes[x].classList.contains("serviceContainer") === true){
			selectContainer = appointmentContainerNodes[x].childNodes;
			serviceSelect[serviceCounter] = selectContainer[0].firstChild;
			serviceCounter++;
		}
	}
	
	
	serviceLength = serviceSelect.length;
	for (let x = 0; x < serviceLength; x++) {
		selectedOption = serviceSelect[x].options[serviceSelect[x].selectedIndex];
		serviceValues[x] = selectedOption.value;
	}

	timeSelect = document.getElementsByClassName("time")[currentAppointment];
	timeOption = timeSelect.options[timeSelect.selectedIndex];
	timeStart = timeOption.value;


	currentID = document.getElementsByClassName("appointmentID")[currentAppointment];
	customerName = document.getElementsByClassName("customerName")[currentAppointment];
	

	jsonData = JSON.stringify({
		"appointmentID": currentID.innerHTML,
		"services": serviceValues,
		"timeStart": timeStart,
		"customerName" : customerName
	});


	fetch("/appointments", {
		method: "post",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: jsonData
	})
	.then(async(returnData)=>{
		data = await returnData.json();
		message = `${data.customerName}'s new appointment \nTime\n${data.day} @ ${data.time}`;
		for(let x =0; x < serviceValues.length; x++){
			message = `${message}\n${serviceValues[x]}`;
		}
		alert(message);
		
	});
}


//Listeners and function for cancel buttons and reseting the appointment
function createCancelListeners(services, times, appointments){
	cancelButtons = document.getElementsByClassName("cancel");//Used for the listener
	addServiceButtons = document.getElementsByClassName("addService");//Used to hide or show add button after info is reset

	for (let x = 0; x < cancelButtons.length; x++) {
		cancelButtons[x].addEventListener("click", (event) => {
			event.stopPropagation();
			resetDetails(x, addServiceButtons[x], services, times, appointments);
			
		});
	}

}


async function resetDetails(currentAppointment, addServiceButton, services, times, appointments) {
	
	
	container = addServiceButton.parentNode;
	allNodes = container.childNodes;
	count =0;
	for(let x =0; x < allNodes.length; x++){
		if(allNodes[x - count].classList.contains("serviceContainer") || 
			allNodes[x - count].classList.contains("appointmentTimeContainer")){
				allNodes[x - count].remove();
				count++;
		}
	}
	



	//Services
	serviceList = [
		appointments[currentAppointment].service1,
		appointments[currentAppointment].service2,
		appointments[currentAppointment].service3,
		appointments[currentAppointment].service4,
		appointments[currentAppointment].service5,
	];

	//Loop for the number of services that the appointment currently has
	currentServices = appointments[currentAppointment].numberOfServices;
	for(let y =0; y < currentServices; y++){
		//Service Container
		serviceContainer = document.createElement("div");
		serviceContainer.setAttribute("class", "row no-gutters serviceContainer");
		container.insertBefore(serviceContainer, addServiceButton);


		//Select Container
		appointmentSelectContainer = document.createElement("div");
		appointmentSelectContainer.setAttribute("class","col-10 appointmentSelectContainer elmSmallMarginTop");
		serviceContainer.appendChild(appointmentSelectContainer);

		//Appointment Select
		appointmentSelect = document.createElement("select");
		appointmentSelect.setAttribute("class", "input inputStyle service");
		appointmentSelectContainer.appendChild(appointmentSelect);

		//Appointment Options
		found = false;
		for (let z = 0; z < services.length; z++) {

			serviceOption = document.createElement("option");
			serviceOptionText = document.createTextNode(`${services[z].serviceName}`);
			serviceOption.setAttribute("value", `${services[z].serviceName}`);
			serviceOption.appendChild(serviceOptionText);


			if (serviceList[0] === services[z].serviceName && found === false) {
				serviceOption.setAttribute("selected", "selected");
				serviceList.splice(0, 1);
				found = true;
			}
			else if (serviceList[1] === services[z].serviceName && found === false) {
				serviceOption.setAttribute("selected", "selected");
				serviceList.splice(1, 1);
				found = true;
			}
			else if (serviceList[2] === services[z].serviceName && found === false) {
				serviceOption.setAttribute("selected", "selected");
				serviceList.splice(2, 1);
				found = true;
			}
			else if (serviceList[3] === services[z].serviceName && found === false) {
				serviceOption.setAttribute("selected", "selected");
				serviceList.splice(3, 1);
				found = true;
			}
			else if (serviceList[4] === services[z].serviceName && found === false) {
				serviceOption.setAttribute("selected", "selected");
				serviceList.splice(4, 1);
				found = true;
			}

			appointmentSelect.add(serviceOption);

		}//End of options loop

		//Appointment Remove Container
		appointmentRemoveContainer = document.createElement("div");
		appointmentRemoveContainer.setAttribute("class", "col-2 appointmentRemoveContainer elmSmallMarginTop");
		serviceContainer.appendChild(appointmentRemoveContainer);

		//Appointment Remove Object
		appointmentRemove = document.createElement("div");
		appointmentRemove.setAttribute("class", "removeService");
		appointmentRemove.innerHTML = `x`;
		appointmentRemoveContainer.appendChild(appointmentRemove);

		//Appointment Time Container
		appointmentTimeContainer = document.createElement("div");
		appointmentTimeContainer.setAttribute("class","col-12 appointmentTimeContainer elmSmallMarginTop");
		container.insertBefore(appointmentTimeContainer, addServiceButton);

		//Appointment Time Select
		appointmentTimeSelect = document.createElement("select");
		appointmentTimeSelect.setAttribute("class","time input inputStyle");
		appointmentTimeContainer.appendChild(appointmentTimeSelect);

		//Appointment Time Options
		for (let y = 0; y < times.length; y++) {
			timeOption = document.createElement("option");
			timeOptionText = document.createTextNode(`${times[y].day} @ ${times[y].time}`);
			timeOption.setAttribute("value", `${times[y].timeID}`);
			timeOption.appendChild(timeOptionText);
			if (appointments[currentAppointment].timeID === times[y].timeID) {
				timeOption.setAttribute("selected", "selected");
			}
			appointmentTimeSelect.add(timeOption);
		}
	}
	if(currentServices <= 4){
		if(addServiceButton.classList.contains("hidden") === true){
			addServiceButton.classList.remove("hidden");
		}	
	}
	else{
		if(addServiceButton.classList.contains("hidden") === false){
			addServiceButton.classList.add("hidden");
		}
	}

}


//Listener to stop bubbling when selectes are activated
function createSelectListeners(){
	selectElms = document.getElementsByTagName("select");
	for (let x = 0; x < selectElms.length; x++) {
		selectElms[x].addEventListener("click", (event) => {
			event.stopPropagation();
		});
	}

}


//Listeners and function for adding services
function createAddServiceListeners(services){
	addServiceButton = document.getElementsByClassName("addService");
	for(let x =0; x < addServiceButton.length; x++){
		addServiceButton[x].addEventListener("click", (event)=>{
			event.stopPropagation();
			addService(services, addServiceButton[x]);
		});
	}

}


function addService(services, addServiceButton) {
	
	container = addServiceButton.parentNode;
	allNodes = container.childNodes;
	numberOfServices = allNodes.length - 4;

	//Find time select to append before it
	timeSelectFound = false;
	x = 0;
	while(timeSelectFound === false){
		if(allNodes[x].classList.contains("appointmentTimeContainer") === true){
			timeSelectContainer = allNodes[x]; 
			timeSelectFound = true;
		}
		x++
	}

	if(numberOfServices < 4){
		//Service Container
		serviceContainer = document.createElement("div");
		serviceContainer.setAttribute("class", "row no-gutters serviceContainer");
		container.insertBefore(serviceContainer, timeSelectContainer);


		//Select Container
		appointmentSelectContainer = document.createElement("div");
		appointmentSelectContainer.setAttribute("class","col-10 appointmentSelectContainer elmSmallMarginTop");
		serviceContainer.appendChild(appointmentSelectContainer);

		//Appointment Select
		appointmentSelect = document.createElement("select");
		appointmentSelect.setAttribute("class", "input inputStyle service");
		appointmentSelectContainer.appendChild(appointmentSelect);

		//Appointment Options
		found = false;
		for (let z = 0; z < services.length; z++) {

			serviceOption = document.createElement("option");
			serviceOptionText = document.createTextNode(`${services[z].serviceName}`);
			serviceOption.setAttribute("value", `${services[z].serviceName}`);
			serviceOption.appendChild(serviceOptionText);


			if (z === 0) {
				serviceOption.setAttribute("selected", "selected");
			}
			

			appointmentSelect.add(serviceOption);

		}//End of options loop

		//Appointment Remove Container
		appointmentRemoveContainer = document.createElement("div");
		appointmentRemoveContainer.setAttribute("class", "col-2 appointmentRemoveContainer elmSmallMarginTop");
		serviceContainer.appendChild(appointmentRemoveContainer);

		//Appointment Remove Object
		appointmentRemove = document.createElement("div");
		appointmentRemove.setAttribute("class", "removeService");
		appointmentRemove.innerHTML = `x`;
		appointmentRemoveContainer.appendChild(appointmentRemove);
	
		
	}

	
	numberOfServices++;
	
	if(numberOfServices >= 5 && addServiceButton.classList.contains("hidden") === false){
		addServiceButton.classList.add("hidden");
	}
	createRemoveServiceListeners();

	

	
}


//Listener and function for remove service
function createRemoveServiceListeners(){
	removeServiceButton = document.getElementsByClassName("removeService");
	for(let x =0; x < removeServiceButton.length; x++){
		removeServiceButton[x].removeEventListener("click", (event)=>{
			event.stopPropagation();
			removeService(event.target);
		});
	}
	for(let x =0; x < removeServiceButton.length; x++){
		removeServiceButton[x].addEventListener("click", (event)=>{
			event.stopPropagation();
			removeService(event.target);
		});
	}
}


function removeService(triggeringElm) {
	
	targetService = triggeringElm.parentNode.parentNode;
	targetServiceContainer = targetService.parentNode;
	siblings = targetServiceContainer.childNodes;
	numberOfServices = siblings.length - 4; //the - 4 is to remove the other needed children for the service count
	currentError = targetServiceContainer.firstChild;

	for(let x =0; x < siblings.length; x++){
		if(siblings[x].classList.contains("addService") === true){
			addServiceButton = siblings[x];
		}
	}
	
	if(numberOfServices > 1){
		targetService.remove();
		numberOfServices--;
	}
	else{
		currentError.classList.remove("hidden");
		setTimeout(()=>{
			currentError.classList.add("hidden");
		}, 4000);
	}


	if(numberOfServices < 5 && addServiceButton.classList.contains("hidden") === true){
		addServiceButton.classList.remove("hidden");
	}

}


//Listener for the appointment toggle
function createAppointmentListeners() {
	appointments = document.getElementsByClassName("appointmentContainer");
	editContainer = document.getElementsByClassName("editContainer");
	for (let x = 0; x < appointments.length; x++) {
		appointments[x].addEventListener("click", (event) => {
			if (event.target.tagName !== "BUTTON" && event.target.tagName !== "SELECT") {
				toggleDetails(editContainer[x]);
			}

		});
	}
}

function toggleDetails(currentDetail) {
	if (currentDetail.classList.contains("hidden") === true) {
		currentDetail.classList.remove("hidden");
	}
	else if (currentDetail.classList.contains("hidden") === false) {
		currentDetail.classList.add("hidden");
	}
}