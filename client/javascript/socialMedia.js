//This will init the facebook sdk
window.fbAsyncInit = ()=> {
    console.log("facebook init ran");
    FB.init({
        appId : "214044139664387",
        autoLogAppEvents : true,
        xfbml : true,
        version :"v6.0"
    });
}






//This function will append 3 social media icons to the dom that will have an anchor to trigger an 
//event listener to make an api call to the relative social media platform.  
function appendSocialMedia(){
    //create bools for load test
    facebookIconLoaded = false;
    instagramIconLoaded = false;
    twitterIconLoaded = false;

    //find elements
    socialContainer = document.getElementById("socialContainer");

    //create elements
    h2 = document.createElement("h2");
    h2Text = document.createTextNode("Profile Picture");
    facebookAnchor = document.createElement("a"); 
    instagramAnchor = document.createElement("a"); 
    twitterAnchor = document.createElement("a"); 

    facebookImg = document.createElement("img");
    instagramImg = document.createElement("img");
    twitterImg = document.createElement("img");

    //add attributes
    h2.setAttribute("class","col-12 title2");

    facebookAnchor.setAttribute("class", "col-4"); 
    facebookAnchor.setAttribute("id", "facebook"); 

    instagramAnchor.setAttribute("class", "col-4");
    instagramAnchor.setAttribute("id", "instagram"); 
    instagramAnchor.setAttribute("href", "https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token"); 
    instagramAnchor.setAttribute("target", "_blank"); 

    twitterAnchor.setAttribute("class", "col-4");
    twitterAnchor.setAttribute("id", "twitter"); 
    
    
    facebookImg.setAttribute("class", "socialIcon"); 
    instagramImg.setAttribute("src", "/icon/instagram.png"); 
    instagramImg.setAttribute("class", "socialIcon"); 
    twitterImg.setAttribute("src", "/icon/twitter.png"); 
    twitterImg.setAttribute("class", "socialIcon"); 


    //Request icon from the server and wait for the download
    facebookIcon = new Image();
    facebookIcon.src = "/icon/facebook.png";
    facebookIcon.onload = ()=>{
        facebookImg.src = facebookIcon.src; 
        socialContainer.appendChild(facebookAnchor);
        facebookAnchor.appendChild(facebookImg);
        facebookIconLoaded = true;
        //Check to see if all the icons are loaded and then extend the background
        //NOTE that icons can load in any order
        if(facebookIconLoaded === true && instagramIconLoaded === true && twitterIconLoaded === true){
            //Change background size
            changeBy = socialContainer.offsetHeight;
            extendBackground(changeBy);
            //Add the event listener for the facebook call
            document.getElementById("facebook").addEventListener("click", facebookInfo);
        }
    }

    instagramIcon = new Image();
    instagramIcon.src = "/icon/instagram.png";
    instagramIcon.onload = ()=>{
        instagramImg.src = instagramIcon.src;
        socialContainer.appendChild(instagramAnchor);
        instagramAnchor.appendChild(instagramImg);
        instagramIconLoaded = true;
        if(facebookIconLoaded === true && instagramIconLoaded === true && twitterIconLoaded === true){
            //Change background size
            changeBy = socialContainer.offsetHeight;
            extendBackground(changeBy);
            //Add the event listener for the facebook call
            instagramButton = document.getElementById("instagram");
            instagramButton.addEventListener("click", ()=>{
                instagramInfo();
            });
        }
    }

    twitterIcon = new Image();
    twitterIcon.src = "/icon/twitter.png";
    twitterIcon.onload = ()=>{
        twitterImg.src = twitterIcon.src;
        socialContainer.appendChild(twitterAnchor);
        twitterAnchor.appendChild(twitterImg);
        twitterIconLoaded = true;
        if(facebookIconLoaded === true && instagramIconLoaded === true && twitterIconLoaded === true){
            //Change background size
            changeBy = socialContainer.offsetHeight;
            extendBackground(changeBy);
            //Add the event listener for the facebook call
            document.getElementById("facebook").addEventListener("click", facebookInfo);
        }
    }


    //append divs to container
    h2.appendChild(h2Text);
    socialContainer.appendChild(h2);    
}



//Request firstName, lastName, and email from facebook.
//NOTE that there is no way to get the phone number from facebook
function facebookInfo(){ 
    FB.login((login)=>{
        if(login.status === "connected"){
            FB.api("/me?fields=first_name,last_name,email", "GET", {scope:"email"}, (res)=>{
                
                firstName = document.getElementById("firstName");
                lastName = document.getElementById("lastName");
                email = document.getElementById("email");
                userName = document.getElementById("userName");

                firstName.value = res.first_name;
                lastName.value = res.last_name;
                email.value = res.email;

                fetch("https://localhost:3500/checkUserName",{
                    method: "post",
                    mode:"cors",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({"userName":`${res.first_name}${res.last_name}`})
                })
                .then(async(fetchRes)=>{
                    fetchRes = await fetchRes.json();
                    if(fetchRes === false){
                        userName.value = `${res.first_name}${res.last_name}`;
                    }
                    else{
                        userName.value = `${res.first_name}${res.last_name}`;
                        document.getElementById("userNameError").classList.remove("hidden");
                    }
                });
                    
                
   
                imgContainer = document.getElementById("imgPreview");
                img = document.createElement('img');
                img.src = `https://graph.facebook.com/${res.id}/picture?type=normal`;
                imgContainer.appendChild(img);
                
            });
        }
        else{
            console.log(`logged in failed`);
        }
    });

}



function instagramInfo(instagram){//For me to 

    fetch("https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token",{
        method: "get",
        mode:"cors",
        headers: {
            "Content-Type":"application/json"
        }
    })
    .then(async(fetchRes)=>{
        fetchRes = await fetchRes.json();
        console.log(`This is the instagram response : ${fetchRes}`);
    });

    

}



