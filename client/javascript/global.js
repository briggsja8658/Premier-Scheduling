function pageInit(pathName) {
    /*
        This page was made for all the functions that need to run on page load
    */



    //GENERAL FUNCTIONS AND LISTENERS
    //Check to see if the user is logged in by localstoage and cookie status
    checkLogIn(pathName);


    //Set background to image if the user is on the index page if not use the gradient
    //height adjustment is to fix the image for / and have a single gradient on the other pages
    windowHeight = window.outerHeight;
    if (pathName === "/") {
        background = document.getElementById("background");
        background.style.backgroundSize = "cover";
        background.style.backgroundRepeat = "no-repeat";
        background.style.backgroundImage = "url('/image/cool-blue.jpg')";
        background.style.height = `${windowHeight}px`;
    }


    //When the height of the dom changes alter the background relative to the change
    //Note that this needs to be last because functions before this one will alter the dom height
    backgroundListener();


    //The first run will hidden the menu
    alterMenu();
    //Then add a listener to all the open and close buttons for the menu/nav
    menuButtons = document.getElementsByClassName("menuButton");
    for (let x = 0; x < menuButtons.length; x++) {
        menuButtons[x].addEventListener("click", alterMenu);
    }



    //Init for the local database for the user
    //createLocalStorage();

    //When the page grows in size from added elements grow the background in proportion
    function backgroundListener() {
        //Interval is needed because some dom elements are cdn based and will not exsit when this runs
        //This also removes the need to run this function everytime there is a dom change
        prevWindowHeight = 0;
        prevContentHeight = 0;
        background = document.getElementById("background");
        setInterval(() => {
            //This is to fix the background issues
            //This extends the background to the size of the screen if the elements dont fill the screen
            contentHeight = document.getElementById("main").clientHeight;
            navBarHeight = document.getElementById("nav").clientHeight;
            windowHeight = window.innerHeight;

            if (prevWindowHeight < windowHeight || prevWindowHeight > windowHeight) {
                if (contentHeight > windowHeight) {
                    //This simulates padding-bottom with out having the break in the background
                    background.style.height = `${contentHeight + navBarHeight + 150}px`;
                    prevWindowHeight = windowHeight;
                    prevContentHeight = contentHeight;
                    prevNavHeight = navBarHeight;
                    moveNav(windowHeight);
                }
                else {
                    background.style.height = `${windowHeight + 150}px`;
                    prevWindowHeight = windowHeight;
                    prevContentHeight = contentHeight;
                    prevNavHeight = navBarHeight;
                    moveNav(windowHeight);
                }
            }
            if (prevContentHeight > contentHeight || prevContentHeight < contentHeight) {
                if (contentHeight > windowHeight) {
                    //This simulates padding-bottom with out having the break in the background
                    background.style.height = `${contentHeight + navBarHeight + 150}px`;
                    prevWindowHeight = windowHeight;
                    prevContentHeight = contentHeight;
                    prevNavHeight = navBarHeight;
                    moveNav(windowHeight);
                }
                else {
                    background.style.height = `${windowHeight + 150}px`;
                    prevWindowHeight = windowHeight;
                    prevContentHeight = contentHeight;
                    prevNavHeight = navBarHeight;
                    moveNav(windowHeight);
                }
            }

        }, 200)//This is the interval time
    }


    //If user is logged in redirect to today 
    
    function checkLogIn(pathName) {
        if (pathName === "/" && localStorage.userName !== undefined && localStorage.stylist === "true") {
            window.location.href = `/today`;
        }
        else if(pathName === "/" && localStorage.userName !== undefined && localStorage.stylist === "false"){
            window.location.href = `/main`;
        }

        //Create cookie if one is not set. This cookie will be used to get information relative to the user
        if (document.cookie !== "" && document.cookie !== "userName=") {
            if (localStorage.userName === undefined || localStorage.name === undefined || localStorage.stylist === undefined
                || localStorage.userName === "" || localStorage.name === "" || localStorage.stylist === "") {
                //userName and name are used to set length to ignore in the substring function
                userName = "userName=";
                customerUserName = "customerUserName=";
                firstName = "name=";
                stylist = "stylist=";
                userNameLength = userName.length;
                customerUserNameLength = customerUserName.length;
                nameLength = firstName.length;
                stylistLength = stylist.length;

                decodedCookie = decodeURIComponent(document.cookie);
                allCookies = decodedCookie.split(';');


                for (i = 0; i < allCookies.length; i++) {
                    cookie = allCookies[i];
                    while (cookie.charAt(0) == ' ') {
                        cookie = cookie.substring(1);
                    }
                    if (i === 0) {
                        localStorage.userName = cookie.substring(userNameLength, cookie.length);
                    }
                    else if(i === 1){
                        localStorage.customerUserName = cookie.substring(customerUserNameLength, cookie.length);
                    }
                    else if(i === 2) {
                        localStorage.name = cookie.substring(nameLength, cookie.length); 
                    }
                    else if(i === 3){
                        localStorage.stylist = cookie.substring(stylistLength, cookie.length);
                    }
                }

            }
        }  //If cookie doesn't exist and localStorge does set cookie based on localStroage
        else if (document.cookie === "" || document.cookie === "userName=") {
            if (localStorage.userName !== undefined) {
                document.cookie = `userName=${localStorage.userName};`;
                document.cookie = `customerUserName=${localStorage.customerUserName};`;
                document.cookie = `name=${localStorage.name};`;
                document.cookie = `stylist=${localStorage.stylist};`;
            }
        }


        //Redirect to index if localStorage is empty and the user is not on a stylist creation page
        if (localStorage.userName === undefined || localStorage.userName === "") {
            if (pathName !== "/" && pathName !== "/newProfile" && pathName !== "/login") {
                window.location.href = `/`;
            }
        }
    }


    function moveNav(windowHeight) {
        //Content Height repersents where the nav bar is located
        //windowHeight is needed for the condition if the 
        //content is not bigger then the default window size
        navBar = document.getElementById("nav");
        navBar.classList.remove("hidden");
        navBarHeight = navBar.clientHeight;
        navBar.style.position = "fixed";
        navBar.style.top = `${windowHeight - navBarHeight }px`;
    }


    function alterMenu() {
        menu = document.getElementById("menu");
        navBarHeight = document.getElementById("nav").offsetHeight;
        windowHeight = window.innerHeight;

        if (menu.classList.contains("hidden") === true) {
            menu.style.top = `-${windowHeight - navBarHeight}px`;
            menu.style.height = `${windowHeight}px`;
            menu.classList.remove("hidden");
        }
        else if (menu.classList.contains("hidden") !== true) {
            menu.classList.add("hidden");
        }
    }


    
}


function createDiv(attributeType, attributeString, newData){
    newDiv = document.createElement("div");
    if(attributeType === null || attributeString === null){
        newDiv.innerHTML = `${newData}`;
    }
    else if(typeof attributeType === "string"){
        newDiv.setAttribute(`${attributeType}`, `${attributeString}`);
        if(newData !== undefined && typeof newData === "string"){
            newDiv.innerHTML = `${newData}`;
        }
    }
    else if(typeof attributeType === "object"){
        let i =0; 
        while(i < attributeType.length){
            newDiv.setAttribute(`${attributeType[i]}`, `${attributeString[i]}`);
            i++;
        }
        if(newData !== undefined && typeof newData === "string"){
            newDiv.innerHTML = `${newData}`;
        }
    }
    return newDiv;
}



function createATag(attributeType, attributeString, newData){
    if(typeof attributeType === "string"){
        newATag = document.createElement("div");
        newATag.setAttribute(`${attributeType}`, `${attributeString}`);
        if(newData !== undefined && typeof newData === "string"){
            newATag.innerHTML = `${newData}`;
        }
    }
    else if(typeof attributeType === "object"){
        newATag = document.createElement("div");
        let i =0; 
        while(i < attributeType.length){
            newATag.setAttribute(`${attributeType[i]}`, `${attributeString[i]}`);
            i++;
        }
        if(newData !== undefined && typeof newData === "string"){
            newATag.innerHTML = `${newData}`;
        }
    }
    return newATag;
}


function showNotification(text){
    textElm = document.getElementById("alertText");
    leftExtendAnimation(textElm);
    textElm.innerText = text;
    setTimeout(()=>{
        textElm.innerText = "";
        leftExtendAnimation(textElm);
    }, 2500)
}

function scrollToFirstError(){
    let errors = document.getElementsByClassName("error");
    let i = 0;
    foundError = false;
    while(i < errors.length && foundError === false){
        if(errors[i].classList.contains("hidden") === false){
            errors[i].scrollIntoView({ behavior : "smooth", block : "center" });
            foundError = true;
        }
        i++
    }
}

function notifyResult(error, errorText, taken, takenText, complete, completeText){
    if(taken === true){
        showNotification(`${takenText}`);
    }
    else if(error === true){
        showNotification(`${errorText}`);
    }
    else if(complete === true){
        showNotification(`${completeText}`);
    }
}


function clientRedirect(path){
    setTimeout(()=>{
        window.location.href = `${path}`;
    }, 2000);
}


function createReadableDay(milSeconds){
    let localDate = new Date();
    let localTimeZone = localDate.getTimezoneOffset();
    let dateGMT = new Date(milSeconds + (localTimeZone * 60000));
    rawString = dateGMT.toDateString();
    returnString = rawString.slice(0, 10);
    return returnString;
}


function createReadableTime(milSeconds){
    rawTime = new Date(milSeconds);
    offsetTime = rawTime.getTimezoneOffset();
    localTime = new Date(milSeconds + (offsetTime * 60000));
    hour = Number(localTime.getHours());
    mins = Number(localTime.getMinutes());

    if(mins === 0){
        mins = "00";
    }

    return{
        hour,
        mins
    }
}


function findCurrentDay(){
    let oneDay = 86400000;
    let timeNow = Date.now();
    let timeDiff = timeNow % oneDay;
    let dayID = timeNow - timeDiff;
    return dayID;
}


function convertToTwelveHour(currentHour){
    hourFound = false;
    if(currentHour > 12){
        let i = 13;
        while(i <= 23 && hourFound === false){
            if(i === currentHour){
                if(i >= 21){
                    //If 9 PM or later 14 hours needs to be removed to get am / pm time
                    currentHour = currentHour - 14;
                    hourFound = true;
                }
                else{
                    //if between 12 and 9 pm 12 hours needs to be removed to get am / pm time
                    currentHour = currentHour - 12;
                    hourFound = true;
                }
            }
            i++;
        }
    }
    else if(currentHour === 0){
        currentHour = 12;
    }
    return currentHour;
}