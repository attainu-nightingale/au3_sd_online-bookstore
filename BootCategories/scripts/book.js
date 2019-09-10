$(".details").on("click", function () {
    var val = $(this).attr('value')
    window.location = '/:category/'+val;
    // alert(val)
});