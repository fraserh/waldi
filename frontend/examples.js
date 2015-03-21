$(document).ready(setupTypeahead);

function setupTypeahead() {
// prefetch
// --------

var sizeReg = /[0-9]{1,3}[kgKGmg]/

var countries = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    hint: true,
    prefetch: {
      // url points to a json file that contains an array of country names, see
      // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
      // url: 'https://raw.githubusercontent.com/twitter/typeahead.js/gh-pages/data/countries.json',
      url: 'http://localhost/prepopulate',
      // the json file contains an array of strings, but the Bloodhound
      // suggestion engine expects JavaScript objects so this converts all of
      // those strings
      filter: function(list) {
        return $.map(list, function(country) { return { 
          name: country["prod"], 
          price: country["price"],
          size: country["prod"]
        }; });
      }
    }
  });


  // kicks off the loading/processing of `local` and `prefetch`
  countries.initialize();
  console.log(countries)
  // passing in `null` for the `options` arguments will result in the default
  // options being used
  var suggestHTML = Handlebars.compile("<span class='dropdown-title'>{{name}}</span><span class='dropdown-price'>${{price}}/kg</span>");

  $('#prefetch .typeahead').typeahead({
      hint: true,
      minLength:2,
      highlight: true
    },{
    source: countries.ttAdapter(),
    name: 'titles',
    displayKey: 'name',
    templates: {suggestion: suggestHTML},
    // `ttAdapter` wraps the suggestion engine in an adapter that
    // is compatible with the typeahead jQuery plugin
    
  });

}
