# Classes in Adventure Game

[Main Contents](/README.md)

## Contents of this file
- [Inventory system (Inventory, Tool and Item classes)](#inventory-system-inventory-tool-and-item-classes)
- [Mining (Tool, Block and Resource classes)](#mining-tool-block-and-resource-classes)
- [Specifics of the Resource class](#specifics-of-the-resource-class)
- [Map sections](#map-sections)
- [WildAnimal class](#wildanimal-class)
- [Species of WildAnimal](#species-of-wildanimal)


#### Inventory system (Inventory, Tool and Item classes)
[Back to top](#contents-of-this-file)  
In an inventory, the maximum amount of items is measured by weight. Any number of sufficiently light items can be carrier. The basic item is from the Item class. It has imagesize/name, weight and item name. Built upon that class are Tool (soon to be ShortRangeTool or something), which is for things like hammers, pickaxes and shovels. There will also be a class called LongRangeTool and this will be things that shoot things, like a bow and arrow. The Inventory class has a prototype and therefore needs to be reconstructed when loading from JSON. The items within an Inventory are all built upon the Item class and have no prototype, simplifying loading from JSON.

#### Mining (Tool, Block and Resource classes)
[Back to top](#contents-of-this-file)  
Mining can be done by an object of the Tool class (soon to be replaced with ShortRangeTool and LongRangeTool). A Tool has a hitPower, which is an arbitrary value saying how much damage it does on impacting a block. The objects of the Block class have a size, a position, strength (how much more damage can be taken), maxStrength (how much strength there was at the start, used for calculating size of shaking effects), isExcavated (whether or not the block has been excavated), image data and resourceContent. resourceContent is a list of Resource objects. When a block is mined (through the hit() method) it returns a boolean about whether it was just mined on that hit. If it was just mined, the object calling hit() should call takeResources() and place the returned list of resources into an inventory object.

#### Specifics of the Resource class
[Back to top](#contents-of-this-file)  
Objects of the Resource class are only made once. They are stored in the resources object/dictionary and there is only one of each type of resource. For example, resources.ironOre would be an object of the Resource class with the properties of iron ore. An Inventory object would contain a reference to this object. This might be an example inventory's items:
\[the object referenced by resources.wood, the object referenced by resources.ironOre, the same wood object, the same ironOre object]

#### Map sections
[Back to top](#contents-of-this-file)  
To avoid checking all of the blocks for collisions, the blocks are sorted into map sections depending on where they lie. Each map section contains the x range that it encompasses and a list of blocks that are in it. The map sections overlap by 100 px and are 600 px wide (including the overlap). The map section list is passed to a Character in Character.move() and the character figures out which section it is in and then gets the blocks of that section and passes them to the other methods.

#### WildAnimal class
[Back to top](#contents-of-this-file)  
The WildAnimal class is a class for a generic above-ground wild animal that extends character. This extension allows reuse of the block collision, health/stamina & tool handling code. Wild animals go towards the character if the character's close enough (within this.characterDetectRange) and have a tool which they use to attack the character. The tool means that the character is only injured if they are touching the tool (which probably is located so it protrudes from the head of the animal), not any part of the animal. This makes combat more realistic. Each type (aka species) of wild animal has it's own class that has the information hard-coded into the constructor to avoid a long boring config file full of consts prefixed with boar- or bird-. I tried to put the information as class-level declarations but it messed with the underlying character class.

#### Species of WildAnimal
[Back to top](#contents-of-this-file)  
- Boar. Large animal (1.2 blocks * 1.2 blocks big) that attacks by hitting you with its head. Does a reasonable amount of damage and has a good amount of health. When multiple boars 'gang up' it can be deadly. No special features.