/*  Homepage handler
    Author: Fraser Hemphill
*/

var homepageHandler = function() {
  
  this.userStillTyping = true;

  // Boolean to decide if options bar is showing.
  this.optionsVisible = false;

  // Setup the ajax call when user hard-searchs a product.
  this.initSearchListeners();

  // Setup Click listeners on buttons.
  this.initButtonListeners();
}

homepageHandler.prototype.initButtonListeners = function () {
  that = this;
  $(".menu-button-container").click(function(){
    if (!that.optionsVisible) {
      TweenLite.to($(".top-bar"), .3, {top:60});
      that.optionsVisible = true;
    } else {
      TweenLite.to($(".top-bar"), .3, {top:0});
      that.optionsVisible = false;
    }
  });
};
  
homepageHandler.prototype.initSearchListeners = function() {
  // Jquery's proxy fn is not agreeing with this event listener, so this is a quick workaround.
  var that = this;

  $(document).keydown(function(e) {
    // If user doesn't type for 0.4s, load the prices!
    that.userStillTyping = true;
    setTimeout(function(){ that.userStillTyping = false }, 2500);
    setTimeout(function(){ that.getPricesFromList($(".tt-input").val());
    }, 2000) ;

    $(".dropdown-more-results").click(function() {
      
    });
    
    if (! (e.keyCode==40 || e.keyCode==38 || e.keyCode==13)){
      return;
    }
    var title = $(".tt-cursor .dropdown-title").text();
    if (e.keyCode==13) {
      // If they pressed entered in the searchbar.
      // if (!$(".tt-cursor").length) {
      //   that.getMoreResults($(".tt-input").val());
      //   return;
      // }
      var title = $(".tt-input").val();
      that.getProdMatch(title)
    }
    if (title) {
      that.getProductInfo(title);
    }
  });
};

homepageHandler.prototype.getPricesFromList = function() {
  var titles = [];
  console.log(this.userStillTyping);
  if (this.userStillTyping || !$(".dropdown-title").length){
    return;
  }
  $(".dropdown-title").each(function(title) {
    console.log(title)
    titles.append(title.text());
  });
  console.log(titles)
  var that = this;
  $.ajax({
    type: "POST",
    url: "/items",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(titles),
    success: function (data, addToList) {
      console.log(data)
    }
  });
};

homepageHandler.prototype.getMoreResults = function(prodTitle) {
  var query = encodeURIComponent(prodTitle);
  var that = this;
  $.ajax({
    url: "/search/item?title="+query,
    success: function (data, addToList) {
      that.handleMoreResultsResponse(data)
    }
  });
};

homepageHandler.prototype.handleMoreResultsResponse = function(data) {
  console.log(data);
};

homepageHandler.prototype.getProdMatch = function(prodTitle) {
  var query = encodeURIComponent(prodTitle);
  console.log(query)
  var that = this;
  $.ajax({
    url: "/match?title="+query,
    success: function (data, addToList) {
      that.handleMatchResponse(data)
    }
  });
};

homepageHandler.prototype.getProductInfo = function(prodTitle, newItem) {
  var query = encodeURIComponent(prodTitle);
  var that = this;
  $.ajax({
    url: "/item?title="+query,
    success: function (data) {
      that.handleItemResponse(data, newItem)
    }
  });
};

homepageHandler.prototype.handleItemResponse = function(e, newItem) {
  this.wooliesItem = e;
  var selected = $(".tt-cursor .dropdown-price");
  if (!selected) {
    return;
  } else if(newItem) {
    this.appendShoppingItem();
  }
  selected.text("$" + e.price_per_kle + "/" + e.kle);
};

homepageHandler.prototype.matchCallback = function(e) {
  this.colesItem = e;
  var title = $(".tt-input").val();
  this.getProductInfo(title, true)
};

homepageHandler.prototype.handleMatchResponse = function(e) {
  // Should replace this with the actual method of best match.
  var bestMatch = encodeURIComponent(e.pop());
  console.log(e)
  var that = this;
  $.ajax({
    url: "/item?title="+bestMatch,
    success: function (data) {
      that.matchCallback(data);
    }
  });
};

/*** Append item to shopping list 
 * @param {Object} colesItem The object of the coles product item.
 * @param {Object} wooliesItem The object of the woolies product item.
*/
homepageHandler.prototype.appendShoppingItem = function(colesItem, wooliesItem) {
  var source   = $("#entry-template").html();
  colesItem = this.colesItem;
  colesItem["store"] = "coles";
  wooliesItem = this.wooliesItem;
  wooliesItem["store"] = "woolies";
  console.log(wooliesItem);
  var template = Handlebars.compile(source);
  newContainer = document.createElement('div')
  newContainer.className = "shopping-list-item-container";
  newContainer.innerHTML += (template(colesItem));
  newContainer.innerHTML += (template(wooliesItem));
  $(".content-container").append(newContainer);
  this.updateListCost();
};

/*** Update the total cost of the shopping list. 
 * @param {Object} colesItem The object of the coles product item.
 * @param {Object} wooliesItem The object of the woolies product item.
*/
homepageHandler.prototype.updateListCost = function() {
  var colesTotal = 0;
  var wooliesTotal = 0;
  var cheapestTotal = 0;
  $(".item-container").each(function(item) {
    var colesPrice = parseFloat($("ppu-coles", $(this)).text());
    var wooliesPrice = parseFloat($("ppu-woolies", $(this)).text());
    if (colesPrice < wooliesPrice) {
      cheapestTotal += colesPrice
      $("ppu-coles", $(this)).addClass("cheaper");
    } else {
      cheapestTotal += wooliesPrice
      $("ppu-woolies", $(this)).addClass("cheaper");
    }
  });
  $(".ppu-coles").each(function() {
    colesTotal += parseFloat($(this).text());
  });
  $(".ppu-woolies").each(function() {
    wooliesTotal += parseFloat($(this).text());
  });
  $("#total-cost-coles")[0].innerHTML = "$"+colesTotal.toFixed(2);
  $("#total-cost-woolies")[0].innerHTML = "$"+wooliesTotal.toFixed(2);
  $("#total-cost-both")[0].innerHTML = "$"+cheapestTotal.toFixed(2);
};
