class WildAnimal extends Character {
    constructor(name, positionCm, sizeCm, moveSpeedCm, imageNames,
        maxHealth, maxStamina, staminaRechargeRate, characterDetectDist,
        attackDamage, staminaToAttack) {

        super(name, positionCm, sizeCm, moveSpeedCm, imageNames, maxHealth, maxStamina, null, null, null);

        this.attackDamage = attackDamage;
        this.characterDetectDist = characterDetectDist;
        this.staminaRechargeRate = staminaRechargeRate;
        this.staminaToAttack = staminaToAttack;
    }

    move(mapSections, characterToChase) {
        var blocks = this.getNearbyBlocks(mapSections);

        this.fall(blocks);
        if (this.nearCharacter(characterToChase)) {
            this.chaseCharacter(characterToChase);
        }
        if (this.touchingCharacter(characterToChase)) {
            this.moveAwayFromBlock(characterToChase);
            this.attackCharacter(characterToChase)
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
        console.log(images)
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
        }
        this.positionCm.x += speed;
    }

    attackCharacter(character) {
        // Do damage to the character (assuming that the character is being touched)
        if (this.stamina >= this.staminaToAttack) {
            character.health -= this.attackDamage;
            this.stamina -= this.staminaToAttack;
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

    touchingCharacter(character) {
        // Return a boolean stating if the animal is touching the character

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

    rechargeStamina() {
        this.stamina += this.staminaRechargeRate;
        if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
    }
}