var btn = $("#shorten-btn");
var searchbar = $("#basic-url");

btn.on("click", function(){
    console.log(btn.html());
    btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
    getUrl();
});

searchbar.on("keypress", function(e) {
    if (e.which == 13) {
        console.log("Enter");
        btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
        getUrl();
        
    }
});

function getUrl(){
    
}


/*
$(document).ready(function () {

});
*/