function countdown(second){
    let seconds= second;
    let timer=setInterval(()=>{
        if (seconds > 0){
            console.log(seconds);
            seconds--;
        }
        else{
            console.log("Time's Up");
            clearInterval(timer);
        }
    },1000);
}

countdown(3);