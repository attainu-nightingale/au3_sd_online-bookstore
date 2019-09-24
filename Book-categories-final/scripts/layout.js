$('li.dropdown').hover(function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(500);
}, function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(500);
});
$(".bookpage").on("click", function () {
    var category = $(this).attr('value')
    window.location = '/category/'+category;
});
$(".search-button").on("click", function () {
    var ele = $('.search').val();
    window.location = '/search/' + ele;
});
$('.store').on('click', function (req, res) {
    var cartid = $(this).attr('value')
    var username = $("#username").val();
    $.ajax({
        url: '/addbook/' + cartid,
        type: 'post',
        datatype: JSON,
        success: function (msg) {
            if (msg == 'Do login') {
                window.location.replace("/login ");
            } else if (msg == 'inserted') {
                var value = document.querySelector('#counter').innerHTML;
                val = parseInt(value) + 1;
                document.getElementById("counter").innerText = val;
                alert(msg)
            } else if (msg == 'Already in Cart') {
                alert('Already in Cart')
            }
        }
    })
})
$('.deleteproduct').on('click', function () {
    var deleteitem = $(this).attr('value')
    var username = $("#username").val();
    $.ajax({
        url: '/deleteproduct/' + username + '/' + deleteitem,
        type: 'delete',
        datatype: 'json',
        success: function (msg) {
             var value = document.querySelector('#counter').innerHTML;
            val = parseInt(value) - 1;
            document.querySelector('#counter').innerHTML = val;
            console.log(value)
            alert(JSON.stringify(msg))
        }
    })
})

// $('.deleterefresh').on('click', function () {
//     $.ajax({
//         url: '/cart/usercart',
//         type: 'get',
//         datatype: 'json',
//         success: function (msg) {
//             alert(JSON.stringify(msg))
//         }
//     })
// })
$(document).on("change", ".Bookquantity", function () {
    var id = $(this).attr("book_qua");
    // var $this = $(this);
    var quant = $(this).find(":selected").text();
    // console.log("val is", quant);
    $.ajax({
        url: "/book/"+quant+'/'+ id,
        type: 'put',
        datatype:"json",
        success:function(message){
            alert(message)
        }
    })
})
