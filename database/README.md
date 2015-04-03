# Database Importer
* Currently using Redis, but switching to SQL soon (see notes at end)

## Import Items
```
./import_items.py <input_csv>
```

where `input_csv` is a file structured as

```
title, price_per_kle, kle, unit_price, unit_volume, amount
```

For example,

```
woolworths beef soup bones, 5.95, 1kg, 6.19, 1.04kg, 1
created with jamie beef burgers mexican style, 15.98, 1kg, 7.99, 0.5KG, 1
created with jamie butterflied beef rump sweet pepper, 23.50, 1kg, 14.10, 0.6KG, 1
beef diced heart smart, 17.35, 1kg, 8.68, 0.5KG, 1
msa australian beef diced slow cook, 12.99, 1kg, 7.79, 0.6KG, 1
woolworths beef diced bulgolgi, NA, NA, 8.99, each, 1
woolworths beef diced shredded slow cooked bbq, 27.96, 1kg, 6.99, 0.25KG, 1
woolworths chunky beef meat pie family pie, NA, NA, 4.99, 0.5KG, 1
created with jamie meatballs beef and wagyu chorizo, 12.48, 1kg, 7.49, 0.6KG, 1
quick cook meatballs beef, 14.0, 0.1KG, 6.99, 0.5KG, 1
```

## Import Matches
```
./import_matches.py <input_csv>
```

where `input_csv` is a file structured as

```
title_coles, titles_woolies, match_rating
```

For example,

```
4 star lean beef mince 500g, beef mince heart smart, 1.05263157895
4 star lean beef mince 500g, macro grass fed premium mince beef, 0.785714285714
4 star lean beef mince 500g, beef mince heart smart, 1.05263157895
4 star lean beef mince 500g, macro  beef mince premium, 0.936170212766
5 star lean beef mince 500g, beef mince heart smart, 1.05263157895
5 star lean beef mince 500g, macro grass fed premium mince beef, 0.785714285714
5 star lean beef mince 500g, beef mince heart smart, 1.05263157895
5 star lean beef mince 500g, macro  beef mince premium, 0.936170212766
3 star beef mince, beef mince heart smart, 1.42857142857
3 star beef mince, macro grass fed premium mince beef, 0.95652173913
```

# SQL notes
CREATE DATABASE waldi
sql_schema.sql defines the schema
GRANT ALL PRIVILEGES ON waldi.* To 'waldi'@'hostname' IDENTIFIED BY 'password';

