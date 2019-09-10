$('li.dropdown').hover(function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(500);
}, function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(500);
});

var cartBtn = document.querySelector('.cart-btn');
var clearCart = document.querySelector('.clear-cart')
// var cartItems = document.querySelector('.items');
var totalAmount = document.querySelector('.total-amount');
var cartContent = document.querySelector('.cart-content');
var bookList = document.querySelector('.book-list');
$('.store').on("click", function () {
    var value = document.querySelector('#counter').innerHTML;
    if (value == 0) {
        val = parseInt(value) + 1;
        document.getElementById("counter").innerText = val;
    } else {
        alert("already in cart")
    }
})
$(".bookpage").on("click", function () {
    var category = $(this).attr('value')
    window.location = '/'+category;
});
//search bar
// $('.search-button').on("click",function(){
//     var element = $('.search').val();
//     if(element.length<=0){
//         alert("Need some value to search")
//     }else{
//         $.ajax({
//             url: '/category/search/'+element,
//             type: "get",
//             dataType: "json",
//             success: function (data) {
//                 for (var i = 0; i < data.length; i++) {
//                     alert(data)
//                 }
//             }
//         });
//     }
// })
//end search bar