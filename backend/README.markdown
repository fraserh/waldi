# API
Get the most common items

    GET '/commonItems?size=20'

Fuzzy search for an item

    GET '/search/item?title=query%20terms'

Exact match for an item

    GET '/search/item?title=zucchini'

Alphabetical auto-complete suggestion

    GET '/search/autocomplete?title=ap&size=20'

Matches (must provide exact matching title)

    GET '/match?title=apricots'