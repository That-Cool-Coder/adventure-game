class Game {
    constructor(name, bgImageName, character, exitFunc, mainThemeColor, 
        secondaryColor, version=oldestCompatibleVersion, blocks=[], mapSectionXRanges=[],
        wildAnimals=[], wildAnimalSpawnArea=null, wildAnimalSpawnChances={}, createWildAnimalFunctions={},
        maxWildAnimalAmounts={},
        timeIncrement=1/36000, timeOfDay=0.5, autoSaveInterval=600) {

        this.name = name;
        this.bgImageName = bgImageName;
        this.character = character;

        this.exitFunc = exitFunc;

        this.mainThemeColor = mainThemeColor;
        this.secondaryColor = secondaryColor;

        this.version = version;

        this.blocks = blocks;
        this.mapSectionXRanges = mapSectionXRanges;
        this.generateMapSections(this.mapSectionXRanges);
        this.fillMapSections(this.blocks);

        this.wildAnimals = wildAnimals;
        this.wildAnimalSpawnArea = wildAnimalSpawnArea;
        this.wildAnimalSpawnChances = wildAnimalSpawnChances;
        this.createWildAnimalFunctions = createWildAnimalFunctions;
        this.maxWildAnimalAmounts = maxWildAnimalAmounts;

        this.timeIncrement = timeIncrement; // 1/36000 will be one day in 10 mins
        this.timeOfDay = timeOfDay;

        this.autoSaveInterval = autoSaveInterval;

        this.cachedFrameRate = 0;

        this.paused = false;
        this.inventoryMenuShowing = false;

        this.crntDraw = this.updateExploring.bind(this);
        this.crntButtonChecks = this.exploringButtonChecks.bind(this);
        this.crntOnPressKeybinds = this.exploringKeybinds.bind(this);

        this.messages = [];

        this.setupHud();
        this.setupPauseMenu();
        this.setupInventoryMenu();

        addClassName(this, 'Game');
    }

    // Small callables
    // ---------------

    addMessage(messageText) {
        var message = {text : messageText, deleteTime : frameCount + 180};
        this.messages.push(message);
    }

    togglePause() {
        // unpause
        if (this.paused) {
            this.paused = false;
            this.hud.pauseButton.setText('Pause');
            this.crntButtonChecks = this.exploringButtonChecks.bind(this);
            this.crntDraw = this.updateExploring.bind(this);
        }
        // pause
        else {
            this.paused = true;
            this.hud.pauseButton.setText('Unpause');
            this.crntButtonChecks = this.pausedButtonChecks.bind(this);
            this.crntDraw = this.updateGamePaused.bind(this);
        }
    }

    toggleInventoryMenu() {
        if (this.inventoryMenuShowing) this.closeInventoryMenu();
        else this.openInventoryMenu();
    }

    closeInventoryMenu() {
        this.inventoryMenuShowing = false;
        this.crntDraw = this.updateExploring.bind(this);
        this.crntButtonChecks = this.exploringButtonChecks.bind(this);
    }

    openInventoryMenu() {
        this.paused = true;
        this.inventoryMenuShowing = true;
        this.crntDraw = this.updateShowingInventory.bind(this);
        this.crntButtonChecks = this.showingInventoryButtonChecks.bind(this);
    }

    exit() {
        saveGame(this);

        eval(this.exitFunc);
    }

    // Main loops
    // ----------
    
    updateExploring() {
        // Main loop of the game

        // Movement
        this.moveWildAnimals();
        this.character.move(this.mapSections, this.wildAnimals);

        this.spawnWildAnimals();

        // Drawing
        this.drawBg();
        this.drawBlocks();
        this.drawWildAnimals();
        this.character.draw();
        this.drawNightOverlay();
        this.drawFrameRate();
        this.drawMessages();
        this.drawHud();

        // Housekeeping
        this.housekeeping();
    }

    updateGamePaused() {
        // Loop for when the game is paused
        
        // Drawing game content
        this.drawBg();
        this.drawBlocks();
        this.drawWildAnimals();
        this.character.draw(); // may not be necessary - character may be behind menu
        this.drawNightOverlay();
        this.drawFrameRate();

        // May not keep this
        this.drawMessages();

        // Drawing menus
        this.drawPauseMenu();
    }

    updateShowingInventory() {
        // Loop for when the game is showing the character's inventory

        //this.inventoryMenu.itemCounter.setText(this.character.inventory.items.length + 
            //' items in inventory');
        
        // Drawing game content
        this.drawBg();
        this.drawBlocks();
        this.drawWildAnimals();
        this.character.draw(); // may not be necessary - character may be behind menu
        this.drawNightOverlay();
        this.drawInventoryMenu();
        this.drawFrameRate();

        // May not keep this
        this.drawMessages();
    }

    moveWildAnimals() {
        this.wildAnimals.forEach(animal => {
            animal.move(this.mapSections, this.character);
        })
    }

    // Drawing the game
    // ----------------

    drawBg() {
        noStroke();
        image(images[this.bgImageName], 0, 0, cWidth, cHeight);
    }

    drawBlocks(translationCm) {
        var translation = new p5.Vector(-this.character.positionCm.x, -this.character.positionCm.y);
        translation.sub(this.character.sizeCm.x / 2, this.character.sizeCm.y / 2);
        translation.add(translationCm);

        this.blocks.forEach(block => {
            block.draw(translation);
        });
    }

    drawWildAnimals() {
        var translation = new p5.Vector(-this.character.positionCm.x, -this.character.positionCm.y);
        translation.sub(this.character.sizeCm.x / 2, this.character.sizeCm.y / 2);

        this.wildAnimals.forEach(animal => {
            animal.draw(translation);
        });
    }

    drawNightOverlay() {
        var isMorning = this.timeOfDay > 0.2 && this.timeOfDay <= 0.3;
        var isEvening = this.timeOfDay > 0.7 && this.timeOfDay <= 0.8;
        var isNight = this.timeOfDay > 0.8 || this.timeOfDay <= 0.2;

        var black = [0, 0, 0];

        if (isMorning) {
            var sinceMorning = 0.3 - this.timeOfDay;
            var alpha = sinceMorning / 0.1 * 100;
        }
        else if (isEvening) {
            var untilNight = this.timeOfDay - 0.7;
            var alpha = untilNight / 0.1 * 100;
        }
        else if (isNight) {
            var alpha = 100;
        }
        else {
            var alpha = 0;
        }

        alpha *= 0.8; // make it not completely black

        noStroke();
        fill(setAlpha(black, alpha));
        rect(0, 0, cWidth, cHeight);
    }

    // Drawing the user interface
    // --------------------------

    drawFrameRate() {
        if (frameCount % 10 == 0) this.cachedFrameRate = frameRate();

        push();
        scale(scaleMult);

        stroke(0);
        strokeWeight(1);
        fill(100);
        textSize(25);

        text(Math.floor(this.cachedFrameRate), widthCm - 30, 30);
        pop();
    }

    drawHud() {
        var hudKeys = Object.keys(this.hud);
        for (var keyIdx = 0; keyIdx < hudKeys.length; keyIdx ++) {
            this.hud[hudKeys[keyIdx]].draw(scaleMult);
        }
    }

    drawMessages() {
        var messageSize = 20;

        push();

        scale(scaleMult);

        fill(0, 0, 0);
        noStroke();
        textSize(messageSize);

        for (var msgIdx = 0; msgIdx < this.messages.length; msgIdx ++) {
            var message = this.messages[msgIdx];
            text(message.text, 100, 25 + (msgIdx * messageSize * 1.5));
        }

        pop();
    }

    drawPauseMenu() {
        this.pauseMenu.draw();
    }

    drawInventoryMenu() {
        this.inventoryMenu.draw();
        this.inventoryMenu.centerPanel.updateInventory(this.character.inventory);
    }

    // Button click checking
    // ---------------------

    exploringButtonChecks() {
        this.checkHudButtons();
    }

    pausedButtonChecks() {
        if (this.pauseMenu.unpauseButton.mouseHovering()) {
            this.togglePause();
        }
        if (this.pauseMenu.exitButton.mouseHovering()) {
            this.exit();
        }
    }

    showingInventoryButtonChecks() {
        if (this.inventoryMenu.exitButton.mouseHovering()) {
            this.closeInventoryMenu();
        }
    }

    checkHudButtons() {
        // This assumes that the mouse is being pressed already
        if (this.hud.pauseButton.mouseHovering()) {
            this.togglePause();
        }
        if (this.hud.inventoryButton.mouseHovering()) {
            this.toggleInventoryMenu();
        }
    }

    // Keybinds
    // --------

    exploringKeybinds() {
    }

    showingInventoryKeybinds() {
    }

    // Housekeeping methods
    // --------------------

    housekeeping() {
        // Increment time and autosave

        this.timeOfDay += this.timeIncrement; // step time forwards
        if (this.timeOfDay > 1) this.timeOfDay -= 1;

        if (frameCount % this.autoSaveInterval == 0) {
            saveGame(this);
            this.addMessage('Autosaving...');
        }

        this.deleteOldMessages();
        this.updateHud();

        this.deleteDeadAnimals();

        this.blocks.forEach(block => block.housekeeping());
    }

    deleteOldMessages() {
        // delete expired messages

        var newMessageList = [];
        this.messages.forEach(message => {
            if (message.deleteTime > frameCount) {
                newMessageList.push(message);
            }
        });

        this.messages = newMessageList;
    }

    updateHud() {
        // Update the displays on the HUD

        this.hud.healthMeter.text = 'Health: ' + Math.floor(this.character.health);
    }
    
    deleteDeadAnimals() {
        // Delete the wild animals that are no longer living so they don't draw, do damage

        // Loop backwards to avoid issues on deleting items and messing with indexes
        for (var i = this.wildAnimals.length - 1; i >= 0; i --) {
            if (! this.wildAnimals[i].alive) {
                this.wildAnimals.splice(i, 1);
            }
        }
    }

    spawnWildAnimals() {
        // Go through all the wild animal types and spawn them if there is the right chance

        if (this.wildAnimalSpawnArea !== null) {
            wildAnimalSpecies.forEach(species => {

                // If there is a spawn chance defined for  that species
                if (this.wildAnimalSpawnChances[species] !== undefined) {

                    // If random is within a chance, then look up the create function and run it
                    if (Math.random() < this.wildAnimalSpawnChances[species] &&
                        ! this.tooManyAnimals(species)) {

                        var pos = new p5.Vector(random(this.wildAnimalSpawnArea.min, this.wildAnimalSpawnArea.max),  -1500);
                        this.wildAnimals.push(this.createWildAnimalFunctions[species](pos));
                    }
                }
            });
        }
    }

    // Setup World
    // -----------

    generateMapSections(mapSectionXRanges) {
        // Make the map sections based on the ranges provided
        // The map sections are used for checking which blocks to 
        // Do close collision checks with

        this.mapSections = [];
        mapSectionXRanges.forEach(xRange => {
            var mapSection = new MapSection(xRange, []);
            this.mapSections.push(mapSection);
        });
    }

    fillMapSections(blocks) {
        // Put pointers to the blocks in the correct map sections based on x pos

        blocks.forEach(block => {
            this.mapSections.forEach(section => {
                // Check the bottom right corner
                var bottomRightCorner = new p5.Vector(
                    block.positionCm.x + block.sizeCm.x,
                    block.positionCm.y + block.sizeCm.y);
                if (section.overlapsArea(block.positionCm, bottomRightCorner)) {
                    section.blocks.push(block);
                }
            });
        })
    }

    // Setup ui
    // ---------

    setupHud() {
        this.hud = {};

        this.hud.pauseButton = new SimpleButton(new p5.Vector(widthCm - 140, 10),
            new p5.Vector(85, 30), 'Pause', 20, scaleMult);
        this.hud.pauseButton.setBgColor(this.mainThemeColor);

        this.hud.inventoryButton = new SimpleButton(new p5.Vector(widthCm - 260, 10),
            new p5.Vector(100, 30), 'Inventory', 20, scaleMult);
        this.hud.inventoryButton.setBgColor(this.mainThemeColor);

        this.hud.healthMeter = new Label(new p5.Vector(widthCm - 140, heightCm - 40),
            'Health: ' + this.character.health, 30, scaleMult);
    }

    setupPauseMenu() {
        // Setup panel for pause menu
        var pauseMenuSize = new p5.Vector(widthCm * 0.5, heightCm * 0.75);
        var marginX = (widthCm - pauseMenuSize.x) / 2;
        var marginY = (heightCm - pauseMenuSize.y) / 2;

        this.pauseMenu = new Panel(new p5.Vector(marginX, marginY), 
            pauseMenuSize, layoutStyles.verticalRow, scaleMult);
        this.pauseMenu.setBgColor(this.secondaryColor);

        // Make unpause button
        var unpauseBtn = new SimpleButton(new p5.Vector(0, 0),
            new p5.Vector(120, 40), 'Unpause', 25, scaleMult);
        unpauseBtn.setBgColor(this.mainThemeColor);
        this.pauseMenu.addChild(unpauseBtn, 15);
        this.pauseMenu.linkChild(unpauseBtn, 'unpauseButton'); // give it a label like this.pauseMenu.unpauseButton

        // Make exit button
        var exitBtn = new SimpleButton(new p5.Vector(0, 0),
            new p5.Vector(180, 40), 'Save and exit', 25, scaleMult);
        exitBtn.setBgColor(this.mainThemeColor);
        this.pauseMenu.addChild(exitBtn, 15);
        this.pauseMenu.linkChild(exitBtn, 'exitButton'); // see unpause button explanation
    }

    setupInventoryMenu() {
        // Setup panel for inventory-showing menu
        var inventoryMenuSize = new p5.Vector(widthCm * 0.9, heightCm * 0.9);
        var marginX = (widthCm - inventoryMenuSize.x) / 2;
        var marginY = (heightCm - inventoryMenuSize.y) / 2;
        var centerX = inventoryMenuSize.x / 2;

        this.inventoryMenu = new Panel(new p5.Vector(marginX, marginY), 
            inventoryMenuSize, layoutStyles.relativePosition, scaleMult);
        this.inventoryMenu.setBgColor(this.secondaryColor);

        var heading = new Label(new p5.Vector(centerX, 40),
            'Inventory', 25, scaleMult);
        heading.setTextColor([100, 100, 100]);
        this.inventoryMenu.addChild(heading);

        var counter = new Label(new p5.Vector(centerX, 80),
            '0 items in inventory', 15, scaleMult);
        counter.setTextColor([100, 100, 100]);
        //this.inventoryMenu.addChild(counter);
        //this.inventoryMenu.linkChild(counter, 'itemCounter');

        var exitButton = new SimpleButton(new p5.Vector(inventoryMenuSize.x - 60, 5),
            new p5.Vector(40, 30), 'Exit', 20, scaleMult);
        exitButton.setTextColor([100, 100, 100]);
        exitButton.setBgColor(this.mainThemeColor);
        this.inventoryMenu.addChild(exitButton);
        this.inventoryMenu.linkChild(exitButton, 'exitButton');

        var centerPanelSize = new p5.Vector(inventoryMenuSize.x / 3, inventoryMenuSize.y - 100);
        var centerPanelPos = new p5.Vector(inventoryMenuSize.x / 3, 100);
        var centerPanel = new InventoryPanel(this.character.inventory, centerPanelPos,
            centerPanelSize, 15, 5, scaleMult);
        this.inventoryMenu.addChild(centerPanel);
        this.inventoryMenu.linkChild(centerPanel, 'centerPanel');

        this.setupCraftingPanel();
    }

    setupCraftingPanel() {
        //this.craftingPanel = new Panel(new p5.Vector())
    }

    // Misc
    // ----

    amountOfAnimals(speciesName) {
        // Count how many animals there are of this species

        var count = 0;
        this.wildAnimals.forEach(animal => {
            if (animal.species == speciesName) {
                count ++;
            }
        })
        return count;
    }

    tooManyAnimals(speciesName) {
        // Is the amount of animals of this species above the maximum for that species?

        var count = this.amountOfAnimals(speciesName);
        if (this.maxWildAnimalAmounts[speciesName] == undefined) {
            return false;
        }
        else if (count > this.maxWildAnimalAmounts[speciesName]) {
            return true;
        }
        else return false;
    }
}