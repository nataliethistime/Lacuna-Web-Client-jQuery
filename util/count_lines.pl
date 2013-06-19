#!/usr/bin/env perl

use strict;
use warnings;
use v5.10;

use File::Find;
use Cwd;

use Getopt::Long (qw(GetOptions));

my $debug;

GetOptions(
    "debug" => \$debug
);

my $path = cwd();
$path =~ s/\/util//i;
my $total_count = 0;


find(\&wanted, $path);

## Finished
say "There are $total_count lines SLOC in the project.";

    ###################
    ### SUBROUTINES ###
    ###################

sub wanted {
    ## $_ is the name of the file.
    if (m/\.js$|\.tmpl$|\.pl$/i and
        $File::Find::dir !~ m/src\/js/i and
        $File::Find::dir !~ m/node_modules/i and
        not $_ eq 'r.js' and
        not $_ eq 'Lacuna-Web-Client-jQuery-Build.js') {

        say 'Reading ' . $File::Find::name if ($debug);

        $total_count += count_lines($File::Find::name);

    }
}

sub count_lines {
    my ($file_name) = @_;
    my $count       = 0;

    open (FH, $file_name) or die "Crap. $!";
    
    while (<FH>) {
        if (not m/^\s+?$/) {
            $count++;
        }
    }

    close FH;

    return $count;
}

__END__
