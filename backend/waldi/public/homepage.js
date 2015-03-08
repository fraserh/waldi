/*  Homepage handler
    Author: Fraser Hemphill
*/

var homepageHandler = function() {
  
  // Setup the ajax call when user hard-searchs a product.
  this.initSearchListeners();

  this.appendShoppingItem();

}
  
homepageHandler.prototype.initSearchListeners = function() {
  // Jquery's proxy fn is not agreeing with this event listener, so this is a quick workaround.
  var that = this;

  $(document).keydown(function(e) {
    if (! (e.keyCode==40 || e.keyCode==38 || e.keyCode==13)){
      return;
    }
    var title = $(".tt-cursor .dropdown-title").text();
    if (e.keyCode==13) {
      that.appendShoppingItem({},{});
    }
    if (title) {
      that.getProductInfo(title);
    }
  });
};

homepageHandler.prototype.getProductInfo = function(prodTitle) {
  var query = encodeURIComponent(prodTitle);
  $.ajax("/item?title="+query, {
    success: this.handleItemResponse()
  });
};

homepageHandler.prototype.handleItemResponse = function(e) {
  console.log(e);
};

/*** Append item to shopping list 
 * @param {Object} colesItem The object of the coles product item.
 * @param {Object} wooliesItem The object of the woolies product item.
*/
homepageHandler.prototype.appendShoppingItem = function(colesItem, wooliesItem) {
  var source   = $("#entry-template").html();
  colesItem = {"store":"woolies","title": "mince", "price_per_kle": "5.99", "ppu": "6.99"}
  wooliesItem = {"store":"coles","title": "mince", "price_per_kle": "5.99", "ppu": "6.99"}
  var template = Handlebars.compile(source);
  newContainer = document.createElement('div')
  newContainer.className = "shopping-list-item-container";
  newContainer.innerHTML += (template(wooliesItem));
  newContainer.innerHTML += (template(colesItem));
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
  $(".ppu-coles").each(function() {
    colesTotal += parseFloat($(this).text());
  });
    $(".ppu-woolies").each(function() {
    wooliesTotal += parseFloat($(this).text());
  });
  $("#total-cost-coles")[0].innerHTML = "$"+colesTotal.toFixed(2);
  $("#total-cost-woolies")[0].innerHTML = "$"+colesTotal.toFixed(2);
};
