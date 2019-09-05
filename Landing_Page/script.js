var cartBtn = document.querySelector('.cart-btn');
var clearCart = document.querySelector('.clear-cart')
// var cartItems = document.querySelector('.items');
var totalAmount = document.querySelector('.total-amount');
var cartContent = document.querySelector('.cart-content');
var bookList = document.querySelector('.book-list');
$('.store').on("click", function () {
    var value = document.querySelector('#counter').innerHTML;
    if (value==0) {
            val = parseInt(value) + 1;
            document.getElementById("counter").innerText = val;
        } else {
            alert("already in cart")
        }
})