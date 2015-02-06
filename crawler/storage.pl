#!/usr/bin/perl -w

# # #
#  Usage: ./storage.pl (-c | -w) directory/
#  
#  Note : * -c or -w (for Coles or Woolworths) are exclusive.
#         * `directory/` is tested working with the trailing slash.
#           It might work without (I tried to handle this), but I just
#           haven't tested yet.
# 
# # #




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

print "begin\n";

my $flag = $ARGV[0] or usage_error();
my $directory = $ARGV[1] or usage_error();

if ($directory !~ /\/$/) {
  $directory =~ s!/*$!/!; # Add a trailing slash
}

if ($flag eq "-c") {
  # Coles
  organise_coles($directory, matching_files($directory));
} elsif ($flag eq "-w") {
  # Woolworths
  organise_woolworths($directory, matching_files($directory));
} else {
  usage_error();
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

# Moves the files into the correct folder
sub organise {
  my $current_dir = shift;
  my $intended_dir = shift;
  my @filepaths = @_;
  my $full_dirname = "./${current_dir}${intended_dir}";

  # Create the directory
  if (-e $full_dirname) {
    die "Directory '$full_dirname' already exists", "\n";
  }

  mkdir $full_dirname or die $!;

  # Now move the files into the directory
  foreach my $file (@filepaths) {
    my $basename = basename $file;
    print "Moving $file to ${full_dirname}/${basename}", "\n";
    move $file, "${full_dirname}/${basename}" or die $!;
  }
}

# Organise a collection of files with the Coles method
sub organise_coles {
  my $current_dir = shift;
  my $intended_dir = "coles";
  my @filepaths = @_;
  my $full_dirname = "./${current_dir}${intended_dir}";

  organise($current_dir, $intended_dir, @filepaths);

  # And neatly categorise each file within the coles directory
  foreach my $file (matching_files "$full_dirname/") {
    my ($category, $pageNumber) = coles_path_to_neat($file);
    move "$file", "$full_dirname/$category-" . "$pageNumber.html" or die $!;
  }
}

# Organise a collection of files with the Woolworths method
sub organise_woolworths {
  my $current_dir = shift;
  my $intended_dir = "woolworths";
  my @filepaths = @_;
  my $full_dirname = "./${current_dir}${intended_dir}";

  organise($current_dir, $intended_dir, @filepaths);

  # And categorise each file within the woolies directory
  foreach my $file (matching_files "$full_dirname/") {
    my ($category, $pageNumber) = woolworths_path_to_neat($file);
    move "$file", "$full_dirname/$category-" . "$pageNumber.html" or die $!;
  }
}

# Could have made this more DRY but I think we'll probably just end up changing
# these separately anyway.

# Takes a long coles path and turns it into a tuple of (category, page no.)
sub coles_path_to_neat {
  my $file = shift;
  # Extract the page number
  $file =~ /pageNumber=([0-9]+)/;
  my $pageNumber = $1 // 1;

  # We want the words between 'national' and '#pageNumber'.
  # (This is actually the same word repeated twice.)
  $file =~ /national([^\#]+)/;
  my $category = $1 or die "Unable to extract category", "\n";
  $category = substr $category, 0, length($category) / 2;

  return ($category, $pageNumber);
}

# Takes a long woolies path and turns it into a tuple of (category, page no.)
sub woolworths_path_to_neat {
  my $file = shift;
  # Extract page number
  $file =~ /page=([0-9]+)/;
  my $pageNumber = $1 // 1;

  # We want the words between 'Browse' and 'page='.
  $file =~ /Browse(.*)page\=/;
  my $category = $1 or die "Unable to extract category", "\n";

  return ($category, $pageNumber);
}
