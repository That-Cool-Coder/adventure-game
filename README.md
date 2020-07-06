# Adventure Game
## (This is a project for a class)

#### Basic game idea
You are a person on an island. You cannot jump, but you can mine and use that to go up hills 

#### Small but important things
Times:
Times in this game are measured from 0 to 1. 0 is midnight and 1 is just before midnight the following day. 0.25 is morning and 0.5 is midday

Images:
The images in this game are stored in an object (created in script). A block, tool, etc only knows the key of it's image in that object, as passing images doesn't work unless they are passed during or after draw. Each item looks up the key that it's given and draws that image.

#### Buttons
Buttons are from my guiElements 'package'. All button pressed are bound to mouseReleased(), so that a button gets clicked when the mouse is released, as is with html buttons. All widgets have mouseHovering() and isBeingClicked() methods. The difference is that isBeingClicked() checks the p5 variable mouseIsDown. When a button is bound to mouseReleased, it will be triggered at a point when mouseIsDown is NOT true. Therefore isBeingClicked() will return false when called from mouseReleased()