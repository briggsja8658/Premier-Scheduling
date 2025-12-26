//Call in dependencies
const Https = require("https");
const FS = require("fs");//FS is file system
const Express = require("express");
const CoookieParser = require("cookie-parser");
const BodyParser = require("body-parser");
const { exec } = require("child_process");
const app = Express();
const chalk = require("chalk");
const mongodb = require("./models/dbFunctions/connection");
//BodyParser must be defined before routes are called. This means that it cant be defined 
//in a router because the root route is in app.js


//Configurations
const port = 443;
app.set('view engine', 'ejs');
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(CoookieParser());
mongodb.open();


//Cors
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", `Https://localhost:${port}`);
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, PUT");
        return res.status(200).json({});
    }
    next();
});


//Set up static file routes
app.use("/image", Express.static("client/images"));
app.use("/icon", Express.static("client/images/icons"));
app.use("/style", Express.static("client/styles"));
app.use("/js", Express.static("client/javascript"));
app.use("/template", Express.static("views/templates"));
app.use("/profilePic", Express.static("client/images/profileImages"));
app.use("/userImages", Express.static("client/images/userImages"));



//Set routers
MainController = require("./controllers/controller.js");
app.use("/", MainController);
app.set('views', './views');


//Set root route to index
app.get("/", (req, res) => {
    let name = null;
    res.render("index", {
        name
    });
});


//Run Server
//Https was required to request info from social media api's 
//This command was ran to create the server key
//openssl req -nodes -new -x509 -keyout server.key -out server.cert
server = Https.createServer({
    key: FS.readFileSync("server.key"),
    cert: FS.readFileSync("server.cert")
}, app)
.listen(port, (req,res) => {
    console.log(`listening on port ${chalk.green(port)}`);
});

process.on("unhandledRejection", (error) =>{
    console.log(`Unhandled Rejection\n\n${error}\n\n${error.stack}`);
    // server.close(()=>{
    //     process.exit(1);
    // });
    //process.exit(1);
});

process.on("unchaughtException", (error) =>{
    console.log(`Unhandled Rejection\n\n${error}\n\n${error.stack}`);
    // server.close(()=>{
    //     process.exit(1);
    // });
    //process.exit(1);
});


// setInterval(()=>{
//     memoryAmount = process.memoryUsage();
//     console.log(`\n\nMemory usage : ${(memoryAmount.heapTotal / 1024 /1024 * 100) / 100} MB\n\n`);
// }, 5000);


