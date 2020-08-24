class Rat extends WildAnimal {
    // This is a seperate constructor as I found it just wastes space const-ifying everything and 
    // having a generic WildAnimal class
    // It is just a handy way to define my constants
    // The boar class is no different from the wildAnimal class - 
    // you can use wildAnimal and just pass in the information below
    
    constructor(positionCm, gravityStrength) {
        var name = '';
        var sizeCm = new p5.Vector(blockSizeCm * 0.5, blockSizeCm * 0.2);
        var moveSpeedCm = 8;
        var imageNames = {
            left : 'ratLeft',
            right : 'ratRight',
            up : 'characterIdle',
            down : 'characterIdle'};
        var maxHealth = 15;
        var maxStamina = 10;
        var attackInterval = 50;
        var staminaRechargeRate = 0;
        var characterDetectDist = 350;
        var attackDamage = 1.8;
        var attackTool = new Tool('rat', 1, new p5.Vector(0, 0), 'grey20Pixel',
            attackDamage,
            new p5.Vector(sizeCm.x * 1.2, sizeCm.y * 1.2), 60);
        var soundNames = {
            onDie : 'boarDie',
            onDamageTaken : 'grunt'
        };

        super(name, positionCm, sizeCm, moveSpeedCm, 0, gravityStrength, imageNames,
            maxHealth, maxStamina, staminaRechargeRate, characterDetectDist,
            attackTool, true, wildAnimalOnDieFuncs.boar, soundNames);
        
        this.species = 'rat';

        addClassName(this, 'Rat');
    }
}