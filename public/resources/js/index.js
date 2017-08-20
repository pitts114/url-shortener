var btn = $("#shorten-btn");
var searchbar = $("#basic-url");
var apibtn = $("#api-btn");
var botbar = $("#botbar");
var HasBeenAnimated = false;
searchbar.val('');

searchbar.focus();

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
    searchbar.blur();
    var url = searchbar.val();
    console.log("url is " + url);
    $.getJSON("api/" + url, function(data) {
        searchbar.val(data.short_url);
        btn.html("Shorten!");
    });
    /*
    $.ajax({
        url: "/api/" + url,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            searchbar.val(data.short_url);
            btn.html("Shorten!");
        }
    });
    */
}

function animate(){//begins button/bottom animation
    if (!HasBeenAnimated){
        HasBeenAnimated = true;
        console.log("animating");
        apibtn.addClass("animated fadeInDown").parent().css("visibility", "visible");
        botbar.toggle().addClass("animated fadeInUp").css("visibility", "visible");

    }
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    // when on mobile, hide the footer when typing
searchbar.focus( function() {
    botbar.removeClass("animated fadeInUp").css("visibility", "hidden");
});

searchbar.blur( function() {
   botbar.addClass("animated fadeInUp").css("visibility", "visible");
});
}
