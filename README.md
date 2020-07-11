# Adventure Game
## (This is a project for a class)

#### Basic game idea
You are a person on an island. You cannot jump, but you can mine and use that to go up hills 

#### Small but important things
Times:
Times in this game are measured from 0 to 1. 0 is midnight and 1 is just before midnight the following day. 0.25 is dawn and 0.5 is midday

Images:
The images in this game are stored in an object (created in script). A block, tool, etc only knows the key of it's image in that object, as passing images doesn't work unless they are passed during or after draw. Each item looks up the key that it's given and draws that image.

Positions/velocities and scaleMult:
Positions/velocities are measured in cm (and are suffixed with cm) unless they refer directly to drawing a shape onto the canvas. This allows for easy resizing by simply multiplying a position in cm by scaleMult to get the position in px (although some extra panning may be done, for instance in the Block class where they move, not the character). The unit cm is totally arbitrary, but it is short and won't be mistaken for something else when suffixed onto a var name.

#### Buttons
Buttons are from my guiElements 'package'. All button pressed are bound to mouseReleased(), so that a button gets clicked when the mouse is released, as is with html buttons. All widgets have mouseHovering() and isBeingClicked() methods. The difference is that isBeingClicked() checks the p5 variable mouseIsDown. When a button is bound to mouseReleased, it will be triggered at a point when mouseIsDown is NOT true. Therefore isBeingClicked() will return false when called from mouseReleased(), which is not what you want.

#### Inventory system (Inventory, Tool and Item classes)
In an inventory, the maximum amount of items is measured by weight. Any number of sufficiently light items can be carrier. The basic item is from the Item class. It has imagesize/name, weight and item name. Built upon that class are Tool (soon to be ShortRangeTool or something), which is for things like hammers, pickaxes and shovels. There will also be a class called LongRangeTool and this will be things that shoot things, like a bow and arrow. The Inventory class has a prototype and therefore needs to be reconstructed when loading from JSON. The items within an Inventory are all built upon the Item class and have no prototype, simplifying loading from JSON.

#### Mining (Tool, Block and Resource classes)
Mining can be done by an object of the Tool class (soon to be replaced with ShortRangeTool and LongRangeTool). A Tool has a hitPower, which is an arbitrary value saying how much damage it does on impacting a block. The objects of the Block class have a size, a position, strength (how much more damage can be taken), maxStrength (how much strength there was at the start, used for calculating size of shaking effects), isExcavated (whether or not the block has been excavated), image data and resourceContent. resourceContent is a list of Resource objects. When a block is mined (through the hit() method) it returns a boolean about whether it was just mined on that hit. If it was just mined, the object calling hit() should call takeResources() and place the returned list of resources into an inventory object.

#### More stuff about the Resource class 
Objects of the Resource class are only made once. They are stored in the resources object/dictionary and there is only one of each type of resource. For example, resources.ironOre would be an object of the Resource class with the properties of iron ore. An Inventory object would contain a reference to this object. This might be an example inventory's items:
\[the object referenced by resources.wood, the object referenced by resources.ironOre, the same wood object, the same ironOre object]