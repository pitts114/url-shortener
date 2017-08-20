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

}

function animate(){//begins button/bottom animation
    if (!HasBeenAnimated){
        HasBeenAnimated = true;
        console.log("animating");
        apibtn.addClass("animated fadeInDown").parent().toggle();
        botbar.toggle().addClass("animated fadeInUp");
        
    }
}


//top button  animated fadeInDown
//bottom icons:  animated fadeInUp