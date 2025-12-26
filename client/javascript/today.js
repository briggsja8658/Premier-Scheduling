
function todayInit(){
    checkForTimeAdvance();
    checkForNewAppointments();
}

function checkForTimeAdvance(){
    
    findAppointments = true;
    timeIDs = [];
    setInterval(()=>{
        timeNow = Date.now();
        if(findAppointments === true){
            todaysAppontments = document.getElementsByClassName("appointmentContainer");
            let i =0;
            timeIDs= [];
            while(i < todaysAppontments.length){
                timeIDs[i] = Number(todaysAppontments[i].firstChild.nextSibling.innerText);
                i++;
            }
            findAppointments = false;
        }

        
        let i = 0;
        while(i < timeIDs.length){
            if(timeIDs[i] <= timeNow){
                todaysAppontments[i].remove();
                findAppointments = true;
            }
            i++;
        }
        

    }, 60000)
}


function checkForNewAppointments(){
    
    
    setInterval(()=>{
        
        fetch("/getAppointments",{
            method : "get",
            mode : "cors"
        })
        .then( async (rawJson)=>{
            jsonData = await rawJson.json();
            appointmentsToday = jsonData.appointmentsToday;
            customerImages = jsonData.customerImages;
            checkIfNew(appointmentsToday, customerImages);
        })

    }, 300000) //Check for apppointments every 5 mins
}


function checkIfNew(appointmentsToday, customerImages){
    appointmentsContainer = document.getElementsByClassName("title1")[0].parentElement;
    let currentTimeIDs = document.getElementsByClassName("timeID");

    let i = 0;
    let x = 0;
    while(i < appointmentsToday.length){
        timeFound = false;
        testID = appointmentsToday[i].timeID;
        while(x < currentTimeIDs.length && timeFound === false){

            if(Number(currentTimeIDs[x].innerText) === appointmentsToday[i].timeID){
                timeFound = true;
            }
            x++;
        }
        
        if(timeFound === false){
            appendNewApponinments(appointmentsToday[i], customerImages[i], appointmentsContainer);
        }
        i++;
    }

}


function appendNewApponinments(currentAppointment, currentCustomerImage, parentContainer){

    appointmentContainer = createDiv("class", "appointmentContainer col-12 col-md-6 col-lg-4");
    hiddenTimeID = createDiv("class", "hidden timeID", `${currentAppointment.timeID}`);
    appointmentContainer.appendChild(hiddenTimeID);

    buttonContainer = createATag(["class", "id"], ["buttonAccent elmSmallestMarginTop", `${currentAppointment._id}`]);
    appointmentContainer.appendChild(buttonContainer);

    rowDiv = createDiv("class", "row no-gutters");
    buttonContainer.appendChild(rowDiv);


    imgContainer = createDiv("class","col-4");
    rowDiv.appendChild(imgContainer);


    imageElm = document.createElement("img");
    imageElm.src = `${currentCustomerImage}`;
    imgContainer.appendChild(imageElm);


    quickInfoContainer = createDiv("class", "col-8");
    rowDiv.appendChild(quickInfoContainer);

    customerName = createDiv(null, null, `${currentAppointment.customerName}`);
    time = createDiv(null, null, `${currentAppointment.time}`);
    serviceName = createDiv(null, null, `${currentAppointment.serviceName}`);
    quickInfoContainer.appendChild(customerName);
    quickInfoContainer.appendChild(time);
    quickInfoContainer.appendChild(serviceName);

    parentContainer.appendChild(appointmentContainer);


}