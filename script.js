// for widthCm and heightCm, view canvasInfo.js as that data needs to be loaded
// for some other files before this one

const scaleMult = findSizeMultilplierToFitRectangle(new p5.Vector(widthCm, heightCm),
    new p5.Vector(getViewportWidth(), getViewportHeight())) * viewportSizeTaken;

const cWidth = scaleMult * widthCm;
const cHeight = scaleMult * heightCm;

const gameSaveName = 'unnamedGame';

var initialScreenStartButton;

const imageUrls = {
    dirtBlockNorm : 'images/blocks/dirtBlockNorm.png',
    dirtBlockExcv : 'images/blocks/dirtBlockExcv.png',
    grassBlockNorm : 'images/blocks/grassBlockNorm.png',
    grassBlockExcv : 'images/blocks/grassBlockExcv.png',
    stoneBlockNorm : 'images/blocks/stoneBlockNorm.png',
    stoneBlockExcv : 'images/blocks/stoneBlockExcv.png',

    coal : 'images/resources/coal.png',

    characterIdle : 'images/character/characterIdle.png',

    boarLeft : 'images/animals/boarLeft.png',
    boarRight : 'images/animals/boarRight.png',

    ratLeft : 'images/animals/ratLeft.png',
    ratRight : 'images/animals/ratRight.png',

    pickaxe : 'images/tools/pickaxe.png',
    sword : 'images/tools/sword.png',

    bgImage : 'images/bgImage.png',

    grey20Pixel : 'images/colors/grey20.png',
    seaBluePixel : 'images/colors/seablue.png',
    transparentPixel : 'images/colors/transparentPixel.png',

    titleScreenBg : 'images/titleScreenBg.png'
};

const soundUrls = {
    mainLoop : 'sounds/mainLoop.mp3',
    titleScreen : 'sounds/titleScreen.mp3',
    boarDie : 'sounds/animals/boarDie.mp3',
    grunt : 'sounds/grunt.wav',
    sadTrombone : 'sounds/sadTrombone.wav',
    characterDamageTaken : 'sounds/knifeStab.mp3',
    gravel : 'sounds/gravel.wav',
    clang : 'sounds/clang.wav'
};

var images = {}; // object to hold all of the images used in the game (in p5-format)

var sounds = {}; // object to hold all of the sounds used in the game (in p5-format)

new p5();

function preload() {
    // load all of the images and add them to the image object
    loadAssets(imageUrls, loadImage, images);
    // load all of the sounds and add them to the sound object
    loadAssets(soundUrls, loadSound, sounds)
}

function loadAssets(inputUrls, loadFunc, outputDict) {
    // Load all of the assets from the urls in inputUrls
    // using the function loadFunc, and set the keys of outputDict
    // to keys of inputUrls then set the data to the loaded assets

    var keys = Object.keys(inputUrls);
    var values = Object.values(inputUrls);

    for (var i = 0; i < keys.length; i ++) {
        outputDict[keys[i]] = loadFunc(values[i]);
    }
}

function setup() {
    canvas = createCanvas(cWidth, cHeight);
    canvas.parent('canvasHolder');
    colorMode(RGB, 100);
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);
    frameRate(fps);
}

function openControlPage() {
    window.open('instructionPage.html', '_blank');
}

function openAboutGamePage() {
    window.open('about.html', '_blank');
}

function createInitialScreen() {
    var size = new p5.Vector(150, 50);
    var pos = new p5.Vector(widthCm / 2, heightCm / 2).sub(p5.Vector.div(size, 2));
    initialScreenStartButton = new SimpleButton(pos, size, 'Start', 40, scaleMult);
    initialScreenStartButton.setBgColor(themeColors.mainBrown);
    initialScreenStartButton.setBorderColor(themeColors.secondBrown);
}

function showInitialScreen() {
    initialScreenStartButton.draw();
}

function initialScreenButtonChecks() {
    if (initialScreenStartButton.mouseHovering()) {
        goToTitleScreen();
    }
}

function goToTitleScreen() {
    draw = () => {
        background(0);
        titleScreen.update();
    }
    titleScreen.reset();
    crntButtonChecks = () => titleScreen.crntButtonChecks();
    crntOnPressKeybinds = doNothing;
    sounds.mainLoop.stop();
    sounds.titleScreen.loop();
}

function exitGame() {
    goToTitleScreen();
    titleScreen.goToPlayMenu();
}

function startGame(gameToStart) {
    if (gameToStart !== null) {
        game = gameToStart;
        draw = () => {
            background(0);
            game.crntDraw();
        }
        crntButtonChecks = () => game.crntButtonChecks();
        crntOnPressKeybinds = () => game.crntOnPressKeybinds();
        sounds.titleScreen.stop();
        //sounds.mainLoop.loop();
    }
    else {
        console.warn('Warning: Attempted to start null game');
        console.log('An error most likely occured in saveAndLoad.js ' +
        'due to an incompatible version');
    }
}

function startUnnamedGame() {
    // (just a thing for the title screen to start the game, not final)

    loadGame('unnamedGame').then(gameData => {
        // If the loading went fine, then start the game
        if (gameData.status == errorDict.noError) {
            startGame(gameData.game);
        }
        // If the problem is that there is no game under that name, start new game
        else if (gameData.status == errorDict.nonExistingGameStarted) {
            startNewGame();
        }
        // If the version is incompatible, then ask the user...
        // ...if they want to start a new game
        else if (gameData.status == errorDict.incompatibleGameVersion) {
            var canStart = confirm('Cannot load game: the version is incompatible.\n' + 
                'Start new game?');
            if (canStart) {
                startNewGame();
            }
            else {
                goToTitleScreen();
                titleScreen.goToPlayMenu();
            }
        }
    })
}

function mouseReleased() {
    crntButtonChecks();
}

function keyPressed() {
    crntOnPressKeybinds();
}

// Make title screen
var titleScreen = new TitleScreen(fps, 'titleScreenBg', 
    imageSizesCm.titleScreenBg, 'startUnnamedGame()', 'startNewGame()', 'openAboutGamePage()');

// Make the screen that says start (needed for playing sound) and go to it
createInitialScreen();
var draw = showInitialScreen;
var crntButtonChecks = initialScreenButtonChecks;
var crntOnPressKeybinds = () => {};
var game;