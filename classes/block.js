class Block {
    constructor(topLeftPosCm, sizeCm, normImageName, excvImageName, strength=15,
        maxStrength=strength, isExcavated=false) {
        this.positionCm = new p5.Vector(topLeftPosCm.x, topLeftPosCm.y);
        this.sizeCm = new p5.Vector(sizeCm.x, sizeCm.y);
        this.strength = strength;
        this.maxStrength = maxStrength;

        this.normImageName = normImageName;
        this.excvImageName = excvImageName;
        this.isExcavated = isExcavated;

        this.hitLastFrame = false;
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

            if (this.strength > 0 && this.strength != this.maxStrength) {
                this.drawWeakeningShape();
            }

            pop();
        }
    }

    hit(tool, totalBlocksHit=1) {
        // if multiple blocks are being hit, deal a smaller amount of damage to each
        this.strength -= tool.hitPower / totalBlocksHit;

        if (this.strength <= 0) {
            this.strength = 0;
            this.isExcavated = true;
        }
        else {
            this.hitLastFrame = true;
        }
    }

    drawWeakeningShape() {
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

        noStroke();
        var imageToDraw = images[this.normImageName];
        image(imageToDraw, posX, posY, this.sizeCm.x + posX, this.sizeCm.y + posY);
    }

    willBeOffscreen(viewPanCm) {
        var sizeX = this.sizeCm.x * scaleMult;
        var xPosPx = (scaleMult * (viewPanCm.x + this.positionCm.x)) + cWidth / 2;
        var xIsOff = (xPosPx < -sizeX || xPosPx > cWidth);
        
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
        if (! this.hitLastFrame) {
            this.strength = this.maxStrength;
        }
        this.hitLastFrame = false;
    }
}