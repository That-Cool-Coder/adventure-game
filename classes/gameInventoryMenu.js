class GameInventoryMenu extends Panel {
    constructor(character, mainThemeColor, secondaryColor) {
        // Setup panel for inventory-showing menu
        var size = new p5.Vector(widthCm * 0.9, heightCm * 0.9);
        var margin = new p5.Vector(widthCm, heightCm).sub(size).div(2);

        super(margin, size, layoutStyles.relativePosition, scaleMult);
        this.character = character;
        this.mainThemeColor = mainThemeColor;
        this.secondaryColor = secondaryColor;
        this.setBgColor(this.secondaryColor);

        this.centerPos = p5.Vector.div(size, 2);

        this.itemActionButtons = {};
        this.itemActionButtonPosY = 27;
        this.selectedItemImageSize = new p5.Vector(20, 20);

        this.setupItemActionButtonCallbacks();

        this.setupMainItemsRENAME();
        this.setupCenterPanel();
        this.setupCraftingPanel();

        // Save the draw function inherited from Panel so that a new draw that does everything can be made
        // without overwriting the inherited draw
        this.crntlySelectedItem = null;
        this.crntlySelectedItemIdx = null;
        this.inheritedDraw = this.draw;
        this.draw = () => {
            this.centerPanel.itemInfoPanel.displayImage.draw(); // draw it last so it's on top
            if (this.crntlySelectedItem !== null) this.updateItemInfoPanelActionButtons();

            this.inheritedDraw();
        }
    }

    updateItemInfoPanelActionButtons() {
        // Make the buttons show all of the actions available for the currently selected item

        // Remove all of the old actions
        var actionNames = Object.keys(itemActions);
        actionNames.forEach(name => {
            var btn = this.itemActionButtons[name];
            this.centerPanel.itemInfoPanel.removeChild(btn);
        });

        // And add the new ones
        var xPosSubtotal = 0;
        this.crntlySelectedItem.actions.forEach((action, idx) => {
            var btn = this.itemActionButtons[action];

            var pos = (idx + 1) * 5 + xPosSubtotal;
            btn.topLeftPos.x = pos;
            btn.topLeftPos.y = this.itemActionButtonPosY;

            this.centerPanel.itemInfoPanel.addChild(btn);
            xPosSubtotal += btn.size.x;
        });
    }

    buttonChecks() {
        var idx = this.centerPanel.itemPanel.buttonChecks();
        if (idx !== null) {
            this.selectItem(idx);
        }

        if (this.crntlySelectedItem !== null) {
            this.checkItemActionButtons();
        }
    }

    selectItem(idx) {
        this.crntlySelectedItemIdx = idx;
        this.crntlySelectedItem = this.character.inventory.items[this.crntlySelectedItemIdx];

        if (this.crntlySelectedItem !== null) {
            // Change the image content
            this.centerPanel.itemInfoPanel.displayImage.name = this.crntlySelectedItem.imageName;
            // Resize the image to avoid messing up aspect ratio of item
            this.centerPanel.itemInfoPanel.displayImage.size =
                this._scaleItemImage(this.crntlySelectedItem, this.selectedItemImageSize);
            // Set the label to say the item's name
            this.centerPanel.itemInfoPanel.nameText.text = this.crntlySelectedItem.name;
        }
        else deselectSelectedItem();
    }

    deselectSelectedItem() {
        this.crntlySelectedItemIdx = null;
        this.crntlySelectedItem = null;
        this.centerPanel.itemInfoPanel.displayImage.name = 'transparentPixel';
        this.centerPanel.itemInfoPanel.nameText.text = 'No item selected';
    }

    checkItemActionButtons() {
        // Loop through all of the item action buttons and see if any are triggering
        // (assumes mouse being clicked has been checked somewhere else)

        var enabledButtonNames = this.crntlySelectedItem.actions;
        enabledButtonNames.forEach(name => {
            var btn = this.itemActionButtons[name];
            // If the button's being clicked, find the function that
            // goes with it and run that function
            if (btn.mouseHovering()) {
                this.itemActionButonCallbacks[name]();
            }
        })
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
        // Setup the central panel of the inventory menu. This panel shows what's...
        // ...in the character's inventory and lets you select items and use them

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
        var itemPanel = new InventoryItemPanel(this.character.inventory, new p5.Vector(0, 0),
            p5.Vector.sub(centerPanelSize, new p5.Vector(10, 150)), 12, 2, scaleMult);
        this.centerPanel.addChild(itemPanel, 15);
        this.centerPanel.linkChild(itemPanel, 'itemPanel');
    }

    setupItemInfoPanel() {
        // Setup the panel that shows specific information about the selected item

        // Panel that shows info about an item and has buttons like move to, equip
        var itemInfoPanel = new Panel(new p5.Vector(0, 0),
            new p5.Vector(this.centerPanel.size.x - 20, 50),
            layoutStyles.relativePosition, scaleMult);
        itemInfoPanel.setBorderColor(this.mainThemeColor);
        itemInfoPanel.setBorderWidth(3);
        this.centerPanel.addChild(itemInfoPanel, 15);
        this.centerPanel.linkChild(itemInfoPanel, 'itemInfoPanel');

        var displayImage = new SimpleImage(new p5.Vector(5, 5),
            new p5.Vector(this.selectedItemImageSize.x, this.selectedItemImageSize.y),
            'transparentPixel', scaleMult);
        itemInfoPanel.addChild(displayImage);
        itemInfoPanel.linkChild(displayImage, 'displayImage');

        var nameText = new Label(new p5.Vector(itemInfoPanel.size.x / 2, 12),
            'No item selected', 14, scaleMult);
        nameText.setTextColor([100, 100, 100]);
        itemInfoPanel.addChild(nameText);
        itemInfoPanel.linkChild(nameText, 'nameText');

        // Create the item action buttons

        var buttonNames = Object.keys(itemActions);

        buttonNames.forEach(name => {
            var btn = new SimpleButton(new p5.Vector(0, this.itemActionButtonPosY), new p5.Vector(7 * name.length, 18),
                name, 12, scaleMult);
            btn.setBgColor(this.mainThemeColor);
            this.itemActionButtons[name] = btn;
        });
    }

    setupCraftingPanel() {

    }

    setupItemActionButtonCallbacks() {
        // Setup a dictionary of callbacks to be run when an item-action-triggering button is pressed

        this.itemActionButonCallbacks = {};

        // Setup discard button
        this.itemActionButonCallbacks[itemActions.discard] = () => {
            this.character.inventory.removeItem(this.crntlySelectedItem);
            this.deselectSelectedItem();
        }

        // Setup equip button
        this.itemActionButonCallbacks[itemActions.equip] = () => {
            var oldEquippedItem = this.character.mainItem;
            var newItem = this.crntlySelectedItem;
            this.character.inventory.removeItem(newItem);
            this.character.equipMain(newItem);
            
            if (oldEquippedItem !== null) {
                this.character.inventory.addItem(oldEquippedItem);
            }
            this.deselectSelectedItem();
        }
    }

    _scaleItemImage(item, endSize) {
        // If the item has a definite size, scale it so it fits in the box
        if (item.imageSizeCm !== undefined) {
            var size = scaleToFitRectangle(item.imageSizeCm, endSize);
        }
        // If the item has no definite size
        else {
            var size = new p5.Vector(endSize.x, endSize.y);
        }
        return size;
    }
}