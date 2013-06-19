#!/usr/bin/env perl

use strict;
use warnings;
use v5.10;

use Tie::File;
use Data::Dumper;

my $built_file_header = q{

/******************************************************************************

This is the Lacuna Expanse Web Client jQuery Edition's built file. It has been
built using the following JavaScript libraries and other utilities.

    - Node
    - Grunt
        - RequireJS
        - Qunit
    - And a Perl script to put it all together

The Lacuna Expanse Web Client jQuery Edition makes use of the following
JavaScript libraries to make what it does possible.

    - jQuery
        - Zebra_Cookie
    - jQuery User Interface
        - jQuery UI Bootstrap Theme
    - RequireJS
    - Underscore

******************************************************************************/

};

## Start off with running JSHint and the Qunit tests, if they succeed, move on.
my $status = system('grunt development');

if ($status == 0) {
    ## Build the single JS file.
    system('node r.js -o app.build.js');

    ## Now that the file has been built, time to clean it a little.
    tie my @built_file, 'Tie::File', 'Lacuna-Web-Client-jQuery-Build.js';

    if (@built_file) {
        

        ## Now strip everything down until we only have the line that lacuna is
        ## actually on.
        for (@built_file) {
            if (m/^ |^\*|^\//) { ## Check if it starts with any sort of JS comment.
                ## undef it.
                undef $_;
            }
        }

        ## Now get the line that has the program on it.
        @built_file = grep {defined $_ and not $_ eq ''} @built_file;

        ## And add the heading to the top of it.
        unshift(@built_file, $built_file_header);

        say "\n\nFinished building.";
    }
}
else {
    say "Failed to pass JSHint and Unit tests with a status code of $status.";
}

system('pause');

__END__

This is the place for my Perl code that sucks and shouldn't be used.


