function distSq(p1, p2) {
    return (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
}

function roughRectRectCollide(rect1Corner, rect1Size, rect2Corner, rect2Size) {
    // returns true if the rectangles may be colliding
    // returns false if there is no way that they will be colliding

    var rect1Largest = Math.max(rect1Size.x, rect1Size.y);
    var rect2Largest = Math.max(rect2Size.x, rect2Size.y);

    var rect1MiddleX = rect1Corner.x + rect1Size.x;
    var rect1MiddleY = rect1Corner.y + rect1Size.y;

    var rect2MiddleX = rect2Corner.x + rect2Size.x;
    var rect2MiddleY = rect2Corner.y + rect2Size.y;

    var distSq = (rect2MiddleX - rect1MiddleX) ** 2 + (rect2MiddleY - rect1MiddleY) ** 2;

    if (distSq < (rect1Largest + rect2Largest) ** 2) {
        return true;
    }
    else {
        return false;
    }
}

function rectRectCollisionSide(rect1Corner, rect1Size, rect2Corner, rect2Size) {
    // Find which side the rectangles are colliding on
    // (relative to rect 1)
    
    var dx = (rect1Corner.x + rect1Size.x / 2) - (rect2Corner.x + rect2Size.x / 2);
    var dy = (rect1Corner.y + rect1Size.y / 2) - (rect2Corner.y + rect2Size.y / 2);
    var width = (rect1Size.x + rect2Size.x) / 2;
    var height = (rect1Size.y + rect2Size.y) / 2;
    var crossWidth = width * dy;
    var crossHeight = height * dx;
    var collision = 'none';

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        }
        else {
            collision = (crossWidth > (-crossHeight)) ? 'right' : 'top';
        }
    }
    return collision;
}

function leftSideOverlap(rect1Corner, rect1Size, rect2Corner, rect2Size) {
    // returns amount of overlap of the left side of rect 1 and the right side of rect 2
    // assumes rects are already colliding
    
    var rect1LeftSide = rect1Corner.x;
    var rect2RightSide = rect2Corner.x + rect2Size.x;

    return rect2RightSide - rect1LeftSide;
}

function rightSideOverlap(rect1Corner, rect1Size, rect2Corner, rect2Size) {
    // returns amount of overlap of the right side of rect 1 and the left side of rect 2
    // assumes rects are already colliding
    
    var rect1RightSide = rect1Corner.x + rect1Size.x;
    var rect2LeftSide = rect2Corner.x;

    return rect1RightSide - rect2LeftSide;
}

function topSideOverlap(rect1Corner, rect1Size, rect2Corner, rect2Size) {
    // returns amount of overlap of the top side of rect 1 and the bottom side of rect 2
    // assumes rects are already colliding
    
    var rect1TopSide = rect1Corner.y;
    var rect2BottomSide = rect2Corner.y + rect2Size.y;

    return rect1TopSide - rect2BottomSide;
}

function bottomSideOverlap(rect1Corner, rect1Size, rect2Corner, rect2Size) {
    // returns amount of overlap of the bottom side of rect 1 and the top side of rect 2
    // assumes rects are already colliding
    
    var rect1BottomSide = rect1Corner.y + rect1Size.y;
    var rect2TopSide = rect2Corner.y;

    return rect2TopSide - rect1BottomSide;
}