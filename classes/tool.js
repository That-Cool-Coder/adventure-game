class Tool extends Item {
    constructor(name, weight, imageSizeCm, imageName,
        hitPower, hitBoxSizeCm) {
        super(name, weight, imageSizeCm, imageName);
        this.hitPower = hitPower;
        this.hitBoxSizeCm = hitBoxSizeCm;
        this.classNames.push('Tool');
    }
}