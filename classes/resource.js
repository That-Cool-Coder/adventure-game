class Resource extends Item {

    constructor(name, weight, imageSizeCm, imageName) {
        super(name, weight, imageSizeCm, imageName);

        addClassName(this, 'Resource');
    }
}