const directions = {
    right : 'right',
    left : 'left',
    up : 'up',
    down : 'down'
}

class Character {
    constructor(name, positionCm, sizeCm, moveSpeedCm, jumpStrength, gravityStrength, imageNames,
        maxHealth, healRate, maxStamina, staminaRechargeRate, alive=true, onDieFunc=()=>{},
        mainItem=null, secondaryItem=null, inventory=null, soundNames={}) {

        this.name = name;
        this.positionCm = new p5.Vector(positionCm.x, positionCm.y);
        this.velocityCm = new p5.Vector(0, 0);
        this.sizeCm = new p5.Vector(sizeCm.x, sizeCm.y);
        this.moveSpeedCm = moveSpeedCm; // not a vector
        this.jumpStrength = jumpStrength;
        this.gravityStrength = gravityStrength;
        this.imageNames = imageNames;

        this.alive = alive;
        this.onDieFunc = onDieFunc;

        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.healRate = healRate;

        this.maxStamina = maxStamina;
        this.stamina = maxStamina;
        this.staminaRechargeRate = staminaRechargeRate;

        this.inventory = inventory;

        // Currently accepted sound names types:
        // onDamageTaken, onDie
        this.soundNames = soundNames;

        this.direction = directions.right;

        this.equipMain(mainItem);
        this.equipSecondary(secondaryItem);

        addClassName(this, 'Character');
    }

    // Callables
    // ---------

    equipMain(item) {
        this.mainItem = item;
        this.setItemNextUse(this.mainItem);
    }

    equipSecondary(item) {
        this.secondaryItem = item;
        this.setItemNextUse(this.secondaryItem);
    }

    useMain(blocks, wildAnimals) {
        if (this.mainItem !== null) {
            if (this.canUseItemYet(this.mainItem)) {
                this.mine(blocks);
                this.attackWildAnimals(wildAnimals);
                this.setItemNextUse(this.mainItem);
            }
        }
    }

    useSecondary() {

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

    jump() {
        this.velocityCm.y = -this.jumpStrength;
    }

    hit(damage, totalThingsHit=1) {
        // if multiple things are being hit, deal a smaller amount of damage to each
        this.health -= damage / totalThingsHit;

        var wasKilledNow = false;

        if (this.health <= 0 /*&& this.alive*/) {
            this.die();
        }

        else {
            if (this.soundNames.onDamageTaken !== undefined) {
                sounds[this.soundNames.onDamageTaken].play();
            }
        }

        return wasKilledNow;
    }

    die() {
        this.health = 0;
        this.stamina = 0;
        this.alive = false;
        if (this.soundNames.onDie !== undefined) {
            sounds[this.soundNames.onDie].play();
        }
        this.onDieFunc();
    }

    // Main movement
    // -------------

    move(mapSections, wildAnimals) {
        var blocks = this.getNearbyBlocks(mapSections);

        this.generalKeybinds(blocks, wildAnimals);
        this.setDirection();

        var isUnderground = this.isHittingExcavatedBlock(blocks);
        if (isUnderground) this.undergroundMovement();
        this.fall(blocks);

        this.positionCm.x += this.velocityCm.x;
        this.positionCm.y += this.velocityCm.y;

        this.heal();
        this.rechargeStamina();

        this.collideBlocks(blocks);
        this.collideWildAnimals(wildAnimals);
    }

    // Drawing
    // -------

    draw(translationCm=new p5.Vector(0, 0)) {
        push();

        translate(cWidth / 2, cHeight / 2);
        scale(scaleMult);

        translate(translationCm);

        noStroke();

        var imageToDraw = images[this.imageNames[this.direction]];
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

    // Interactions with other objects
    // -------------------------------

    attackWildAnimals(wildAnimals) {
        var collisionBox = this.makeMainItemCollisionBox();

        // Find the animals being hit
        var animalsBeingHit = [];
        wildAnimals.forEach(animal => {
            // This works because tool hit boxes have the same attributes as characters
            var collision = animal.touchingCharacter(collisionBox);

            if (collision) animalsBeingHit.push(animal);
        });

        // Deal damage to the animals
        animalsBeingHit.forEach(animal => {
            animal.hit(this.mainItem.hitPower, animalsBeingHit.length);
        });
    }

    touchingCharacter(character) {
        // Return a boolean stating if the this is touching the character

        // this function is documented to work with vector inputs...
        // ...but I couldn't get that to work
        var collision = collideRectRect(
            this.positionCm.x, this.positionCm.y,
            this.sizeCm.x, this.sizeCm.y,
            character.positionCm.x, character.positionCm.y,
            character.sizeCm.x, character.sizeCm.y);
        
        if (collision) return true;
        else return false;
    }

    collideWildAnimals(wildAnimals) {
        wildAnimals.forEach(animal => {
            if (this.touchingCharacter(animal)) {
                this.moveAwayFromBlock(animal);
            }
        })
    }

    // 2nd level movement
    // ------------------

    fall(blocks) {
        if (! this.isTouchingBlockBeneath(blocks)) {
            this.velocityCm.y += this.gravityStrength;
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
            this.velocityCm.y = 0;
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

        this.velocityCm.y = 0;
    }

    generalKeybinds(blocks, wildAnimals) {
        if (keyIsDown(LEFT_ARROW)) {
            this.positionCm.x -= this.moveSpeedCm * this.goFasterOnShift(2);
        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.positionCm.x += this.moveSpeedCm * this.goFasterOnShift(2);
        }

        if (keyIsDown(UP_ARROW)) {
            if (this.isTouchingBlockBeneath(blocks) ||
                this.isHittingExcavatedBlock(blocks) ||
                this.isTouchingBlockBeneath(wildAnimals)) {

                this.positionCm.y -= 2;
                this.jump();
            }
        }

        if (keyIsDown(90)) { // 'z'
            this.useMain(blocks, wildAnimals);
        }

        else if (keyIsDown(88)) { // 'x'
            this.useSecondary(blocks);
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

    heal() {
        if (this.stamina > 0 && this.health < this.maxHealth / 2) {
            this.health += this.healRate;
            if (this.health > this.maxHealth) this.health = this.maxHealth;
        }
    } 

    rechargeStamina() {
        this.stamina += this.staminaRechargeRate;
        if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
    }

    setItemNextUse(item) {
        if (item !== null) {
            item.nextUseTime = frameCount + item.timeBetweenUse;
        }
    }

    canUseItemYet(item) {
        if (item !== null) {
            return frameCount >= item.nextUseTime;
        }
    }
}