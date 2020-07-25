class Inventory {
    constructor(maxWeight, maxItemAmount, items=[]) {
        this.maxWeight = maxWeight;
        this.maxItemAmount = maxItemAmount;
        this.items = items;
    }

    addItem(item) {
        this.items.push(item);
    }

    addItems(itemList) {
        this.items.push(...itemList);
    }

    removeItem(itemOrIdx) {
        // If an index was given, remove the item at that idx
        if (typeof itemOrIdx == 'number') {
            return this.items.splice(itemOrIdx, 1);
        }
        // Else find the idx of the item to remove and remove that item
        else {
            return this.items.splice(this.items.indexOf(itemOrIdx));
        }
    }
}