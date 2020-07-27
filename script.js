// (width cm and height cm are in canvasInfo.js)

const scaleMult = findScaleMult();

const cWidth = scaleMult * widthCm;
const cHeight = scaleMult * heightCm;

const gameSaveName = 'unnamedGame';

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

    pickaxe : 'images/tools/pickaxe.png',

    bgImage : 'images/bgImage.png',

    grey20Pixel : 'images/colors/grey20.png',
    seaBluePixel : 'images/colors/seablue.png',

    titleScreenBg : 'images/titleScreenBg.png'
}

var images = {}; // object to hold all of the images used in the game (in p5-format)

new p5();
function preload() {
    // load all of the images and add them to the image object

    var keys = Object.keys(imageUrls);
    var values = Object.values(imageUrls);

    for (var i = 0; i < keys.length; i ++) {
        images[keys[i]] = loadImage(values[i]);
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

function goToTitleScreen() {
    draw = () => {
        background(0);
        titleScreen.update();
    }
    titleScreen.reset();
    crntButtonChecks = () => titleScreen.crntButtonChecks();
    crntOnPressKeybinds = doNothing;
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
    }
    else {
        console.warn('Warning: Attempted to start null game');
        console.log('An error most likely occured in saveAndLoad.js ' +
        'due to an imcompatible version')
    }
}

function startUnnamedGame() {
    // (just a thing for the title screen to start the game, not final)

    // If there's a saved game, load it
    if (loadGame('unnamedGame') !== null) {
        loadGame('unnamedGame').then(startGame);
    }
    // Else make a new one
    else {
        startNewGame();
    }
}

function mouseReleased() {
    crntButtonChecks();
}

function keyPressed() {
    crntOnPressKeybinds();
}

// Make title screen and set it to the current screen
var titleScreen = new TitleScreen(fps, 'titleScreenBg', 
    imageSizesCm.titleScreenBg, 'startUnnamedGame()', 'startNewGame()');

var draw;
var crntButtonChecks;
var crntOnPressKeybinds;
var game;

goToTitleScreen();