class Item {
    constructor(name, weight, imageSizeCm, imageName) {
        this.name = name;
        this.weight = weight;
        this.imageSizeCm = imageSizeCm;
        this.imageName = imageName;

        addClassName(this, 'Item');
    }
}