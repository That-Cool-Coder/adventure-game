class Tool extends Item {
    // A generic tool (eg sword, pickaxe)

    constructor(name, weight, imageSizeCm, imageName,
        hitPower, hitBoxSizeCm, timeBetweenUse=0) {
        super(name, weight, imageSizeCm, imageName);
        this.hitPower = hitPower;
        this.hitBoxSizeCm = hitBoxSizeCm;
        this.timeBetweenUse = timeBetweenUse;
        this.nextUseTime = 0; // the time at which it can be used again

        this.actions.push(itemActions.equip);

        addClassName(this, 'Tool');
    }
}