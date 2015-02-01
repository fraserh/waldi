$(document).ready(setupTypeahead);

function setupTypeahead() {
// prefetch
// --------

var countries = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    prefetch: {
      // url points to a json file that contains an array of country names, see
      // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
      // url: 'https://raw.githubusercontent.com/twitter/typeahead.js/gh-pages/data/countries.json',
      url: 'https://gist.githubusercontent.com/matthewpalmer/733a8eb336157c56a7e1/raw/de82f7701af79e57804b61a2933bc54664d45637/products.json',
      // the json file contains an array of strings, but the Bloodhound
      // suggestion engine expects JavaScript objects so this converts all of
      // those strings
      filter: function(list) {
        return $.map(list, function(country) { return { name: country }; });
      }
    }
  });

  // kicks off the loading/processing of `local` and `prefetch`
  countries.initialize();

  // passing in `null` for the `options` arguments will result in the default
  // options being used
  $('#prefetch .typeahead').typeahead(null, {
    name: 'countries',
    displayKey: 'name',
    // `ttAdapter` wraps the suggestion engine in an adapter that
    // is compatible with the typeahead jQuery plugin
    source: countries.ttAdapter()
  });
}
