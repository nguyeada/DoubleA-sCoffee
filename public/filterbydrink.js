function filterLocationsByDrink()   {
    var drink_id = document.getElementById('drinklocation_filter').value
    window.location = '/drink-locations/filter/' + parseInt(drink_id)
};