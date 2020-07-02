class TitleScreen {
    constructor(fps, bgGameDataStr, startGameFuncName) {
        
        this.fadeIntoGameLenMs = 1000;
        this.fadeIntoGameLenFrames = this.fadeIntoGameLenMs * fps;
        this.fadingIntoGame = false;
        this.fadeIntoGameAlpha = 0;

        // Make the background slide to one side to change menus
        this.changeViewLenMs = 1500;
        this.changeViewLenFrames = this.changeViewLenMs * fps;
        this.bgGamePanCm = new p5.Vector(widthCm - widthCm / 2 - 100, 0);

        this.startGameFuncName = startGameFuncName;

        this.crntButtonChecks = () => {};

        this.setupBgGame(bgGameDataStr);
        this.setupStartMenu();
        this.setupPlayMenu();
    }

    // Setup
    // -----

    setupBgGame(bgGameDataStr) {
        localStorage.setItem('**tempGame', bgGameDataStr);
        this.bgGame = loadGame('**tempGame');
        localStorage.removeItem('**tempGame');
    }

    setupStartMenu() {
        var fillInVector = new p5.Vector(0, 0); // vector for temporary use

        // Set up panel to hold menu
        var startMenuWidth = widthCm * 0.7;
        var startMenuHeight = heightCm * 0.7;

        var marginX = (widthCm - startMenuWidth) / 2;
        var marginY = (heightCm - startMenuHeight) / 2;

        this.startMenu = new Panel(new p5.Vector(marginX, marginY),
            new p5.Vector(startMenuWidth, startMenuHeight), layoutStyles.verticalRow, scaleMult);

        // Set up play button
        var playButton = new SimpleButton(fillInVector, new p5.Vector(200, 50),
            'Play Game', 40, scaleMult);
        playButton.setBorderWidth(2);
    }

    setupPlayMenu() {

    }

    // Small callables
    // ---------------

    goToStartScreen() {

    }

    // Main loop
    // ---------

    draw() {
        this.bgGame.drawBg();
        this.bgGame.drawBlocks(this.bgGamePanCm);
        this.bgGame.drawFrameRate();

        this.bgGame.character.draw(this.bgGamePanCm);

        if (this.fadingIntoGame) this.fadeIntoGame();
    }

    // Drawing functions
    // -----------------

    fadeIntoGame() {
        push();

        this.fadeIntoGameAlpha()

        fill()

        rect(0, 0, cWidth, cHeight);

        pop();
    }

    drawStartMenu() {
        this.startMenu.draw();
    }

    drawPlayMenu() {
        this.playMenu.draw();
    }

    // Change mode
    // -----------

    async startFadeIntoGame() {
        this.fadingIntoGame = true;
        this.fadeIntoGameAlpha = 0;

        var promise = new Promise(resolve => {
        	setTimeout(() => {
            	resolve();
            }, this.fadeIntoGameLenMs);
        });
    }
}