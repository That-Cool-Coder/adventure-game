class Resource extends Item {

    constructor(name, weight, imageSizeCm, imageName) {
        super(name, weight, imageSizeCm, imageName);

        this.classNames.push('Resource');
    }
}