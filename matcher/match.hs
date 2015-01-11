module Match (
  match
) where 

import Data.Char
import Data.List

coles = [ "Strawberries Prepacked 250g"
        , "Bananas 1 each"
        , "Pink Lady Apples 1 each"
        , "Packham Pears 1 each"
        , "Carrots 1 each"
        ]

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

match = reverse $ sortLists $ compareLists coles woolworths

-- For each string in the first list, determine its matchiness 
-- to the strings in the second list. Then sort by matchiness.
-- This is N^2.
-- Returns a list of tuples of the form (list1String, list2String, matchRank)

-- How we sort our groups
sortTriple (s1, t1, r1) (s2, t2, r2) = compare r1 r2

sortLists :: [(String, String, Double)] -> [(String, String, Double)]
sortLists list1 = sortBy sortTriple list1

-- For each string in the first list, determine its matchiness 
-- to the strings in the second list. 
-- This is N^2.
-- Returns a list of tuples of the form (list1String, list2String, matchRank)
compareLists :: [String] -> [String] -> [(String, String, Double)]
compareLists list1 list2 =
  concat $ map (\s1 -> map (\s2 -> (s1, s2, (matchRating s1 s2))) list2) list1

{-
  Based on [an article][a] by Simon White, and 
  the [corresponding question][q] on StackOverflow.

  [a]: http://www.catalysoft.com/articles/StrikeAMatch.html
  [q]: http://stackoverflow.com/q/653157/1695900
-}

-- Convert a string into words, then get the pairs of words from that phrase
wordLetterPairs :: String -> [String]
wordLetterPairs s1 = concat $ map pairs $ words s1

-- Converts a String into a list of letter pairs.
pairs :: String -> [String]
pairs [] = []
pairs (x:[]) = []
pairs (x:ys) = [x, head ys]:(pairs ys)

-- Calculates the match rating for two strings
matchRating :: String -> String -> Double
matchRating s1 s2 = (numberOfMatches * 2) / totalLength
  where pairsS1 = wordLetterPairs $ map toLower s1
        pairsS2 = wordLetterPairs $ map toLower s2
        numberOfMatches = fromIntegral $ length $ pairsS1 `intersect` pairsS2
        totalLength = fromIntegral $ length pairsS1 + length pairsS2
