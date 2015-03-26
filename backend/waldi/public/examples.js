$(document).ready(setupTypeahead);

function setupTypeahead() {

  var products = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: 10,
      hint: true,
      prefetch: {
        url: '/prepopulate',
        filter: function(list) {
          return $.map(list, function(country) { return { 
              name: country["prod"]
            };
          });
        }
      },
      remote: {
        url: '/search/autocomplete?title=%QUERY',
        filter: function (taglist) {
            // Map the remote source JSON array to a JavaScript object array
            var i = 0;
            return $.map(taglist, function (tag) {
                return {
                  name: tag
                }
            });
          }
      } 
  });

    products.initialize();

    var suggestHTML = Handlebars.compile("<span class='dropdown-title'>{{name}}</span><span class='dropdown-price'><i class='fa fa-circle-o-notch fa-spin'></i></span>");

    $('#prefetch .typeahead').typeahead({
        hint: true,
        minLength:2,
        highlight: true,
        updater: function(item) {console.log(item)}
      },{
      source: products.ttAdapter(),
      name: 'titles',
      displayKey: 'name',
      templates: {
        suggestion: suggestHTML,
        footer: "<div class='dropdown-more-results'>More Results...</div>"
      }
    }).on('typeahead:selected', function(object, data) {
      
    });
}
