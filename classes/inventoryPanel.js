class InventoryPanel extends Panel {
    constructor(inventory, topLeftPos, size, itemSize=10, itemPadding=2, scaleMult=1) {
        // Size is vector, itemSize is scalar as items are square
        super(topLeftPos, size, layoutStyles.relativePosition, scaleMult);

        this.itemSize = itemSize;
        this.itemPadding = itemPadding;

        this.updateInventory(inventory);
    }

    updateInventory(newInventory) {
        this.inventory = newInventory;
        this.setupButtonsAndImages();
    }

    setupButtonsAndImages() {
        this.removeChildren();
        this.itemsPerRow = Math.floor((this.size.x - this.itemPadding) / (this.itemSize + this.itemPadding));
        this.fullRows = Math.floor(this.inventory.items.length / this.itemsPerRow) // how many full rows there are
        this.totalRows = this.fullRows + 1;

        this.itemsInLastRow = this.inventory.items.length % this.itemsPerRow;
        this.totalItemSize = this.itemSize + this.itemPadding;

        for (var row = 0; row < this.fullRows; row ++) {
            for (var col = 0; col < this.itemsPerRow; col ++) {
                this._makeButtonAndImage(row, col);
            }
        }

        for (var col = 0; col < this.itemsInLastRow; col ++) {
            this._makeButtonAndImage(this.totalRows - 1, col);
        }
    }

    _makeButtonAndImage(row, col) {
        var pos = new p5.Vector(col * this.totalItemSize + this.itemPadding, row * this.totalItemSize + this.itemPadding);
        var size = new p5.Vector(this.itemSize, this.itemSize);
        var idx = row * this.itemsPerRow + col;

        var button = new SimpleButton(pos, size, '', 0, this.scaleMult);
        var image = new SimpleImage(pos, size, this.inventory.items[idx].imageName, this.scaleMult);
        
        this.addChild(image);
        this.addChild(button);
    }
}