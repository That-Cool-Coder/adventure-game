const wildAnimalSpecies = [
    'boar'
];

class WildAnimal extends Character {
    constructor(name, positionCm, sizeCm, moveSpeedCm, imageNames,
        maxHealth, maxStamina, staminaRechargeRate, characterDetectDist,
        attackTool, alive) {

        super(name, positionCm, sizeCm, moveSpeedCm, imageNames, maxHealth, 0,
            maxStamina, staminaRechargeRate, alive, attackTool, null, null);

        this.attackTool = attackTool;
        this.characterDetectDist = characterDetectDist;

        addClassName(this, 'WildAnimal');
    }

    move(mapSections, characterToChase) {
        var blocks = this.getNearbyBlocks(mapSections);

        this.fall(blocks);
        if (this.nearCharacter(characterToChase)) {
            this.chaseCharacter(characterToChase);
        }
        if (this.touchingCharacter(characterToChase)) {
            this.moveAwayFromBlock(characterToChase);
        }

        if (this.attackToolTouchingCharacter(characterToChase)) {
            this.attackCharacter(characterToChase);
        }

        //this.avoidCliffs(blocks);
        this.collideBlocks(blocks);

        this.rechargeStamina();
    }

    draw(translationCm=new p5.Vector(0, 0)) {
        push();
            
        translate(cWidth / 2, cHeight / 2);
        scale(scaleMult);

        translate(this.positionCm.x, this.positionCm.y);
        translate(translationCm);

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
        if (this.stamina >= this.attackTool.staminaToUse) {
            character.hit(this.attackTool.hitPower);
            this.stamina -= this.attackTool.staminaToUse;
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