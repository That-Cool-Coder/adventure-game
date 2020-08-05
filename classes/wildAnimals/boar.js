class Boar extends WildAnimal {
    // This is a seperate constructor as I found it just wastes space const-ifying everything and 
    // having a generic WildAnimal class
    constructor(positionCm) {
        var name = '';
        var sizeCm = new p5.Vector(blockSizeCm * 1.2, blockSizeCm * 1.2);
        var moveSpeedCm = 5;
        var imageNames = {
            left : 'boarLeft',
            right : 'boarRight',
            up : 'characterIdle',
            down : 'characterIdle'};
        var maxHealth = 30;
        var maxStamina = 10;
        var staminaToAttack = 10;
        var staminaRechargeRate = 0.2;
        var characterDetectDist = 250;
        var attackDamage = 8;
        var attackTool = new Tool('dat boar', 1, new p5.Vector(0, 0), 'grey20Pixel',
            attackDamage,
            new p5.Vector(sizeCm.x / 1.9, sizeCm.y / 2),
            staminaToAttack);

        super(name, positionCm, sizeCm, moveSpeedCm, imageNames,
            maxHealth, maxStamina, staminaRechargeRate, characterDetectDist,
            attackTool, true);
        
        this.species = 'boar';

        addClassName(this, 'Boar');
    }
}