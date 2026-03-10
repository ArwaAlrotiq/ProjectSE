function checkSeatAvailability(requestedSeat,availableSeats){
    if(requestedSeat<=availableSeats){
        console.log("available seats");
        return true;
    }else{
        alert("sorry, there is no available seats");
        return false;
    }
}
