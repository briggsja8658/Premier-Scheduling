/*
    THIS IS THE CLIENT SIDE CONTROLLER
    This file was created with the intent to limit global polution
    as well as keeping code readable and clean    
*/


window.onload = () => {

    pathName = window.location.pathname;
    pageInit(pathName);
    centerAlign();

    
    if(pathName === "/today"){    
        todayInit();
    }


    if(pathName === "/newProfile"){    
        newProfileInit();
        cropInit();
    }


    if(pathName === "/services"){    
        serviceInit();
    }


    if(pathName === "/customers"){
        customerInit();
        verticalAlign();
        cropInit();
    }


    if(pathName === "/schedule"){
        scheduleInit();
        matchButtonSize();
        verticalAlign();
    }


    if(pathName === "/profile"){
        profileInit();
        cropInit();
    }

    if(pathName === "/login"){
        loginInit();
    }


    if(pathName === "/appointments"){
        //Get appointment data from the server
        //Note that javascript was used here because of the debugger features that it has
        //Also we don't want the server rendering this page because it will hold up other users
        getAppointments();
 
    }



    /* Customer Routes */
    if(pathName === "/main"){
        mainInit();
        imgInit();
        matchButtonSize();
    }
}






