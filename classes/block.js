class Block {
    constructor(topLeftPosCm, sizeCm, normImageName, excvImageName, soundNames={},
        resourceContent=[], strength=15, strengthRechargeRate=0, maxStrength=strength,
        isIndestructible=false, isExcavated=false) {
        
        this.positionCm = new p5.Vector(topLeftPosCm.x, topLeftPosCm.y);
        this.sizeCm = new p5.Vector(sizeCm.x, sizeCm.y);
        this.strength = strength;
        this.maxStrength = maxStrength;
        this.strengthRechargeRate = strengthRechargeRate;

        this.resourceContent = resourceContent;

        this.normImageName = normImageName;
        this.excvImageName = excvImageName;

        this.isExcavated = isExcavated;
        this.isIndestructible = isIndestructible;

        // Sound names currently supported:
        // onHit, onExcavate
        this.soundNames = soundNames;

        addClassName(this, 'Block');
    }

    draw(viewPanCm) {
        if (! this.willBeOffscreen(viewPanCm)) {
            push();
            
            translate(cWidth / 2, cHeight / 2);
            scale(scaleMult);

            translate(this.positionCm.x, this.positionCm.y);
            translate(viewPanCm.x, viewPanCm.y);

            if (this.isExcavated) {
                var imageToDraw = images[this.excvImageName];
            }
            else {
                var imageToDraw = images[this.normImageName]
            }
            noStroke();

            image(imageToDraw, 0, 0, this.sizeCm.x, this.sizeCm.y);
            // If it needs to look crumbling, translate then draw a second image
            // Don't just draw one image or gaps appear
            if (this.strength > 0 && this.strength != this.maxStrength && ! this.isExcavated) {
                this.translateForWeakeningEffect();
                image(imageToDraw, 0, 0, this.sizeCm.x, this.sizeCm.y);
            }

            if (! this.isExcavated && this.resourceContent.length > 0) {
                this.drawResourceContent();
            }

            pop();
        }
    }

    hit(tool, totalBlocksHit=1) {
        if (! this.isExcavated) {
            // if multiple blocks are being hit, deal a smaller amount of damage to each
            if (! this.isIndestructible) {
                this.strength -= tool.hitPower / totalBlocksHit;
            }

            var wasExcavatedNow = false;

            if (this.strength <= 0 && ! this.isIndestructible) {
                this.excavate();
                wasExcavatedNow = true;
            }
            else {
                if (this.soundNames.onHit !== undefined) {
                    sounds[this.soundNames.onHit].play();
                }
            }

            return wasExcavatedNow;
        }
    }

    excavate() {
        this.strength = 0;
        this.isExcavated = true;
        if (this.soundNames.onExcavate !== undefined) {
            sounds[this.soundNames.onExcavate].play();
        }
    }

    takeResources() {
        var resources = this.resourceContent;
        this.resourceContent = [];
        return resources;
    }

    translateForWeakeningEffect() {
        var maxMovement = 3.5;
        
        var damageMult = 1 - (this.strength / this.maxStrength);
        var movement = damageMult * maxMovement;

        var directionNum = randint(0, 4);

        // left
        if (directionNum == 0) {
            var posX = -movement;
            var posY = 0;
        }
        // up
        else if (directionNum == 1) {
            var posX = 0;
            var posY = -movement;
        }
        // right
        else if (directionNum == 2) {
            var posX = movement;
            var posY = 0;
        }
        // down
        else {
            var posX = 0;
            var posY = movement;
        }

        translate(posX, posY);
    }

    drawResourceContent() {
        noStroke();

        var marginX = (this.sizeCm.x - imageSizesCm.resourceImage.x) / 2;
        var marginY = (this.sizeCm.y - imageSizesCm.resourceImage.y) / 2;

        var imageToDraw = images[this.resourceContent[0].imageName];
        image(imageToDraw, marginX, marginY,
            imageSizesCm.resourceImage.x, imageSizesCm.resourceImage.y);
    }

    willBeOffscreen(viewPanCm) {
        /*
        This is the original code of the below paragraph, which has been simplified to speed it up
        
        var sizeX = this.sizeCm.x * scaleMult;
        var xPosPx = (scaleMult * (viewPanCm.x + this.positionCm.x)) + cWidth / 2;
        var xIsOff = (xPosPx < -sizeX || xPosPx > cWidth);*/

        var xPosPx = (scaleMult * (viewPanCm.x + this.positionCm.x)) + cWidth / 2;
        var xIsOff = xPosPx < -(this.sizeCm.x * scaleMult) || xPosPx > cWidth;
        
        if (! xIsOff) {
            var sizeY = this.sizeCm.y * scaleMult;
            var yPosPx = (scaleMult * (viewPanCm.y + this.positionCm.y)) + cHeight / 2;
            var yIsOff = (yPosPx < -sizeY || yPosPx > cHeight);
            return yIsOff;
        }
        else {
            return xIsOff;
        }
    }

    housekeeping() {
        if (this.strength < this.maxStrength) this.strength += this.strengthRechargeRate;
        else this.strength = this.maxStrength;
    }
}