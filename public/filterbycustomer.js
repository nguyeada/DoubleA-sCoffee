function filterOrdersByCustomer()   {
    var customer_id = document.getElementById('customerorder_filter').value
    window.location = '/drink-orders/filter/' + parseInt(customer_id)
};