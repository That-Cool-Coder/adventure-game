class Tool extends Item {
    constructor(name, weight, imageSizeCm, imageName,
        hitPower, hitBoxSizeCm, staminaToUse=0) {
        super(name, weight, imageSizeCm, imageName);
        this.hitPower = hitPower;
        this.hitBoxSizeCm = hitBoxSizeCm;
        this.staminaToUse = staminaToUse;
        this.classNames.push('Tool');
    }
}