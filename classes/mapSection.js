// The seperate map sections (they overlap a bit for safety)
// These are used to optimise the collision detection algorithm

class MapSection {
    constructor(xRange, blocks) {
        this.xRange = xRange;
        this.blocks = blocks;
    }

    containsPos(position) {
        if (position.x > this.xRange.min && position.x < this.xRange.max) return true;
        else return false;
    }
}