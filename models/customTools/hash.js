const crypto = require("crypto");
const secret = "123529345ui6ght6jweankldfs.nsadf```---][][{}{}<><><,,.,/,/,```";
const randomString = require("randomstring");
const exportFunction = module.exports = {};

exportFunction.sha256 = async(password)=>{
    doHash = await crypto.createHmac("sha256",secret);
    doHash.update(password);
    password = doHash.digest("hex");
    return password
}


exportFunction.getObjectId = async()=>{
    randomNumber = Math.floor(Math.random() * Math.floor(9999));
    hashString = randomString.generate(randomNumber);
    doHash = await crypto.createHmac("sha256", hashString);
    doHash.update(hashString);
    hashString = doHash.digest("hex");
    return hashString;
}
