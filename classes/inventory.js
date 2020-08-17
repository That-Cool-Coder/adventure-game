class Inventory {
    constructor(maxWeight, maxItemAmount, items=[]) {
        this.maxWeight = maxWeight;
        this.maxItemAmount = maxItemAmount;
        this.items = items;

        addClassName(this, 'Inventory');
    }

    addItem(item) {
        this.items.push(item);
    }

    addItems(itemList) {
        this.items.push(...itemList);
    }

    canAddItem(item) {
        // If adding the item will overload the capacity or not

        if (this.itemCount + 1 < this.maxItemAmount &&
            this.crntWeight() + item.weight < this.weight) {
            return true;
        }
        else return false;
    }

    itemCount() {
        // How many items are in this inventory currently?

        return this.items.length;
    }

    crntWeight() {
        // What is the total weight of all of the items in this inventory?

        var weight = 0;
        this.items.forEach(item => {
            weight += item.weight;
        });
        return weight;
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