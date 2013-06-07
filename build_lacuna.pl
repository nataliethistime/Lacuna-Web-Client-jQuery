#!/usr/bin/perl

use strict;
use warnings;
use v5.10;

## Start off with running JSHint and the Qunit tests, if they succeed, move on.
my $status = system('grunt development');

if ($status == 0) {
    ## Build the single JS file.
    system('node r.js -o app.build.js');
}
else {
    say 'Failed to pass JSHint and Unit tests.';
    exit;
}
