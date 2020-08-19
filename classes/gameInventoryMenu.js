class GameInventoryMenu extends Panel {
    constructor(characterInventory, mainThemeColor, secondaryColor) {
        // Setup panel for inventory-showing menu
        var size = new p5.Vector(widthCm * 0.9, heightCm * 0.9);
        var margin = new p5.Vector(widthCm, heightCm).sub(size).div(2);

        super(margin, size, layoutStyles.relativePosition, scaleMult);
        this.characterInventory = characterInventory;
        this.mainThemeColor = mainThemeColor;
        this.secondaryColor = secondaryColor;
        this.setBgColor(this.secondaryColor);

        this.centerPos = p5.Vector.div(size, 2);

        this.setupMainItemsRENAME();
        this.setupCenterPanel();
        this.setupCraftingPanel();

        // Save the draw function inherited from Panel so that a new draw that does everything can be made
        this.crntlySelectedItem = null;
        this.crntlySelectedItemIdx = null;
        this.inheritedDraw = this.draw;
        this.draw = () => {
            this.inheritedDraw();

            if (this.crntlySelectedItem !== null) this.drawItemInfoPanel();
        }
    }

    drawItemInfoPanel() {
    }

    buttonChecks() {
        var idx = this.centerPanel.itemPanel.buttonChecks();
        if (idx !== null) {
            this.selectItem(idx);
        }

        if (this.crntlySelectedItem !== null) {
            if (this.centerPanel.itemInfoPanel.discardButton.mouseHovering()) {
                if (confirm(`Are you sure you want to discard ${this.crntlySelectedItem.name}?`)) {
                    this.characterInventory.removeItem(this.crntlySelectedItemIdx);
                    this.deselectSelectedItem();
                }
            }
        }
    }

    selectItem(idx) {
        this.crntlySelectedItemIdx = idx;
        this.crntlySelectedItem = this.characterInventory.items[this.crntlySelectedItemIdx];

        if (this.crntlySelectedItem !== null) {
            this.centerPanel.itemInfoPanel.displayImage.name = this.crntlySelectedItem.imageName;
        }
        else this.centerPanel.itemInfoPanel.displayImage.name = 'transparentPixel';
    }

    deselectSelectedItem() {
        this.crntlySelectedItemIdx = null;
        this.crntlySelectedItem = null;
        this.centerPanel.itemInfoPanel.displayImage.name = 'transparentPixel';
    }

    setupMainItemsRENAME() {
        var heading = new Label(new p5.Vector(this.centerPos.x, 20),
            'Inventory', 25, scaleMult);
        heading.setTextColor([100, 100, 100]);
        this.addChild(heading);

        var exitButton = new SimpleButton(new p5.Vector(this.size.x - 60, 5),
            new p5.Vector(40, 30), 'Exit', 20, scaleMult);
        exitButton.setTextColor([100, 100, 100]);
        exitButton.setBgColor(this.mainThemeColor);
        this.addChild(exitButton);
        this.linkChild(exitButton, 'exitButton');
    }

    setupCenterPanel() {
        var centerPanelSize = new p5.Vector(this.size.x / 3, this.size.y - 80);
        var centerPanelPos = new p5.Vector(this.size.x / 3, 50);
        var centerPanel = new Panel(centerPanelPos,
            centerPanelSize, layoutStyles.verticalRow, scaleMult);
        centerPanel.setBorderColor(this.mainThemeColor);
        centerPanel.setBorderWidth(3);
        this.addChild(centerPanel);
        this.linkChild(centerPanel, 'centerPanel');

        var itemCounter = new Label(new p5.Vector(0, 0),
            '', 12, scaleMult);
        itemCounter.setTextColor([100, 100, 100]);
        this.centerPanel.addChild(itemCounter, 15);
        this.centerPanel.linkChild(itemCounter, 'itemCounter');

        var weightCounter = new Label(new p5.Vector(0, 0),
            '', 12, scaleMult);
        weightCounter.setTextColor([100, 100, 100]);
        this.centerPanel.addChild(weightCounter, 15);
        this.centerPanel.linkChild(weightCounter, 'weightCounter');

        this.setupItemInfoPanel();

        // Panel that shows all of the items in a list
        var itemPanel = new InventoryItemPanel(this.characterInventory, new p5.Vector(0, 0),
            p5.Vector.sub(centerPanelSize, new p5.Vector(10, 150)), 12, 2, scaleMult);
        this.centerPanel.addChild(itemPanel, 15);
        this.centerPanel.linkChild(itemPanel, 'itemPanel');
    }

    setupItemInfoPanel() {
        // Panel that shows info about an item and has buttons like move to x
        var itemInfoPanel = new Panel(new p5.Vector(0, 0),
            new p5.Vector(this.centerPanel.size.x - 20, 50),
            layoutStyles.relativePosition, scaleMult);
        itemInfoPanel.setBorderColor(this.mainThemeColor);
        itemInfoPanel.setBorderWidth(3);
        this.centerPanel.addChild(itemInfoPanel, 15);
        this.centerPanel.linkChild(itemInfoPanel, 'itemInfoPanel');

        var displayImage = new SimpleImage(new p5.Vector(5, 5), new p5.Vector(20, 20),
            'transparentPixel', scaleMult);
        itemInfoPanel.addChild(displayImage);
        itemInfoPanel.linkChild(displayImage, 'displayImage');

        var equipButton = new SimpleButton(new p5.Vector(5, 27), new p5.Vector(45, 18),
            'Equip', 12, scaleMult);
        equipButton.setBgColor(this.mainThemeColor);
        itemInfoPanel.addChild(equipButton);
        itemInfoPanel.linkChild(equipButton, 'equipButton');

        var discardButton = new SimpleButton(new p5.Vector(55, 27), new p5.Vector(50, 18),
            'Discard', 12, scaleMult);
        discardButton.setBgColor(this.mainThemeColor);
        itemInfoPanel.addChild(discardButton);
        itemInfoPanel.linkChild(discardButton, 'discardButton');
    }

    setupCraftingPanel() {

    }
}