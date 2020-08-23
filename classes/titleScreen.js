var fillInVector = new p5.Vector(0, 0); // vector for temporary use

class TitleScreen {
    constructor(fps, bgImageName, bgImageSize, startGameFunc, newGameFunc, openAboutPageFunc) {
        this.bgImageName = bgImageName;
        this.bgImageSize = bgImageSize;

        this.startGameFunc = startGameFunc; // to start any game
        this.newGameFunc = newGameFunc; // to start new
        this.openAboutPageFunc = openAboutPageFunc; // To open the page that says stuff about the game

        // 'consts'

        this.startMenuSize = new p5.Vector(widthCm * 0.7, heightCm * 0.7);
        this.playMenuSize = new p5.Vector(widthCm * 0.7, heightCm * 0.7);
        
        this.fadeIntoGameLenMs = 500;
        this.fadeIntoGameLenFrames = this.fadeIntoGameLenMs * fps / 1000;
        this.fadingIntoGame = false;
        this.fadeIntoGameAlpha = 0;

        // Random other stuff

        this.viewPanCm = new p5.Vector(0, 0);

        // Make the background and menus slide to one side to change menus
        this.slidingBetweenMenus = false;
        this.maxMenuSlideVel = 20;
        this.crntMenuSlideVel = 0;
        this.menuSlideAccel = 0;
        this.menuSlideRange = new Range(-widthCm, 0);

        this.crntButtonChecks = () => {
            this.checkStartScreenButtons();
        }
        
        this.setupStartMenu();
        this.setupPlayMenu();

        addClassName(this, 'TitleScreen');
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
        var playButton = new SimpleButton(fillInVector, new p5.Vector(270, 70),
            'Play', 50, scaleMult);
        playButton.setBorderWidth(3);
        playButton.setBorderColor(themeColors.secondBrown);
        playButton.setTextOutlineWidth(0);
        playButton.setTextColor([100, 100, 100]);
        playButton.setBgColor(themeColors.mainBrown);

        this.startMenu.addChild(playButton, 5);
        this.startMenu.linkChild(playButton, 'playButton');

        // Set up about button
        var aboutButton = new SimpleButton(fillInVector, new p5.Vector(270, 70),
            'About', 50, scaleMult);
        aboutButton.setBorderWidth(3);
        aboutButton.setBorderColor(themeColors.secondBrown);
        aboutButton.setTextOutlineWidth(0);
        aboutButton.setTextColor([100, 100, 100]);
        aboutButton.setBgColor(themeColors.mainBrown);

        this.startMenu.addChild(aboutButton, 50);
        this.startMenu.linkChild(aboutButton, 'aboutButton');
    }

    setupPlayMenu() {
        // Add width here so the buttons are offscreen to one side
        var marginX = (widthCm - this.playMenuSize.x) / 2 + widthCm;
        var marginY = (heightCm - this.playMenuSize.y) / 2;

        this.playMenu = new Panel(new p5.Vector(marginX, marginY),
            new p5.Vector(this.playMenuSize.x, this.playMenuSize.y),
            layoutStyles.verticalRow, scaleMult);
        this.playMenu.setBorderWidth(0);

        // Set up load game button
        var loadGameButton = new SimpleButton(fillInVector, new p5.Vector(300, 70),
            'Load Game', 50, scaleMult);
        loadGameButton.setBorderWidth(3);
        loadGameButton.setBorderColor(themeColors.secondBrown);
        loadGameButton.setTextOutlineWidth(0);
        loadGameButton.setTextColor([100, 100, 100]);
        loadGameButton.setBgColor(themeColors.mainBrown);

        this.playMenu.addChild(loadGameButton, 5);
        this.playMenu.linkChild(loadGameButton, 'loadGameButton');


        // Set up new game button
        var newGameButton = new SimpleButton(fillInVector, new p5.Vector(390, 70),
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
        this.viewPanCm.x = this.menuSlideRange.max;
        this.crntMenuSlideVel = 0;
        this.slidingBetweenMenus = false;
        this.crntButtonChecks = () => {
            this.checkStartScreenButtons();
        }
    }

    goToPlayMenu() {
        this.viewPanCm.x = this.menuSlideRange.min;
        this.crntMenuSlideVel = 0;
        this.slidingBetweenMenus = false;
        this.crntButtonChecks = () => {
            this.checkPlayMenuButtons();
        }
    }

    beginSlideToStartScreen() {
        this.crntMenuSlideVel = this.maxMenuSlideVel;
        this.slidingBetweenMenus = true;
    }

    beginSlideToPlayMenu() {
        this.crntMenuSlideVel = -this.maxMenuSlideVel;
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
        if (this.slidingBetweenMenus) this.slideBetweenMenus();

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

        translate(this.viewPanCm.x, this.viewPanCm.y);

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
            this.beginSlideToPlayMenu();
        }

        if (this.startMenu.aboutButton.mouseHovering(this.viewPanCm)) {
            eval(this.openAboutPageFunc);
        }
    }

    checkPlayMenuButtons() {
        if (this.playMenu.loadGameButton.mouseHovering(this.viewPanCm)) {
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
            this.beginSlideToStartScreen();
        }
    }

    // Other 
    // -----

    slideBetweenMenus() {
        var nextPos = this.viewPanCm.x + this.crntMenuSlideVel;

        // If it's not at the end yet, keep sliding
        if (this.menuSlideRange.min < nextPos && nextPos < this.menuSlideRange.max) {
            this.viewPanCm.x += this.crntMenuSlideVel;
        }
        // Otherwise snap to the nearest side
        else {
            var midpoint = (this.menuSlideRange.min + this.menuSlideRange.max) / 2;
            // If it's nearly to the right side
            if (this.viewPanCm.x < midpoint) {
                this.goToPlayMenu();
            }
            // If it's nearly to the left side
            else this.goToStartScreen();
        }
    }
}