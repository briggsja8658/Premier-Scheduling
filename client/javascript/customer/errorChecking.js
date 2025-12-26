function showFirstError(){
    errors = document.getElementsByClassName("error");
    errorFound = false;
    let i =0;
    while(i < errors.length && errorFound === false){
        if(errors[i].classList.contains("hidden") === false){
            errors[i].scrollIntoView({behavior : "smooth", block : "center"});
            errorFound = true;
        }
        i++;
    }
}