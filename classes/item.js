const itemActions = {
    eat : 'eat',
    equip : 'equip',
    discard : 'discard'
};

class Item {
    constructor(name, weight, imageSizeCm, imageName) {
        this.name = name;
        this.weight = weight;
        this.imageSizeCm = imageSizeCm;
        this.imageName = imageName;
        this.actions = [itemActions.discard];

        addClassName(this, 'Item');
    }
}