// The seperate map sections (they overlap a bit for safety)
// These are used to optimise the collision detection algorithm

class MapSection {
    constructor(xRange, blocks) {
        this.xRange = xRange;
        this.blocks = blocks;

        addClassName(this, 'MapSection');
    }

    containsPos(position) {
        if (position.x > this.xRange.min && position.x < this.xRange.max) return true;
        else return false;
    }

    overlapsArea(topLeftPos, bottomRightPos) {
        if (topLeftPos.x < this.xRange.min && this.xRange.min < bottomRightPos.x ||
            topLeftPos.x < this.xRange.max && this.xRange.max < bottomRightPos.x ||
            this.xRange.min < topLeftPos.x && topLeftPos.x < this.xRange.max ||
            this.xRange.min < topLeftPos.x && bottomRightPos.x < this.xRange.max) {
            return true;
        }
        else return false;
    }
}