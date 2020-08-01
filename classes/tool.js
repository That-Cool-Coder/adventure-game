class Tool extends Item {
    // A generic tool (eg sword, pickaxe)

    constructor(name, weight, imageSizeCm, imageName,
        hitPower, hitBoxSizeCm, staminaToUse=0) {
        super(name, weight, imageSizeCm, imageName);
        this.hitPower = hitPower;
        this.hitBoxSizeCm = hitBoxSizeCm;
        this.staminaToUse = staminaToUse;

        addClassName(this, 'Tool');
    }
}