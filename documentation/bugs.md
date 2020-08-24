# Bugs

[Main Contents](/README.md)

## Contents of this file
- [Unfixed Bugs](#unfixed)
- [Fixed Bugs](#fixed)

## Unfixed
[Back to top](#contents-of-this-file)  
#### Collision detection is off when touching bedrock corner
When the character is touching the boundary between water and bedrock (on either side), they can go down into the bedrock. After they stop colliding with the excavated blocks above, they fall. rectRectCollisionSide() says that the bedrock is colliding with the character's right side when it's not. Honestly not that worth fixing. If you go to the bedrock, you might as well get sent to the 'underworld', anyway.

## Fixed
[Back to top](#contents-of-this-file)  
#### Going to the HTTP address doesn't work
When going to any of the http addresses, it gets stuck at 'loading assets'. It breaks at preload because p5.sound can't load sounds from the http. Only https works.  
SOLUTION - create a script that redirects to the https address is the protocol is http

#### Item actions sometimes wrong in the inventory menu
When an item with a large amount of actions is selected in the inventory menu and then one with less actions is selected, the actions from the first item don't go away.
SOLUTION - the action button remover forgot to remove all actions - it only removes the actions of the new item - just remove all actions at the start