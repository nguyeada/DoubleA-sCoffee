function deleteDrink(drink_id){
    $.ajax({
        url: '/drinks/' + drink_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};