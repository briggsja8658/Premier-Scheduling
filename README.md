# Premier Scheduling
- High level
    * Premier Scheduling is an appointment management application built with Node to reduce error in book scheduling.


# Features
- Primary Goal
    Looks to eliminate booking errors while allowing for overlapping      appointment slots. Example, if hair die takes 30 mins to dry then a male hair cut can be done during that time. 
    
- Stylist can 
    Manage appointments slots 
    Services
    Working hours (including vacation)

- Customers can 
    Find stylist in a given area
    Select open time slots
    Get reminders of appointments
    Send cancellation notifications


# Tech
- Server
    Node.js with Express
    Templates with EJS
- Client
    Vanilla JS
    Bootstrap
- DB
    MongoDB for prototyping (will swap to sql at some point)
    Mongoose for schema definitions and structure


# Prerequisites
- Node.js (v14+ recommended)
- npm (comes with Node.js)
- A running mongodb server (change `dbFunctions/connection.js`) to connect


# Run the project
- Clone the repository (if not already cloned)
    git clone `https://github.com/briggsja8658/Premier-Scheduling.git`
    cd Premier-Scheduling
- Install dependencies
    npm install
- Configs
    Review the DB connection settings in `dbFunctions/connection.js` and update environment variables or config values as needed.
    The server has unsigned keys for HTTPS, please run ssh-keygen for your own keys
- Start
    npm start or npm nodemon or node `./app.js`
- Go to 
    `http://localhost:443` (or the configured port) in your browser.


# Project structure (top-level)
- `app.js` — application entry point
- `client/` — front-end assets (JS, images, styles)
- `controllers/`, `models/` — server controllers and models
- `dbFunctions/` — database helper functions
- `schema/` — data schema definitions
- `views/` — EJS templates and partials


# Notes
- Client 
    JS lives in `client/javascript/`
    split by feature (appointments, customers, scheduling, etc.).
- Server 
    routes and controller logic are in `controllers/`
    top-level `controller.js`
- Utilities 
    `customTools/` for tasks like image handling, hashing, and sorting.

---

