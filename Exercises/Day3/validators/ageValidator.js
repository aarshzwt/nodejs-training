function ageValidator(age){
    age= Number(age);
    if(Number.isInteger(age)){
        return true
    }
    else{
        return false;
    }
}

module.exports = ageValidator