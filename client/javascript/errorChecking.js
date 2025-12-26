

function checkForNewCustomerErrors(newFirstName, newLastName, newCustomerUserName, newCustomerEmail, newCustomerPhoneNumber){
    noErrors = true;

    let newFirstNameError = document.getElementById("newFirstNameError");
    errorState = checkText(newFirstName, newFirstNameError);
    if (errorState === true) {
        noErrors = false;
    }

    let newLastNameError = document.getElementById("newLastNameError");
    errorState = checkText(newLastName, newLastNameError);
    if (errorState === true) {
        noErrors = false;
    }

    let userNameError = document.getElementsByClassName("newUserNameError");
    errorState = checkUserName(newCustomerUserName, userNameError);
    if (errorState === true) {
        noErrors = false;
    }


    let emailError = document.getElementById("newEmailError");
    errorState = checkEmail(newCustomerEmail, emailError);
    if (errorState === true) {
        noErrors = false;
    }


    let telError = document.getElementById("newTelError");
    errorState = checkTel(newCustomerPhoneNumber, telError); 
    if (errorState === true) {
        noErrors = false;
    }

    
    if(noErrors === true){
        return false;
    }
    else if(noErrors === false){
        return true;
    }
}

function checkForCustomerErrors(customerName, customerEmail, customerPhoneNumber, currentCustomer) {

    noErrors = true;

    textError = document.getElementsByClassName("textError")[currentCustomer];
    errorState = checkText(customerName.value, textError);
    if (errorState === true) {
        noErrors = false;
        console.log(`Error in Text`);
    }


    emailError = document.getElementsByClassName("emailError")[currentCustomer];
    errorState = checkEmail(customerEmail.value, emailError);
    if (errorState === true) {
        noErrors = false;
        console.log(`Error in E-mail`);
    }


    telError = document.getElementsByClassName("telError")[currentCustomer];
    errorState = checkTel(customerPhoneNumber.value, telError); 
    if (errorState === true) {
        noErrors = false;
        console.log(`Error in phone number`);
    }

    
    if(noErrors === true){
        return false;
    }
    else if(noErrors === false){
        return true;
    }


}

function checkForBusinessErrors(){
    let noErrors = true;

    businessInputs = document.getElementsByClassName("businessInput");
    businessErrors = document.getElementsByClassName("businessError");

    let i=0;
    while(i < businessInputs.length){
        errorState = checkText(businessInputs[i].value, businessErrors[i]);
        i++;
    }

    
    if(noErrors === true){
        return false;
    }
    else if(noErrors === false){
        return true;
    }
}


function checkForSchedulingErrors(customers, services, serviceTimes, customerError, serviceError, timeError) {

	errors = false;

	//reset errors
	if (customerError.classList.contains("hidden") !== true) {
		customerError.classList.add("hidden");
	}
	if (serviceError.classList.contains("hidden") !== true) {
		serviceError.classList.add("hidden");
	}
	if (timeError.classList.contains("hidden") !== true) {
		timeError.classList.add("hidden");
	}



	//Check to see if there is a customer selected
	customerCount = 0;
	for (let x = 0; x < customers.length; x++) {
		if (customers[x].classList.contains("selected") === true) {
			customerCount++;
		}
	}
	if (customerCount === 0) {//There was no customer selected
		customerError.classList.remove("hidden");
		errors = true;
	}

	//Check to see if there is a service
	//There can be more than but limited to 5
	serviceCount = 0;
	for (let x = 0; x < services.length; x++) {
		if (services[x].classList.contains("selected") === true) {
			serviceCount++;
		}
	}
	if (serviceCount === 0) {
		serviceError.classList.remove("hidden");
		errors = true;
	}


    //Check to see if a service time was selected
    timeCount = 0;
    let i =0;
    while (i < serviceTimes.length){
        if(serviceTimes[i].classList.contains("selected") === true){
            timeCount++;
        }
        i++;
    }
    if(timeCount === 0){
        errors = true;
    }


	return errors;
	
}

async function checkForErrors() {

    //Find all the inputs and error messages for the page. 
    //Errors will be hidden to start with
    inputs = document.getElementsByClassName("input");

    //Check all inputs for errors
    telError = document.getElementsByClassName("telError");
    emailError = document.getElementsByClassName("emailError");
    textError = document.getElementsByClassName("textError");
    passwordError = document.getElementsByClassName("passwordError");
    numberError = document.getElementsByClassName("numberError");
    userNameError = document.getElementsByClassName("userNameError");
    picError = document.getElementsByClassName("picError");


    telIterator = 0;   //Keep track of which error type that the script is on
    emailIterator = 0; //This allows us to have one loop for all the inputs 
    textIterator = 0;  //and maintain which error needs to be shown
    passwordIterator = 0;
    numberIterator = 0;
    userNameIterator = 0;
    picIterator = 0;

    noErrors = true;

    let inputsIter = 0;
    while (inputsIter < inputs.length) {
        if (inputs[inputsIter].classList.contains("inputTel") === true) { //Check for phone number errors
            errorState = checkTel(inputs[inputsIter], telError[telIterator]); //pass in the phone number object to have access to properties in checkNumber 
            telIterator++;
            if (errorState === true) {
                noErrors = false;
                console.log(`Error in phone number`);
            }
        }
        if (inputs[inputsIter].classList.contains("inputEmail") === true) {
            //Only need the value because there is no .value alteration in checkEmail
            errorState = checkEmail(inputs[inputsIter].value, emailError[emailIterator]);
            emailIterator++;
            if (errorState === true) {
                noErrors = false;
                console.log(`Error in E-mail`);
            }
        }
        if (inputs[inputsIter].classList.contains("inputText") === true) {
            //Only need the value because there is no .value alteration in checkText
            errorState = checkText(inputs[inputsIter].value, textError[textIterator]);
            textIterator++;
            
            if (errorState === true) {
                noErrors = false;
                console.log(`Error in Text`);
            }
        }
        if (inputs[inputsIter].classList.contains("inputNumbers") === true) {
            //Only need the value because there is no .value alteration in checkNumbers
            errorState = checkNumbers(inputs[inputsIter].value, numberError[numberIterator]);
            numberIterator++;
            if (errorState === true) {
                noErrors = false;
                console.log(`Error in Numbers`);
            }
        }
        if (inputs[inputsIter].classList.contains("inputPassword") === true) {
            //Only need the value because there is no .value alteration in checkPassword
            errorState = checkPassword(inputs[inputsIter].value, passwordError[passwordIterator]);
            passwordIterator++;
            if (errorState === true) {
                noErrors = false;
                console.log(`Error in Password`);
            }
        }
        if (inputs[inputsIter].classList.contains("inputUserName") === true) {
            userName = inputs[inputsIter].value;
            userNameState = await checkUserName(inputs[inputsIter].value, userNameError[userNameIterator]);
            if(userNameState === 1){
                changeErrorState(userNameError[0], true); //Username was taken
            }
            else if(userNameState === 2){
                changeErrorState(userNameError[0], false); //No error
                changeErrorState(userNameError[1], false);
            }
            else if(userNameState === 3){
                changeErrorState(userNameError[1], false); //No username to check
            }
            if (userNameState === 1  || userNameState === 3) {
                noErrors = false;
                console.log(`Error in Username`);
            }
        }
        if (inputs[inputsIter].classList.contains("inputPic") === true) {
            //Inputs[inputsIter] is not nessary becuase checkPic needs to get the element that holds the image data anyways
            errorState = checkPic(picError[picIterator]);
            picIterator++;
            if (errorState === true) {
                noErrors = false;
                console.log(`Error in profile pic`);
            }
        }
        inputsIter++;
    }


    if (noErrors === true) {
        return false;
    }
    else {
        return true;
    }
}
    
    




//Check to see if the userName given is taken or not.
//If it's taken display the error message
async function checkUserName(userName) {
    if(userName !== ""){
        nameTaken = await fetch("/checkUserName", {
            method: "post",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "userName" : userName })
        })
            .then(async (fetchRes) => {
                userNameTaken = await fetchRes.json();
                if (userNameTaken === true) {
                    return 1; //state 1 is taken username
                }
                else {
                   return 2; // state 2 is avalible username
                }
            });
            return nameTaken;
    }
    else{
        return 3; //state 3 means that there is no string to check 
    }
}



//Check to see if a text input on a form is blank or not
function checkText(text, currentError) {
    
    if (text !== "") {
        errorState = false;
        changeErrorState(currentError, errorState);
        return errorState;
    }
    else {
        errorState = true;
        changeErrorState(currentError, errorState);
        return errorState;
    }
}




//Check phone number given from the form
function checkTel(currentTel, currentError) {
    if(typeof currentTel !== "string"){
        number = currentTel.value;
    }
    else{
        number = currentTel;
    }
    if (number !== "") { //check to see if input is empty
        number = cleanFormat(number);//remove chars that are not numbers
        if (number.length === 10) {
            numberPart1 = number.slice(0, 3);
            numberPart2 = number.slice(3, 6);
            numberPart3 = number.slice(6, 10);

            number = `(${numberPart1})-${numberPart2}-${numberPart3}`; //append phone number formating is test are passed
            currentTel.value = `${number}`;

            errorState = false;
            changeErrorState(currentError, errorState);//Show or removes error based on previous state
            return errorState;

        }
        else {
            errorState = true;
            currentTel.value = `${number}`;
            changeErrorState(currentError, errorState);
            return errorState;
        }
    }
    else {
        errorState = true;
        changeErrorState(currentError, errorState); //Show or removes error based on previous state
        return errorState;
    }
}

//Find and remove invalid chars
function cleanFormat(string) {
    newString = "";
    validChars = string.match(/\d+/g);
    if (validChars === null) {
        return newString;
    }
    else {
        for (let y = 0; y < validChars.length; y++) {
            newString = newString + validChars[y];
        }
        return newString;
    }
}



//see if the password is empty and then the match password does indeed match the password input.
//NOTE that there are no password harding checks (will put in soon 3/28/2020)
function checkPassword(passwordText, currentError) {
    passwordMatch = document.getElementById("passwordMatch");
    if (passwordText === "") {
        errorState = true;
        changeErrorState(currentError, errorState);//Show or removes error based on previous state
        return errorState;
    }
    else if (passwordMatch.value !== passwordText) {
        errorState = true;
        currentError = document.getElementById("passwordMatchError");
        changeErrorState(currentError, errorState);
        return errorState;
    }
    else {
        errorState = false;
        changeErrorState(currentError, errorState);

        currentError = document.getElementById("passwordMatchError");
        changeErrorState(currentError, errorState);

        return errorState;
    }

}






//Error checking for numbers only inputs
function checkNumbers(value, currentError) {
    if (value !== "") {
        inValidChars = value.match(/[a-zA-Z]/g);
        if (inValidChars !== null) {//Error from invalid chars
            errorState = true;
            changeErrorState(currentError, errorState); //Show or removes error based on previous state
            return errorState;
        }
        else {//No errors 
            errorState = false;
            changeErrorState(currentError, errorState);
            return errorState;
        }
    }
    else { //Error from empty input
        errorState = true;
        changeErrorState(currentError, errorState);
        return errorState;
    }
}





//Check for pattern text@text.text and return true or false if it was found or not
//if text@text.text was found then there is no error
//meaning that someone can put in a nonsense domain and the script will accept it
function checkEmail(emailText, currentError) {
    validEmail = emailText.match(/@/g);
    if (validEmail <= 0) {
        errorState = true;
        changeErrorState(currentError, errorState); //Show or removes error based on previous state
        return errorState;
    }
    else {
        errorState = false;
        changeErrorState(currentError, errorState);
        return errorState;
    }
}


function checkPic(currentError) {
    picInput = document.getElementById("profileImage");
    if (picInput.files[0] === undefined) {
        errorState = true;
        changeErrorState(currentError, errorState);
        return errorState;
    }
    else {
        errorState = false;
        changeErrorState(currentError, errorState);
        return errorState;
    }
}




//Show or hidden error messages on the dom
function changeErrorState(currentError, errorState) {
    //If there is an error and there is not an error shown. Then show the error
    if (errorState === true && currentError.classList.contains("hidden") === true) {
        currentError.classList.remove("hidden");
        changeBy = currentError.offsetHeight;
    }
    //If there is not an error and there is an error shown. Then hide the error
    else if (errorState === false && currentError.classList.contains("hidden") === false) {
        currentError.classList.add("hidden");
        changeBy = currentError.offsetHeight;
    }
}







