#!/usr/bin/perl -w

# Prints out a list of the most frequently recurring words.
# Reads from STDIN/file

while (<>) {
  @words = split /(\s|,)/, $_;
  foreach $word (@words) {
    if ($word =~ /\w+/) {
      $word_freq{lc $word}++;
    }
  }
}

foreach $key (sort {$word_freq{$a} <=> $word_freq{$b} } keys %word_freq) {
  print $key, " ", $word_freq{$key}, "\n";
}