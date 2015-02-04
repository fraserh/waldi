#!/usr/bin/perl -w

use File::Copy;
use File::Basename;

# Given a collection of files like
# httpshop.coles.com.auonlinenationalpantrypantry#
#   pageNumber=9&currentPageSize=100.html,
# this script will organise them into subdirectories similar to
# coles/
#   pantry-1.html
#   pantry-2.html
#   ...
#   fruit-1.html
# and so on

my $flag = $ARGV[0] or &usage_error();
my $directory = $ARGV[1] or &usage_error();

if ($flag eq "-c") {
  # Coles
  # print matching_files($directory);
  organise_coles($directory, matching_files($directory));
}

# Display a usage message and then exit with an error.
sub usage_error {
  print "Usage: ./storage.pl (-c | -w) path", "\n";
  print "\t-c\tThe Coles directory storage functions will be used.", "\n";
  print "\t-w\tThe Woolworths directory storage functions will be used.", "\n";
  die;
}

# Get a list of the HTML files in the given directory
sub matching_files {
  my $directory = shift or die "matching_files directory", "\n";

  if ($directory !~ /\/$/) {
    $directory =~ s!/*$!/!; # Add a trailing slash
  }

  opendir(DIR, $directory) or die $!;

  my @files = readdir(DIR);

  # Only match *.html  
  @files = grep(/.+\.html/, @files);

  # Prepend the path
  @files = map { "$directory" . $_ } @files;

  closedir(DIR);

  return @files;
}

# Organise a collection of files with the Coles method
sub organise_coles {
  my $current_dir = shift or die "organise_coles currentDir filenames", "\n";
  my @filepaths = @_;
  my $coles_dirname = "./${current_dir}coles";

  # Create the coles directory
  if (-e $coles_dirname) {
    die "Directory '$coles_dirname' already exists", "\n";
  }

  mkdir $coles_dirname or die $!;

  # Now move the files into the directory
  foreach my $file (@filepaths) {
    my $basename = basename $file;
    print "Moving $file to ${coles_dirname}/${basename}", "\n";
    move $file, "${coles_dirname}/${basename}" or die $!;

  }

  foreach my $file (matching_files "$coles_dirname/") {
    # Extract the page number
    $file =~ /pageNumber=([0-9]+)/;
    my $pageNumber = $1 or die "Unable to extract page number", "\n";

    # We want the words between 'national' and '#pageNumber'.
    # (This is actually the same word repeated twice.)
    $file =~ /national([^\#]+)/;
    my $category = $1 or die "Unable to extract category", "\n";
    $category = substr $category, 0, length($category) / 2;

    # Now move the file to 'coles/category-pageNumber.html'
    move "$file", "$coles_dirname/$category-$pageNumber.html" 
      or die $!;
  }
}
