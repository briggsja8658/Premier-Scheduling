async function createLocalStorage(){
    localDBCustomers = indexedDB.open("customers");
    localDBAppointments = indexedDB.open("appointments");
    localDBTimes = indexedDB.open("times");
    localDBservices = indexedDB.open("services");

    localDBCustomers.onupgradeneeded = async()=>{
        
        newDBCustomers = fetch("/getCustomers",{
            method:"get",
            mode:"cors",
            body : JSON.stringify({"username":localStorage.username})
        })
        .then(customerData =>{
            await createLocalDBCustomers(customerData);
        });  
    }
}

async function createLocalDBCustomers(customerData){
    db = request.result;
    customerDB = db.createObjectStore("custoemrDB", {keyPath : "isbn"});
    
}