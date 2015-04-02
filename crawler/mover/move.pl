#!/usr/bin/perl -w

use File::Copy qw(copy);

my $usage = "Usage: move.pl (coles|woolworths) input_dir output_dir";

sub error {
  print $_[0], "\n";
  exit;
}

sub usage_error {
  error $usage;
}

sub file_error {
  error "file or directory not found";
}

# Check for the right number of arguments
if (@ARGV != 3) {
  usage_error;
}

my $store = $ARGV[0];
my $input_directory = $ARGV[1];
my $output_directory = $ARGV[2];

# If there is one, strip the trailing slash from the given directories.
$input_directory =~ s/\/$//;
$output_directory =~ s/\/$//;

# Check that the store given was ok
if ($store ne "coles" && $store ne "woolworths") {
  usage_error;
}

# Check that both the input and output directories exist
if (!(-d $input_directory) || !(-d $output_directory)) {
  file_error;
}

# Get the list of files in the input directory
opendir my $dir, $input_directory or die "Cannot open directory: $!";
my @input_files = readdir $dir;
@input_files = grep { /[^\.]/ } @input_files;
closedir $dir;

# Given a filename-ised URL, extract the category and filename to-be
# and return these values as a tuple.
  # Sample URLs
  # httpshop.coles.com.auonlinenationalstationery-mediastationery-media#pageNumber=7&currentPageSize=100
  # httpshop.coles.com.auonlinenationalclothingclothing#pageNumber=1&currentPageSize=100
  
sub coles_extractor {
  # httpshop.coles.com.auonlinenationalstationery-mediastationery-media#pageNumber=7&currentPageSize=100
  my $url = shift or die "Invalid arguments to coles_extractor";

  # stationery-mediastationery-media#pageNumber=7&currentPageSize=100
  $url =~ s/^httpshop.coles.com.auonlinenational//;

  # (stationery-mediastationery-media)#(pageNumber=7)&currentPageSize=100
  $url =~ /(.*?)#pageNumber=([0-9]+)/;

  # stationery-mediastationery-media
  my $category = $1;

  # 7
  my $pageNumber = $2;

  $category = substr $category, 0, (length($category) / 2);

  return ($category, $pageNumber);
}

# Given a filename-ised URL, extract the category and filename to-be
# and return these values as a tuple.
  # Sample URLs
  # httpwww2.woolworthsonline.com.auShopBrowsetoiletriespage=93
  # httpwww2.woolworthsonline.com.auShopBrowsehome-outdoorpage=16
sub woolworths_extractor {
  my $url = shift or die "Invalid arguments to woolworths_extractor";

  # httpwww2.woolworthsonline.com.auShopBrowsetoiletriespage=93
  $url =~ s/^httpwww2.woolworthsonline.com.auShopBrowse//;

  # (toiletries)page=(93)
  $url =~ /(.*)page=(\d+)/;

  # toiletries
  my $category = $1;

  # 93
  my $pageNumber = $2;

  return ($category, $pageNumber);
}

# For each file in the directory, move it to the subdirectory
# for its category
foreach my $file (@input_files) {
  my $filename;
  my $category;

  if ($store eq "coles") {
    ($category, $filename) = coles_extractor $file;
  } elsif ($store eq "woolworths") {
    ($category, $filename) = woolworths_extractor $file;
  } else {
    error "invalid store";
  }

  my $src = "$input_directory/$file";
  my $dest = "$output_directory/$category/$filename";
  print $src, " to ", $dest, "\n";

  if (!(-d "$output_directory/$category")) {
    # The category's directory doesn't exist. Create it.
    mkdir "$output_directory/$category";
  }

  copy $src, $dest;
}