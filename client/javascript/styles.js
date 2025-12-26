//This is styles that can not be easly done in css

function verticalAlign(){
    //Vertical text align
    nameText = document.querySelectorAll(".verticalAlign");
    for (let x = 0; x < nameText.length; x++){

        containerHeight = nameText[x].parentNode.parentNode.parentNode.offsetHeight;
        textHeight = nameText[x].offsetHeight;
        textMove = (containerHeight / 2) - textHeight;

        nameText[x].style.position = `relative`;
        nameText[x].style.top = `${textMove}px`;
    }
}


function navVerticalAlign(){
    //Vertical Align Header 
    navVerticalAlignElms = document.getElementsByClassName("navVerticalAlign");
    
    let i =0;
    while(i < navVerticalAlignElms.length){
        container = navVerticalAlignElms[i].parentNode;
        containerHeight = container.clientHeight;
        elmHeight = navVerticalAlignElms[i].clientHeight;
        moveAmount = (containerHeight - elmHeight) / 2;
        debugger;
    
        navVerticalAlignElms[i].style.position = `relative`;
        navVerticalAlignElms[i].style.top = `${moveAmount}px`;
        i++;
    }
}


function verticalAlignWithImg(){
    //Vertical center align for customer page
    //Used for img and text
    nameText = document.querySelectorAll(".verticalAlignWithImg");
    verticalAlignImg = document.querySelectorAll(".verticalAlignImg");
    for (let x = 0; x < nameText.length; x++){
        buttonContainer = nameText[x].parentNode;
        currentHeight = buttonContainer.offsetHeight;
        currentWidth = buttonContainer.offsetWidth;
        
        textHeight = nameText[x].offsetHeight;
        textWidth = nameText[x].offsetWidth;
        
        textMove = (currentHeight / 2) - textHeight;
        textMoveLeft = ((currentWidth / 2 ) - textWidth) + (verticalAlignImg[x].width + 10);

        nameText[x].style.position = `relative`;
        nameText[x].style.bottom = `${textMove}px`;
        nameText[x].style.left = `${textMoveLeft}px`;
    }
}


function matchButtonSize(){
    buttonList = document.getElementsByClassName("matchButtonSize");
    biggestButton = 0;
    for(let x = 0; x < buttonList.length; x++){
        if(buttonList[x].offsetHeight > biggestButton){
            biggestButton = buttonList[x].offsetHeight;
        }
    }
    for(let x = 0; x < buttonList.length; x++){
        buttonList[x].style.height = `${biggestButton}px`;
    }
    console.log(`Biggest button size : ${biggestButton}`);
}


function centerAlign(){
    centerAlignContent = document.getElementsByClassName("contentCenter");
    for(let x =0; x < centerAlignContent.length; x++){
        contentWidth = centerAlignContent[x].offsetWidth;
        parentNode = centerAlignContent[x].parentNode;
        parentWidth = parentNode.offsetWidth;

        moveAmount = ((parentWidth - contentWidth) / 2);
        centerAlignContent[x].style.marginLeft = `${moveAmount}px`; 
        centerAlignContent[x].style.marginRight = `${moveAmount}px`; 
    }
}


function verticalAlignParentNode(){
    verticalAlignContent = document.getElementsByClassName("verticalAlign");
    for(let x =0; x < verticalAlignContent.length; x++){
        contentHeight = verticalAlignContent[x].clientHeight;
        parentNode = verticalAlignContent[x].parentNode;
        parentHeight = parentNode.clientHeight;

        moveAmount = ((parentHeight - contentHeight) / 2);
        verticalAlignContent[x].style.marginTop = `${moveAmount}px`; 
    }
}



function slideOutListner(){
    slideOuts = document.getElementsByClassName("slideOut");
    for(let i =0; i < slideOuts.length; i++){
        slideOuts[i].addEventListener("click", (event)=>{
            event.cancelBubble = true;
            slideOutAnimation(slideOut);
        });
    }
}


function slideOutAnimation(currentElm){
    container = currentElm.parentNode;
    containerHeight = container.clientHeight;
    elmHeight = currentElm.clientHeight;
    if(currentElm.classList.contains("open") === true){
        currentElm.animate([
            { height : `${containerHeight - elmHeight}px` },
            { height : `${0}px` }
        ], { duration : 100 });
        setTimeout(() => { 
            currentElm.classList.remove("open"); 
            currentElm.classList.add("hidden"); 
        }, 95 );
    }
    else if(currentElm.classList.contains("open") === false){
        currentElm.classList.remove("hidden"); 
        currentElm.animate([
            { height : `${0}px` },
            { height : `${containerHeight - elmHeight}px` }
        ], { duration : 100 });

        currentElm.classList.add("open");
    }
}


function slideAndFadeAnimation(currentElm){
    container = currentElm.parentNode;
    

    if(currentElm.classList.contains("open") === true){
        
        containerHeight = container.clientHeight;
        elmHeight = currentElm.clientHeight;
        currentElm.animate(
            [
                { opacity : 1 },
                { opacity : .2 },
                { opacity : .1 },
                { opacity : 0 },
            ], 
            { 
                duration : 100,
                fill : "forwards"
            }
        );

        currentElm.animate(
            [
                { height : `${elmHeight}px` },
                { height : `${0}px` }
            ], 
            { 
                duration : 200
            }
        );

        setTimeout(() => { 
            currentElm.classList.remove("open"); 
            currentElm.classList.add("hidden"); 
        }, 200 );
    }
    else if(currentElm.classList.contains("open") === false){
        currentElm.classList.remove("hidden"); 
        containerHeight = container.clientHeight;
        elmHeight = currentElm.clientHeight;

        currentElm.animate([
            { height : `${0}px` },
            { height : `${elmHeight}px` }
        ], { duration : 200 });
        
        currentElm.animate(
            [
                { opacity : 0 },
                { opacity : 0.1 },
                { opacity : 0.2 },
                { opacity : 1 }
            ], 
            { 
                duration : 400,
                fill : "forwards" 
            }
        );
        
        currentElm.classList.add("open");
    }
}


function leftExtendAnimation(textElm){
    alertContainer = textElm.parentNode;
    screenWidth = screen.width;

    if(alertContainer.classList.contains("open") === true){
        
        alertContainerHeight = alertContainer.clientHeight;
        alertContainerWdith = alertContainer.clientWidth;
        textElmHeight = textElm.clientHeight;
        textElmWidth = textElm.clientWidth;

        if(screenWidth < 500){
            alertContainer.animate(
                [
                    { opacity : 1, width : `${60}%`, left  : `${40}%` },
                    { opacity : .2, width : `${4}%`, left : `${50}%`},
                    { opacity : .1 },
                    { opacity : 0, width : `${0}px`, left  : `${100}%` }
                ], 
                { 
                    duration : 400,
                    fill : "forwards"
                }
            );
        }
        else if(screenWidth >= 500 && screenWidth < 1000){
            alertContainer.animate(
                [
                    { opacity : 1, width : `${40}%`, left  : `${60}%` },
                    { opacity : .2, width : `${4}%`, left : `${50}%`},
                    { opacity : .1 },
                    { opacity : 0, width : `${0}px`, left  : `${100}%` }
                ], 
                { 
                    duration : 400,
                    fill : "forwards"
                }
            );
        }
        else if(screenWidth >= 1000){
            alertContainer.animate(
                [
                    { opacity : 1, width : `${20}%`, left  : `${80}%` },
                    { opacity : .2, width : `${4}%`, left : `${50}%`},
                    { opacity : .1 },
                    { opacity : 0, width : `${0}px`, left  : `${100}%` }
                ], 
                { 
                    duration : 400,
                    fill : "forwards"
                }
            );
        }

        setTimeout(() => { 
            alertContainer.classList.remove("open"); 
            alertContainer.classList.add("hidden"); 
        }, 395 );
    }
    else if(alertContainer.classList.contains("open") === false){
        alertContainer.classList.remove("hidden"); 
        alertContainerHeight = alertContainer.clientHeight;
        alertContainerWdith = alertContainer.clientWidth;
        textElmHeight = textElm.clientHeight;
        textElmWidth = textElm.clientWidth;

        if(screenWidth < 500){
            alertContainer.animate([
                { width : `${0}px`, opacity : 0, left : `${100}%`},
                { opacity : .1 },
                { width : `${4}%`, opacity : .2, left : `${96}%` },
                { width : `${60}%`, opacity : 1, left : `${40}%`},
            ], { 
                duration : 400, 
                fill : "forwards" 
            });
        }
        else if(screenWidth >= 500 && screenWidth < 1000){
            alertContainer.animate([
                { width : `${0}px`, opacity : 0, left : `${100}%`},
                { opacity : .1 },
                { width : `${4}%`, opacity : .2, left : `${96}%` },
                { width : `${40}%`, opacity : 1, left : `${60}%`},
            ], { 
                duration : 400, 
                fill : "forwards" 
            });
        }
        else if(screenWidth >= 1000){
            alertContainer.animate([
                { width : `${0}px`, opacity : 0, left : `${100}%`},
                { opacity : .1 },
                { width : `${4}%`, opacity : .2, left : `${96}%` },
                { width : `${30}%`, opacity : 1, left : `${70}%`},
            ], { 
                duration : 400, 
                fill : "forwards" 
            });
        }

        
        
        
        alertContainer.classList.add("open");
    }
}