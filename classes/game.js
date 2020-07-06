class Game {
    constructor(name, bgImageName, character, exitFuncName, mainThemeColor, 
        secondaryColor, version=oldestCompatibleVersion, blocks=[], timeIncrement=1/36000,
        timeOfDay=0.5, autoSaveInterval=600) {

        this.name = name;
        this.bgImageName = bgImageName;
        this.character = character;

        this.exitFuncName = exitFuncName;

        this.mainThemeColor = mainThemeColor;
        this.secondaryColor = secondaryColor;

        this.version = version;

        this.blocks = blocks;
        this.timeIncrement = timeIncrement; // 1/36000 will be one day in 10 mins
        this.timeOfDay = timeOfDay;
        this.autoSaveInterval = autoSaveInterval;

        this.cachedFrameRate = 0;

        this.paused = false;

        this.crntDraw = this.updateExploring.bind(this);
        this.crntButtonChecks = this.exploringButtonChecks.bind(this);

        this.messages = [];

        this.setupHud();
        this.setupPauseMenu();
    }

    // Setup
    // -----

    setupHud() {
        this.hud = {};

        this.hud.pauseButton = new SimpleButton(new p5.Vector(widthCm - 140, 10),
            new p5.Vector(85, 30), 'Pause', 20, scaleMult);
        this.hud.pauseButton.setBgColor(this.mainThemeColor);
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

    exitGame() {
        saveGame(this);

        eval(this.exitFuncName + '()');
    }

    // Main loops
    // ----------
    
    updateExploring() {
        // Main loop of the game

        // Movement
        this.character.move(this.blocks);

        // Drawing
        this.drawBg();
        this.drawBlocks();
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
        this.character.draw(); // may not be necessary - character may be behind menu
        this.drawNightOverlay();
        this.drawFrameRate();

        // May not keep these two
        this.drawMessages();

        // Drawing menus
        this.drawPauseMenu();
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

    // Handling the user interface

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
            this.exitGame();
        }
    }

    checkHudButtons() {
        if (this.hud.pauseButton.mouseHovering()) {
            this.togglePause();
        }
    }

    // Housekeeping methods
    // --------------------

    housekeeping() {
        this.timeOfDay += this.timeIncrement; // step time forwards
        if (this.timeOfDay > 1) this.timeOfDay -= 1;

        if (frameCount % this.autoSaveInterval == 0) {
            saveGame(this);
            this.addMessage('Autosaving...');
        }

        this.updateMessages();

        this.blocks.forEach(block => block.housekeeping());
    }

    updateMessages() {
        // delete expired messages

        var newMessageList = [];
        this.messages.forEach(message => {
            if (message.deleteTime > frameCount) {
                newMessageList.push(message);
            }
        });

        this.messages = newMessageList;
    }
}