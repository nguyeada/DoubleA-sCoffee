function updateCustomer(customer_id)    {
    $.ajax({
        url: '/customers/' + customer_id,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result)   {
            window.location.replace("./");
        }
    })
};