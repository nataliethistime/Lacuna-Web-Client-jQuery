Lacuna-Web-Client-jQuery
========================

Rewrite of the current Lacuna Expanse Web Client using jQuery & friends.


Buildings
=========

The following is the list of buildings that needs to be implemented. If you think you can code a building or two, open up the `buildingType/planetaryCommand.js` file and have a look at the notes we've written in there for you.

* Archaeology
* BlackHoleGenerator
* Capitol
* DeployedBleeder
* Development
* DistributionCenter
* Embassy
* EnergyReserve
* Entertainment
* FoodReserve
* GeneticsLab
* Intelligence
* IntelTraining
* InterDimensionalRift
* LibraryOfJith
* LostCityOfTyleon
* MayhemTraining
* MercenariesGuild
* MiningMinistry
* MissionCommand
* Network19
* Observatory
* OreStorage
* Park
* PlanetaryCommand
    * @Vasari will be writing the code for this plus a bunch of explanatory notes for those starting with the code here.
        * Finished:
            * Planet Tab
            * Rename Tab
            * Plans Tab
        * TODO:
            * Abandon Tab:
                * Abandoning a planet involves a planet change, which hasn't been implemented yet. @Vasari plans to look at this in the near future.
            * Resources Tab
            * Supply Chains Tab
            * Storage Tab
                * @Vasari plans to adapt the Storage Tab code as seen in the Waste Well into a separate module to be used by the Food, Ore, Water, Energy and Waste storing buildings.
* PoliticsTraining
* Ravine
* Security
* Shipyard
    * @Vasari is working on this one.
    * So far, a very basic version of viewing the build queue is available.
* SpacePort
    * @icydee plans to work on this, and on other bits of code that display lists of ships (starmaps etc.)
* SpaceStationLab
* SubspaceSupplyDepot
* SupplyPod
* TempleOfTheDrajilites
* TheDillonForge
* TheftTraining
* ThemePark
* Trade
* Transporter
* WasteExchanger
* WasteSequestration
* WaterStorage

Git Notes
=========

These are mostly notes for me as I keep forgetting Git commands. :)

### Best practices for using Git

I have put these notes here so that we do not get into the git spagetti merge
nightmare that Lacuna-Server-Open got into. (see the network graph about 12 
months ago for an example).

# First Principles
    Do not use the github 'Merge pull request' Button, ever.
    Do not use 'git pull origin master'
    Do not use 'git merge master'
    Always use 'git pull --ff-only origin master'
    Always use 'git merge --ff-only master' or similar when merging branches.

The aim is to keep a linear history in the master branch without side branches 
and remerging.

Github 'Merge pull request' always does a merge, never a fast-forward, even
when it could do so.

If on doing a 'git pull --ff-only origin master' you get the following error:-

  fatal: Not possible to fast-forward, aborting.

This means that the upstream (origin) has been modified and updated by someone
else. In this circumstance you should do the following instead.

git pull --rebase origin master

This is what has happened.
 
          A--B      master on origin
         /
    D---E---F       master (on your local)

The last time you pulled down the code from the origin (github) was at revision
E. You since committed change F locally.

Meanwhile someone else pulled down the same revision, E and made changes A and B.

However that someone committed their changes to origin before you did.

When you do a 'git pull origin master' to your local directory. It will do the
following.

          A---B     master on origin
         /     \
    D---E---F---G   master (on your local)

It has merged the two divergent branches and this 'loop' will be present in the
git repository for posterity. As more and more people commit, you get loops on
loops and three way merges etc. It soon gets to be a mess!

However. if you do the 'git pull --ff-only origin master' and it complains about
not being able to do a fast forward merge, do the following.

git pull --rebase origin master.

This will pull down the master from origin and *replay your changes on top of it*

    D---E---A---B---F'

Note, F' is not the same as F, what has happened is that it looked at the changes
that you made *from E to F* and instead, applied those changes on top of B.

###BIG WARNING NOTICE

Almost always, your changes are local in which case rewriting history in this way
is perfectly fine. If however you have pushed the changes elsewhere, which is
public, then someone else may have your original changes and things can get in a
mess. There are ways around this, but it requires a deeper understanding than I
can impart in these comments!

When, and only when, you have merged from the master repository (currently vasari)
in this way, you can push your changes to your own repository on github.

(sorry this was so long, I did not have sufficient time to make it shorter).


###Merging to gh-pages

*Starting from the master branch.*

    $ git checkout gh-pages
    $ git merge --ff-only master
    $ git push origin master

###Correctly merging someone else's branch into master.

*We'll use @tmtowtdi as an example. :)*

    $ git checkout master
    $ git pull --ff-only origin master
    $ git remote add tmtowtdi http://github.com/tmtowtdi/Lacuna-Web-Client-jQuery.git
    $ git fetch tmtowtdi
    $ git checkout tmtowtdi/master
    $ git rebase master
    $ git checkout master
    $ git merge --ff-only tmtowtdi/master
    $ git push origin master

Grunt 'n' stuff Notes
=====================

The source urls for the libraries used in this project are. (Note, I plan to write a script that automatically updates all of these)

* jQuery - http://code.jquery.com/jquery-latest.js
* RequireJs - https://raw.github.com/jrburke/requirejs/master/require.js
* Zebra_Cookie - https://raw.github.com/stefangabos/Zebra_Cookie/master/public/javascript/zebra_cookie.src.js
