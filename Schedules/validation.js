function validate() {
    const capacity = Number(document.getElementById('seat-capacity').value);
    const price = Number(document.getElementById('ticket-price').value);

    if (!capacity || capacity <= 0 || isNaN(capacity)) {
        alert("Please enter a valid seat capacity");
        return false;
    }

    if (!price || price <= 0 || isNaN(price)) {
        alert("Please enter a valid ticket price");
        return false;
    }

    return true;
}