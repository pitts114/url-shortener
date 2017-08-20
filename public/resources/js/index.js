var btn = $("#shorten-btn");
var searchbar = $("#basic-url");
var apibtn = $("#api-btn");
var botbar = $("#botbar");
var HasBeenAnimated = false;

btn.on("click", function(){
    console.log(btn.html());
    btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
    getUrl();
    animate();
});

searchbar.on("keypress", function(e) {
    if (e.which == 13) {
        console.log("Enter");
        btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
        getUrl();
        animate();

    }
});

function getUrl(){
    //populates the form with the short url
    var url = searchbar.val();
    console.log("url is " + url);
    jQuery.getJSON("api/" + url, function(data) {
        searchbar.val(data.short_url);
        btn.html("Shorten!");
    });
    
}

function animate(){//begins button/bottom animation
    if (!HasBeenAnimated){
        HasBeenAnimated = true;
        console.log("animating");
        apibtn.addClass("animated fadeInDown").parent().css("visibility", "visible");
        botbar.toggle().addClass("animated fadeInUp").css("visibility", "visible");
        
    }
}


//top button  animated fadeInDown
//bottom icons:  animated fadeInUp