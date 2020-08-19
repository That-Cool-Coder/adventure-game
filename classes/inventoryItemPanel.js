class InventoryItemPanel extends Panel {
    constructor(inventory, topLeftPos, size, itemSize=10, itemPadding=2, scaleMult=1) {
        // Size is vector, itemSize is scalar as items are square
        super(topLeftPos, size, layoutStyles.relativePosition, scaleMult);

        this.itemSize = itemSize;
        this.itemPadding = itemPadding;

        this.updateInventory(inventory);
        this.inventory = inventory;
    }

    updateInventory(newInventory) {
        // Save the inventory and make the new buttons for it 

        this.inventory = newInventory;
        this.setupItemImages();
    }
    
    buttonChecks() {
        // Curently, alert what item is being on clicked on
        var itemBeingClickedIdx = null;

        this.children.forEach(child => {
            if (child.mouseHovering()) {
                itemBeingClickedIdx = this.children.indexOf(child);
            }
        });
        return itemBeingClickedIdx;
    }

    setupItemImages() {
        // Figure out the layout and create all of the buttons

        this.removeChildren();
        this.itemsPerRow = Math.floor((this.size.x - this.itemPadding) / (this.itemSize + this.itemPadding));
        this.fullRows = Math.floor(this.inventory.items.length / this.itemsPerRow) // how many full rows there are
        this.totalRows = this.fullRows + 1;

        this.itemsInLastRow = this.inventory.items.length % this.itemsPerRow;
        this.totalItemSize = this.itemSize + this.itemPadding;

        // Make the rectangular area of complete rows
        for (var row = 0; row < this.fullRows; row ++) {
            for (var col = 0; col < this.itemsPerRow; col ++) {
                this._makeItemImage(row, col);
            }
        }

        // Make the final partially-complete row
        for (var col = 0; col < this.itemsInLastRow; col ++) {
            this._makeItemImage(this.totalRows - 1, col);
        }
    }

    _makeItemImage(row, col) {
        // Create an image in the right position to display an item

        var pos = new p5.Vector(col * this.totalItemSize + this.itemPadding, row * this.totalItemSize + this.itemPadding);
        var size = new p5.Vector(this.itemSize, this.itemSize);
        var idx = row * this.itemsPerRow + col;
        var image = new SimpleImage(pos, size, this.inventory.items[idx].imageName, this.scaleMult);
        
        this.addChild(image);
    }
}