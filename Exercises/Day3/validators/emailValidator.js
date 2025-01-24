function emailValidator(){

    const emailRegex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!emailRegex.test(email)){
        return false
    }
    else{
        return true;
    }
}

module.export = {emailValidator}