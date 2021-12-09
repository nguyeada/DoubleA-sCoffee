function updateDrink(drink_id){
    $.ajax({
        url: '/drinks/' + drink_id,
        type: 'PUT',
        data: $('#update-drink').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};