# Bugs

[Main Contents](/README.md)

## Contents of this file
- [Unfixed Bugs](#unfixed)
- [Fixed Bugs](#fixed)

## Unfixed
[Back to top](#contents-of-this-file)  
#### Collision detection is off when touching bedrock corner
When the character is touching the boundary between water and bedrock (on either side), they can go down into the bedrock. After they stop colliding with the excavated blocks above, they fall. rectRectCollisionSide() says that the bedrock is colliding with the character's right side when it's not.

## Fixed
[Back to top](#contents-of-this-file)  