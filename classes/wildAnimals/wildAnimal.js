const wildAnimalSpecies = [
    'boar',
    'rat'
];

class WildAnimal extends Character {
    constructor(name, positionCm, sizeCm,
        moveSpeedCm, jumpStrength, gravityStrength, collidesWithCharacter,
        imageNames, maxHealth, maxStamina, staminaRechargeRate, 
        characterDetectDist, attackTool, alive, onDieFunc, soundNames) {

        super(name, positionCm, sizeCm, moveSpeedCm, jumpStrength, gravityStrength, imageNames, maxHealth, 0,
            maxStamina, staminaRechargeRate, alive, onDieFunc, attackTool, null, null, soundNames);

        this.collidesWithCharacter = collidesWithCharacter;
        this.characterDetectDist = characterDetectDist;

        addClassName(this, 'WildAnimal');
    }

    move(mapSections, characterToChase) {
        var blocks = this.getNearbyBlocks(mapSections);

        this.fall(blocks);

        // Chase character
        if (this.nearCharacter(characterToChase)) {
            this.chaseCharacter(characterToChase);
        }

        // Collide with character
        if (this.collidesWithCharacter) {
            if (this.touchingCharacter(characterToChase)) {
                // Use block collision code to see if touching the character...
                // ...because the character has the same attributes as a block
                this.moveAwayFromBlock(characterToChase);
            }
        }

        // Attack character
        if (this.attackToolTouchingCharacter(characterToChase)) {
            this.attackCharacter(characterToChase);
        }
        
        // Do velocity
        this.positionCm.x += this.velocityCm.x;
        this.positionCm.y += this.velocityCm.y;

        //this.avoidCliffs(blocks);
        this.collideBlocks(blocks);

        this.rechargeStamina();
    }

    draw(translationCm=new p5.Vector(0, 0)) {
        push();
            
        translate(cWidth / 2, cHeight / 2);
        scale(scaleMult);

        translate(this.positionCm.x, this.positionCm.y);
        translate(translationCm.x, translationCm.y);

        noStroke();

        var imageToDraw = images[this.imageNames[this.direction]];
        image(imageToDraw, 0, 0, this.sizeCm.x, this.sizeCm.y);
        pop();
    }

    chaseCharacter(character) {
        // Go towards the character horizontally

        var xDistToCharacter = character.positionCm.x - this.positionCm.x
        
        // if character is to the right of me
        if (xDistToCharacter > this.moveSpeedCm) {
            var speed = this.moveSpeedCm;
            this.direction = directions.right;
        }
        // If character is to the left of me
        else if (xDistToCharacter < -this.moveSpeedCm) {
            var speed = -this.moveSpeedCm;
            this.direction = directions.left;
        }
        // If the character is less than one step away
        else {
            var speed = xDistToCharacter;
            if (speed < 0) this.direction = directions.left;
            else if (speed > 0) this.direction = directions.right;
        }
        this.positionCm.x += speed;
    }

    attackCharacter(character) {
        // Do damage to the character (assuming that the character is being touched)
        if (this.canUseItemYet(this.mainItem)) {
            character.hit(this.mainItem.hitPower);
            this.setItemNextUse(this.mainItem);
        }
    }

    nearCharacter(character) {
        // If the distance between the center point of this and the center pos...
        // ...of the character is less than the detection distance (using squares for efficiency),
        // then return true
        
        if (distSq(this.getCenterPos(), character.getCenterPos()) < this.characterDetectDist ** 2) {
            return true;
        }
        else return false;
    }

    attackToolTouchingCharacter(character) {
        var collisionBox = this.makeMainItemCollisionBox();

        // This works because collision boxes have the same attributes as characters
        var collision = character.touchingCharacter(collisionBox);
        return collision;
    }
}