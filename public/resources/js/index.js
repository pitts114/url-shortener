var btn = $("#short-btn");
var searchbar = $("#basic-url");

btn.on("click", function(){
    console.log(btn.html());
    btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
});

searchbar.on("keypress", function(e) {
    if (e.which == 13) {
        console.log("Enter");
        btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
    }
});
//TODO make a json request and update the field with the short url


/*
$(document).ready(function () {

});
*/