
function profileInit() {
	editProfileListener();
	workingDayListeners();
	getProfileData();
	fillTimeSelect();
	submitTimeOffListener();
	deleteTimeOffListener();
}


function editProfileListener() {
	document.getElementById("editProfileSubmit").addEventListener("click", editProfile);
}


//Send profile edits
async function editProfile() {
	errors = await checkForErrors();
	if (errors === false) {
		firstName = document.getElementById("firstName").value;
		lastName = document.getElementById("lastName").value;
		phoneNumber = document.getElementById("phoneNumber").value;
		email = document.getElementById("email").value;
		newImageData = document.getElementById("imgPreview").toDataURL("image/png", 1);
		stylistID = document.getElementById("stylistID").innerHTML;


		editProfileForm = new FormData();
		editProfileForm.append("newFirstName", firstName);
		editProfileForm.append("newLastName", lastName);
		editProfileForm.append("newPhoneNumber", phoneNumber);
		editProfileForm.append("newEmail", email);
		editProfileForm.append("newProfileImage", newImageData);
		editProfileForm.append("stylistID", stylistID);
		
		blankCanvas = getBlankCanvas();
		editProfileForm.append("blankCanvas", blankCanvas);

		fetch("/profile", {
			method: "post",
			mode: "cors",
			body: editProfileForm
		})
		.then(async (jsonString) => {
			data = await jsonString.json();
			notifyResult(
				data.error,
				"There was an error in your edit, please try again later",
				data.taken,
				"",
				data.complete,
				"Edit complete"
			)
		});
	}
}


function workingDayListeners() {
	workingDays = document.getElementsByClassName("workingDays");

	for (let x = 0; x < workingDays.length; x++) {
		workingDays[x].addEventListener("click", () => {
			workingDayToggle(x);
		});
	}
}


function workingDayToggle(currentDay) {
	if (currentDay.classList.contains("hidden") === true) {
		currentDay.classList.remove("hidden");
	}
	else if (currentDay.classList.contains("hidden") === false) {
		currentDay.classList.remove("hidden");
	}
}


function dayButtonListener() {
	workingDays = document.getElementsByClassName("workingDay");
	for (let x = 0; x < workingDays.length; x++) {
		workingDays[x].removeEventListener("click", () => {
			dayToggle(x);
		});
		workingDays[x].addEventListener("click", () => {
			dayToggle(x);
		});

	}
}


function dayToggle(currentDay) {
	workingDayContent = document.getElementsByClassName("workingDayContent");

	if (workingDayContent[currentDay].classList.contains("hidden") === true) {
		workingDayContent[currentDay].classList.remove("hidden");

		containerHeight = workingDayContent[currentDay].parentNode.offsetHeight;
		serviceHeight = workingDayContent[currentDay].offsetHeight;
		buttonHeight = containerHeight - serviceHeight;

		workingDayContent[currentDay].animate([
			{ height: `${0}px` },
			{ height: `${containerHeight - buttonHeight}px` }
		], { duration: 200 });
	}
	else if (workingDayContent[currentDay].classList.contains("hidden") !== true) {
		workingDayContent[currentDay].animate([
			{ height: `${containerHeight - buttonHeight}px` },
			{ height: `${0}px` }
		], { duration: 200 });
		setTimeout(() => { workingDayContent[currentDay].classList.add("hidden"); }, 199);
	}
}


function addBreakListeners() {
	addBreakButton = document.getElementsByClassName("addBreakButton");
	for (let x = 0; x < addBreakButton.length; x++) {
		addBreakButton[x].addEventListener("click", (event) => {
			event.stopPropagation();
			currentBreakContainer = addBreakButton[x].parentNode;
			addBreak(x, currentBreakContainer);
		});
	}

}


function addBreak(currentBreak, breaksContainer) {
	breakStart = document.getElementsByClassName("breaksStart");
	numberOfBreaks = 0;

	for (let x = 0; x < breakStart.length; x++) {
		if (breakStart[x].parentNode.parentNode === breaksContainer) {
			numberOfBreaks++;
		}
	}

	newBreakContainer = document.createElement("div");
	newBreakContainer.setAttribute("class", "breakContainer");

	breakID = document.createElement("div");
	breakID.setAttribute("class", "breakID hidden");
	breakID.innerHTML = "";
	newBreakContainer.appendChild(breakID);

	breakStartContainer = document.createElement("div");
	breakStartContainer.setAttribute("class", "breaksStart elmSmallMarginTop elmSmallestMarginBottom");

	breakStartRow = document.createElement("div");
	breakStartRow.setAttribute("class","row no-gutters");

	breakStartCol1 = document.createElement("div");
	breakStartCol1.setAttribute("class","col-6 col-lg-12 text");

	breakStartCol2 = document.createElement("div");
	breakStartCol2.setAttribute("class","col-6 col-lg-12 text");

	breakStartRow.appendChild(breakStartCol1);
	breakStartRow.appendChild(breakStartCol2);
	breakStartContainer.appendChild(breakStartRow);

	breakStartSpan = document.createElement("span");
	breakStartSpan.innerHTML = "Break Start ";
	breakStartCol1.appendChild(breakStartSpan);


	breakStartSelect = appendBreakStartOptions("6 am");
	breakStartCol2.appendChild(breakStartSelect);

	
	breakEndContainer = document.createElement("div");
	breakEndContainer.setAttribute("class", "breaksEnd elmSmallestMarginTop elmSmallestMarginBottom");
	
	breakEndRow = document.createElement("div");
	breakEndRow.setAttribute("class","row no-gutters");

	breakEndCol1 = document.createElement("div");
	breakEndCol1.setAttribute("class","col-6 col-lg-12 text");

	breakEndCol2 = document.createElement("div");
	breakEndCol2.setAttribute("class","col-6 col-lg-12 text");

	breakEndRow.appendChild(breakEndCol1);
	breakEndRow.appendChild(breakEndCol2);
	breakEndContainer.appendChild(breakEndRow); 

	breakEndSpan = document.createElement("span");
	breakEndSpan.innerHTML = "Break End ";
	breakEndCol1.appendChild(breakEndSpan);

	breakEndSelect = appendBreakEndOptionsWithString("6 am");
	breakEndCol2.appendChild(breakEndSelect);
	breakEndCol2.appendChild(breakID);

	currentAddBreakButton = document.getElementsByClassName("addBreakButton")[currentBreak];
	currentRemoveBreakButton = document.getElementsByClassName("removeBreakButton")[currentBreak];

	newBreakContainer.appendChild(breakStartContainer);
	newBreakContainer.appendChild(breakEndContainer);
	breaksContainer.insertBefore(newBreakContainer, currentRemoveBreakButton);

	numberOfBreaks++;
	if (numberOfBreaks >= 5) {
		currentAddBreakButton.classList.add("hidden");
	} 
	else if (numberOfBreaks <= 1) {
		currentRemoveBreakButton.classList.add("hidden");
	}
	else{
		currentAddBreakButton.classList.remove("hidden");
		currentRemoveBreakButton.classList.remove("hidden");
	}


	breakStartListeners();
	breakEndListeners();

}


function removeBreakListeners() {
	removeBreakButton = document.getElementsByClassName("removeBreakButton");
	for (let x = 0; x < removeBreakButton.length; x++) {
		removeBreakButton[x].addEventListener("click", (event) => {
			event.stopPropagation();
			currentBreakContainer = removeBreakButton[x].parentNode;
			removeBreak(x, currentBreakContainer);
		});
	}
}


function removeBreak(currentBreak, currentBreaksContainer) {
	numberOfBreaks = 0;
	breakContainers = [];
	breakCounter = 0;
	nodeList = currentBreaksContainer.childNodes;

	for (let x = 0; x < nodeList.length; x++) {
		if (nodeList[x].classList.contains("breakContainer")) {
			breakContainers[breakCounter] = nodeList[x];
			breakCounter++;
		}
	}

	
	numberOfBreaks = breakContainers.length;
	breakContainers[numberOfBreaks - 1].remove();
	numberOfBreaks--;

	currentAddBreakButton = document.getElementsByClassName("addBreakButton")[currentBreak];
	currentRemoveBreakButton = document.getElementsByClassName("removeBreakButton")[currentBreak];


	if (numberOfBreaks >= 5) {
		currentAddBreakButton.classList.add("hidden");
	} 
	else if (numberOfBreaks <= 1) {
		currentRemoveBreakButton.classList.add("hidden");
	}
	else{
		currentAddBreakButton.classList.remove("hidden");
		currentRemoveBreakButton.classList.remove("hidden");
	}

	breakStartListeners();
	breakEndListeners();

}


function workStartListeners() {
	workStart = document.getElementsByClassName("workStart");
	for (let x = 0; x < workStart.length; x++) {
		workStart[x].addEventListener("click", (event) => {
			event.stopPropagation();
		});
	}
}


function workEndListeners() {
	workEnd = document.getElementsByClassName("workEnd");
	for (let x = 0; x < workEnd.length; x++) {
		workEnd[x].addEventListener("click", (event) => {
			event.stopPropagation();
		});
	}
}


function breakStartListeners() {
	breaksStarts = document.getElementsByClassName("breaksStarts");
	for (let x = 0; x < breaksStarts.length; x++) {
		breaksStarts[x].removeEventListener("click", (event) => {
			event.stopPropagation();
		});
	}
	for (let x = 0; x < breaksStarts.length; x++) {
		breaksStarts[x].addEventListener("click", (event) => {
			event.stopPropagation();
		});
	}
}


function breakEndListeners() {
	breaksEnd = document.getElementsByClassName("breaksEnd");
	for (let x = 0; x < breaksEnd.length; x++) {
		breaksEnd[x].removeEventListener("click", (event) => {
			event.stopPropagation();
		});
	}
	for (let x = 0; x < breaksEnd.length; x++) {
		breaksEnd[x].addEventListener("click", (event) => {
			event.stopPropagation();
		});
	}
}


function getProfileData() {
	fetch("/profileData", {
		method: "get",
		mode: "cors"
	})
	.then(async (data) => {
		profileTimes = await data.json();
		breakTimes = profileTimes.breakTimes;
		workingHours = profileTimes.workingHours;
		stylist = profileTimes.stylist;
		appendProfileTimesData(breakTimes, workingHours);
	});
}


function appendProfileTimesData(breakTimes, workingHours) {	
	mainProfileDiv = document.getElementById("mainProfileDiv");

	workingHoursContainer = document.getElementById("workingHoursContainer");
	mainProfileDiv.appendChild(workingHoursContainer);

	workingHoursTitle = document.createElement("div");
	workingHoursTitle.innerHTML = "Working Hours";
	workingHoursTitle.setAttribute("class", "title2 elmMarginTop");
	workingHoursContainer.appendChild(workingHoursTitle);


	workingHoursDiv = document.createElement("div");
	workingHoursDiv.setAttribute("id", "workingHours");
	workingHoursContainer.appendChild(workingHoursDiv);



	workingDayContainer = document.createElement("div");
	workingDayContainer.setAttribute("class","row no-gutters");
	workingHoursContainer.appendChild(workingDayContainer);
	for (let x = 0; x < workingHours.length; x++) {

		workingHoursWrapper = document.createElement("div");
		workingHoursWrapper.setAttribute("class"," col-12 col-md-6 col-lg-4 dayWrapper");
		workingDayContainer.appendChild(workingHoursWrapper);

		//Interactive button for each day
		dayButton = document.createElement("a");
		if (x % 2 === 0) {
			dayButton.setAttribute("class", "workingDay altButtons1 elmSmallestMarginTop elmSmallestMarginBottom");
		}
		else {
			dayButton.setAttribute("class", "workingDay altButtons2 elmSmallestMarginTop elmSmallestMarginBottom");

		}
		dayButton.innerHTML = `${workingHours[x].dayName}`;
		workingHoursWrapper.appendChild(dayButton);


		//Card background default state is hidden
		cardBackground = document.createElement("div");
		cardBackground.setAttribute("class", "workingDayContent cardBackground hidden");
		workingHoursWrapper.appendChild(cardBackground);

		dayID = document.createElement("div");
		dayID.setAttribute("class", "dayID hidden");
		dayID.innerHTML = `${workingHours[x].dayID}`;
		cardBackground.appendChild(dayID);

		dayName = document.createElement("div");
		dayName.setAttribute("class", "dayName hidden");
		dayName.innerHTML = `${workingHours[x].dayName}`;
		cardBackground.appendChild(dayName);


		dayStart = convertTimeToString(workingHours[x].startTime);
		dayEnd = convertTimeToString(workingHours[x].endTime);



		editWorkTimeTitle = document.createElement("div");
		editWorkTimeTitle.setAttribute("class", "title2 elmSmallMarginTop");
		editWorkTimeTitle.innerHTML = "Work Time";
		cardBackground.appendChild(editWorkTimeTitle);


		workTimesContainer = document.createElement("div");
		workTimesContainer.setAttribute("class", "workTimesContainer");
		cardBackground.appendChild(workTimesContainer);


		dayOffContainer = document.createElement("div");
		dayOffContainer.setAttribute("class", "dayOff elmSmallestMarginTop");
		workTimesContainer.appendChild(dayOffContainer);

		dayOffRow = document.createElement("div");
		dayOffRow.setAttribute("class","row no-gutters");

		dayOffCol1 = document.createElement("div");
		dayOffCol1.setAttribute("class","col-6 col-lg-12 text");

		dayOffCol2 = document.createElement("div");
		dayOffCol2.setAttribute("class","col-6 col-lg-12 text");

		dayOffContainer.appendChild(dayOffRow);
		dayOffRow.appendChild(dayOffCol1);
		dayOffRow.appendChild(dayOffCol2);

		dayOffSpan = document.createElement("span");
		dayOffSpan.setAttribute("class", "text");
		dayOffSpan.innerHTML = "Day Off?";
		dayOffCol1.appendChild(dayOffSpan);
		
		dayOffSelect = document.createElement("select");
		dayOffSelect.setAttribute("class", "dayOffSelect");

		dayOffOptionYes = document.createElement("option");
		dayOffOptionYes.text = "Yes";

		dayOffOptionNo = document.createElement("option");
		dayOffOptionNo.text = "No";

		dayOffSelect.add(dayOffOptionYes);
		dayOffSelect.add(dayOffOptionNo);
		if (workingHours[x].dayOff === true) {
			dayOffOptionYes.setAttribute("selected", "selected");
		}
		else{
			dayOffOptionNo.setAttribute("selected", "selected");
		}
		dayOffCol2.appendChild(dayOffSelect);


		wasDayOff = document.createElement("div");
		wasDayOff.setAttribute("class", "wasDayOff hidden");
		wasDayOff.innerHTML = `${workingHours[x].dayOff}`;
		dayOffContainer.appendChild(wasDayOff);

		//Work Start
		//Work Start Container
		workStartContainer = document.createElement("div");
		workStartContainer.setAttribute("class", "workStartContainer elmSmallMarginTop");
		workTimesContainer.appendChild(workStartContainer);

		//New Row Col for Work Start Times
		workStartRow = document.createElement("div");
		workStartRow.setAttribute("class","row no-gutters");

		workStartCol1 = document.createElement("div");
		workStartCol1.setAttribute("class","col-6 col-lg-12 text");

		workStartCol2 = document.createElement('div');
		workStartCol2.setAttribute("class","col-6 col-lg-12 text");

		workStartContainer.appendChild(workStartRow);
		workStartRow.appendChild(workStartCol1);
		workStartRow.appendChild(workStartCol2);

		
		//Work start span 
		workStartSpan = document.createElement("span");
		workStartSpan.innerHTML = "Start";
		workStartCol1.appendChild(workStartSpan);
		
		
		//Work Start Select
		workStartSelect = appendWorkStartOptions(dayStart);
		workStartSelect.setAttribute("class", "workStart");
		workStartCol2.appendChild(workStartSelect);
		
		
		//Work End Container
		workEndContainer = document.createElement("div");
		workEndContainer.setAttribute("class", "workEndContainer elmSmallMarginTop");
		workTimesContainer.appendChild(workEndContainer);
		
		//New Row Col for Work Start Times
		workEndRow = document.createElement("div");
		workEndRow.setAttribute("class","row no-gutters");

		workEndCol1 = document.createElement("div");
		workEndCol1.setAttribute("class","col-6 col-lg-12 text");

		workEndCol2 = document.createElement('div');
		workEndCol2.setAttribute("class","col-6 col-lg-12 text");

		workEndContainer.appendChild(workEndRow);
		workEndRow.appendChild(workEndCol1);
		workEndRow.appendChild(workEndCol2);

		//Work End Span
		workEndSpan = document.createElement("span");
		workEndSpan.innerHTML = "End";
		workEndCol1.appendChild(workEndSpan);

		//Work End Select and Work Times appended to DOM
		workEndSelect = appendWorkEndOptions(dayEnd);
		workEndSelect.setAttribute("class", "workEnd");
		workEndCol2.appendChild(workEndSelect);



		numberOfBreaks = 0;
		
		breaksContainer = document.createElement("div");
		breaksContainer.setAttribute("class", "breaksContainer elmMarginTop");
		workTimesContainer.appendChild(breaksContainer);


		editBreaksTitles = document.createElement("div");
		editBreaksTitles.innerHTML = "Breaks";
		editBreaksTitles.setAttribute("class", "title2");
		breaksContainer.appendChild(editBreaksTitles);


		for (let y = 0; y < breakTimes.length; y++) {
			if (breakTimes[y].dayName === workingHours[x].dayName) {
				breakContainer = document.createElement("div");
				breakContainer.setAttribute("class", "breakContainer");


				breakID = document.createElement("div");
				breakID.innerHTML = `${breakTimes[y]._id}`;
				breakID.setAttribute("class", "breakID hidden");
				breakContainer.appendChild(breakID);
				
				//Container for a single break
				breaksStartContainer = document.createElement("div");
				breaksStartContainer.setAttribute("class", "breaksStart elmSmallestMarginTop elmSmallestMarginBottom");
				breakContainer.appendChild(breaksStartContainer);
				
				
				//New Row Col for the Break
				breaksStartRow = document.createElement("div");
				breaksStartRow.setAttribute("class","row no-gutters");
				
				breakStartCol1 = document.createElement("div");
				breakStartCol1.setAttribute("class","col-6 col-lg-12 text");
				
				breakStartCol2 = document.createElement('div');
				breakStartCol2.setAttribute("class","col-6 col-lg-12 text");
				
				breaksStartContainer.appendChild(breaksStartRow);
				breaksStartRow.appendChild(breakStartCol1);
				breaksStartRow.appendChild(breakStartCol2);
				
				
				//Break start span
				breakStartSpan = document.createElement("span");
				breakStartSpan.innerHTML = "Break Start ";
				breakStartCol1.appendChild(breakStartSpan);
				
				
				breakStartSelect = appendBreakStartOptions(breakTimes[y]);
				breakStartCol2.appendChild(breakStartSelect);
				breakStartCol2.appendChild(breakID);



				breaksEndContainer = document.createElement("div");
				breaksEndContainer.setAttribute("class", "breaksEnd elmSmallMarginTop elmMarginBottom");
				breakContainer.appendChild(breaksEndContainer);

				//New Row Col for the Break
				breaksEndRow = document.createElement("div");
				breaksEndRow.setAttribute("class","row no-gutters");

				breakEndCol1 = document.createElement("div");
				breakEndCol1.setAttribute("class","col-6 col-lg-12 text");

				breakEndCol2 = document.createElement('div');
				breakEndCol2.setAttribute("class","col-6 col-lg-12 text");

				breaksEndContainer.appendChild(breaksEndRow);
				breaksEndRow.appendChild(breakEndCol1);
				breaksEndRow.appendChild(breakEndCol2);


				breakEndSpan = document.createElement("span");
				breakEndSpan.innerHTML = "Break End ";
				breakEndCol1.appendChild(breakEndSpan);

				breakEndSelect = appendBreakEndOptions(breakTimes[y]);
				breakEndCol2.appendChild(breakEndSelect);
				breakContainer.appendChild(breaksEndContainer);
				breaksContainer.appendChild(breakContainer);
				numberOfBreaks++;

			}
		}

		removeBreakButton = document.createElement("a");
		removeBreakButton.setAttribute("class", "removeBreakButton buttonSecondary elmSmallMarginTop elmSmallestMarginBottom");
		removeBreakButton.innerHTML = "Remove Break";
		breaksContainer.appendChild(removeBreakButton);

		addBreakButton = document.createElement("a");
		addBreakButton.setAttribute("class", "addBreakButton buttonNeutral elmSmallestMarginTop elmSmallestMarginBottom");
		addBreakButton.innerHTML = "Add Break";
		breaksContainer.appendChild(addBreakButton);

		submitBreakButton = document.createElement("a");
		submitBreakButton.setAttribute("class", "submitBreakButton buttonPrimary elmSmallestMarginTop elmSmallestMarginBottom");
		submitBreakButton.innerHTML = `Submit ${workingHours[x].dayName}`;
		cardBackground.appendChild(submitBreakButton);

		if (numberOfBreaks >= 5) {
			addBreakButton.classList.add("hidden");
		}

		if (numberOfBreaks <= 1) {
			removeBreakButton.classList.add("hidden");
		}


		if (workingHours[x].dayOff === true) {
			workStartContainer.classList.add("hidden");
			workEndContainer.classList.add("hidden");
			breaksContainer.classList.add("hidden");
		}
	} //End of working hours loop

	addBreakListeners();
	removeBreakListeners();
	workStartListeners();
	workEndListeners();
	breakStartListeners();
	breakEndListeners();
	dayButtonListener();
	submitWorkingHoursListener();
	dayOffListener();
}


function dayOffListener() {
	dayOffCheckbox = document.getElementsByClassName("dayOffCheckbox");

	for (let x = 0; x < dayOffCheckbox.length; x++) {
		dayOffCheckbox[x].addEventListener("change", () => {
			toggleWorkTimes(x);
		});
	}

}


function toggleWorkTimes(currentDay) {

	workStart = document.getElementsByClassName("workStartContainer")[currentDay];
	workEnd = document.getElementsByClassName("workEndContainer")[currentDay];
	breakContainer = document.getElementsByClassName("breaksContainer")[currentDay];

	if (workStart.classList.contains("hidden") === true) {
		workStart.classList.remove("hidden");
		workEnd.classList.remove("hidden");
		breakContainer.classList.remove("hidden");
	}
	else if (workStart.classList.contains("hidden") === false) {
		workStart.classList.add("hidden");
		workEnd.classList.add("hidden");
		breakContainer.classList.add("hidden");
	}

}


function convertTimeToString(rawTime) {
	switch (rawTime) {
		case 0000:
			stringTime = "12 am";
			stringTimeAjusted = "12:30 am";
			break;
		case 0030:
			stringTime = "12:30 am";
			stringTimeAjusted = "1 am";
			break;
		case 0100:
			stringTime = "1 am";
			stringTimeAjusted = "1:30 am";
			break;
		case 0130:
			stringTime = "1:30 am";
			stringTimeAjusted = "2 am";
			break;
		case 0200:
			stringTime = "2 am";
			stringTimeAjusted = "2:30 am";
			break;
		case 0230:
			stringTime = "2:30 am";
			stringTimeAjusted = "3 am";
			break;
		case 0300:
			stringTime = "3 am";
			stringTimeAjusted = "3:30 am";
			break;
		case 0330:
			stringTime = "3:30 am";
			stringTimeAjusted = "4 am";
			break;
		case 0400:
			stringTime = "4 am";
			stringTimeAjusted = "4:30 am";
			break;
		case 0430:
			stringTime = "4:30 am";
			stringTimeAjusted = "5 am";
			break;
		case 0500:
			stringTime = "5 am";
			stringTimeAjusted = "5:30 am";
			break;
		case 0530:
			stringTime = "5:30 am";
			stringTimeAjusted = "6 am";
			break;
		case 0600:
			stringTime = "6 am";
			stringTimeAjusted = "6:30 am";
			break;
		case 0630:
			stringTime = "6:30 am";
			stringTimeAjusted = "7 am";
			break;
		case 0700:
			stringTime = "7 am";
			stringTimeAjusted = "7:30 am";
			break;
		case 0730:
			stringTime = "7:30 am";
			stringTimeAjusted = "8 am";
			break;
		case 0800:
			stringTime = "8 am";
			stringTimeAjusted = "8:30 am";
			break;
		case 0830:
			stringTime = "8:30 am";
			stringTimeAjusted = "9 am";
			break;
		case 0900:
			stringTime = "9 am";
			stringTimeAjusted = "9:30 am";
			break;
		case 0930:
			stringTime = "9:30 am";
			stringTimeAjusted = "10 am";
			break;
		case 1000:
			stringTime = "10 am";
			stringTimeAjusted = "10:30 am";
			break;
		case 1030:
			stringTime = "10:30 am";
			stringTimeAjusted = "11 am";
			break;
		case 1100:
			stringTime = "11 am";
			stringTimeAjusted = "11:30 am";
			break;
		case 1130:
			stringTime = "11:30 am";
			stringTimeAjusted = "12 pm";
			break;
		case 1200:
			stringTime = "12 pm";
			stringTimeAjusted = "12:30 pm";
			break;
		case 1230:
			stringTime = "12:30 pm";
			stringTimeAjusted = "1 pm";
			break;
		case 1300:
			stringTime = "1 pm";
			stringTimeAjusted = "1:30 pm";
			break;
		case 1330:
			stringTime = "1:30 pm";
			stringTimeAjusted = "2 pm";
			break;
		case 1400:
			stringTime = "2 pm";
			stringTimeAjusted = "2:30 pm";
			break;
		case 1430:
			stringTime = "2:30 pm";
			stringTimeAjusted = "3 pm";
			break;
		case 1500:
			stringTime = "3 pm";
			stringTimeAjusted = "3:30 pm";
			break;
		case 1530:
			stringTime = "3:30 pm";
			stringTimeAjusted = "4 pm";
			break;
		case 1600:
			stringTime = "4 pm";
			stringTimeAjusted = "4:30 pm";
			break;
		case 1630:
			stringTime = "4:30 pm";
			stringTimeAjusted = "5 pm";
			break;
		case 1700:
			stringTime = "5 pm";
			stringTimeAjusted = "5:30 pm";
			break;
		case 1730:
			stringTime = "5:30 pm";
			stringTimeAjusted = "6 pm";
			break;
		case 1800:
			stringTime = "6 pm";
			stringTimeAjusted = "6:30 pm";
			break;
		case 1830:
			stringTime = "6:30 pm";
			stringTimeAjusted = "7 pm";
			break;
		case 1900:
			stringTime = "7 pm";
			stringTimeAjusted = "7:30 pm";
			break;
		case 1930:
			stringTime = "7:30 pm";
			stringTimeAjusted = "8 pm";
			break;
		case 2000:
			stringTime = "8 pm";
			stringTimeAjusted = "8:30 pm";
			break;
		case 2030:
			stringTime = "8:30 pm";
			stringTimeAjusted = "9 pm";
			break;
		case 2100:
			stringTime = "9 pm";
			stringTimeAjusted = "9:30 pm";
			break;
		case 2130:
			stringTime = "9:30 pm";
			stringTimeAjusted = "10 pm";
			break;
		case 2200:
			stringTime = "10 pm";
			stringTimeAjusted = "10:30 pm";
			break;
		case 2230:
			stringTime = "10:30 pm";
			stringTimeAjusted = "11 pm";
			break;
		case 2300:
			stringTime = "11 pm";
			stringTimeAjusted = "11:30 pm";
			break;
		case 2330:
			stringTime = "11:30 pm";
			stringTimeAjusted = "12 am";
			break;

	}

	return {
		stringTime,
		stringTimeAjusted
	};
}


function appendWorkStartOptions(dayStart) {


	workStartSelect = document.createElement("select");
	workStartSelect.setAttribute("class", "workStartContainer elmSmallestMarginTop");
	workEndSelect = document.createElement("select");
	workEndSelect.setAttribute("class", "workEndContainer elmSmallestMarginTop");


	sixAMOption = document.createElement("option");
	sixAMOption.setAttribute("value", "0600");
	sixAMOption.innerHTML = "6 am";

	sixThirtyAMOption = document.createElement("option");
	sixThirtyAMOption.setAttribute("value", "0630");
	sixThirtyAMOption.innerHTML = "6:30 am";

	sevenAMOption = document.createElement("option");
	sevenAMOption.setAttribute("value", "0700");
	sevenAMOption.innerHTML = "7 am";

	sevenThirtyAMOption = document.createElement("option");
	sevenThirtyAMOption.setAttribute("value", "0730");
	sevenThirtyAMOption.innerHTML = "7:30 am";

	eightAMOption = document.createElement("option");
	eightAMOption.setAttribute("value", "0800");
	eightAMOption.innerHTML = "8 am";

	eightThirtyAMOption = document.createElement("option");
	eightThirtyAMOption.setAttribute("value", "0830");
	eightThirtyAMOption.innerHTML = "8:30 am";

	nineAMOption = document.createElement("option");
	nineAMOption.setAttribute("value", "0900");
	nineAMOption.innerHTML = "9 am";

	nineThirtyAMOption = document.createElement("option");
	nineThirtyAMOption.setAttribute("value", "0930");
	nineThirtyAMOption.innerHTML = "9:30 am";

	tenAMOption = document.createElement("option");
	tenAMOption.setAttribute("value", "1000");
	tenAMOption.innerHTML = "10 am";

	tenThirtyAMOption = document.createElement("option");
	tenThirtyAMOption.setAttribute("value", "1030");
	tenThirtyAMOption.innerHTML = "10:30 am";

	elevenAMOption = document.createElement("option");
	elevenAMOption.setAttribute("value", "1100");
	elevenAMOption.innerHTML = "11 am";

	elevenThirtyAMOption = document.createElement("option");
	elevenThirtyAMOption.setAttribute("value", "1130");
	elevenThirtyAMOption.innerHTML = "11:30 am";

	twelvePMOption = document.createElement("option");
	twelvePMOption.setAttribute("value", "1200");
	twelvePMOption.innerHTML = "12 pm";

	twelveThirtyPMOption = document.createElement("option");
	twelveThirtyPMOption.setAttribute("value", "1230");
	twelveThirtyPMOption.innerHTML = "12:30 pm";

	onePMOption = document.createElement("option");
	onePMOption.setAttribute("value", "1300");
	onePMOption.innerHTML = "1 pm";

	oneThirtyPMOption = document.createElement("option");
	oneThirtyPMOption.setAttribute("value", "1330");
	oneThirtyPMOption.innerHTML = "1:30 pm";

	twoPMOption = document.createElement("option");
	twoPMOption.setAttribute("value", "1400");
	twoPMOption.innerHTML = "2 pm";

	twoThirtyPMOption = document.createElement("option");
	twoThirtyPMOption.setAttribute("value", "1430");
	twoThirtyPMOption.innerHTML = "2:30 pm";

	threePMOption = document.createElement("option");
	threePMOption.setAttribute("value", "1500");
	threePMOption.innerHTML = "3 pm";

	threeThirtyPMOption = document.createElement("option");
	threeThirtyPMOption.setAttribute("value", "1530");
	threeThirtyPMOption.innerHTML = "3:30 pm";

	fourPMOption = document.createElement("option");
	fourPMOption.setAttribute("value", "1600");
	fourPMOption.innerHTML = "4 pm";

	fourThirtyPMOption = document.createElement("option");
	fourThirtyPMOption.setAttribute("value", "1630");
	fourThirtyPMOption.innerHTML = "4:30 pm";

	fivePMOption = document.createElement("option");
	fivePMOption.setAttribute("value", "1700");
	fivePMOption.innerHTML = "5 pm";

	fiveThirtyPMOption = document.createElement("option");
	fiveThirtyPMOption.setAttribute("value", "1730");
	fiveThirtyPMOption.innerHTML = "5:30 pm";

	sixPMOption = document.createElement("option");
	sixPMOption.setAttribute("value", "1800");
	sixPMOption.innerHTML = "6 pm";

	sixThirtyPMOption = document.createElement("option");
	sixThirtyPMOption.setAttribute("value", "1830");
	sixThirtyPMOption.innerHTML = "6:30 pm";

	sevenPMOption = document.createElement("option");
	sevenPMOption.setAttribute("value", "1900");
	sevenPMOption.innerHTML = "7 pm";

	sevenThirtyPMOption = document.createElement("option");
	sevenThirtyPMOption.setAttribute("value", "1930");
	sevenThirtyPMOption.innerHTML = "7:30 pm";

	eightPMOption = document.createElement("option");
	eightPMOption.setAttribute("value", "2000");
	eightPMOption.innerHTML = "8 pm";

	eightThirtyPMOption = document.createElement("option");
	eightThirtyPMOption.setAttribute("value", "2030");
	eightThirtyPMOption.innerHTML = "8:30 pm";

	ninePMOption = document.createElement("option");
	ninePMOption.setAttribute("value", "2100");
	ninePMOption.innerHTML = "9 pm";

	nineThirtyPMOption = document.createElement("option");
	nineThirtyPMOption.setAttribute("value", "2130");
	nineThirtyPMOption.innerHTML = "9:30 pm";

	tenPMOption = document.createElement("option");
	tenPMOption.setAttribute("value", "2200");
	tenPMOption.innerHTML = "10 pm";

	tenThirtyPMOption = document.createElement("option");
	tenThirtyPMOption.setAttribute("value", "2230");
	tenThirtyPMOption.innerHTML = "10:30 pm";

	elevenPMOption = document.createElement("option");
	elevenPMOption.setAttribute("value", "2300");
	elevenPMOption.innerHTML = "11 pm";

	elevenThirtyPMOption = document.createElement("option");
	elevenThirtyPMOption.setAttribute("value", "2330");
	elevenThirtyPMOption.innerHTML = "11:30 pm";


	switch (dayStart.stringTime) {
		case "6 am":
			sixAMOption.setAttribute("selected", "selected");
			break;

		case "6:30 am":
			sixThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "7 am":
			sevenAMOption.setAttribute("selected", "selected");
			break;

		case "7:30 am":
			sevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "8 am":
			eightAMOption.setAttribute("selected", "selected");
			break;

		case "8:30 am":
			eightThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "9 am":
			nineAMOption.setAttribute("selected", "selected");
			break;

		case "9:30 am":
			nineThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "10 am":
			tenAMOption.setAttribute("selected", "selected");
			break;

		case "10:30 am":
			tenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "11 am":
			elevenAMOption.setAttribute("selected", "selected");
			break;

		case "11:30 am":
			elevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "12 pm":
			twelvePMOption.setAttribute("selected", "selected");
			break;

		case "12:30 pm":
			twelveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "1 pm":
			onePMOption.setAttribute("selected", "selected");
			break;

		case "1:30 pm":
			oneThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "2 pm":
			twoPMOption.setAttribute("selected", "selected");
			break;

		case "2:30 pm":
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "3 pm":
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "3:30 pm":
			threeThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "4 pm":
			fourPMOption.setAttribute("selected", "selected");
			break;

		case "4:30 pm":
			fourThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "5 pm":
			fivePMOption.setAttribute("selected", "selected");
			break;

		case "5:30 pm":
			fiveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "6 pm":
			sixPMOption.setAttribute("selected", "selected");
			break;

		case "6:30 pm":
			sixThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "7 pm":
			sevenPMOption.setAttribute("selected", "selected");
			break;

		case "7:30 pm":
			sevenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "8 pm":
			eightPMOption.setAttribute("selected", "selected");
			break;

		case "8:30 pm":
			eightThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "9 pm":
			ninePMOption.setAttribute("selected", "selected");
			break;

		case "9:30 pm":
			nineThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "10 pm":
			tenPMOption.setAttribute("selected", "selected");
			break;

		case "10:30 pm":
			tenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "11 pm":
			elevenPMOption.setAttribute("selected", "selected");
			break;

		case "11:30 pm":
			elevenThirtyPMOption.setAttribute("selected", "selected");
			break;
	}



	workStartSelect.add(sixAMOption);
	workStartSelect.add(sixThirtyAMOption);
	workStartSelect.add(sevenAMOption);
	workStartSelect.add(sevenThirtyAMOption);
	workStartSelect.add(eightAMOption);
	workStartSelect.add(eightThirtyAMOption);
	workStartSelect.add(nineAMOption);
	workStartSelect.add(nineThirtyAMOption);
	workStartSelect.add(tenAMOption);
	workStartSelect.add(tenThirtyAMOption);
	workStartSelect.add(elevenAMOption);
	workStartSelect.add(elevenThirtyAMOption);
	workStartSelect.add(twelvePMOption);
	workStartSelect.add(twelveThirtyPMOption);
	workStartSelect.add(onePMOption);
	workStartSelect.add(oneThirtyPMOption);
	workStartSelect.add(twoPMOption);
	workStartSelect.add(twoThirtyPMOption);
	workStartSelect.add(threePMOption);
	workStartSelect.add(threeThirtyPMOption);
	workStartSelect.add(fourPMOption);
	workStartSelect.add(fourThirtyPMOption);
	workStartSelect.add(fivePMOption);
	workStartSelect.add(fiveThirtyPMOption);
	workStartSelect.add(sixPMOption);
	workStartSelect.add(sixThirtyPMOption);
	workStartSelect.add(sevenPMOption);
	workStartSelect.add(sevenThirtyPMOption);
	workStartSelect.add(eightPMOption);
	workStartSelect.add(eightThirtyPMOption);
	workStartSelect.add(ninePMOption);
	workStartSelect.add(nineThirtyPMOption);
	workStartSelect.add(tenPMOption);
	workStartSelect.add(tenThirtyPMOption);
	workStartSelect.add(elevenPMOption);
	workStartSelect.add(elevenThirtyPMOption);


	return workStartSelect;
}


function appendWorkEndOptions(dayEnd) {

	sixAMOption = document.createElement("option");
	sixAMOption.setAttribute("value", "0600");
	sixAMOption.innerHTML = "6 am";
	if (breakTimes.breakEnd === 0600) {
		sixAmOption.setAttribute("selected", "selected");
	}

	sixThirtyAMOption = document.createElement("option");
	sixThirtyAMOption.setAttribute("value", "0630");
	sixThirtyAMOption.innerHTML = "6:30 am";
	if (breakTimes.breakEnd === 0630) {
		sixThirtyAMOption.setAttribute("selected", "selected");
	}

	sevenAMOption = document.createElement("option");
	sevenAMOption.setAttribute("value", "0700");
	sevenAMOption.innerHTML = "7 am";
	if (breakTimes.breakEnd === 0700) {
		sevenAMOption.setAttribute("selected", "selected");
	}

	sevenThirtyAMOption = document.createElement("option");
	sevenThirtyAMOption.setAttribute("value", "0730");
	sevenThirtyAMOption.innerHTML = "7:30 am";
	if (breakTimes.breakEnd === 0730) {
		sevenThirtyAMOption.setAttribute("selected", "selected");
	}

	eightAMOption = document.createElement("option");
	eightAMOption.setAttribute("value", "0800");
	eightAMOption.innerHTML = "8 am";
	if (breakTimes.breakEnd === 0800) {
		eightAMOption.setAttribute("selected", "selected");
	}

	eightThirtyAMOption = document.createElement("option");
	eightThirtyAMOption.setAttribute("value", "0830");
	eightThirtyAMOption.innerHTML = "8:30 am";
	if (breakTimes.breakEnd === 0830) {
		eightThirtyAMOption.setAttribute("selected", "selected");
	}

	nineAMOption = document.createElement("option");
	nineAMOption.setAttribute("value", "0900");
	nineAMOption.innerHTML = "9 am";
	if (breakTimes.breakEnd === 0900) {
		nineAMOption.setAttribute("selected", "selected");
	}

	nineThirtyAMOption = document.createElement("option");
	nineThirtyAMOption.setAttribute("value", "0930");
	nineThirtyAMOption.innerHTML = "9:30 am";
	if (breakTimes.breakEnd === 0930) {
		nineThirtyAMOption.setAttribute("selected", "selected");
	}

	tenAMOption = document.createElement("option");
	tenAMOption.setAttribute("value", "1000");
	tenAMOption.innerHTML = "10 am";
	if (breakTimes.breakEnd === 1000) {
		tenAMOption.setAttribute("selected", "selected");
	}

	tenThirtyAMOption = document.createElement("option");
	tenThirtyAMOption.setAttribute("value", "1030");
	tenThirtyAMOption.innerHTML = "10:30 am";
	if (breakTimes.breakEnd === 1030) {
		tenThirtyAMOption.setAttribute("selected", "selected");
	}

	elevenAMOption = document.createElement("option");
	elevenAMOption.setAttribute("value", "1100");
	elevenAMOption.innerHTML = "11 am";
	if (breakTimes.breakEnd === 1100) {
		elevenAMOption.setAttribute("selected", "selected");
	}

	elevenThirtyAMOption = document.createElement("option");
	elevenThirtyAMOption.setAttribute("value", "1130");
	elevenThirtyAMOption.innerHTML = "11:30 am";
	if (breakTimes.breakEnd === 1130) {
		elevenThirtyAMOption.setAttribute("selected", "selected");
	}

	twelvePMOption = document.createElement("option");
	twelvePMOption.setAttribute("value", "1200");
	twelvePMOption.innerHTML = "12 pm";
	if (breakTimes.breakEnd === 1200) {
		twelvePMOption.setAttribute("selected", "selected");
	}

	twelveThirtyPMOption = document.createElement("option");
	twelveThirtyPMOption.setAttribute("value", "1230");
	twelveThirtyPMOption.innerHTML = "12:30 pm";
	if (breakTimes.breakEnd === 1230) {
		twelveThirtyPMOption.setAttribute("selected", "selected");
	}

	onePMOption = document.createElement("option");
	onePMOption.setAttribute("value", "1300");
	onePMOption.innerHTML = "1 pm";
	if (breakTimes.breakEnd === 1300) {
		onePMOption.setAttribute("selected", "selected");
	}

	oneThirtyPMOption = document.createElement("option");
	oneThirtyPMOption.setAttribute("value", "1330");
	oneThirtyPMOption.innerHTML = "1:30 pm";
	if (breakTimes.breakEnd === 1330) {
		oneThirtyPMOption.setAttribute("selected", "selected");
	}

	twoPMOption = document.createElement("option");
	twoPMOption.setAttribute("value", "1400");
	twoPMOption.innerHTML = "2 pm";
	if (breakTimes.breakEnd === 1400) {
		twoPMOption.setAttribute("selected", "selected");
	}

	twoThirtyPMOption = document.createElement("option");
	twoThirtyPMOption.setAttribute("value", "1430");
	twoThirtyPMOption.innerHTML = "2:30 pm";
	if (breakTimes.breakEnd === 1430) {
		twoThirtyPMOption.setAttribute("selected", "selected");
	}

	threePMOption = document.createElement("option");
	threePMOption.setAttribute("value", "1500");
	threePMOption.innerHTML = "3 pm";
	if (breakTimes.breakEnd === 1500) {
		threePMOption.setAttribute("selected", "selected");
	}

	threeThirtyPMOption = document.createElement("option");
	threeThirtyPMOption.setAttribute("value", "1530");
	threeThirtyPMOption.innerHTML = "3:30 pm";
	if (breakTimes.breakEnd === 1530) {
		threeThirtyPMOption.setAttribute("selected", "selected");
	}

	fourPMOption = document.createElement("option");
	fourPMOption.setAttribute("value", "1600");
	fourPMOption.innerHTML = "4 pm";
	if (breakTimes.breakEnd === 1600) {
		fourPMOption.setAttribute("selected", "selected");
	}

	fourThirtyPMOption = document.createElement("option");
	fourThirtyPMOption.setAttribute("value", "1630");
	fourThirtyPMOption.innerHTML = "4:30 pm";
	if (breakTimes.breakEnd === 1630) {
		fourThirtyPMOption.setAttribute("selected", "selected");
	}

	fivePMOption = document.createElement("option");
	fivePMOption.setAttribute("value", "1700");
	fivePMOption.innerHTML = "5 pm";
	if (breakTimes.breakEnd === 1700) {
		fivePMOption.setAttribute("selected", "selected");
	}

	fiveThirtyPMOption = document.createElement("option");
	fiveThirtyPMOption.setAttribute("value", "1730");
	fiveThirtyPMOption.innerHTML = "5:30 pm";
	if (breakTimes.breakEnd === 1730) {
		fiveThirtyPMOption.setAttribute("selected", "selected");
	}

	sixPMOption = document.createElement("option");
	sixPMOption.setAttribute("value", "1800");
	sixPMOption.innerHTML = "6 pm";
	if (breakTimes.breakEnd === 1800) {
		sixPMOption.setAttribute("selected", "selected");
	}

	sixThirtyPMOption = document.createElement("option");
	sixThirtyPMOption.setAttribute("value", "1830");
	sixThirtyPMOption.innerHTML = "6:30 pm";
	if (breakTimes.breakEnd === 1830) {
		sixThirtyPMOption.setAttribute("selected", "selected");
	}

	sevenPMOption = document.createElement("option");
	sevenPMOption.setAttribute("value", "1900");
	sevenPMOption.innerHTML = "7 pm";
	if (breakTimes.breakEnd === 1900) {
		sevenPMOption.setAttribute("selected", "selected");
	}

	sevenThirtyPMOption = document.createElement("option");
	sevenThirtyPMOption.setAttribute("value", "1930");
	sevenThirtyPMOption.innerHTML = "7:30 pm";
	if (breakTimes.breakEnd === 1930) {
		sevenThirtyPMOption.setAttribute("selected", "selected");
	}

	eightPMOption = document.createElement("option");
	eightPMOption.setAttribute("value", "2000");
	eightPMOption.innerHTML = "8 pm";
	if (breakTimes.breakEnd === 2000) {
		eightPMOption.setAttribute("selected", "selected");
	}

	eightThirtyPMOption = document.createElement("option");
	eightThirtyPMOption.setAttribute("value", "2030");
	eightThirtyPMOption.innerHTML = "8:30 pm";
	if (breakTimes.breakEnd === 2030) {
		eightThirtyPMOption.setAttribute("selected", "selected");
	}

	ninePMOption = document.createElement("option");
	ninePMOption.setAttribute("value", "2100");
	ninePMOption.innerHTML = "9 pm";
	if (breakTimes.breakEnd === 2100) {
		ninePMOption.setAttribute("selected", "selected");
	}

	nineThirtyPMOption = document.createElement("option");
	nineThirtyPMOption.setAttribute("value", "2130");
	nineThirtyPMOption.innerHTML = "9:30 pm";
	if (breakTimes.breakEnd === 2130) {
		nineThirtyPMOption.setAttribute("selected", "selected");
	}

	tenPMOption = document.createElement("option");
	tenPMOption.setAttribute("value", "2200");
	tenPMOption.innerHTML = "10 pm";
	if (breakTimes.breakEnd === 2200) {
		tenPMOption.setAttribute("selected", "selected");
	}

	tenThirtyPMOption = document.createElement("option");
	tenThirtyPMOption.setAttribute("value", "2230");
	tenThirtyPMOption.innerHTML = "10:30 pm";
	if (breakTimes.breakEnd === 2230) {
		tenThirtyPMOption.setAttribute("selected", "selected");
	}

	elevenPMOption = document.createElement("option");
	elevenPMOption.setAttribute("value", "2300");
	elevenPMOption.innerHTML = "11 pm";
	if (breakTimes.breakEnd === 2300) {
		elevenPMOption.setAttribute("selected", "selected");
	}

	elevenThirtyPMOption = document.createElement("option");
	elevenThirtyPMOption.setAttribute("value", "2330");
	elevenThirtyPMOption.innerHTML = "11:30 pm";
	if (breakTimes.breakEnd === 2330) {
		elevenThirtyPMOption.setAttribute("selected", "selected");
	}


	switch (dayEnd.stringTime) {
		case "6 am":
			sixAMOption.setAttribute("selected", "selected");
			break;

		case "6:30 am":
			sixThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "7 am":
			sevenAMOption.setAttribute("selected", "selected");
			break;

		case "7:30 am":
			sevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "8 am":
			eightAMOption.setAttribute("selected", "selected");
			break;

		case "8:30 am":
			eightThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "9 am":
			nineAMOption.setAttribute("selected", "selected");
			break;

		case "9:30 am":
			nineThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "10 am":
			tenAMOption.setAttribute("selected", "selected");
			break;

		case "10:30 am":
			tenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "11 am":
			elevenAMOption.setAttribute("selected", "selected");
			break;

		case "11:30 am":
			elevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "12 pm":
			twelvePMOption.setAttribute("selected", "selected");
			break;

		case "12:30 pm":
			twelveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "1 pm":
			onePMOption.setAttribute("selected", "selected");
			break;

		case "1:30 pm":
			oneThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "2 pm":
			twoPMOption.setAttribute("selected", "selected");
			break;

		case "2:30 pm":
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "3 pm":
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "3:30 pm":
			threeThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "4 pm":
			fourPMOption.setAttribute("selected", "selected");
			break;

		case "4:30 pm":
			fourThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "5 pm":
			fivePMOption.setAttribute("selected", "selected");
			break;

		case "5:30 pm":
			fiveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "6 pm":
			sixPMOption.setAttribute("selected", "selected");
			break;

		case "6:30 pm":
			sixThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "7 pm":
			sevenPMOption.setAttribute("selected", "selected");
			break;

		case "7:30 pm":
			sevenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "8 pm":
			eightPMOption.setAttribute("selected", "selected");
			break;

		case "8:30 pm":
			eightThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "9 pm":
			ninePMOption.setAttribute("selected", "selected");
			break;

		case "9:30 pm":
			nineThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "10 pm":
			tenPMOption.setAttribute("selected", "selected");
			break;

		case "10:30 pm":
			tenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "11 pm":
			elevenPMOption.setAttribute("selected", "selected");
			break;

		case "11:30 pm":
			elevenThirtyPMOption.setAttribute("selected", "selected");
			break;
	}


	workEndSelect.add(sixAMOption);
	workEndSelect.add(sixThirtyAMOption);
	workEndSelect.add(sevenAMOption);
	workEndSelect.add(sevenThirtyAMOption);
	workEndSelect.add(eightAMOption);
	workEndSelect.add(eightThirtyAMOption);
	workEndSelect.add(nineAMOption);
	workEndSelect.add(nineThirtyAMOption);
	workEndSelect.add(tenAMOption);
	workEndSelect.add(tenThirtyAMOption);
	workEndSelect.add(elevenAMOption);
	workEndSelect.add(elevenThirtyAMOption);
	workEndSelect.add(twelvePMOption);
	workEndSelect.add(twelveThirtyPMOption);
	workEndSelect.add(onePMOption);
	workEndSelect.add(oneThirtyPMOption);
	workEndSelect.add(twoPMOption);
	workEndSelect.add(twoThirtyPMOption);
	workEndSelect.add(threePMOption);
	workEndSelect.add(threeThirtyPMOption);
	workEndSelect.add(fourPMOption);
	workEndSelect.add(fourThirtyPMOption);
	workEndSelect.add(fivePMOption);
	workEndSelect.add(fiveThirtyPMOption);
	workEndSelect.add(sixPMOption);
	workEndSelect.add(sixThirtyPMOption);
	workEndSelect.add(sevenPMOption);
	workEndSelect.add(sevenThirtyPMOption);
	workEndSelect.add(eightPMOption);
	workEndSelect.add(eightThirtyPMOption);
	workEndSelect.add(ninePMOption);
	workEndSelect.add(nineThirtyPMOption);
	workEndSelect.add(tenPMOption);
	workEndSelect.add(tenThirtyPMOption);
	workEndSelect.add(elevenPMOption);
	workEndSelect.add(elevenThirtyPMOption);

	return workEndSelect;
}


function appendBreakStartOptions(breakTimes) {


	sixAMOption = document.createElement("option");
	sixAMOption.setAttribute("value", "0600");
	sixAMOption.innerHTML = "6 am";

	sixThirtyAMOption = document.createElement("option");
	sixThirtyAMOption.setAttribute("value", "0630");
	sixThirtyAMOption.innerHTML = "6:30 am";

	sevenAMOption = document.createElement("option");
	sevenAMOption.setAttribute("value", "0700");
	sevenAMOption.innerHTML = "7 am";

	sevenThirtyAMOption = document.createElement("option");
	sevenThirtyAMOption.setAttribute("value", "0730");
	sevenThirtyAMOption.innerHTML = "7:30 am";

	eightAMOption = document.createElement("option");
	eightAMOption.setAttribute("value", "0800");
	eightAMOption.innerHTML = "8 am";

	eightThirtyAMOption = document.createElement("option");
	eightThirtyAMOption.setAttribute("value", "0830");
	eightThirtyAMOption.innerHTML = "8:30 am";

	nineAMOption = document.createElement("option");
	nineAMOption.setAttribute("value", "0900");
	nineAMOption.innerHTML = "9 am";

	nineThirtyAMOption = document.createElement("option");
	nineThirtyAMOption.setAttribute("value", "0930");
	nineThirtyAMOption.innerHTML = "9:30 am";

	tenAMOption = document.createElement("option");
	tenAMOption.setAttribute("value", "1000");
	tenAMOption.innerHTML = "10 am";

	tenThirtyAMOption = document.createElement("option");
	tenThirtyAMOption.setAttribute("value", "1030");
	tenThirtyAMOption.innerHTML = "10:30 am";

	elevenAMOption = document.createElement("option");
	elevenAMOption.setAttribute("value", "1100");
	elevenAMOption.innerHTML = "11 am";

	elevenThirtyAMOption = document.createElement("option");
	elevenThirtyAMOption.setAttribute("value", "1130");
	elevenThirtyAMOption.innerHTML = "11:30 am";

	twelvePMOption = document.createElement("option");
	twelvePMOption.setAttribute("value", "1200");
	twelvePMOption.innerHTML = "12 pm";

	twelveThirtyPMOption = document.createElement("option");
	twelveThirtyPMOption.setAttribute("value", "1230");
	twelveThirtyPMOption.innerHTML = "12:30 pm";

	onePMOption = document.createElement("option");
	onePMOption.setAttribute("value", "1300");
	onePMOption.innerHTML = "1 pm";

	oneThirtyPMOption = document.createElement("option");
	oneThirtyPMOption.setAttribute("value", "1330");
	oneThirtyPMOption.innerHTML = "1:30 pm";

	twoPMOption = document.createElement("option");
	twoPMOption.setAttribute("value", "1400");
	twoPMOption.innerHTML = "2 pm";

	twoThirtyPMOption = document.createElement("option");
	twoThirtyPMOption.setAttribute("value", "1430");
	twoThirtyPMOption.innerHTML = "2:30 pm";

	threePMOption = document.createElement("option");
	threePMOption.setAttribute("value", "1500");
	threePMOption.innerHTML = "3 pm";

	threeThirtyPMOption = document.createElement("option");
	threeThirtyPMOption.setAttribute("value", "1530");
	threeThirtyPMOption.innerHTML = "3:30 pm";

	fourPMOption = document.createElement("option");
	fourPMOption.setAttribute("value", "1600");
	fourPMOption.innerHTML = "4 pm";

	fourThirtyPMOption = document.createElement("option");
	fourThirtyPMOption.setAttribute("value", "1630");
	fourThirtyPMOption.innerHTML = "4:30 pm";

	fivePMOption = document.createElement("option");
	fivePMOption.setAttribute("value", "1700");
	fivePMOption.innerHTML = "5 pm";

	fiveThirtyPMOption = document.createElement("option");
	fiveThirtyPMOption.setAttribute("value", "1730");
	fiveThirtyPMOption.innerHTML = "5:30 pm";

	sixPMOption = document.createElement("option");
	sixPMOption.setAttribute("value", "1800");
	sixPMOption.innerHTML = "6 pm";

	sixThirtyPMOption = document.createElement("option");
	sixThirtyPMOption.setAttribute("value", "1830");
	sixThirtyPMOption.innerHTML = "6:30 pm";

	sevenPMOption = document.createElement("option");
	sevenPMOption.setAttribute("value", "1900");
	sevenPMOption.innerHTML = "7 pm";

	sevenThirtyPMOption = document.createElement("option");
	sevenThirtyPMOption.setAttribute("value", "1930");
	sevenThirtyPMOption.innerHTML = "7:30 pm";

	eightPMOption = document.createElement("option");
	eightPMOption.setAttribute("value", "2000");
	eightPMOption.innerHTML = "8 pm";

	eightThirtyPMOption = document.createElement("option");
	eightThirtyPMOption.setAttribute("value", "2030");
	eightThirtyPMOption.innerHTML = "8:30 pm";

	ninePMOption = document.createElement("option");
	ninePMOption.setAttribute("value", "2100");
	ninePMOption.innerHTML = "9 pm";

	nineThirtyPMOption = document.createElement("option");
	nineThirtyPMOption.setAttribute("value", "2130");
	nineThirtyPMOption.innerHTML = "9:30 pm";

	tenPMOption = document.createElement("option");
	tenPMOption.setAttribute("value", "2200");
	tenPMOption.innerHTML = "10 pm";

	tenThirtyPMOption = document.createElement("option");
	tenThirtyPMOption.setAttribute("value", "2230");
	tenThirtyPMOption.innerHTML = "10:30 pm";

	elevenPMOption = document.createElement("option");
	elevenPMOption.setAttribute("value", "2300");
	elevenPMOption.innerHTML = "11 pm";

	elevenThirtyPMOption = document.createElement("option");
	elevenThirtyPMOption.setAttribute("value", "2330");
	elevenThirtyPMOption.innerHTML = "11:30 pm";



	switch (breakTimes.breakStart) {
		case 0600:
			sixAMOption.setAttribute("selected", "selected");
			break;

		case 0630:
			sixThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 0700:
			sevenAMOption.setAttribute("selected", "selected");
			break;

		case 0730:
			sevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 0800:
			eightAMOption.setAttribute("selected", "selected");
			break;

		case 0830:
			eightThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 0900:
			nineAMOption.setAttribute("selected", "selected");
			break;

		case 0930:
			nineThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 1000:
			tenAMOption.setAttribute("selected", "selected");
			break;

		case 1030:
			tenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 1100:
			elevenAMOption.setAttribute("selected", "selected");
			break;

		case 1130:
			elevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 1200:
			twelvePMOption.setAttribute("selected", "selected");
			break;

		case 1230:
			twelveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1300:
			onePMOption.setAttribute("selected", "selected");
			break;

		case 1330:
			oneThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1400:
			twoPMOption.setAttribute("selected", "selected");
			break;

		case 1430:
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1500:
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1530:
			threeThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1600:
			fourPMOption.setAttribute("selected", "selected");
			break;

		case 1630:
			fourThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1700:
			fivePMOption.setAttribute("selected", "selected");
			break;

		case 1730:
			fiveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1800:
			sixPMOption.setAttribute("selected", "selected");
			break;

		case 1830:
			sixThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1900:
			sevenPMOption.setAttribute("selected", "selected");
			break;

		case 1930:
			sevenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2000:
			eightPMOption.setAttribute("selected", "selected");
			break;

		case 2030:
			eightThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2100:
			ninePMOption.setAttribute("selected", "selected");
			break;

		case 2130:
			nineThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2200:
			tenPMOption.setAttribute("selected", "selected");
			break;

		case 2230:
			tenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2300:
			elevenPMOption.setAttribute("selected", "selected");
			break;

		case 2330:
			elevenThirtyPMOption.setAttribute("selected", "selected");
			break;
	}

	breakStartSelect = document.createElement("select");
	breakStartSelect.setAttribute("class", "breakStartSelect");
	breakStartSelect.add(sixAMOption);
	breakStartSelect.add(sixThirtyAMOption);
	breakStartSelect.add(sevenAMOption);
	breakStartSelect.add(sevenThirtyAMOption);
	breakStartSelect.add(eightAMOption);
	breakStartSelect.add(eightThirtyAMOption);
	breakStartSelect.add(nineAMOption);
	breakStartSelect.add(nineThirtyAMOption);
	breakStartSelect.add(tenAMOption);
	breakStartSelect.add(tenThirtyAMOption);
	breakStartSelect.add(elevenAMOption);
	breakStartSelect.add(elevenThirtyAMOption);
	breakStartSelect.add(twelvePMOption);
	breakStartSelect.add(twelveThirtyPMOption);
	breakStartSelect.add(onePMOption);
	breakStartSelect.add(oneThirtyPMOption);
	breakStartSelect.add(twoPMOption);
	breakStartSelect.add(twoThirtyPMOption);
	breakStartSelect.add(threePMOption);
	breakStartSelect.add(threeThirtyPMOption);
	breakStartSelect.add(fourPMOption);
	breakStartSelect.add(fourThirtyPMOption);
	breakStartSelect.add(fivePMOption);
	breakStartSelect.add(fiveThirtyPMOption);
	breakStartSelect.add(sixPMOption);
	breakStartSelect.add(sixThirtyPMOption);
	breakStartSelect.add(sevenPMOption);
	breakStartSelect.add(sevenThirtyPMOption);
	breakStartSelect.add(eightPMOption);
	breakStartSelect.add(eightThirtyPMOption);
	breakStartSelect.add(ninePMOption);
	breakStartSelect.add(nineThirtyPMOption);
	breakStartSelect.add(tenPMOption);
	breakStartSelect.add(tenThirtyPMOption);
	breakStartSelect.add(elevenPMOption);
	breakStartSelect.add(elevenThirtyPMOption);

	return breakStartSelect;
}


function appendBreakEndOptionsWithString(breakEnd){
	sixAMOption = document.createElement("option");
	sixAMOption.setAttribute("value", "0600");
	sixAMOption.innerHTML = "6 am";

	sixThirtyAMOption = document.createElement("option");
	sixThirtyAMOption.setAttribute("value", "0630");
	sixThirtyAMOption.innerHTML = "6:30 am";

	sevenAMOption = document.createElement("option");
	sevenAMOption.setAttribute("value", "0700");
	sevenAMOption.innerHTML = "7 am";

	sevenThirtyAMOption = document.createElement("option");
	sevenThirtyAMOption.setAttribute("value", "0730");
	sevenThirtyAMOption.innerHTML = "7:30 am";

	eightAMOption = document.createElement("option");
	eightAMOption.setAttribute("value", "0800");
	eightAMOption.innerHTML = "8 am";

	eightThirtyAMOption = document.createElement("option");
	eightThirtyAMOption.setAttribute("value", "0830");
	eightThirtyAMOption.innerHTML = "8:30 am";

	nineAMOption = document.createElement("option");
	nineAMOption.setAttribute("value", "0900");
	nineAMOption.innerHTML = "9 am";

	nineThirtyAMOption = document.createElement("option");
	nineThirtyAMOption.setAttribute("value", "0930");
	nineThirtyAMOption.innerHTML = "9:30 am";

	tenAMOption = document.createElement("option");
	tenAMOption.setAttribute("value", "1000");
	tenAMOption.innerHTML = "10 am";

	tenThirtyAMOption = document.createElement("option");
	tenThirtyAMOption.setAttribute("value", "1030");
	tenThirtyAMOption.innerHTML = "10:30 am";

	elevenAMOption = document.createElement("option");
	elevenAMOption.setAttribute("value", "1100");
	elevenAMOption.innerHTML = "11 am";

	elevenThirtyAMOption = document.createElement("option");
	elevenThirtyAMOption.setAttribute("value", "1130");
	elevenThirtyAMOption.innerHTML = "11:30 am";

	twelvePMOption = document.createElement("option");
	twelvePMOption.setAttribute("value", "1200");
	twelvePMOption.innerHTML = "12 pm";

	twelveThirtyPMOption = document.createElement("option");
	twelveThirtyPMOption.setAttribute("value", "1230");
	twelveThirtyPMOption.innerHTML = "12:30 pm";

	onePMOption = document.createElement("option");
	onePMOption.setAttribute("value", "1300");
	onePMOption.innerHTML = "1 pm";

	oneThirtyPMOption = document.createElement("option");
	oneThirtyPMOption.setAttribute("value", "1330");
	oneThirtyPMOption.innerHTML = "1:30 pm";

	twoPMOption = document.createElement("option");
	twoPMOption.setAttribute("value", "1400");
	twoPMOption.innerHTML = "2 pm";

	twoThirtyPMOption = document.createElement("option");
	twoThirtyPMOption.setAttribute("value", "1430");
	twoThirtyPMOption.innerHTML = "2:30 pm";

	threePMOption = document.createElement("option");
	threePMOption.setAttribute("value", "1500");
	threePMOption.innerHTML = "3 pm";

	threeThirtyPMOption = document.createElement("option");
	threeThirtyPMOption.setAttribute("value", "1530");
	threeThirtyPMOption.innerHTML = "3:30 pm";

	fourPMOption = document.createElement("option");
	fourPMOption.setAttribute("value", "1600");
	fourPMOption.innerHTML = "4 pm";

	fourThirtyPMOption = document.createElement("option");
	fourThirtyPMOption.setAttribute("value", "1630");
	fourThirtyPMOption.innerHTML = "4:30 pm";

	fivePMOption = document.createElement("option");
	fivePMOption.setAttribute("value", "1700");
	fivePMOption.innerHTML = "5 pm";

	fiveThirtyPMOption = document.createElement("option");
	fiveThirtyPMOption.setAttribute("value", "1730");
	fiveThirtyPMOption.innerHTML = "5:30 pm";

	sixPMOption = document.createElement("option");
	sixPMOption.setAttribute("value", "1800");
	sixPMOption.innerHTML = "6 pm";

	sixThirtyPMOption = document.createElement("option");
	sixThirtyPMOption.setAttribute("value", "1830");
	sixThirtyPMOption.innerHTML = "6:30 pm";

	sevenPMOption = document.createElement("option");
	sevenPMOption.setAttribute("value", "1900");
	sevenPMOption.innerHTML = "7 pm";

	sevenThirtyPMOption = document.createElement("option");
	sevenThirtyPMOption.setAttribute("value", "1930");
	sevenThirtyPMOption.innerHTML = "7:30 pm";

	eightPMOption = document.createElement("option");
	eightPMOption.setAttribute("value", "2000");
	eightPMOption.innerHTML = "8 pm";

	eightThirtyPMOption = document.createElement("option");
	eightThirtyPMOption.setAttribute("value", "2030");
	eightThirtyPMOption.innerHTML = "8:30 pm";

	ninePMOption = document.createElement("option");
	ninePMOption.setAttribute("value", "2100");
	ninePMOption.innerHTML = "9 pm";

	nineThirtyPMOption = document.createElement("option");
	nineThirtyPMOption.setAttribute("value", "2130");
	nineThirtyPMOption.innerHTML = "9:30 pm";

	tenPMOption = document.createElement("option");
	tenPMOption.setAttribute("value", "2200");
	tenPMOption.innerHTML = "10 pm";

	tenThirtyPMOption = document.createElement("option");
	tenThirtyPMOption.setAttribute("value", "2230");
	tenThirtyPMOption.innerHTML = "10:30 pm";

	elevenPMOption = document.createElement("option");
	elevenPMOption.setAttribute("value", "2300");
	elevenPMOption.innerHTML = "11 pm";

	elevenThirtyPMOption = document.createElement("option");
	elevenThirtyPMOption.setAttribute("value", "2330");
	elevenThirtyPMOption.innerHTML = "11:30 pm";


	switch (breakEnd) {
		case "6 am":
			sixAMOption.setAttribute("selected", "selected");
			break;

		case "6:30 am":
			sixThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "7 am":
			sevenAMOption.setAttribute("selected", "selected");
			break;

		case "7:30 am":
			sevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "8 am":
			eightAMOption.setAttribute("selected", "selected");
			break;

		case "8:30 am":
			eightThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "9 am":
			nineAMOption.setAttribute("selected", "selected");
			break;

		case "9:30 am":
			nineThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "10 am":
			tenAMOption.setAttribute("selected", "selected");
			break;

		case "10:30 am":
			tenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "11 am":
			elevenAMOption.setAttribute("selected", "selected");
			break;

		case "11:30 am":
			elevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case "12 pm":
			twelvePMOption.setAttribute("selected", "selected");
			break;

		case "12:30 pm":
			twelveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "1 pm":
			onePMOption.setAttribute("selected", "selected");
			break;

		case "1:30 pm":
			oneThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "2 pm":
			twoPMOption.setAttribute("selected", "selected");
			break;

		case "2:30 pm":
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "3 pm":
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "3:30 pm":
			threeThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "4 pm":
			fourPMOption.setAttribute("selected", "selected");
			break;

		case "4:30 pm":
			fourThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "5 pm":
			fivePMOption.setAttribute("selected", "selected");
			break;

		case "5:30 pm":
			fiveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "6 pm":
			sixPMOption.setAttribute("selected", "selected");
			break;

		case "6:30 pm":
			sixThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "7 pm":
			sevenPMOption.setAttribute("selected", "selected");
			break;

		case "7:30 pm":
			sevenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "8 pm":
			eightPMOption.setAttribute("selected", "selected");
			break;

		case "8:30 pm":
			eightThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "9 pm":
			ninePMOption.setAttribute("selected", "selected");
			break;

		case "9:30 pm":
			nineThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "10 pm":
			tenPMOption.setAttribute("selected", "selected");
			break;

		case "10:30 pm":
			tenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case "11 pm":
			elevenPMOption.setAttribute("selected", "selected");
			break;

		case "11:30 pm":
			elevenThirtyPMOption.setAttribute("selected", "selected");
			break;
	}


	breakEndSelect = document.createElement("select");
	breakEndSelect.setAttribute("class", "breakEndSelect");
	breakEndSelect.add(sixAMOption);
	breakEndSelect.add(sixThirtyAMOption);
	breakEndSelect.add(sevenAMOption);
	breakEndSelect.add(sevenThirtyAMOption);
	breakEndSelect.add(eightAMOption);
	breakEndSelect.add(eightThirtyAMOption);
	breakEndSelect.add(nineAMOption);
	breakEndSelect.add(nineThirtyAMOption);
	breakEndSelect.add(tenAMOption);
	breakEndSelect.add(tenThirtyAMOption);
	breakEndSelect.add(elevenAMOption);
	breakEndSelect.add(elevenThirtyAMOption);
	breakEndSelect.add(twelvePMOption);
	breakEndSelect.add(twelveThirtyPMOption);
	breakEndSelect.add(onePMOption);
	breakEndSelect.add(oneThirtyPMOption);
	breakEndSelect.add(twoPMOption);
	breakEndSelect.add(twoThirtyPMOption);
	breakEndSelect.add(threePMOption);
	breakEndSelect.add(threeThirtyPMOption);
	breakEndSelect.add(fourPMOption);
	breakEndSelect.add(fourThirtyPMOption);
	breakEndSelect.add(fivePMOption);
	breakEndSelect.add(fiveThirtyPMOption);
	breakEndSelect.add(sixPMOption);
	breakEndSelect.add(sixThirtyPMOption);
	breakEndSelect.add(sevenPMOption);
	breakEndSelect.add(sevenThirtyPMOption);
	breakEndSelect.add(eightPMOption);
	breakEndSelect.add(eightThirtyPMOption);
	breakEndSelect.add(ninePMOption);
	breakEndSelect.add(nineThirtyPMOption);
	breakEndSelect.add(tenPMOption);
	breakEndSelect.add(tenThirtyPMOption);
	breakEndSelect.add(elevenPMOption);
	breakEndSelect.add(elevenThirtyPMOption);

	return breakEndSelect;

	
}


function appendBreakEndOptions(breakTimes) {


	sixAMOption = document.createElement("option");
	sixAMOption.setAttribute("value", "0600");
	sixAMOption.innerHTML = "6 am";

	sixThirtyAMOption = document.createElement("option");
	sixThirtyAMOption.setAttribute("value", "0630");
	sixThirtyAMOption.innerHTML = "6:30 am";

	sevenAMOption = document.createElement("option");
	sevenAMOption.setAttribute("value", "0700");
	sevenAMOption.innerHTML = "7 am";

	sevenThirtyAMOption = document.createElement("option");
	sevenThirtyAMOption.setAttribute("value", "0730");
	sevenThirtyAMOption.innerHTML = "7:30 am";

	eightAMOption = document.createElement("option");
	eightAMOption.setAttribute("value", "0800");
	eightAMOption.innerHTML = "8 am";

	eightThirtyAMOption = document.createElement("option");
	eightThirtyAMOption.setAttribute("value", "0830");
	eightThirtyAMOption.innerHTML = "8:30 am";

	nineAMOption = document.createElement("option");
	nineAMOption.setAttribute("value", "0900");
	nineAMOption.innerHTML = "9 am";

	nineThirtyAMOption = document.createElement("option");
	nineThirtyAMOption.setAttribute("value", "0930");
	nineThirtyAMOption.innerHTML = "9:30 am";

	tenAMOption = document.createElement("option");
	tenAMOption.setAttribute("value", "1000");
	tenAMOption.innerHTML = "10 am";

	tenThirtyAMOption = document.createElement("option");
	tenThirtyAMOption.setAttribute("value", "1030");
	tenThirtyAMOption.innerHTML = "10:30 am";

	elevenAMOption = document.createElement("option");
	elevenAMOption.setAttribute("value", "1100");
	elevenAMOption.innerHTML = "11 am";

	elevenThirtyAMOption = document.createElement("option");
	elevenThirtyAMOption.setAttribute("value", "1130");
	elevenThirtyAMOption.innerHTML = "11:30 am";

	twelvePMOption = document.createElement("option");
	twelvePMOption.setAttribute("value", "1200");
	twelvePMOption.innerHTML = "12 pm";

	twelveThirtyPMOption = document.createElement("option");
	twelveThirtyPMOption.setAttribute("value", "1230");
	twelveThirtyPMOption.innerHTML = "12:30 pm";

	onePMOption = document.createElement("option");
	onePMOption.setAttribute("value", "1300");
	onePMOption.innerHTML = "1 pm";

	oneThirtyPMOption = document.createElement("option");
	oneThirtyPMOption.setAttribute("value", "1330");
	oneThirtyPMOption.innerHTML = "1:30 pm";

	twoPMOption = document.createElement("option");
	twoPMOption.setAttribute("value", "1400");
	twoPMOption.innerHTML = "2 pm";

	twoThirtyPMOption = document.createElement("option");
	twoThirtyPMOption.setAttribute("value", "1430");
	twoThirtyPMOption.innerHTML = "2:30 pm";

	threePMOption = document.createElement("option");
	threePMOption.setAttribute("value", "1500");
	threePMOption.innerHTML = "3 pm";

	threeThirtyPMOption = document.createElement("option");
	threeThirtyPMOption.setAttribute("value", "1530");
	threeThirtyPMOption.innerHTML = "3:30 pm";

	fourPMOption = document.createElement("option");
	fourPMOption.setAttribute("value", "1600");
	fourPMOption.innerHTML = "4 pm";

	fourThirtyPMOption = document.createElement("option");
	fourThirtyPMOption.setAttribute("value", "1630");
	fourThirtyPMOption.innerHTML = "4:30 pm";

	fivePMOption = document.createElement("option");
	fivePMOption.setAttribute("value", "1700");
	fivePMOption.innerHTML = "5 pm";

	fiveThirtyPMOption = document.createElement("option");
	fiveThirtyPMOption.setAttribute("value", "1730");
	fiveThirtyPMOption.innerHTML = "5:30 pm";

	sixPMOption = document.createElement("option");
	sixPMOption.setAttribute("value", "1800");
	sixPMOption.innerHTML = "6 pm";

	sixThirtyPMOption = document.createElement("option");
	sixThirtyPMOption.setAttribute("value", "1830");
	sixThirtyPMOption.innerHTML = "6:30 pm";

	sevenPMOption = document.createElement("option");
	sevenPMOption.setAttribute("value", "1900");
	sevenPMOption.innerHTML = "7 pm";

	sevenThirtyPMOption = document.createElement("option");
	sevenThirtyPMOption.setAttribute("value", "1930");
	sevenThirtyPMOption.innerHTML = "7:30 pm";

	eightPMOption = document.createElement("option");
	eightPMOption.setAttribute("value", "2000");
	eightPMOption.innerHTML = "8 pm";

	eightThirtyPMOption = document.createElement("option");
	eightThirtyPMOption.setAttribute("value", "2030");
	eightThirtyPMOption.innerHTML = "8:30 pm";

	ninePMOption = document.createElement("option");
	ninePMOption.setAttribute("value", "2100");
	ninePMOption.innerHTML = "9 pm";

	nineThirtyPMOption = document.createElement("option");
	nineThirtyPMOption.setAttribute("value", "2130");
	nineThirtyPMOption.innerHTML = "9:30 pm";

	tenPMOption = document.createElement("option");
	tenPMOption.setAttribute("value", "2200");
	tenPMOption.innerHTML = "10 pm";

	tenThirtyPMOption = document.createElement("option");
	tenThirtyPMOption.setAttribute("value", "2230");
	tenThirtyPMOption.innerHTML = "10:30 pm";

	elevenPMOption = document.createElement("option");
	elevenPMOption.setAttribute("value", "2300");
	elevenPMOption.innerHTML = "11 pm";

	elevenThirtyPMOption = document.createElement("option");
	elevenThirtyPMOption.setAttribute("value", "2330");
	elevenThirtyPMOption.innerHTML = "11:30 pm";


	switch (breakTimes.breakEnd) {
		case 0600:
			sixAMOption.setAttribute("selected", "selected");
			break;

		case 0630:
			sixThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 0700:
			sevenAMOption.setAttribute("selected", "selected");
			break;

		case 0730:
			sevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 0800:
			eightAMOption.setAttribute("selected", "selected");
			break;

		case 0830:
			eightThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 0900:
			nineAMOption.setAttribute("selected", "selected");
			break;

		case 0930:
			nineThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 1000:
			tenAMOption.setAttribute("selected", "selected");
			break;

		case 1030:
			tenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 1100:
			elevenAMOption.setAttribute("selected", "selected");
			break;

		case 1130:
			elevenThirtyAMOption.setAttribute("selected", "selected");
			break;

		case 1200:
			twelvePMOption.setAttribute("selected", "selected");
			break;

		case 1230:
			twelveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1300:
			onePMOption.setAttribute("selected", "selected");
			break;

		case 1330:
			oneThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1400:
			twoPMOption.setAttribute("selected", "selected");
			break;

		case 1430:
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1500:
			twoThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1530:
			threeThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1600:
			fourPMOption.setAttribute("selected", "selected");
			break;

		case 1630:
			fourThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1700:
			fivePMOption.setAttribute("selected", "selected");
			break;

		case 1730:
			fiveThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1800:
			sixPMOption.setAttribute("selected", "selected");
			break;

		case 1830:
			sixThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 1900:
			sevenPMOption.setAttribute("selected", "selected");
			break;

		case 1930:
			sevenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2000:
			eightPMOption.setAttribute("selected", "selected");
			break;

		case 2030:
			eightThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2100:
			ninePMOption.setAttribute("selected", "selected");
			break;

		case 2130:
			nineThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2200:
			tenPMOption.setAttribute("selected", "selected");
			break;

		case 2230:
			tenThirtyPMOption.setAttribute("selected", "selected");
			break;

		case 2300:
			elevenPMOption.setAttribute("selected", "selected");
			break;

		case 2330:
			elevenThirtyPMOption.setAttribute("selected", "selected");
			break;
	}


	breakEndSelect = document.createElement("select");
	breakEndSelect.setAttribute("class", "breakEndSelect");
	breakEndSelect.add(sixAMOption);
	breakEndSelect.add(sixThirtyAMOption);
	breakEndSelect.add(sevenAMOption);
	breakEndSelect.add(sevenThirtyAMOption);
	breakEndSelect.add(eightAMOption);
	breakEndSelect.add(eightThirtyAMOption);
	breakEndSelect.add(nineAMOption);
	breakEndSelect.add(nineThirtyAMOption);
	breakEndSelect.add(tenAMOption);
	breakEndSelect.add(tenThirtyAMOption);
	breakEndSelect.add(elevenAMOption);
	breakEndSelect.add(elevenThirtyAMOption);
	breakEndSelect.add(twelvePMOption);
	breakEndSelect.add(twelveThirtyPMOption);
	breakEndSelect.add(onePMOption);
	breakEndSelect.add(oneThirtyPMOption);
	breakEndSelect.add(twoPMOption);
	breakEndSelect.add(twoThirtyPMOption);
	breakEndSelect.add(threePMOption);
	breakEndSelect.add(threeThirtyPMOption);
	breakEndSelect.add(fourPMOption);
	breakEndSelect.add(fourThirtyPMOption);
	breakEndSelect.add(fivePMOption);
	breakEndSelect.add(fiveThirtyPMOption);
	breakEndSelect.add(sixPMOption);
	breakEndSelect.add(sixThirtyPMOption);
	breakEndSelect.add(sevenPMOption);
	breakEndSelect.add(sevenThirtyPMOption);
	breakEndSelect.add(eightPMOption);
	breakEndSelect.add(eightThirtyPMOption);
	breakEndSelect.add(ninePMOption);
	breakEndSelect.add(nineThirtyPMOption);
	breakEndSelect.add(tenPMOption);
	breakEndSelect.add(tenThirtyPMOption);
	breakEndSelect.add(elevenPMOption);
	breakEndSelect.add(elevenThirtyPMOption);

	return breakEndSelect;
}


function submitWorkingHoursListener() {
	submitBreakButton = document.getElementsByClassName("submitBreakButton");

	for (let x = 0; x < submitBreakButton.length; x++) {
		submitBreakButton[x].addEventListener("click", (event) => {
			event.stopPropagation();
			submitWorkingHoursEdit(x);
		})
	}
}


function submitWorkingHoursEdit(currentDay) {
	toDayOff = document.getElementsByClassName("dayOffSelect")[currentDay].value;
	workStartValue = document.getElementsByClassName("workStart")[currentDay].value;
	workEndValue = document.getElementsByClassName("workEnd")[currentDay].value;
	dayID = document.getElementsByClassName("dayID")[currentDay].innerHTML;
	breaksContainer = document.getElementsByClassName("breaksContainer")[currentDay];
	dayName = document.getElementsByClassName("dayName")[currentDay].innerHTML;
	breakIDs = document.getElementsByClassName("breakID");
	breakStart = document.getElementsByClassName("breakStartSelect");
	breakEnd = document.getElementsByClassName("breakEndSelect");
	wasDayOff = document.getElementsByClassName("wasDayOff")[currentDay].innerHTML;
	stylistID = document.getElementById("stylistID").innerHTML;

	breakStartValue = [];
	breakEndValue = [];
	breakIDValue = [];
	breakCounter = 0;
	

	//If the user does not have the day off
	if (toDayOff === "No") {
		for (let x = 0; x < breakStart.length; x++) { //Loop to determine if there is a new break or not
			if (breakStart[x].parentNode.parentNode.parentNode.parentNode.parentNode === breaksContainer) {
				breakStartValue[breakCounter] = breakStart[x].value;
				breakEndValue[breakCounter] = breakEnd[x].value;
				if(breakIDs[x] === undefined || breakIDs[x].innerHTML === ""){
					breakIDValue[breakCounter] = null;
				}
				else{
					breakIDValue[breakCounter] = breakIDs[x].innerHTML;
				}
				
				breakCounter++;
			}
		}

		fetch("/hoursEdit", {
			method: "post",
			mode: "cors",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				"dayID" : dayID,
				"dayName" : dayName,
				"toDayOff" : toDayOff,
				"workStartValue" : workStartValue,
				"workEndValue" : workEndValue,
				"breakIDValue" : breakIDValue,
				"breakStartValue" : breakStartValue,
				"breakEndValue" : breakEndValue,
				"wasDayOff" : wasDayOff,
				"stylistID" : stylistID
			})
		})
		.then(async (jsonString) => {
			data = await jsonString.json();
			notifyResult(
				data.error,
				"Error in hours edit, please try again later",
				data.taken,
				"",
				data.complete,
				"Edit complete"
			)
		});

	}
	else if (toDayOff === "Yes") {
		breakStartValue[0] = "0000";
		breakEndValue[0] = "2330";
		fetch("/hoursEdit", {
			method: "post",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body : JSON.stringify({
				"dayID" : dayID,
				"toDayOff" : toDayOff,
				"dayName" : dayName,
				"workStartValue" : workStartValue,
				"workEndValue" : workEndValue,
				"breakIDValue" : breakIDValue,
				"breakStartValue" : breakStartValue,
				"breakEndValue" : breakEndValue,
				"wasDayOff" : wasDayOff,
				"stylistID" : stylistID
			})
		})
		.then(async (jsonString) => {
			data = await jsonString.json();
			notifyResult(
				data.error,
				"Error in hours edit, please try again later",
				data.taken,
				"",
				data.complete,
				"Edit complete"
			)
		});
	}

	
}



function fillTimeSelect(){
	startTimeSelect = document.getElementById("startTimeOffSelect");
	endTimeSelect = document.getElementById("endTimeOffSelect");
	currentTimeID = findCurrentDay();

	let i =0;
	while(i < 84){ //84 is the number of days for 12 weeks 
		//Must make a copy of currentOption so that both start and end can get an option object
		startOption = document.createElement("option");
		endOption = document.createElement("option");
		startOption.setAttribute("value", currentTimeID);
		endOption.setAttribute("value", currentTimeID);
		
		dayString = createReadableDay(currentTimeID);

		startOption.innerText = `${dayString}`;
		endOption.innerText = `${dayString}`;
		startOption.setAttribute("value", currentTimeID);
		endOption.setAttribute("value", currentTimeID);

		if(i === 0){
			startOption.selected = true;
			endOption.selected = true;
		}

		startTimeSelect.appendChild(startOption);
		endTimeSelect.appendChild(endOption);
		i++;
		currentTimeID += 86400000;
	}
}

function submitTimeOffListener(){
	document.getElementById("submitTimeOff").addEventListener("click", submitTimeOff);
}
function submitTimeOff(){
	startTime = document.getElementById("startTimeOffSelect");
	endTime = document.getElementById("endTimeOffSelect");


	startTimeID =startTime.options[startTime.selectedIndex].value;
	endTimeID = endTime.options[endTime.selectedIndex].value;

	errors = checkForTimeOffErrors(startTimeID, endTimeID);
	if(errors === false){
		stylistID = document.getElementById("stylistID").innerText;
		fetch("/timeOff",{
			method : "post",
			mode : "cors",
			headers :{
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				"stylistID" : stylistID, 
				"timeStart" : startTimeID, 
				"timeEnd" : endTimeID
			})
		})
		.then(async(rawData)=>{
			data = await rawData.json();
			notifyResult(
				data.error,
                "Error in creating time off",
                null,
                "",
                data.complete,
                "Time off complete"
			);

			if(data.error === false){
				appendTimeOff(data.timeStart, data.timeEnd);
			}
		});
	}
}


function checkForTimeOffErrors(startTime, endTime){
	timeOffError1 = document.getElementById("timeOffError1");
	timeOffError2 = document.getElementById("timeOffError2");
	errors = false;

	if(timeOffError1.classList.contains("hidden") === false){
		timeOffError1.classList.add("hidden");
	}
	else if(timeOffError2.classList.contains("hidden") === false){
		timeOffError2.classList.add("hidden");
	}

	if(startTime > endTime){
		timeOffError1.classList.remove("hidden");
		errors = true;
	}
	else if(startTime === endTime){
		timeOffError2.classList.remove("hidden");
		errors = true;
	}

	return errors;
}


function appendTimeOff(timeStart, timeEnd){
	activeTimeOffContainer = document.getElementById("activeTimeOffContainer");
	
	timeStartString = createReadableDay(timeStart);
	timeEndString = createReadableDay(timeEnd);

	newTimeOff = createDiv(
		"class",
		"col-12 activeTimeOff buttonAccent elmSmallMarginTop", 
		`From ${timeStartString} to ${timeEndString}`
	);

	activeTimeOffContainer.appendChild(newTimeOff);
}


function deleteTimeOffListener(){
	deleteTimeOffButtons = document.getElementsByClassName("timeOffDelete");
	for(let i =0; i < deleteTimeOffButtons.length; i++ ){
		deleteTimeOffButtons[i].addEventListener("click", deleteTimeOff);
	}
	
}

function deleteTimeOff(event){
	let currentButton = event.currentTarget;
	let parentNode = currentButton.parentNode;
	let children  = parentNode.children;

	let i = 0;
	while(i < children.length){
		if(children[i].classList.contains("timeOffID") === true){
			timeOffID = children[i].innerText;
		}
		i++;
	}

	
	fetch("/timeOff", {
		method : "delete",
		mode : "cors",
		headers : {
			"Content-Type" : "application/json"
		},
		body : JSON.stringify({ "timeOffID" : timeOffID })
	})
	.then(async(rawData)=>{
		data = await rawData.json();
		notifyResult(
			data.error,
			"Error in deleting time off",
			null,
			"",
			data.complete,
			"Deleted time off, page will refresh"
		);

		if(data.error === false){
			setTimeout(()=>{
				window.location.href = "/profile";
			}, 2000);
		}
	});
}
