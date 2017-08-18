var btn = $("#short-btn");

btn.on("click", function(){
    console.log(btn.html())
    btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>')
});

//TODO make a json request and update the field with the short url


/*
$(document).ready(function () {
    
});
*/