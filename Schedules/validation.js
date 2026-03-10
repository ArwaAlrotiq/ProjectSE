function validate(){
    const capacity=document.getElementById('seat-capacity').value;
    const price=document.getElementById('ticket-price').value;

    if(capacity<=0){
        alert("please enter a valid seat capacity");
        return false;
    }
    if(price <=0){
        alert("please enter a valid price");
        return false;
    }
    return true;
}