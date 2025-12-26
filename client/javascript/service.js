function serviceInit(){
    //Add service listener
    addServiceListenerCreate();

    //Edit service listener
    editServiceListenerCreate();

    //Time slot listeners
    timeSlotListenerCreate();

    //Delete service listeners
    deleteServiceListenerCreate();

    //Service button listener
    serviceButtonListenerCreate();

    //Add the add new time slot listener
    addNewTimeSlotListenerCreate();

    //Add the remove new time slot listener
    removeNewTimeSlotListenerCreate();

    //New service listener
    newServiceListenerCreate();
}

function addServiceListenerCreate(){
    addServiceButton = document.getElementById("addService");
    addServiceButton.addEventListener("click", ()=>{
        addServiceToggle(addServiceButton);
        addServiceButton.cancelBubble = true;
    });
}



function addServiceToggle(addServiceButton){
    newServiceContainer = document.getElementById("newServiceContainer");
    if(newServiceContainer.classList.contains("hidden") === true){
        newServiceContainer.classList.remove("hidden");
        addServiceButton.innerHTML = "Cancel";
        addServiceButton.classList.remove("buttonNeutral");
        addServiceButton.classList.add("buttonCaution");
    }
    else if(newServiceContainer.classList.contains("hidden") === false){
        newServiceContainer.classList.add("hidden");
        addServiceButton.innerHTML = "Add Service";
        addServiceButton.classList.remove("buttonCaution");
        addServiceButton.classList.add("buttonNeutral");
    }
}


function editServiceListenerCreate(){
    submitButtonServices = document.getElementsByClassName("submitButtonServices");
    for(let x = 0; x < submitButtonServices.length; x++){
        submitButtonServices[x].addEventListener("click", ()=>{
            editServices(submitButtonServices[x], x);
            submitButtonServices[x].cancelBubble = true;
        });
    }
}



async function editServices(submitButton, currentService){
    let inputs = document.getElementsByClassName("input");
    let errors = document.getElementsByClassName("error");
    let serviceIDs = document.getElementsByClassName("serviceID");
    let serviceName = document.getElementsByClassName("serviceName");
    let charge = document.getElementsByClassName("charge");
    let timeSlotsRow = document.getElementsByClassName("timeSlotsRow");

    local = getLocalElements(submitButton.parentNode.parentNode, inputs, errors, serviceIDs);
    activeError = serviceErrorCheck(local.inputs, local.errors);
    timeSlotsRowChildren = timeSlotsRow[currentService].childNodes;
    timeSlotData = getTimeSlotsData(timeSlotsRowChildren);
    timeSelectValues = convertStringToBoolean(timeSlotData.values);

    if(activeError === false){
        timeSlotsData = getTimeSlotsData(timeSlotsRowChildren);
        //Pass the edit function to the global listener
        //Then run he edit function after the user has confirmed the edit
        fetch("/services", {
            method: "post",
            mode:"cors",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                "serviceName" : serviceName[currentService].value,
                "charge" : charge[currentService].value,
                "serviceID" : id,
                "timeSelectValues" : timeSelectValues,
                "timeSelectCount" : timeSlotsData.count
            })
        })
        .then(async(res)=>{
            res = await res.json();
            notifyResult(
                res.error,
                "Error in service edit, please try again later",
                null,
                "",
                res.complete,
                "Service edit completed" 
            );
        });
    }


} 


function convertStringToBoolean(values){
    let i =0;
    booleanValues = [];
    boolCounter = 0;
    while(i < values.length){
        if(values[i] === "true"){
            booleanValues[boolCounter] = true;
            boolCounter++;
        }
        else if(values[i] === "false"){
            booleanValues[boolCounter] = false;
            boolCounter++;
        }
        i++;
    }
    return booleanValues;
}


function getLocalElements(currentService, allInputs, allErrors, allIDs){
    inputs = [];
    errors = [];
    count = 0;
    id = null;

    for(let x =0; x < allInputs.length; x++){
        if(allInputs[x].parentNode.parentNode === currentService){
            inputs[count] = allInputs[x]; 
            count++;
        }
        else if(allInputs[x].parentNode.parentNode.parentNode === currentService){
            inputs[count] = allInputs[x]; 
            count++;
        }
    }

    count = 0;
    for(let x = 0; x < allErrors.length; x++){
        if(allErrors[x].parentNode.parentNode === currentService){
            errors[count] = allErrors[x];
            count++;
        }
    }


    for(let x =0; x < allIDs.length && id === null; x++){
        if(currentService === allIDs[x].parentNode.parentNode){
            id = allIDs[x].innerHTML;
        }
    }
    return {
        inputs,
        errors,
        id
    }
}


function serviceErrorCheck(localInputs, localErrors){
    activeErrors = false;
    for(let x =0; x < localInputs.length; x++){
        if(localInputs[x].classList.contains("inputText") === true){
            if(localInputs[x].value !== ""){
                errorState=false;
                activeErrors = false;
                changeErrorState(localErrors[x], errorState);
            }
            else{
                errorState=true;
                activeErrors = true;
                changeErrorState(localErrors[x], errorState);
            }
        }
        else if(localInputs[x].classList.contains("inputNumbers") === true){
            value = localInputs[x].value;
            if(value !== ""){
                inValidChars = value.match(/[a-zA-Z]/g);
                if(inValidChars !== null){//Error from invalid chars
                    errorState = true;
                    activeErrors = true;
                    changeErrorState(localErrors[x], errorState); //Show or removes error based on previous state
                }
                else{//No errors 
                    errorState = false;
                    activeErrors = false;
                    changeErrorState(localErrors[x], errorState);
                }
            }
            else{ //Error from empty input
                errorState = true;
                activeErrors = true;
                changeErrorState(localErrors[x], errorState);
            }
        }
    }
    return activeErrors;
}


//Show or hidden error messages on the dom
function changeErrorState(currentError, errorState){
    //If there is an error and there is not an error shown. Then show the error

    if(errorState===true && currentError.classList.contains("hidden") === true){ 
        currentError.classList.remove("hidden");
        changeBy = currentError.offsetHeight;
    }
    //If there is not an error and there is an error shown. Then hide the error
    else if(errorState === false && currentError.classList.contains("hidden") === false){
        currentError.classList.add("hidden");
        changeBy = currentError.offsetHeight;
    } 

}

function deleteServiceListenerCreate(){
    deleteServiceButtons = document.getElementsByClassName("deleteServiceButton");
    for(let x =0; x < deleteServiceButtons.length; x++){
        deleteServiceButtons[x].addEventListener("click", ()=>{
            deleteService(x);
        });
    }
}

async function deleteService(currentService){
    serviceIDs = document.getElementsByClassName("serviceID");
    serviceContainer = document.getElementsByClassName("serviceContainer");
    fetch("/services", {
        method : "delete",
        mode : "cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({"serviceID" : serviceIDs[currentService].innerHTML})
    })
    .then(async(res)=>{
        res = await res.json();
        notifyResult(
            res.error,
            "Error in deleting service, please try again later",
            null,
            "",
            res.complete,
            "Service deleted, page will reset" 
        );
        

        if(res.complete === true){
            setTimeout(()=>{
                window.location.href = "/services";
            }, 2000);
        }
        
    });
}



function timeSlotListenerCreate(){
    addTimeSlotButtons = document.getElementsByClassName("addTimeSlot");
    removeTimeSlotButtons = document.getElementsByClassName("removeTimeSlot");

    for(let x = 0; x < addTimeSlotButtons.length; x++){
        addTimeSlotButtons[x].addEventListener("click", ()=>{
            addTimeSlot(addTimeSlotButtons[x], removeTimeSlotButtons[x]);
            addTimeSlotButtons[x].cancelBubble = true;
        });
        removeTimeSlotButtons[x].addEventListener("click", ()=>{
            removeTimeSlot(removeTimeSlotButtons[x], addTimeSlotButtons[x]);
            removeTimeSlotButtons[x].cancelBubble = true;
        });
    }

}
function addTimeSlot(addButton, removeButton){
    timeSlotsContainer = document.getElementsByClassName("timeSlotsContainer");//Container for all the time slot contianers
    timeSlotContainer = document.getElementsByClassName("timeSlotContainer");//Container for one time slot
    timeSlotsRow = document.getElementsByClassName("timeSlotsRow");
    containerFound = false;
    currentTimeSlotContainer = null;
    currentTimeSlotsRow = null;
    

    timeSlotCount = 1;
    for(let y = 0; y < timeSlotsContainer.length && containerFound === false; y++){
        if(timeSlotsContainer[y].parentNode.parentNode === addButton.parentNode){
            if(containerFound === false){
                currentTimeSlotContainer = timeSlotsContainer[y];
                currentTimeSlotsRow = timeSlotsRow[y];
                containerFound = true;
            }
        }
    }


    for(let x =0; x < timeSlotContainer.length; x++){
        if(timeSlotContainer[x].parentNode.parentNode.parentNode.parentNode === addButton.parentNode){
            timeSlotCount++;
        }
    }

    timeSlotContainerDiv = document.createElement("div");
    timeSlotContainerDiv.setAttribute("class","col-12 col-md-6 col-lg-12 elmPaddingTop timeSlotContainer");

    timeSlotLabel = document.createElement("div");
    timeSlotLabel.innerHTML = `Time Slot ${timeSlotCount}`;
    timeSlotLabel.setAttribute("class", "timeLabel text");


    timeSlotSelect = document.createElement("select");
    timeSlotSelect.setAttribute("class", "timeSelect input inputStyle elmSmallestMarginBottom");


    timeSlotOptionActive = document.createElement("option");
    timeSlotOptionActive.setAttribute("value", "true");
    timeSlotOptionActive.setAttribute("selected", "selected");
    timeSlotOptionActive.innerHTML = "Active";


    timeSlotOptionPassive = document.createElement("option");
    timeSlotOptionPassive.setAttribute("value", "false");
    timeSlotOptionPassive.innerHTML = "Passive";


    timeSlotSelect.add(timeSlotOptionActive);
    timeSlotSelect.add(timeSlotOptionPassive);

    timeSlotContainerDiv.appendChild(timeSlotLabel);
    timeSlotContainerDiv.appendChild(timeSlotSelect);
    currentTimeSlotContainer.appendChild(timeSlotContainerDiv);
    currentTimeSlotsRow.appendChild(timeSlotContainerDiv)
    

    if(timeSlotCount >= 15  && addButton.classList.contains("hidden") === false){
        addButton.classList.add("hidden");
    }

    if(timeSlotCount > 0  && removeButton.classList.contains("hidden") === true){
        removeButton.classList.remove("hidden");
    }
}
function removeTimeSlot(removeButton, addButton){
    timeSlotsContainer = document.getElementsByClassName("timeSlotsContainer");//Container for all the time slot contianers
    timeSlotContainer = document.getElementsByClassName("timeSlotContainer");//Container for one time slot
    timeSlotLabel = document.getElementsByClassName("timeLabel");
    timeSlotCount = 0;
    timeSlotList = [];
    timeSlotLabelList = [];

    for(let y =0; y < timeSlotsContainer.length; y++){
        if(timeSlotsContainer[y].parentNode.parentNode === removeButton.parentNode){
            for(let x =0; x < timeSlotContainer.length; x++){
                if(timeSlotContainer[x].parentNode.parentNode === timeSlotsContainer[y]){
                    timeSlotList[timeSlotCount] = timeSlotContainer[x];
                    timeSlotLabelList[timeSlotCount] = timeSlotLabel[x];
                    timeSlotCount++;
                }
            }
        }
    }

    timeSlotList[timeSlotList.length - 1].remove();
    timeSlotLabelList[timeSlotLabelList.length - 1].remove();
    timeSlotCount--;

    //Hidden remove button when there is only one time slot left
    if(timeSlotCount <= 1 && removeButton.classList.contains("hidden") === false){
        removeButton.classList.add("hidden");
    }

    //Revale add button then there is less than 4 time slots
    if(timeSlotCount < 4 && addButton.classList.contains("hidden") === true){
        addButton.classList.remove("hidden");
    }
}






function serviceButtonListenerCreate(){
    serviceButtons = document.getElementsByClassName("serviceButton");
    for(let x = 0; x < serviceButtons.length; x++){
        serviceButtons[x].onclick = ()=>{
            serviceButtonToggle(x);
        };
    }
}
function serviceButtonToggle(currentService){
    let serviceContent = document.getElementsByClassName("serviceContent");
    console.log(`serviceContent Length : ${serviceContent.length}`);

    if(serviceContent[currentService].classList.contains("hidden") === true){
        serviceContent[currentService].classList.remove("hidden");

        containerHeight = serviceContent[currentService].parentNode.offsetHeight;
        serviceHeight = serviceContent[currentService].offsetHeight;
        buttonHeight = containerHeight - serviceHeight;
        
        serviceContent[currentService].animate([
            { height : `${0}px` },
            { height : `${containerHeight - buttonHeight}px` }
        ], { duration : 200 });
    }
    else if(serviceContent[currentService].classList.contains("hidden") !== true){
        serviceContent[currentService].animate([
            { height : `${containerHeight - buttonHeight}px` },
            { height : `${0}px` }
        ], { duration : 200 });
        setTimeout(()=>{ serviceContent[currentService].classList.add("hidden"); }, 199);
    }

}



function addNewTimeSlotListenerCreate(){
    document.getElementById("addNewTimeSlot").addEventListener("click", addNewTimeSlot);
}
function addNewTimeSlot(){
    timeSlotContainer = document.getElementById("newTimeSlotContianer");
    newAddButton = document.getElementById("addNewTimeSlot");
    newRemoveButton = document.getElementById("removeNewTimeSlot");
    newTimeSelect = document.getElementsByClassName("newTimeSelect");

    slotContainerDiv = document.createElement("div");
    slotContainerDiv.setAttribute("class","col-12 col-md-6 col-lg-4 elmSmallMarginTop slotContainer");


    timeSlotCount = newTimeSelect.length + 1;
    

    timeSlotLabel = document.createElement("div");
    timeSlotLabel.innerHTML = `Time Slot ${timeSlotCount}`;
    timeSlotLabel.setAttribute("class", "newTimeLabel");
    slotContainerDiv.appendChild(timeSlotLabel);


    timeSlotSelect = document.createElement("select");
    timeSlotSelect.setAttribute("class", "newTimeSelect input inputStyle");
    slotContainerDiv.appendChild(timeSlotSelect);


    timeSlotOptionActive = document.createElement("option");
    timeSlotOptionActive.setAttribute("value", "true");
    timeSlotOptionActive.setAttribute("selected", "selected");
    timeSlotOptionActive.innerHTML = "Active";


    timeSlotOptionPassive = document.createElement("option");
    timeSlotOptionPassive.setAttribute("value", "false");
    timeSlotOptionPassive.innerHTML = "Passive";


    timeSlotSelect.add(timeSlotOptionActive);
    timeSlotSelect.add(timeSlotOptionPassive);
    slotContainerDiv.appendChild(timeSlotSelect);

    timeSlotContainer.appendChild(slotContainerDiv);

    

    if(timeSlotCount >= 16  && newAddButton.classList.contains("hidden") === false){
        newAddButton.classList.add("hidden");
    }

    if(timeSlotCount > 0  && newRemoveButton.classList.contains("hidden") === true){
        newRemoveButton.classList.remove("hidden");
    }
}



function removeNewTimeSlotListenerCreate(){
    document.getElementById("removeNewTimeSlot").addEventListener("click", removeNewTimeSlot);
}
function removeNewTimeSlot(){
    newTimeSelect = document.getElementsByClassName("newTimeSelect");
    newSlotLabels = document.getElementsByClassName("newTimeLabel");
    newAddButton = document.getElementById("addNewTimeSlot");
    newRemoveButton = document.getElementById("removeNewTimeSlot");
    
    timeSelectCount = newTimeSelect.length - 1;

    newTimeSelect[timeSelectCount].remove();
    newSlotLabels[timeSelectCount].remove();
    

    //Hidden remove button when there is only one time slot left
    if(timeSelectCount <= 1 && newRemoveButton.classList.contains("hidden") === false){
        newRemoveButton.classList.add("hidden");
    }

    //Revale add button then there is less than 4 time slots
    if(timeSelectCount < 4 && newAddButton.classList.contains("hidden") === true){
        newAddButton.classList.remove("hidden");
    }
}


function newServiceListenerCreate(){
    newServiceButton = document.getElementById("submitNewService");
    newServiceButton.addEventListener("click", createNewService);
}
function createNewService(){

    timeSelectValues = [];
    timeSelectCount =0;
    serviceName = document.getElementById("newServiceName").value;
    charge = document.getElementById("newCharge").value;
    newTimeSlots = document.getElementsByClassName("newTimeSelect");
    
    for(let x =0; x < newTimeSlots.length; x++){
        timeSelectValues[x] = newTimeSlots[x].value;
        timeSelectCount++;
    }

    timeSelectValues = convertStringToBoolean(timeSelectValues);



    fetch("/newService", {
        method: "post",
        mode:"cors",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "serviceName" : serviceName,
            "charge" : charge,
            "timeSelectValues" : timeSelectValues,
            "timeSelectCount" : timeSelectCount
        })
    })
    .then(async(res)=>{
        res = await res.json();
        notifyResult(
            res.error,
            "Error in new service, please try again later",
            null,
            "",
            res.complete,
            "Service edit completed, page will refresh" 
        );
        
        if(res.complete === true){
            //resetAddService();
            clientRedirect("/services");
        }
    });

}


function resetAddService(){
    document.getElementById("newServiceName").value = "";
    document.getElementById("newCharge").value = "";
}


function getTimeSlotsData(timeSlotsRowChildren){
    count = 0;
    values = [];  
    valueCounter = 0;      
    for(let x = 0; x < timeSlotsRowChildren.length; x++){ //Find how many time slots there are
        if(timeSlotsRowChildren[x].nodeName === "DIV"){ //There are no other classes on the other nodes and needs to be filtered by DIV which has the class attr
            if(timeSlotsRowChildren[x].classList.contains("timeSlotContainer") === true){
                count++;
                timeSlotChildren = timeSlotsRowChildren[x].childNodes;
                for(let y = 0; y < timeSlotChildren.length; y++){
                    if(timeSlotChildren[y].nodeName === "SELECT"){
                        values[valueCounter] = timeSlotChildren[y].value;
                        valueCounter++;
                    }
                }
            }
        }
    }
    return {
        count,
        values
    }
}


