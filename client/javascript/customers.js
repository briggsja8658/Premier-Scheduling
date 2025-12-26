function customerInit(){
    newCustomerListener();
    createNewCustomerListener();
    deleteCustomerListener(true);
    customerToggleListener(true); //true creates all the listeners on the page
    customerEditListener(true);
    sendEditListener(true);
}


function deleteCustomerListener(deleteInit){
    //Interval for customer info buttons
    deleteCustomerButtons = document.getElementsByClassName("deleteCustomer");
    if(deleteInit === true){
        for(let x = 0; x < deleteCustomerButtons.length; x++){
            deleteCustomerButtons[x].addEventListener("click", ()=>{
                deleteCustomer(x, deleteCustomerButtons[x]);
            });
        }
    }
    else{
        let x = deleteInit.length - 1;
        deleteInit[x].addEventListener("click", ()=>{
            deleteCustomer(x, deleteCustomerButtons[x]);
        });
    }
}
async function deleteCustomer(currentCustomer, deleteCustomerButton){
    customerContainer = deleteCustomerButton.parentNode.parentNode.parentNode;
    customerID = document.getElementsByClassName("customerId")[currentCustomer].value;
    customerName = document.getElementsByClassName("customerName")[currentCustomer].innerHTML;

    fetch("/deleteCustomer",{
        method: "post",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({ "customerID": customerID})
    })
    .then(async(data)=>{
        data = await data.json();
        notifyResult(
            data.error,
            "There was an error deleting customer",
            data.taken,
            "",
            data.complete,
            "Deleted customer, page will refresh"
        );

        if(data.complete === true){
            setTimeout(()=>{
                window.location.href = "/customers";
            }, 3000);
        }
    });
    //secondaryAlert(`${customerName} has been removed from customer list`)
}


function newCustomerListener(){
    newCustomerButton = document.getElementById("newCustomerButton");
    cancelCreateButton = document.getElementById("cancelCreate");
    newCustomerForm = document.getElementById("form");

    newCustomerButton.addEventListener("click", ()=>{ //Show new customer form
        newCustomerFormToggle(newCustomerForm, newCustomerButton);
    });

    cancelCreateButton.addEventListener("click", ()=>{ //Hide new customer form
        newCustomerFormToggle(newCustomerForm, newCustomerButton);
    });
}
//This function shows or hides the form for a new customer
function newCustomerFormToggle(customerForm, newCustomerButton) {
    if (customerForm.classList.contains("hidden") === true) {
        customerForm.classList.remove("hidden");
        newCustomerButton.classList.add("hidden");
    }
    else {
        customerForm.classList.add("hidden");
        newCustomerButton.classList.remove("hidden");
    }
}




function customerToggleListener(toggleInit){
    //Interval for customer info buttons
    customers = document.getElementsByClassName("customer");
    if(toggleInit === true){
            for(let x = 0; x < customers.length; x++){
                customers[x].addEventListener("click", ()=>{
                    toggleCustomer(x);
                });
            }
        }
    else{
        let x = customers.length - 1;
        customers[x].addEventListener("click", ()=>{
            toggleCustomer(x);
        });
    }
}
function toggleCustomer(currentCustomer) {
    customersInfo = document.getElementsByClassName("customerInfo");

    if (customersInfo[currentCustomer].classList.contains("hidden") === true) {
        
        customersInfo[currentCustomer].classList.remove("hidden");

        currentContainerHeight = customersInfo[currentCustomer].parentNode.offsetHeight;
        currentHeight = customersInfo[currentCustomer].offsetHeight;
        customerButtonHeight = currentContainerHeight - currentHeight;
        
        customersInfo[currentCustomer].animate([
            { height : `${0}px` },
            { height : `${currentContainerHeight - customerButtonHeight}px` }
        ],{ duration : 200 });
        
    }
    else if (customersInfo[currentCustomer].classList.contains("hidden") === false) {
        customersInfo[currentCustomer].animate([
            { height : `${currentContainerHeight - customerButtonHeight}px` },
            { height : `${0}px` }
        ],{ duration : 200 });

        setTimeout(()=>{ customersInfo[currentCustomer].classList.add("hidden"); }, 199);

    }
}




function customerEditListener(editInit){
    customerText = document.getElementsByClassName("customerText");
    customerForm = document.getElementsByClassName("customerForm");
    customerEdit = document.getElementsByClassName("customerEdit");
    editButton = document.getElementsByClassName("customerEdit");
    if(editInit === true){
        for(let x = 0; x < customerEdit.length; x++){
            customerEdit[x].addEventListener("click", ()=>{
                toggleCustomerEdit(customerText[x], customerForm[x], editButton[x]);
            });
        }
    }
    else{
        let x = customerEdit.length - 1;
        customerEdit[x].addEventListener("click", ()=>{
            toggleCustomerEdit(customerText[x], customerForm[x], editButton[x]);
        });
    }
}
function toggleCustomerEdit(customerText, customerForm, editButton) {
    if (customerForm.classList.contains("hidden") === true) {
        customerForm.classList.remove("hidden");
        customerText.classList.add("hidden");
        editButton.innerHTML = 'Close';
    }
    else if (customerForm.classList.contains("hidden") === false) {
        customerText.classList.remove("hidden");
        customerForm.classList.add("hidden");
        editButton.innerHTML = 'Edit Customer';
    }
}






function sendEditListener(sendEditInit){
    //Customer Edit Section
    //Customer Edit Vars
    customerId = document.getElementsByClassName("customerId");
    customerName = document.getElementsByClassName("customerNameEdit");
    customerEmail = document.getElementsByClassName("emailEdit");
    customerPhoneNumber = document.getElementsByClassName("phoneNumberEdit");

    //Customer Edit Buttons
    customerButtonName = document.getElementsByClassName("customerButtonName");
    editSubmit = document.getElementsByClassName("editSubmit");
    customerForm = document.getElementsByClassName("customerForm");
    customerText = document.getElementsByClassName("customerText");
    customerButtons = document.getElementsByClassName("customerButton");

    if(sendEditInit === true){
        for(let x = 0; x < editSubmit.length; x++){
            
            editSubmit[x].addEventListener("click", ()=>{
                errors = checkForCustomerErrors(customerName[x], customerEmail[x], customerPhoneNumber[x], x);
                
                if(errors === false){
                    editCustomer(customerId[x], 
                        customerName[x], 
                        customerEmail[x], 
                        customerPhoneNumber[x], 
                        customerForm[x], 
                        customerText[x], 
                        editSubmit[x], 
                        customerButtonName[x]);
                    }
                });
            }
        }
        else{
            x = editSubmit.length - 1;
            editSubmit[x].addEventListener("click", ()=>{
                errors = checkForCustomerErrors(customerName[x], customerEmail[x], customerPhoneNumber[x], x);
                if(errors === false){
                    editCustomer(customerId[x], 
                        customerName[x], 
                        customerEmail[x], 
                        customerPhoneNumber[x], 
                        customerForm[x], 
                        customerText[x], 
                        editSubmit[x], 
                        customerButtonName[x]);
                }
            });
        }
}
function editCustomer(customerIdRaw, customerNameRaw, customerEmailRaw, customerPhoneNumberRaw, currentCustomerForm, currentCustomerText, currentCustomerButton, customerButtonName) {

    customerId = customerIdRaw.value;
    customerName = customerNameRaw.value;
    customerEmail = customerEmailRaw.value;
    customerPhoneNumber = customerPhoneNumberRaw.value;

    console.log(`\n\ncustomerID on edit : ${customerId}\n\n`);

    fetch("/editCustomer", {
        method: "post",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "customerId": customerId, "name": customerName, "email": customerEmail, "phoneNumber": customerPhoneNumber, "profileImage": profileImage })
    })
        .then(async (data) => {
            data = await data.json();
            customerButtonName.innerHTML = `${data[0].customerName}`;
            currentCustomerText.children[0].innerHTML = `${data[0].customerName}`;
            currentCustomerText.children[1].innerHTML = `${data[0].email}`;
            currentCustomerText.children[2].innerHTML = `${data[0].phoneNumber}`;


            currentCustomerForm.children[1].value = `${data[0].firstName} ${data[0].lastName}`;
            currentCustomerForm.children[3].value = `${data[0].email}`;
            currentCustomerForm.children[5].value = `${data[0].phoneNumber}`;
        });
}






function createNewCustomerListener(){
    document.getElementById("createCustomerButton").addEventListener("click", createNewCustomer);
}
function createNewCustomer() {
    customerFileReader = new FileReader();
    customerImageInput = document.getElementById("profileImage");
    customerFormData = new FormData();

    imageData = document.getElementById("imgPreview").toDataURL("image/png", 1);
    newFirstName = document.getElementById("firstName").value;
    newLastName = document.getElementById("lastName").value;
    newCustomerUserName = document.getElementById("customerUserName").value;
    newEmail = document.getElementById("email").value;
    newPhoneNumber = document.getElementById("phoneNumber").value;

    errors = checkForNewCustomerErrors(newFirstName, newLastName, newCustomerUserName, newEmail, newPhoneNumber);

    if(errors === false){
        customerFormData.append("firstName", newFirstName);
        customerFormData.append("lastName", newLastName);
        customerFormData.append("customerUserName", newCustomerUserName);
        customerFormData.append("password", undefined);
        customerFormData.append("email", newEmail);
        customerFormData.append("phoneNumber", newPhoneNumber);
        customerFormData.append("profileImage", imageData);

        fetch("/newCustomerByStylist", {
            method: "post",
            mode: "cors",
            body: customerFormData
        })
        .then(async (data) => {
            data = await data.json();
            notifyResult(
                data.error, 
                "There was an error making the customer", 
                data.taken, 
                "", 
                data.complete, 
                "New customer was created, page will refresh"
            );

            if(data.complete === true){
                setTimeout(()=>{
                    window.location.href = "/customers";
                }, 3000);
            }
        });
    }
}
function removeFormData(withPicture) {

    document.getElementById("name").value = "";
    document.getElementById("customerUserName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNumber").value = "";
    if (withPicture === true) {
        customerImageInput.files[0] = "";
        imgHolder = document.getElementById("imgHolder");
        imgPreview = document.getElementById("imgPreview");
        imgPreview.removeChild(imgHolder);
    }

}
function appendNewCustomer(customer) {

    //Create Elements
    newContainer = document.getElementById("newCustomerContainer");
    customerContainer = document.createElement("div");
    customerText = document.createElement("div");
    customerButton = document.createElement("a");
    pictureContainer = document.createElement("span");
    nameContainer = document.createElement("span");
    userPicture = document.createElement("img");
    editButton = document.createElement("a");
    editSubmitButton = document.createElement("a");
    deleteButton = document.createElement("a");

    customerInfo = document.createElement("div");
    customerButtonPic = document.createElement("span");
    customerButtonText = document.createElement("span");
    customerForm = document.createElement("div");

    customerName = document.createElement("div");
    customerEmail = document.createElement("div");
    customerPhoneNumber = document.createElement("div");

    customerID = document.createElement("input");
    nameInput = document.createElement("input");
    nameError = document.createElement("div");
    emailInput = document.createElement("input");
    emailError = document.createElement("div");
    phoneNumberInput = document.createElement("input");
    phoneError = document.createElement("div");


    customerIDText = document.createTextNode(`${customer[0]._id}`);
    customerNameText = document.createTextNode(`${customer[0].customerName}`);
    customerEmailText = document.createTextNode(`${customer[0].email}`);
    customerPhoneNumberText = document.createTextNode(`${customer[0].phoneNumber}`);
    editButtonText = document.createTextNode(`Edit Customer`);
    nameErrorText = document.createTextNode("Customer Name is requried");
    emailErrorText = document.createTextNode("Please enter a valid email address. Ex me@gmail.com");
    phoneErrorText = document.createTextNode("Please enter a 10 digit phone number with no letters or special characters");


    //Append text data to elements
    customerID.appendChild(customerIDText);
    customerName.appendChild(customerNameText);
    customerEmail.appendChild(customerEmailText);
    customerPhoneNumber.appendChild(customerPhoneNumberText);
    nameError.appendChild(nameErrorText);
    emailError.appendChild(emailErrorText);
    phoneError.appendChild(phoneErrorText);
    editButton.appendChild(editButtonText);


    //Add attributes
    customerContainer.setAttribute("class", "customerContainer");
    customerButton.setAttribute("class", "col-12 col-md-6 col-lg-4 newCustomer customerButton elmSmallestMarginTop customer");
    customerButton.setAttribute("id", `${customer[0]._id}`);

    userPicture.setAttribute("src", `${customer[0].profileImage}`);
    nameContainer.innerHTML = `${customer[0].customerName}`;

    customerInfo.setAttribute("class", "customerInfo hidden");
    customerText.setAttribute("class", "customerText");
    customerForm.setAttribute("class", "customerForm hidden");

    nameInput.setAttribute("value", `${customer[0].customerName}`);
    nameInput.setAttribute("class", `input inputText inputStyle customerName`);


    emailInput.setAttribute("value", `${customer[0].email}`);
    emailInput.setAttribute("class", `input inputEmail inputStyle customerEmail`);

    phoneNumberInput.setAttribute("value", `${customer[0].phoneNumber}`);
    phoneNumberInput.setAttribute("class", `input inputTel inputStyle customerPhoneNumber`);

    nameError.setAttribute("class", "hidden error textError");
    emailError.setAttribute("class", "hidden error emailError");
    phoneError.setAttribute("class", "hidden error telError");

    editSubmitButton.innerHTML = `Submit Edit`;
    editSubmitButton.setAttribute("class", "editSubmit buttonPrimary");
    editButton.setAttribute("class", "customerEdit buttonNeutral");

    deleteButton.innerHTML = `Delete`;
    deleteButton.setAttribute("class", "deleteCustomer buttonCaution cardContent elmSmallestMarginTop elmSmallestMarginBottom");


    //Add to the dom 
    newContainer.appendChild(customerContainer);
    customerContainer.appendChild(customerButton);
    customerContainer.appendChild(customerInfo);

    customerInfo.appendChild(customerText);
    customerInfo.appendChild(customerForm);
    customerInfo.appendChild(editButton);

    customerButton.appendChild(pictureContainer);
    customerButton.appendChild(nameContainer);
    pictureContainer.appendChild(userPicture);




    //Customer Text Before Edit
    customerText.appendChild(customerName);
    customerText.appendChild(customerEmail);
    customerText.appendChild(customerPhoneNumber);


    //Edit Inputs
    customerForm.appendChild(nameInput);
    customerForm.appendChild(nameError);

    customerForm.appendChild(emailInput);
    customerForm.appendChild(emailError);

    customerForm.appendChild(phoneNumberInput);
    customerForm.appendChild(phoneError);

    customerForm.appendChild(deleteButton);

    customerForm.appendChild(editSubmitButton);

    customerToggleListener(true); //true tells the listener maker to only add a listener to the new customer
    customerEditListener(true);
    sendEditListener(true);//Reset the listeners for the page
    deleteCustomerListener(true);

};



















