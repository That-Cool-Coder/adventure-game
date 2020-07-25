const directions = {
    right : 'right',
    left : 'left',
    up : 'up',
    down : 'down'
}

class Character {
    constructor(name, positionCm, sizeCm, moveSpeedCm, imageName, maxHealth, maxStamina,
        mainItem=null, secondaryItem=null, inventory=null) {
        this.name = name;
        this.positionCm = new p5.Vector(positionCm.x, positionCm.y);
        this.sizeCm = new p5.Vector(sizeCm.x, sizeCm.y);
        this.moveSpeedCm = moveSpeedCm; // not a vector
        this.imageName = imageName;

        this.maxStamina = maxStamina;
        this.stamina = maxStamina;

        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.inventory = inventory;

        this.direction = directions.right;

        this.equipMain(mainItem);
        this.equipSecondary(secondaryItem);
    }

    // Callables
    // ---------

    equipMain(item) {
        if (item !== null) this.mainItem = item;
    }

    equipSecondary(item) {
        if (item !== null) this.secondaryItem = item;
    }

    mine(blocks) {
        if (this.mainItem !== null) {
            var touchingBlocks = this.getBlocksBeingMined(blocks);
            var blockHitAmount = touchingBlocks.length
            for (var blockIdx = 0; blockIdx < touchingBlocks.length; blockIdx ++) {
                var block = touchingBlocks[blockIdx];
                if (! block.isExcavated) {
                    var didDestroyBlock = block.hit(this.mainItem, blockHitAmount);
                    if (didDestroyBlock) {
                        this.inventory.addItems(block.takeResources());
                    }
                }
            }
        }
    }

    // Main movement
    // -------------

    move(mapSections) {
        var blocks = this.getNearbyBlocks(mapSections);

        this.generalKeybinds(blocks);
        this.setDirection();

        var isUnderground = this.isHittingExcavatedBlock(blocks);
        if (isUnderground) this.undergroundMovement();
        else this.fall(blocks);

        this.collideBlocks(blocks);
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

        this.drawMainItem(translationCm);
    }

    drawMainItem(translationCm) {
        push();

        var mainItemAngle = this.getMainItemAngle();

        translate(cWidth / 2, cHeight / 2);
        scale(scaleMult);

        translate(translationCm);

        rotate(mainItemAngle);
        translate(0, -this.mainItem.imageSizeCm.y / 2);
        
        noStroke();
        image(images[this.mainItem.imageName], 0, 0,
            this.mainItem.imageSizeCm.x, this.mainItem.imageSizeCm.y);

        pop();
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

    getNearbyBlocks(mapSections) {
        // Create a list of the blocks in the map sections that the character is in...
        // ...so that the whole list of blocks doesn't have to be checked for collisions

        var blocks = [];
        mapSections.forEach(section => {
            if (section.containsPos(this.positionCm)) {
                blocks = blocks.concat(section.blocks);
            }
        });
        return blocks;
    }

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

            // this function is documented to work with vector inputs...
            // ...but I couldn't get that to work
            var collision = collideRectRect(
                this.positionCm.x, this.positionCm.y,
                this.sizeCm.x, this.sizeCm.y,
                block.positionCm.x, block.positionCm.y,
                block.sizeCm.x, block.sizeCm.y);

            if (collision) touchingBlocks.push(block);
        }
        return touchingBlocks;
    }

    getBlocksBeingMined(blocks) {
        var blocksBeingMined = [];

        var collisionBox = this.makeMainItemCollisionBox();

        for (var blockIdx = 0; blockIdx < blocks.length; blockIdx ++) {
            var block = blocks[blockIdx];
            if (! block.isExcavated) {
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
        return blocksBeingMined;
    }

    makeMainItemCollisionBox() {
        var mainItemCenterPos = this.getMainItemCenterPos();
        var mainItemSize = this.getMainItemHitBoxSize();

        var collisionBox = {
            positionCm : mainItemCenterPos,
            sizeCm : mainItemSize
        }
        return collisionBox;
    }

    getMainItemCenterPos() {
        var thisCenter = {
            x : this.positionCm.x + this.sizeCm.x / 2,
            y : this.positionCm.y + this.sizeCm.y / 2
        }

        switch (this.direction) {
            case directions.right:
                var positionCm = new p5.Vector(thisCenter.x, 
                    thisCenter.y - (this.mainItem.hitBoxSizeCm.y / 2));
                return positionCm;

            case directions.left:
                var positionCm = new p5.Vector(thisCenter.x - this.mainItem.hitBoxSizeCm.x, 
                    thisCenter.y - (this.mainItem.hitBoxSizeCm.y / 2));
                return positionCm;

            case directions.up:
                var positionCm = new p5.Vector(thisCenter.x - (this.mainItem.hitBoxSizeCm.y / 2),
                    thisCenter.y - this.mainItem.hitBoxSizeCm.x);
                return positionCm;
            
            case directions.down:
                var positionCm = new p5.Vector(thisCenter.x - (this.mainItem.hitBoxSizeCm.y / 2),
                    thisCenter.y);
                return positionCm;
            
            default:
                return new p5.Vector(0, 0);
        }
    }

    getMainItemHitBoxSize() {
        switch (this.direction) {
            case directions.right:
                var sizeCm = new p5.Vector(this.mainItem.hitBoxSizeCm.x, this.mainItem.hitBoxSizeCm.y);
                return sizeCm;

            case directions.left:
                var sizeCm = new p5.Vector(this.mainItem.hitBoxSizeCm.x, this.mainItem.hitBoxSizeCm.y)
                return sizeCm;
            
            case directions.up:
                var sizeCm = new p5.Vector(this.mainItem.hitBoxSizeCm.y, this.mainItem.hitBoxSizeCm.x);
                return sizeCm;
            
            case directions.down:
                var sizeCm = new p5.Vector(this.mainItem.hitBoxSizeCm.y, this.mainItem.hitBoxSizeCm.x);
                return sizeCm;
            
            default:
                return new p5.Vector(0, 0);
        }   
    }
    
    getMainItemAngle() {
        // return an angle in degrees for how to rotate the main item for drawing

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

        if (keyIsDown(90)) { // 'z'
            this.mine(blocks);
            // this.useMain(blocks);
        }

        else if (keyIsDown(88)) { // 'x'
            // this.useSecondary(blocks);
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

    // Misc
    // ----

    goFasterOnShift(multiplier) {
        // if shift is pressed, return multiplier
        // else return 1
        if (keyIsDown(SHIFT)) return multiplier;
        else return 1;
    }

    getCenterPos() {
        var halfSelfSize = new p5.Vector(this.sizeCm.x / 2, this.sizeCm.y / 2);
        var selfCenterPos = new p5.Vector(this.positionCm.x, this.positionCm.y);
        selfCenterPos.add(halfSelfSize);
        return selfCenterPos;
    }
}