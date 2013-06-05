Lacuna-Web-Client-jQuery
========================

jQuery Client for The Lacuna Expanse.


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
* PoliticsTraining
* Ravine
* Security
* Shipyard
    * @Vasari is working on this one.
    * So far, a very basic version of viewing the build queue is available.
* SpacePort
    * icydee plans to work on this, and on other bits of code that display lists of ships (starmaps etc.)
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

###Merging to gh-pages

*Starting from the master branch.*

    $ git checkout gh-pages
    $ git merge --ff-only master
    $ git push origin master

(icydee, I added the --ff-only, it's a good habit to get into)
