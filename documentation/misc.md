# Miscellanious Documentation

[Main Contents](/README.md)

## Contents of this file
- [Basic game info](#basic-game-info)
- [Times](#times)

#### Basic game info
The player is a person shipwrecked on an island. They can't jump but can mine and use that to go up hills. The game is currently called Adventure Game. That is a working title and will be revised.

#### Times
Times in this game are measured from 0 to 1. 0 is midnight and 1 is just before midnight the following day. 0.25 is dawn and 0.5 is midday

#### Images
The images in this game are stored in an object (created in script). A block, tool, etc only knows the key of it's image in that object, as passing images doesn't work unless they are passed during or after draw. Each item looks up the key that it's given and draws that image.

#### Positions/velocities and scaleMult
Positions/velocities are measured in cm (and are suffixed with cm) unless they refer directly to drawing a shape onto the canvas. This allows for easy resizing by simply multiplying a position in cm by scaleMult to get the position in px (although some extra panning may be done, for instance in the Block class where they move, not the character). The unit cm is totally arbitrary, but it is short and won't be mistaken for something else when suffixed onto a var name.

#### Buttons
Buttons are from my guiElements 'package'. All button pressed are bound to mouseReleased(), so that a button gets clicked when the mouse is released, as is with html buttons. All widgets have mouseHovering() and isBeingClicked() methods. The difference is that isBeingClicked() checks the p5 variable mouseIsDown. When a button is bound to mouseReleased, it will be triggered at a point when mouseIsDown is NOT true. Therefore isBeingClicked() will return false when called from mouseReleased(), which is not what you want.