function deleteOrder(order_id)  {
    $.ajax({
        url: '/orders/' + order_id,
        type: 'DELETE',
        success: function(result)   {
            window.location.reload(true);
        }
    })
};