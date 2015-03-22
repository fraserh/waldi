# API
Get the most common items

    GET '/commonItems?size=20'

Fuzzy search for an item

    GET '/search/item?title=query%20terms'

Exact match for an item

    GET '/search/item?title=zucchini'

Exact match for a set of items

    POST '/items'

    * Content-Type application/json
    * Send json data with format
      {
        "items": [
          "ace of hearts valentines single stem",
          "alfalfa sprouts  125g",
          "asian choy sum 1 bunch"
        ]
      }

Alphabetical auto-complete suggestion

    GET '/search/autocomplete?title=ap&size=20'

Matches (must provide exact matching title)

    GET '/match?title=apricots'

Prepopulate the autocomplete

    GET /prepopulate

Increment a match's score (`apricot`'s match with `apricot jam` is to be incremented)

    PUT /match?anchor=apricot&match=apricot%20jam
