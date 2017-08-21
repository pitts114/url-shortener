var btn = $("#shorten-btn");
var searchbar = $("#basic-url");
var apibtn = $("#api-btn");
var botbar = $("#botbar");
var HasBeenAnimated = false;
var clip;
searchbar.val('');
searchbar.focus();

btn.on("click", function() {
  if (searchbar.val() == '') {
    return
  }
  console.log(btn.html());
  btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
  getUrl();
  animate();
});

searchbar.on("keypress", function(e) {
  if (e.which == 13) {
    if (searchbar.val() == '') {
      return
    }
    console.log("Enter");
    btn.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
    getUrl();
    animate();

  }
});

function getUrl() {
  //populates the form with the short url
  searchbar.blur();
  var url = searchbar.val();
  console.log("url is " + url);
  $.getJSON("api/" + url, function(data) {
    searchbar.val(data.short_url);
    btn.html("Shorten!");
    showCopyButton();
    //searchbar.select();
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

function animate() { //begins button/bottom animation
  if (!HasBeenAnimated) {
    HasBeenAnimated = true;
    console.log("animating");
    apibtn.addClass("animated fadeInDown").parent().css("visibility", "visible");
    botbar.toggle().addClass("animated fadeInUp").css("visibility", "visible");

  }
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
  // when on mobile, hide the footer when typing
  searchbar.focus(function() {
    botbar.removeClass("animated fadeInUp").css("visibility", "hidden");
  });

  searchbar.blur(function() {
    botbar.addClass("animated fadeInUp").css("visibility", "visible");
  });
}

var buttonVisible = false;

function showCopyButton() {
  if (!buttonVisible) {
    $("#basic-url").after('<span class="input-group-btn "><button id="copy-btn" class="btn" type="button" data-clipboard-target="#basic-url"><i class="fa fa-clipboard" aria-hidden="true"></i></button></span>');
    buttonVisible = true;
    clip = new Clipboard("#copy-btn");
  }
}

function hideCopyButton() {
  if (buttonVisible) {
    $("#copy-btn").remove();
    buttonVisible = false;
  }
}
