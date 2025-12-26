const fs = require("fs");
const jimp = require('jimp');
const sizeOf = require("buffer-image-size");


const exportFunction = module.exports = {};


exportFunction.saveImage = async (image, userName) => {

    let fileNameWithExt = `${userName}ProfileImage.png`;
    relativePath = `/profilePic/${fileNameWithExt}`;
    rawPath = `./client/images/profileImages/${fileNameWithExt}`;
    exists = fs.existsSync(`./client/images/profileImages/${fileNameWithExt}`, (exists) => {
        return exists;
    });

    image = image.slice(22, image.length);//This removes the png header so the string can be saved
    if (exists === true) {
        //Delete the old pic 
        fs.unlinkSync(`./client/images/profileImages/${fileNameWithExt}`);
        //Replace with new one. 
        //Note that if a new picutre is added it's assumed that it's replacing the current profile picture
        fs.writeFileSync(`./client/images/profileImages/${fileNameWithExt}`, image, "base64");
    }
    else {
        fs.writeFileSync(`./client/images/profileImages/${fileNameWithExt}`, image, "base64");
    }

    
    return {
        rawPath : rawPath,
        relativePath : relativePath
    }; //Return the file path to the controler so it can be saved in mongodb
}


exportFunction.formatImage = async(imagePath)=> {
    currentImage = await jimp.read(imagePath);
    currentImage.resize(80,80).write(imagePath);
};


exportFunction.getImageSize = (rawImage)=>{
    previewImg = rawImage.slice(22, rawImage.length);
    previewImg = Buffer.from(previewImg, "base64");
    previewImg = sizeOf(previewImg);
    return previewImg;
}


exportFunction.saveAppointmentImage = async(appointmentImage, customerUserName, appointmentName) =>{
    let fileNameWithExt = `${customerUserName}${appointmentName}Image.png`;
    relativePath = `/userImages/${fileNameWithExt}`;
    rawPath = `./client/images/userImages/${fileNameWithExt}`;
    exists = fs.existsSync(`./client/images/userImages/${fileNameWithExt}`, (exists) => {
        return exists;
    });

    appointmentImage = appointmentImage.slice(22, appointmentImage.length);//This removes the png header so the string can be saved
    if (exists === true) {
        //Delete the old pic 
        fs.unlinkSync(`./client/images/userImages/${fileNameWithExt}`);
        //Replace with new one. 
        //Note that if a new picutre is added it's assumed that it's replacing the current profile picture
        fs.writeFileSync(`./client/images/userImages/${fileNameWithExt}`, appointmentImage, "base64");
    }
    else {
        fs.writeFileSync(`./client/images/userImages/${fileNameWithExt}`, appointmentImage, "base64");
    }

    
    // return {
    //     rawPath : rawPath,
    //     relativePath : relativePath
    // }; //Return the file path to the controler so it can be saved in mongodb

    return relativePath;
}


exportFunction.saveTemplateImage = async(image, templateID, userName) =>{
    let fileNameWithExt = `${userName}${templateID}.png`;
    relativePath = `/userImages/${fileNameWithExt}`;
    rawPath = `./client/images/userImages/${fileNameWithExt}`;
    exists = fs.existsSync(`${rawPath}${fileNameWithExt}`, (exists) => {
        return exists;
    });

    image = image.slice(22, image.length);//This removes the png header so the string can be saved
    if (exists === true) {
        //Delete the old pic 
        fs.unlinkSync(`${rawPath}`);
        //Replace with new one. 
        //Note that if a new picutre is added it's assumed that it's replacing the current profile picture
        fs.writeFileSync(`${rawPath}`, image, "base64");
    }
    else {
        fs.writeFileSync(`${rawPath}`, image, "base64");
    }

    return {
        relativePath,
        rawPath
    }

}