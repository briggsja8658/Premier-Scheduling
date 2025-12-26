
//imageInput needs to be global so that we can determine if the canvas is blank
//The reason why we need to find out on the client side is becuase the blank canvas string on the server
//is not matching. There for we need to do it here
imageInput = document.getElementById("profileImage");
imgNoCropInputs = document.getElementsByClassName("imgNoCropInput");
blankCanvas = true;


function cropInit(){
    cropListener();
}


function cropListener(){
    //look for the click event of the uploadLocal anchor that will simulate a click of the imageInput
    //imageInput is hidden on the dom because the default styling is not approperate for the projcet

    imgContainer = document.getElementById("imgPreviewContainer");
    cancelButton = document.getElementById("cancelProfileImage");

    document.getElementById("uploadLocal").addEventListener("click", () => {
        selectImage();
    });

    document.getElementById("profileImage").addEventListener("click", (event) => { //This is to stop the bubbling so uploadLocal does fire when this does
        event.stopPropagation();
    });

    cancelProfileImage.addEventListener("click", ()=>{
        imgContainer.classList.add("hidden");
        resetCrop();
    });
}

//this function appends the selected image to the dom. 
//This is used if the user didn't choose to use a social media api
function selectImage() {
    fileReader = new FileReader();
    imageInput.value = null; //Remove prior image if there was one
    imageInput.click();
    prepImage(fileReader);
}


function prepImage(fileReader) {

    loading = false;
    image = new Image();

    previewLoop = setInterval(() => { //Run this interval until the image is loaded
        if (imageInput.files[0] !== undefined && loading === false) { //Check to see when the file is ready to read
            fileReader.readAsDataURL(imageInput.files[0]); //This must run to fire the onload event
            loading = true;
        }
        if (fileReader.readyState === 2) {
            
            clearInterval(previewLoop);
            image.src = fileReader.result;

            image.removeEventListener("load", ()=>{
                previewImageInit(image);
            });
            image.addEventListener("load", ()=>{
                previewImageInit(image);
            });

            
        }
    }, 500);
}


function previewImageInit(image) {
    canvas = document.getElementById("imgPreview");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(canvas.parentNode.classList.contains("hidden") === true){
        canvas.parentNode.classList.remove("hidden");
    }

    let imgWidth = image.width;
    let imgHeight = image.height;
    
    
    imgAspect = getImgAspectRatio(imgWidth, imgHeight);
    setCanvas(canvas);
    img = setImage(imgHeight, imgWidth);
    centerAlign();//Align the img preview to the center. Function found in styles.js
    

    appendControls(img.newImageWidth, img.newImageHeight, image, imgAspect.zoomDiff); //img object has the new size after canvas alterations, image is the pixel data
    
    context.drawImage(
        image,
        0,
        0,
        -Number(zoomInput.value),
        -Number(zoomInput.value),
        0,
        0,
        img.newImageWidth,
        img.newImageHeight
    );
    
    blankCanvas = false;
}


function appendControls(imageWidth, imageHeight, image, zoomDiff) {


    cropControls = document.getElementById("cropControls");

    if(cropControls.childNodes.length === 0){
        zoomInput = document.createElement("input");
        xAxisInput = document.createElement("input");
        yAxisInput = document.createElement("input");
        zoomContainer = document.createElement("div");
        xContainer = document.createElement("div");
        yContainer = document.createElement("div");
        zoomLabel = document.createElement("div");
        yLabel = document.createElement("div");
        xLabel = document.createElement("div");


        zoomContainer.setAttribute("class", "col-12");
        xContainer.setAttribute("class", "col-12");
        yContainer.setAttribute("class", "col-12");

        zoomInput.setAttribute("id", "zoom");
        zoomInput.setAttribute("type", "range");


        if(imageWidth < 200){
            zoomInput.setAttribute("min", `-${imageHeight * 6}`);
            zoomInput.setAttribute("max", `${-1}`);
            zoomInput.setAttribute("value", `-${imageHeight * 3}`);
        }
        else if(imageWidth >= 200 && imageWidth < 1000){
            zoomInput.setAttribute("min", `-${imageHeight * 12}`);
            zoomInput.setAttribute("max", `${-1}`);
            zoomInput.setAttribute("value", `-${imageHeight * 6}`);
        }
        else{
            zoomInput.setAttribute("min", `-${imageHeight * 24}`);
            zoomInput.setAttribute("max", `${-1}`);
            zoomInput.setAttribute("value", `-${imageHeight * 12}`);
        }
        

        zoomInput.setAttribute("step", "1");
        zoomInput.style.width = "100%";


        xAxisInput.setAttribute("id", "xAxis");
        xAxisInput.setAttribute("type", "range");
        xAxisInput.setAttribute("min", "0");
        xAxisInput.setAttribute("max", `${imageWidth - parseInt(canvas.offsetWidth)}`);
        xAxisInput.setAttribute("step", "1");
        xAxisInput.setAttribute("value", "0");
        xAxisInput.style.width = "100%";

        yAxisInput.setAttribute("id", "yAxis");
        yAxisInput.setAttribute("type", "range");
        yAxisInput.setAttribute("min", "0");
        yAxisInput.setAttribute("max", `${imageHeight - parseInt(canvas.offsetHeight)}`);
        yAxisInput.setAttribute("step", "1");
        yAxisInput.setAttribute("value", "0");
        yAxisInput.style.width = "100%";

        zoomLabel.innerHTML = "Zoom";
        xLabel.innerHTML = "Left and Right";
        yLabel.innerHTML = "Up and Down";

        zoomContainer.setAttribute("class", "col-12 elmSmallMarginTop elmSmallMarginBottom text");
        xContainer.setAttribute("class", "col-12 elmSmallMarginTop elmSmallMarginBottom text");
        yContainer.setAttribute("class", "col-12 elmSmallMarginTop elmSmallMarginBottom text");

        cropControls.setAttribute("class", "row no-gutters");

        zoomContainer.appendChild(zoomLabel);
        xContainer.appendChild(xLabel);
        yContainer.appendChild(yLabel);


        cropControls.appendChild(zoomContainer);
        zoomContainer.appendChild(zoomInput);


        cropControls.appendChild(xContainer);
        xContainer.appendChild(xAxisInput);



        cropControls.appendChild(yContainer);
        yContainer.appendChild(yAxisInput);


        zoomInput = document.getElementById("zoom");
        xAxisInput = document.getElementById("xAxis");
        yAxisInput = document.getElementById("yAxis");


    
    }
    else{
        xAxisInput.setAttribute("max", `${imageWidth - parseInt(canvas.style.width)}`);
        yAxisInput.setAttribute("max", `${imageHeight - parseInt(canvas.style.height)}`);
    }

    zoomInput.removeEventListener("change", () => {
        alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff);
    });
    zoomInput.addEventListener("change", () => {
        alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff);
    });

    xAxisInput.removeEventListener("change", () => {
        alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff);
    });
    xAxisInput.addEventListener("change", () => {
        alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff);
    });

    yAxisInput.removeEventListener("change", () => {
        alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff);
    });
    yAxisInput.addEventListener("change", () => {
        alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff);
    });

    

}


function alterImagePreview(zoomInput, xAxisInput, yAxisInput, image, imageWidth, imageHeight, zoomDiff) {

    context.clearRect(0, 0, canvas.width, canvas.height);

    /*
        img : specifies the image, canvas, or video
        sx : start of clipping in the x axis
        sy : start of clipping in the y axis
        swidth : width of clipped image
        sheight : height of clipped image
        x : where to place image on the x axis
        y : where to place image on the y axis
        width : visual distortion on the x axis (note visual width will have no distortion)
        height : visual distortion on the y axis (note visual height will have no distortion)
    */
    if(imageHeight < imageWidth){
        context.drawImage(
            image,
            (parseInt(xAxisInput.value)),
            (parseInt(yAxisInput.value)),
            -Number(zoomInput.value),// * zoomDiff,
            -Number(zoomInput.value),
            0,
            0,
            imageWidth,
            imageHeight
        );
    }
    else{
        context.drawImage(
            image,
            (parseInt(xAxisInput.value)),
            (parseInt(yAxisInput.value)),
            -Number(zoomInput.value),
            -Number(zoomInput.value),// * zoomDiff,
            0,
            0,
            imageWidth,
            imageHeight
        );
    }
}


function resetCrop(){
    canvas = document.getElementById("imgPreview");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    cropControls = document.getElementById("cropControls").childNodes;
    counter = 0;
    while(cropControls.length > 0){
        cropControls[counter].remove();
    }

    imageInput.value = null;


}


function setCanvas(canvas){
    windowWidth = window.outerWidth;

    if(windowWidth >= 1000){
        canvas.style.height = `${500}px`;
        canvas.style.width = `${500}px`;
    }
    else if(windowWidth >= 500 && windowWidth < 1000){
        canvas.style.height = `${350}px`;
        canvas.style.width = `${350}px`;
    }
    else{
        canvas.style.height = `${200}px`;
        canvas.style.width = `${200}px`;
    }
}

function setImage(imgHeight, imgWidth){
    
    let newImageHeight = 0;
    let newImageWidth = 0;
    
    let changeAmount = findChangeAmount(imgHeight, imgWidth);

    newImageWidth = imgWidth + changeAmount; //The orginal canvas has a 2 to 1 aspect ratio meaning any changes to the canvas must be repersented in the image 
    newImageHeight = imgHeight;
    
    console.log(`new aspect big width : ${newImageHeight / newImageWidth}`);
    console.log(`new aspect big height : ${newImageWidth / newImageHeight}`);
    console.log(`new height : ${newImageHeight}`);
    console.log(`new width : ${newImageWidth}`);
    return {
        newImageHeight,
        newImageWidth
    }
}


function findChangeAmount(imgWidth, imgHeight){
    const canvasAspect = .5;
    let i = 0;
    aspectMatch = false;
    while(aspectMatch === false){
        
        if((imgWidth / (imgHeight + i)) === canvasAspect){
            aspectMatch = true;
        }
        
        if(i === 1000000){
            aspectMatch = true;
            console.log("aspect was never matched");
        }
        i++;
    }
    return (i - 1);
}

function getImgAspectRatio(imgWidth, imgHeight){

    console.log(`orginal width : ${imgWidth}\norginalHeight : ${imgHeight}`);
    if(imgWidth < imgHeight){
        aspect = imgWidth / imgHeight;
        zoomDiff = imgHeight / imgWidth;
    }
    else if(imgWidth > imgHeight){
        zoomDiff = imgWidth / imgHeight;
        aspect = imgHeight / imgWidth;
    }
    else{
        zoomDiff = 1;
        aspect = zoomDiff;
    }
    console.log(`aspect : ${aspect}`);
    return {
        zoomDiff,
        aspect
    }


}














//No Crop Image functions
function imgInit(){
    imgListener();
}

function imgListener(){
    
    imgNoCropButtons = document.getElementsByClassName("imgNoCrop");
    imgPreviewNoCrop = document.getElementsByClassName("imgPreviewNoCrop");
    cancelNoCrop = document.getElementsByClassName("cancelNoCrop");


    for(let i =0; i < imgNoCropInputs.length; i++){
        imgNoCropInputs[i].addEventListener("click", ()=>{
            imgNoCropInputs[i].cancelBubble = true;
        });
    }

    for(let i =0; i < imgNoCropButtons.length; i++){
        imgNoCropButtons[i].addEventListener("click", ()=>{
            selectImageNoCrop(imgNoCropInputs[i], imgPreviewNoCrop[i]);
        });
    }


    for(let i =0; i < cancelNoCrop.length; i++){
        cancelNoCrop[i].addEventListener("click", ()=>{
            resetImage(imgPreviewNoCrop[i], imgNoCropInputs[i]);
        });
    }



}

function selectImageNoCrop(currentInput, currentCanvas){
    let fileReader = new FileReader();
    currentInput.value = null; //Remove prior image if there was one
    currentInput.click();
    prepImageNoCrop(currentInput, fileReader, currentCanvas);
}

function prepImageNoCrop(currentInput, fileReader, currentCanvas){
    loading = false;
    image = new Image();


    let previewLoop = setInterval(() => { //Run this interval until the image is loaded
        if (currentInput.files[0] !== undefined && loading === false) { //Check to see when the file is ready to read
            fileReader.readAsDataURL(currentInput.files[0]); //This must run to fire the onload event
            loading = true;
        }
        if (fileReader.readyState === 2) {
            clearInterval(previewLoop);
            image.src = fileReader.result;

            image.removeEventListener("load", ()=>{
                previewImageNoCrop(image, currentCanvas);
            });
            image.addEventListener("load", ()=>{
                previewImageNoCrop(image, currentCanvas);
            });
        }
    }, 500);
}

function previewImageNoCrop(currentImage, currentCanvas){
    let context = currentCanvas.getContext("2d");
    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    if(currentCanvas.parentNode.classList.contains("hidden") === true){
        currentCanvas.parentNode.classList.remove("hidden");
    }
    let imgAspect = getImgAspectRatio(currentImage.width, currentImage.height);
    currentImage = setImgSize(currentCanvas, currentImage, imgAspect);
    centerAlign();//Align the img preview to the center. Function found in styles.js
    context.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height);
    blankCanvas = false;
}

function setImgSize(currentCanvas, currentImage, imgAspect){
    currentCanvasWidth = currentCanvas.width;
    currentImgWidth = currentImage.width;

    if(currentCanvasWidth > currentImgWidth){
        widthDiff = currentCanvasWidth - currentImgWidth;
        currentImage.width = currentImgWidth + widthDiff;
        currentImage.height = currentImage.height + (widthDiff * imgAspect.aspect);
    }
    else if(currentCanvasWidth < currentImgWidth){
        widthDiff = currentImgWidth - currentCanvasWidth;
        currentImage.width = currentImgWidth - widthDiff;
        currentImage.height = currentImage.height - (widthDiff * imgAspect.aspect);
    }

    currentCanvas.height = currentImage.height;

    return currentImage;
    

}

function resetImage(currentCanvas, currentInput){
    context = currentCanvas.getContext("2d");
    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    currentInput.value = null;
}

function imgResetNewAppointment(){
    allCanvas = document.getElementsByClassName("imgPreviewNoCrop");
    currntCanvas = allCanvas[allCanvas.length -1];
    context = currntCanvas.getContext("2d");
    context.clearRect(0, 0, currntCanvas.width, currntCanvas.height);

    allImageInputs = document.getElementsByClassName("imgNoCropInput");
    currentInput = allImageInputs[allImageInputs.length - 1];
    currentInput.value = null; //Remove prior image if there was one
}


function getBlankCanvas(){
    return blankCanvas;
}

