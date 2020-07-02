const directions = {
    right : 'right',
    left : 'left',
    up : 'up',
    down : 'down'
}

class Character {
    constructor(name, positionCm, sizeCm, moveSpeedCm, imageName, tool) {
        this.name = name;
        this.positionCm = new p5.Vector(positionCm.x, positionCm.y);
        this.sizeCm = new p5.Vector(sizeCm.x, sizeCm.y);
        this.moveSpeedCm = moveSpeedCm; // not a vector
        this.imageName = imageName;

        this.direction = directions.right;
        this.equip(tool);
    }

    // Callables
    // ---------

    equip(tool) {
        this.crntTool = tool;
    }

    mine(blocks) {
        var touchingBlocks = this.getBlocksBeingMined(blocks);
        var blockHitAmount = touchingBlocks.length
        for (var blockIdx = 0; blockIdx < touchingBlocks.length; blockIdx ++) {
            var block = touchingBlocks[blockIdx];
            if (! block.isExcavated) {
                block.hit(this.crntTool, blockHitAmount);
            }
        }  
    }

    // Main movement
    // -------------

    move(blocks) {
        this.generalKeybinds(blocks);
        this.setDirection();

        var isUnderground = this.isHittingExcavatedBlock(blocks);
        if (isUnderground) this.undergroundMovement();
        else this.fall(blocks);

        this.collideBlocks(blocks);
    }

    // 2nd level movement
    // ------------------

    fall(blocks) {
        if (! this.isTouchingBlockBeneath(blocks)) {
            this.positionCm.y += 6;
        }
    }

    collideBlocks(blocks) {
        var touchingBlocks = this.getTouchingBlocks(blocks);
        for (var blockIdx = 0; blockIdx < touchingBlocks.length; blockIdx ++) {
            var block = touchingBlocks[blockIdx];
            // don't collide with blocks that are excavated
            if (! block.isExcavated) {
                this.moveAwayFromBlock(block);
            }
        }
    }

    moveAwayFromBlock(block) {
        var collisionSide = rectRectCollisionSide(block.positionCm, block.sizeCm,
            this.positionCm, this.sizeCm);
        
        if (collisionSide == 'left') {
            var leftSideOverlapSize = leftSideOverlap(this.positionCm, this.sizeCm,
                block.positionCm, block.sizeCm);
            this.positionCm.x += leftSideOverlapSize;
        }
        if (collisionSide == 'right') {
            var rightSideOverlapSize = rightSideOverlap(this.positionCm, this.sizeCm,
                block.positionCm, block.sizeCm);
            this.positionCm.x -= rightSideOverlapSize;
        }
        if (collisionSide == 'top') {
            var topSideOverlapSize = topSideOverlap(this.positionCm, this.sizeCm,
                block.positionCm, block.sizeCm);
            this.positionCm.y -= topSideOverlapSize;
        }
        if (collisionSide == 'bottom') {
            var bottomSideOverlapSize = bottomSideOverlap(this.positionCm, this.sizeCm,
                block.positionCm, block.sizeCm);
            this.positionCm.y += bottomSideOverlapSize;
        }
    }

    // Low level block stuff
    // ---------------------

    isTouchingBlockBeneath(blocks) {
        var isTouching = false;

        var touchingBlocks = this.getTouchingBlocks(blocks);
        for (var blockIdx = 0; blockIdx < touchingBlocks.length; blockIdx ++) {
            var block = touchingBlocks[blockIdx];
            // don't collide with blocks that are excavated
            
            var collisionSide = rectRectCollisionSide(block.positionCm, block.sizeCm,
                this.positionCm, this.sizeCm);
            if (collisionSide == 'bottom') {
                isTouching = true;
                break;
            }
        }
        return isTouching;
    }

    isHittingExcavatedBlock(blocks) {
        var touchingBlocks = this.getTouchingBlocks(blocks);
        var isHitting = false;
        for (var blockIdx = 0; blockIdx < touchingBlocks.length; blockIdx ++) {
            var block = touchingBlocks[blockIdx];
            if (block.isExcavated) {
                isHitting = true;
                break;
            }
        }
        return isHitting;
    }

    getTouchingBlocks(blocks) {
        var touchingBlocks = [];
        for (var blockIdx = 0; blockIdx < blocks.length; blockIdx ++) {
            var block = blocks[blockIdx];

            // only do the slower check if they are roughly colliding
            var roughlyColliding = roughRectRectCollide(this.positionCm, this.sizeCm, 
                block.positionCm, block.sizeCm);
            if (roughlyColliding) {

                // this function is documented to work with vector inputs...
                // ...but I couldn't get that to work
                var collision = collideRectRect(
                    this.positionCm.x, this.positionCm.y,
                    this.sizeCm.x, this.sizeCm.y,
                    block.positionCm.x, block.positionCm.y,
                    block.sizeCm.x, block.sizeCm.y);

                if (collision) touchingBlocks.push(block);
            }
        }
        return touchingBlocks;
    }

    getBlocksBeingMined(blocks) {
        var blocksBeingMined = [];

        var collisionBox = this.makeToolCollisionBox();

        for (var blockIdx = 0; blockIdx < blocks.length; blockIdx ++) {
            var block = blocks[blockIdx];
            if (! block.isExcavated) {

                // only do the slower check if they are roughly colliding
                var roughlyColliding = roughRectRectCollide(collisionBox.positionCm, this.sizeCm, 
                    block.positionCm, block.sizeCm);
                if (roughlyColliding) {
                    
                    // this function is documented to work with vector inputs...
                    // ...but I couldn't get that to work
                    var collision = collideRectRect(
                        collisionBox.positionCm.x, collisionBox.positionCm.y,
                        collisionBox.sizeCm.x, collisionBox.sizeCm.y,
                        
                        block.positionCm.x, block.positionCm.y,
                        block.sizeCm.x, block.sizeCm.y);

                    if (collision) blocksBeingMined.push(block);
                }
            }
        }
        return blocksBeingMined;
    }

    makeToolCollisionBox() {
        var toolCenterPos = this.getToolCenterPos();
        var toolSize = this.getToolSize();

        var collisionBox = {
            positionCm : toolCenterPos,
            sizeCm : toolSize
        }
        return collisionBox;
    }

    getToolCenterPos() {
        var thisCenter = {
            x : this.positionCm.x + this.sizeCm.x / 2,
            y : this.positionCm.y + this.sizeCm.y / 2
        }

        switch (this.direction) {
            case directions.right:
                var positionCm = new p5.Vector(thisCenter.x, 
                    thisCenter.y - (this.crntTool.hitBoxSizeCm.y / 2));
                return positionCm;

            case directions.left:
                var positionCm = new p5.Vector(thisCenter.x - this.crntTool.hitBoxSizeCm.x, 
                    thisCenter.y - (this.crntTool.hitBoxSizeCm.y / 2));
                return positionCm;

            case directions.up:
                var positionCm = new p5.Vector(thisCenter.x - (this.crntTool.hitBoxSizeCm.y / 2),
                    thisCenter.y - this.crntTool.hitBoxSizeCm.x);
                return positionCm;
            
            case directions.down:
                var positionCm = new p5.Vector(thisCenter.x - (this.crntTool.hitBoxSizeCm.y / 2),
                    thisCenter.y);
                return positionCm;
            
            default:
                return new p5.Vector(0, 0);
        }
    }

    getToolSize() {
        switch (this.direction) {
            case directions.right:
                var sizeCm = new p5.Vector(this.crntTool.hitBoxSizeCm.x, this.crntTool.hitBoxSizeCm.y);
                return sizeCm;

            case directions.left:
                var sizeCm = new p5.Vector(this.crntTool.hitBoxSizeCm.x, this.crntTool.hitBoxSizeCm.y)
                return sizeCm;
            
            case directions.up:
                var sizeCm = new p5.Vector(this.crntTool.hitBoxSizeCm.y, this.crntTool.hitBoxSizeCm.x);
                return sizeCm;
            
            case directions.down:
                var sizeCm = new p5.Vector(this.crntTool.hitBoxSizeCm.y, this.crntTool.hitBoxSizeCm.x);
                return sizeCm;
            
            default:
                return new p5.Vector(0, 0);
        }   
    }
    
    getToolAngle() {
        // return an angle in degrees for how to rotate the tool for drawing

        var angles = {};
        angles[directions.left] = 180;
        angles[directions.up] = 270;
        angles[directions.right] = 0;
        angles[directions.down] = 90;

        return angles[this.direction];
    }

    // Keybinds
    // --------

    undergroundMovement() {
        if (keyIsDown(UP_ARROW)) {
            this.positionCm.y -= this.moveSpeedCm * this.goFasterOnShift(2);
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.positionCm.y += this.moveSpeedCm * this.goFasterOnShift(2);
        }
    }

    generalKeybinds(blocks) {
        if (keyIsDown(LEFT_ARROW)) {
            this.positionCm.x -= this.moveSpeedCm * this.goFasterOnShift(2);
        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.positionCm.x += this.moveSpeedCm * this.goFasterOnShift(2);
        }

        if (keyIsDown(32)) {
            this.mine(blocks);
        }
    }

    setDirection() {
        var leftDown = keyIsDown(LEFT_ARROW);
        var rightDown = keyIsDown(RIGHT_ARROW);
        var upDown = keyIsDown(UP_ARROW);
        var downDown = keyIsDown(DOWN_ARROW);

        if (leftDown && ! rightDown) {
            this.direction = directions.left;
        }

        else if (rightDown && ! leftDown) {
            this.direction = directions.right;
        }

        if (! leftDown && ! rightDown) {
            if (upDown && ! downDown) {
                this.direction = directions.up;
            }
            else if (downDown && ! upDown) {
                this.direction = directions.down;
            }
        }
    }

    // Drawing
    // -------

    draw(translationCm=new p5.Vector(0, 0)) {
        push();

        translate(cWidth / 2, cHeight / 2);
        scale(scaleMult);

        translate(translationCm);

        noStroke();

        var imageToDraw = images[this.imageName];
        image(imageToDraw, -this.sizeCm.x / 2, -this.sizeCm.y / 2,
            this.sizeCm.x, this.sizeCm.y);
        pop();

        this.drawTool(translationCm);
    }

    drawTool(translationCm) {
        push();

        var toolAngle = this.getToolAngle();

        translate(cWidth / 2, cHeight / 2);
        scale(scaleMult);

        rotate(toolAngle);
        translate(0, -this.crntTool.imageSizeCm.y / 2);
        
        noStroke();
        image(images[this.crntTool.imageName], 0, 0,
            this.crntTool.imageSizeCm.x, this.crntTool.imageSizeCm.y);

        pop();
    }

    // Misc
    // ----

    goFasterOnShift(multiplier) {
        // if shift is pressed, return multiplier
        // else return 1
        if (keyIsDown(SHIFT)) return multiplier;
        else return 1;
    }
}