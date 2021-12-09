function deleteCustomer(customer_id)    {
    $.ajax({
        url: '/customers/' + customer_id,
        type: 'DELETE',
        success: function(result)   {
            window.location.reload(true);
        }
    })
};