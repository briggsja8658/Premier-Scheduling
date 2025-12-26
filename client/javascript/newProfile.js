/* 
	Stylist JS  
	All functions unique to the stylist page are located here
*/
function newProfileInit(){
	newProfileListener();
	stylistListener();
	centerCanvas();
}


function newProfileListener(){
	document.getElementById("submit").addEventListener("click", ()=>{
		createNewProfile();
	});
}


async function createNewProfile() {
	newProfileForm = new FormData();
	imageData = document.getElementById("imgPreview").toDataURL("image/png", 1);
	stylistProfile = document.getElementById("stylistProfile").checked;

	if(stylistProfile === true){
		errors = await checkForErrors(false);
		businessErrors = await checkForBusinessErrors();
	}
	else{
		errors = await checkForErrors(false);
		businessErrors = false;
	}

	if (errors === false && businessErrors === false) {
		date = new Date();
		timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
		firstName = document.getElementById("firstName").value;
		lastName = document.getElementById("lastName").value;
		
		if(stylistProfile === true){
			newProfileForm.append("firstName", firstName);
			newProfileForm.append("lastName", lastName);
			newProfileForm.append("userName", document.getElementById("userName").value);
			newProfileForm.append("email", document.getElementById("email").value);
			newProfileForm.append("password", document.getElementById("password").value);
			newProfileForm.append("phoneNumber", document.getElementById("phoneNumber").value);
			newProfileForm.append("profileImage", imageData);
			newProfileForm.append("timeZoneOffset", timeZoneOffset);
			newProfileForm.append("businessName", document.getElementById("businessNameInput").value);
			newProfileForm.append("streetAddress", document.getElementById("streetAddressInput").value);
			newProfileForm.append("city", document.getElementById("cityInput").value);
			newProfileForm.append("state", document.getElementById("stateInput").value);
			newProfileForm.append("zipCode", document.getElementById("zipCodeInput").value);

			let blankCanvas = getBlankCanvas();
			newProfileForm.append("blankCanvas", blankCanvas);

			
			fetch("/newStylist", {
				method: "post",
				mode: "cors",
				body: newProfileForm
			})
			.then(()=>{
				window.location.href = "/today";
			});
				
				
		}
		else if(stylistProfile === false){
			let name = `${firstName} ${lastName}`; 
			newProfileForm.append("name", name);
			newProfileForm.append("firstName", firstName);
			newProfileForm.append("lastName", lastName);
			newProfileForm.append("customerUserName", document.getElementById("userName").value);
			newProfileForm.append("email", document.getElementById("email").value);
			newProfileForm.append("password", document.getElementById("password").value);
			newProfileForm.append("phoneNumber", document.getElementById("phoneNumber").value);
			newProfileForm.append("profileImage", imageData);
			newProfileForm.append("timeZoneOffset", timeZoneOffset);

			let blankCanvas = getBlankCanvas();
			newProfileForm.append("blankCanvas", blankCanvas);
			
			
			fetch("/newCustomer", {
				method: "post",
				mode: "cors",
				body: newProfileForm
			})
			.then(() => {
				window.location.href = "/main";
			});
		}

	}
}



function stylistListener(){
	workAddressContainer = document.getElementById("workAddressContainer");
	document.getElementById("stylistProfile").addEventListener("change", ()=>{
		toggleWorkAddress(workAddressContainer);
	})
}

function toggleWorkAddress(workAddressContainer){
	if(workAddressContainer.classList.contains("hidden") === true){
		workAddressContainer.classList.remove("hidden");
	}
	else if(workAddressContainer.classList.contains("hidden") === false){
		workAddressContainer.classList.add("hidden");
	}
}


function centerCanvas(){
	canvas = document.getElementById("imgPreview");
	canvasContainer = canvas.parentNode;

	containerWidth = canvasContainer.clientWidth;
	canvasWidth = canvas.clientWidth;

	moveAmount = ((containerWidth - canvasWidth) / 2);
	canvas.style.marginLeft = `${moveAmount}px`;
}