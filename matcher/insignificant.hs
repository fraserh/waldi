module Insignificant
  where

import Data.List
import Data.Char

woolworths = [ "Fresh Apple Pink Lady each"
             , "Fresh Apple Sundowner each"
             , "Fresh Apricot each"
             , "Fresh Banana each"
             , "Fresh Banana Organic each"
             , "Fresh Carrot Juicing 2kg bag"
             , "Fresh Carrot each"
             , "Fresh Carrot Prepacked 1kg bag"
             , "Strongbow Pear Cider Pear 24x355ml"
             , "Angas Park Pears Dried 200g"
             , "Fresh Pear Packham Ripe & Ready each"
             , "Fresh Pear Corella each"]

main = take 5 $ reverse $ sortLists $ frequency $ listToWords (mapDeep toLower woolworths)

-- Map a function over the non-list elements in a list of lists
-- (i.e. applies a function at one level deep)
mapDeep :: (a -> b) -> [[a]] -> [[b]]
mapDeep f xs = map (\x -> map f x) xs

-- Convert a list of phrases into a list of words
listToWords :: [String] -> [String]
listToWords list = concat $ map words list

-- Sort a list of (a, Int) pairs based on the Int
sortFrequency (s1, r1) (s2, r2) = compare r1 r2
sortLists :: [(String, Int)] -> [(String, Int)]
sortLists xs = sortBy sortFrequency xs

-- Given a list of words, calculates their frequency.
frequency :: [String] -> [(String, Int)]
frequency ws = 
  map (\w -> (head w, length w)) $ group $ sort ws
