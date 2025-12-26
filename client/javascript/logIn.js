
function loginInit() {
    loginListener();
    passwordSetListeners();
}


function loginListener() {
    //Listeners for auth functions
    logInButton = document.getElementById("loginButton");
    logInButton.addEventListener("click", () => {
        logInRequest();
    });
}


//Use ajax to find user account, if found redirect to /today
function logInRequest() {
    userName = document.getElementById("userName").value;
    password = document.getElementById("password").value;
    passwordMatchError = document.getElementById("passwordMatchError");


    //check to see if password or userName is empty to avoid network the penalty
    if (userName !== "") {
        if (userNameError.classList.contains("hidden") !== true) {
            userNameError.classList.add("hidden");
        }
        fetch(`/login`, {
            method: "post",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userName": userName, "password": password })
        })
            .then(async (user) => {
                user = await user.json();
                if (user.setPassword === true) {
                    document.getElementById("logInContainer").classList.add("hidden");
                    document.getElementById("passwordSetContainer").classList.remove("hidden");
                }
                else if (user.found === true) { //if user is found redirect to /today and set localStorage
                    if (user.customer === true) {
                        window.localStorage.setItem("userName", user.userName);
                        document.location.href = `/main`;
                    }
                    else {
                        window.localStorage.setItem("userName", user.userName);
                        document.location.href = `/today`;
                    }
                }
                else {
                    logInError = document.getElementById("logInError");
                    if (logInError.classList.contains("hidden")) {
                        logInError.classList.remove("hidden");
                    }
                }
            });
    }
    else {
        userNameError = document.getElementById("userNameError");
        if (userNameError.classList.contains("hidden")) {
            userNameError.classList.remove("hidden");
        }
    }
}





function passwordSetListeners() {
    passwordSetButton = document.getElementById("passwordSet");
    passwordSetButton.addEventListener("click", setPassword);
}

function setPassword() {
    userName = document.getElementById("userName").value;
    password = document.getElementById("passwordSetInput").value;
    passwordMatch = document.getElementById("passwordSetMatch").value;
    passwordMatchError = document.getElementById("passwordMatchError");


    if (password === passwordMatch) {
        fetch(`/setPassword`, {
            method: "post",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userName": userName, "password": password })
        })
        document.location.href = `/today`;
    }
    else {
        if (passwordMatchError.classList.contains("hidden")) {
            passwordMatchError.classList.remove("hidden");
        }
    }
}










