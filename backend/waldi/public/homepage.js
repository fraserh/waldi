/*  Homepage handler
    Author: Fraser Hemphill
*/

var homepageHandler = function() {

  // A stack of divs which when a user presses esc, should be removed from DOM.
  this.escapableDivs = [];
  
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

homepageHandler.prototype.escapeNextModule = function() {
  $(this.escapableDivs.pop()).remove();
};
  
homepageHandler.prototype.initSearchListeners = function() {
  // Jquery's proxy fn is not agreeing with this event listener, so this is a quick workaround.
  var that = this;
  that.typingTimeout = null;

  $(".dropdown-title").click(function() {
    console.log("got here");
  });
  $(".search-button").click(function(){
    that.getMoreResults($(".tt-input").val());
  })
  $(document).keydown(function(e) {
    // If user doesn't type for 0.4s, load the prices!
    clearTimeout(that.typingTimeout);
    that.typingTimeout = setTimeout(that.getPricesFromList, 1000);
    if (e.keyCode == 27) {
      that.escapeNextModule();
    }
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

  $('.searchbar').on('focus', function (e) {
    $(this)
      .one('mouseup', function () {
        $(this).select();
        return false;
      })
      .select();
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

  var dataToPost = {
    items: JSON.stringify(titles)
  };

  $.ajax({
    type: "POST",
    url: "/items",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(dataToPost),
    success: function (data, addToList) {

      mergeDataWithDOM(data, getDOMElementsForSearchResults());

      function getDOMElementsForSearchResults() {
        var resultClass = 'tt-suggestion';
        var results = $('.' + resultClass);
        return results;
      }

      function mergeDataWithDOM(data, DOMElements) {
        // n*m, because we can't really sort DOMElements.
        // It'll only be 10 items in the DOM anyway, so really it's
        // 10 * data.length
        var titleClass = 'dropdown-title';
        var priceClass = 'dropdown-price';

        for (var i = 0; i < data.length; i++) {
          var currentItem = data[i];

          for (var j = 0; j < DOMElements.length; j++) {
            var currentNode = DOMElements[j];

            var title = currentNode.getElementsByClassName(titleClass)[0].textContent;
            if (currentItem.title && title === currentItem.title) {
              // We have a match. Update the price DOM element with 
              // this item's price.
              currentNode.getElementsByClassName(priceClass)[0].textContent =
              "$" + currentItem.price_per_kle + "/" + currentItem.kle;
            }
          }
        }
      }
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
  var source   = $("#more-results-template").html();
  var newContainer = Handlebars.compile(source);
  source = $("#more-results-item-template").html();
  $("body").append(newContainer);
  var container = $(".more-results-content-wrapper");
  var template = Handlebars.compile(source);
  $.each(data, function(index, item) {
    container.append(template({title:item}));
  });
  this.escapableDivs.push($(".more-results-bg"));
  $(".more-results-bg").click(function() {
    $(this).remove();
    this.escapableDivs.pop();
  })
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
  newContainer.innerHTML += '<div class="shopping-list-item-delete"><i class="fa fa-times"></i></div>';
  $(".content-container").append(newContainer);

  // Temp hack to add dropdown
  // TODO(Fraser): Add a proper func which determines which store should have the dropdown.
  var dropdownButton = document.createElement('span');
  var dropdownCon = document.createElement('div');
  dropdownCon.className = "shopping-list-dropdown-container hidden";
  dropdownButton.className = "shopping-list-dropdown-button";
  dropdownButton.innerHTML = "<i class='fa fa-chevron-down'></i>";
  $(".shopping-list-name-container.woolies", newContainer).append(dropdownButton);
  $(".shopping-list-name-container.woolies", newContainer).append(dropdownCon);
  $(this.matchList).each(function(i, item) {
    var dropdownOpt = document.createElement('div');
    dropdownOpt.className = "shopping-list-dropdown-option";
    $(dropdownOpt).text(that.matchList.shift());
    $(dropdownCon).append(dropdownOpt)
  });
  TweenLite.to(newContainer, .5, {opacity:1});
  $(dropdownButton).click(function() {
    $(dropdownCon).toggleClass("hidden");
    TweenLite.to(dropdownCon, .5, {opacity:1});
  });
  (function(){
    $(".shopping-list-item-delete", newContainer).click(function() {
      console.log(newContainer)
      $(newContainer).remove();
    });
  })();
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
      $(".shopping-list-item-coles-container", $(this)).addClass("cheaper");
    } else {
      cheapestTotal += wooliesPrice;
      $(".shopping-list-item-woolies-container", $(this)).addClass("cheaper");
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
