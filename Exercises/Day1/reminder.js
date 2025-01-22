const readline = require("readline");

let rl = readline.createInterface(process.stdin, process.stdout);

function NotANumberException(message) {
    const error = new Error(message);
    return error;
}
NotANumberException.prototype = Object.create(Error.prototype);

function isNegativeException(message) {
    const error = new Error(message);
    return error;
}
isNegativeException.prototype = Object.create(Error.prototype);

rl.question('Enter time in ms: ', (time) => {
    try{
        const ms = parseInt(time,10);

        if(isNaN(ms)){
            throw new NotANumberException("Enter a Valid int");
        }
        else if(ms<0){
            throw new isNegativeException("Enter a Valid non negative int");
        }
        else{
            remindUser(ms);
        }
    }
    catch(error){
        console.log("Caught error:", error);

        if (error instanceof NotANumberException) {
            console.log(`Error: ${error.message}`);
        } else if (error instanceof isNegativeException) {
            console.log(`Error: ${error.message}`);
        } else {
            console.log("An unexpected error occurred.");
        }
    }
    finally{
            rl.close();
    }
   
});


function remindUser(time){
    setTimeout(()=>{
        console.log("Drink Water!!!")
    },time);
}