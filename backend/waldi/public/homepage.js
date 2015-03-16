/*  Homepage handler
    Author: Fraser Hemphill
*/

var homepageHandler = function() {
  
  // Boolean to decide if options bar is showing.
  this.optionsVisible = false;

  // List of matches from the retrieved item.
  this.matchList = null;

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
      TweenLite.to($(".top-bar-options-container"), .6, {opacity:1});
      that.optionsVisible = true;
    } else {
      TweenLite.to($(".top-bar"), .3, {top:0});
      TweenLite.to($(".top-bar-options-container"), .2, {opacity:0});
      that.optionsVisible = false;
    }
  });
};
  
homepageHandler.prototype.initSearchListeners = function() {
  // Jquery's proxy fn is not agreeing with this event listener, so this is a quick workaround.
  var that = this;
  that.typingTimeout = null;
  $(".dropdown-more-results").click(function() {
    
  });
  $(document).keydown(function(e) {
    // If user doesn't type for 0.4s, load the prices!
    clearTimeout(that.typingTimeout);
    that.typingTimeout = setTimeout(that.getPricesFromList, 1000);
    if (! (e.keyCode==40 || e.keyCode==38 || e.keyCode==13)){
      return;
    }
    var title = $(".tt-cursor .dropdown-title").text();
    if (e.keyCode==13) {
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
  var that = this;
   if (!$(".dropdown-title").length){
    return;
  }
  $(".dropdown-title").each(function(index, title) {
    titles.push($(this).text());
    $(title).click(function(){
      // Add match
    });
  });
  $.ajax({
    type: "POST",
    url: "/items",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(titles),
    success: function (data, addToList) {
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
  };

homepageHandler.prototype.getProdMatch = function(prodTitle) {
  var query = encodeURIComponent(prodTitle);
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
  this.colesItem = e;
  var selected = $(".tt-cursor .dropdown-price");
  if (!selected) {
    return;
  } else if(newItem) {
    this.appendShoppingItem();
  }
  selected.text("$" + e.price_per_kle + "/" + e.kle);
};

homepageHandler.prototype.matchCallback = function(e) {
  this.wooliesItem = e;
  var title = $(".tt-input").val();
  this.getProductInfo(title, true)
};

homepageHandler.prototype.handleMatchResponse = function(e) {
  // Should replace this with the actual method of best match.
  var bestMatch = encodeURIComponent(e.shift());
  this.matchList = e;
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
  var that = this;
  var source   = $("#entry-template").html();
  colesItem = this.colesItem;
  colesItem["store"] = "coles";
  wooliesItem = this.wooliesItem;
  wooliesItem["store"] = "woolies";
  var template = Handlebars.compile(source);
  newContainer = document.createElement('div')
  newContainer.className = "shopping-list-item-container";
  newContainer.innerHTML += (template(colesItem));
  newContainer.innerHTML += (template(wooliesItem));
  $(".content-container").append(newContainer);

  // Temp hack to add dropdown
  // TODO(Fraser): Add a proper func which determines which store should have the dropdown.
  var dropdownButton = document.createElement('span');
  var dropdownCon = document.createElement('div');
  dropdownCon.className = "shopping-list-dropdown-container hidden";
  dropdownButton.className = "shopping-list-dropdown-button";
  dropdownButton.innerHTML = "more";
  $(".shopping-list-name-container.woolies").append(dropdownButton);
  $(".shopping-list-name-container.woolies").append(dropdownCon);
  $(this.matchList).each(function(i, item) {
    var dropdownOpt = document.createElement('div');
    dropdownOpt.className = "shopping-list-dropdown-option";
    $(dropdownOpt).text(that.matchList.shift());
    $(dropdownCon).append(dropdownOpt)
  });
  TweenLite.to(newContainer, .5, {opacity:1});
  $(dropdownButton).click(function() {
    $(dropdownCon).removeClass("hidden");
    TweenLite.to(dropdownCon, .5, {opacity:1});
  });
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
  $(".shopping-list-item-container").each(function(item) {
    var colesPrice = parseFloat($(".ppu-coles", $(this)).text());
    var wooliesPrice = parseFloat($(".ppu-woolies", $(this)).text());
    if (colesPrice < wooliesPrice) {
      cheapestTotal += colesPrice;
      $(".shopping-list-price-container.coles", $(this)).addClass("cheaper");
    } else {
      cheapestTotal += wooliesPrice;
      $(".shopping-list-price-container.woolies", $(this)).addClass("cheaper");
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
