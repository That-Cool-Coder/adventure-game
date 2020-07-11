var fillInVector = new p5.Vector(0, 0); // vector for temporary use

class TitleScreen {
    constructor(fps, bgImageName, bgImageSize, startGameFunc, newGameFunc) {
        this.bgImageName = bgImageName;
        this.bgImageSize = bgImageSize;

        this.startGameFunc = startGameFunc;
        this.newGameFunc = newGameFunc;

        // 'consts'

        this.startMenuSize = new p5.Vector(widthCm * 0.7, heightCm * 0.7);
        this.playMenuSize = new p5.Vector(widthCm * 0.7, heightCm * 0.7);
        
        this.fadeIntoGameLenMs = 500;
        this.fadeIntoGameLenFrames = this.fadeIntoGameLenMs * fps / 1000;
        this.fadingIntoGame = false;
        this.fadeIntoGameAlpha = 0;

        // Random other stuff

        // Make the background and menus slide to one side to change playMenuSize
        this.viewPanCm = new p5.Vector(0, 0);
        this.viewPanDistCm = new p5.Vector(-widthCm, 0);

        this.crntButtonChecks = () => {
            this.checkStartScreenButtons();
        }
        
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
        var marginX = (widthCm - this.startMenuSize.x) / 2;
        var marginY = (heightCm - this.startMenuSize.y) / 2;

        this.startMenu = new Panel(new p5.Vector(marginX, marginY),
            new p5.Vector(this.startMenuSize.x, this.startMenuSize.y),
            layoutStyles.verticalRow, scaleMult);
        this.startMenu.setBorderWidth(0);

        // Set up play button
        var playButton = new SimpleButton(fillInVector, new p5.Vector(220, 50),
            'Play Game', 40, scaleMult);
        playButton.setBorderWidth(3);
        playButton.setBorderColor(themeColors.secondBrown);
        playButton.setTextOutlineWidth(0);
        playButton.setTextColor([100, 100, 100]);
        playButton.setBgColor(themeColors.mainBrown);

        this.startMenu.addChild(playButton, 5);
        this.startMenu.linkChild(playButton, 'playButton');
    }

    setupPlayMenu() {
        // Add width here so the buttons are offscreen to one side
        var marginX = (widthCm - this.playMenuSize.x) / 2 + widthCm;
        var marginY = (heightCm - this.playMenuSize.y) / 2;

        this.playMenu = new Panel(new p5.Vector(marginX, marginY),
            new p5.Vector(this.playMenuSize.x, this.playMenuSize.y),
            layoutStyles.verticalRow, scaleMult);
        this.playMenu.setBorderWidth(0);

        // Set up start game button
        var startGameButton = new SimpleButton(fillInVector, new p5.Vector(300, 100),
            'Start Game', 50, scaleMult);
        startGameButton.setBorderWidth(3);
        startGameButton.setBorderColor(themeColors.secondBrown);
        startGameButton.setTextOutlineWidth(0);
        startGameButton.setTextColor([100, 100, 100]);
        startGameButton.setBgColor(themeColors.mainBrown);

        this.playMenu.addChild(startGameButton, 5);
        this.playMenu.linkChild(startGameButton, 'startGameButton');


        // Set up new game button
        var newGameButton = new SimpleButton(fillInVector, new p5.Vector(390, 100),
            'Start New Game', 50, scaleMult);
        newGameButton.setBorderWidth(3);
        newGameButton.setBorderColor(themeColors.secondBrown);
        newGameButton.setTextOutlineWidth(0);
        newGameButton.setTextColor([100, 100, 100]);
        newGameButton.setBgColor(themeColors.mainBrown);

        this.playMenu.addChild(newGameButton, 50);
        this.playMenu.linkChild(newGameButton, 'newGameButton');
        
        // Set up back button
        var backButton = new SimpleButton(fillInVector, new p5.Vector(120, 50),
            'Back', 25, scaleMult);
        backButton.setBorderWidth(3);
        backButton.setBorderColor(themeColors.secondBrown);
        backButton.setTextOutlineWidth(0);
        backButton.setTextColor([100, 100, 100]);
        backButton.setBgColor(themeColors.mainBrown);

        this.playMenu.addChild(backButton, 50);
        this.playMenu.linkChild(backButton, 'backButton');
    }

    // Small callables
    // ---------------

    goToStartScreen() {
        this.viewPanCm.x = 0;
        this.crntViewPanSpd = new p5.Vector(0, 0);
        this.slidingBetweenMenus = false;
        this.crntButtonChecks = () => {
            this.checkStartScreenButtons();
        }
    }

    goToPlayMenu() {
        this.viewPanCm.x = this.viewPanDistCm.x;
        this.crntViewPanSpd = new p5.Vector(0, 0);
        this.slidingBetweenMenus = false;
        this.crntButtonChecks = () => {
            this.checkPlayMenuButtons();
        }
    }

    beginSlideToStartScreen() {
        this.crntViewPanSpd = new p5.Vector(0, 0);
        this.slidingBetweenMenus = true;
    }

    beginSlideToPlayMenu() {
        this.crntViewPanSpd = new p5.Vector(0, 0);
        this.slidingBetweenMenus = true;
    }

    async startFadeIntoGame() {
        this.fadingIntoGame = true;
        this.fadeIntoGameAlpha = 0;

        this.crntButtonChecks = () => {}; // don't let any buttons be pressed

        var promise = new Promise(resolve => {
        	setTimeout(() => {
            	resolve();
            }, this.fadeIntoGameLenMs);
        });
        return promise;
    }

    reset() {
        this.goToStartScreen();
        this.fadingIntoGame = false;
        this.fadeIntoGameAlpha = 0;
    }

    // Main loop
    // ---------

    update() {
        //if (this.slidingBetweenMenus) this.slideBetweenMenus();

        this.drawBgImage();
        this.drawStartMenu();
        this.drawPlayMenu();

        if (this.fadingIntoGame) this.fadeIntoGame();
    }

    // Drawing functions
    // -----------------

    drawBgImage() {
        push();

        noStroke();
        scale(scaleMult);

        translate(this.viewPanCm);

        var imageToDraw = images[this.bgImageName];
        image(imageToDraw, 0, 0, this.bgImageSize.x, this.bgImageSize.y);

        pop();
    }

    fadeIntoGame() {
        push();

        fill(0, 0, 0, this.fadeIntoGameAlpha);

        rect(0, 0, cWidth, cHeight);

        this.fadeIntoGameAlpha += 100 / this.fadeIntoGameLenFrames;

        pop();
    }

    drawStartMenu() {
        this.startMenu.draw(this.viewPanCm);
    }

    drawPlayMenu() {
        this.playMenu.draw(this.viewPanCm);
    }

    // Button checks
    // -------------

    checkStartScreenButtons() {
        if (this.startMenu.playButton.mouseHovering(this.viewPanCm)) {
            this.goToPlayMenu();
        }
    }

    checkPlayMenuButtons() {
        if (this.playMenu.startGameButton.mouseHovering(this.viewPanCm)) {
            this.startFadeIntoGame().then(() => {
                eval(this.startGameFunc);
            });
        }
        if (this.playMenu.newGameButton.mouseHovering(this.viewPanCm)) {
            this.startFadeIntoGame().then(() => {
                eval(this.newGameFunc);
            });
        }
        if (this.playMenu.backButton.mouseHovering(this.viewPanCm)) {
            this.goToStartScreen();
        }
    }

    // Other 
    // -----

    slideBetweenMenus() {
    }
}