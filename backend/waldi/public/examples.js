$(document).ready(setupTypeahead);

function setupTypeahead() {

  var products = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: 10,
      hint: true,
      prefetch: {
        url: 'titles.json',
        filter: function(list) {
          return $.map(list, function(country) { return { 
            name: country["prod"]
          }; });
        }
      }
    });

    products.initialize();

    var suggestHTML = Handlebars.compile("<span class='dropdown-title'>{{name}}</span><span class='dropdown-price'>$/kg</span>");

    $('#prefetch .typeahead').typeahead({
        hint: true,
        minLength:2,
        highlight: true,
      },{
      source: products.ttAdapter(),
      name: 'titles',
      displayKey: 'name',
      templates: {
        suggestion: suggestHTML,
        footer: "<div class='dropdown-more-results'>More Results...</div>"
      }
    });
}
