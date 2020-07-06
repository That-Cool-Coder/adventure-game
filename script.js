// (width cm and height cm are in canvasInfo.js)

const scaleMult = findScaleMult();

const cWidth = scaleMult * widthCm;
const cHeight = scaleMult * heightCm;

const gameSaveName = 'unnamedGame';

const imageUrls = {
    dirtBlockNorm : 'images/dirtBlockNorm.png',
    dirtBlockExcv : 'images/dirtBlockExcv.png',
    grassBlockNorm : 'images/grassBlockNorm.png',
    grassBlockExcv : 'images/grassBlockExcv.png',

    characterIdle : 'images/characterIdle.png',

    pickaxe : 'images/pickaxe.png',

    bgImage : 'images/bgImage.png',

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
}

function startGame(gameToStart) {
    if (gameToStart !== null) {
        game = gameToStart;
        draw = () => {
            background(0);
            game.crntDraw();
        }
        crntButtonChecks = () => game.crntButtonChecks();
    }
    else {
        console.warn('Warning: Attempted to start null game');
        console.log('An error most likely occured in saveAndLoad due to an imcompatible' + 
        ' version')
    }
}

function startUnnamedGame() {
    // If there's a saved game, load it
    if (loadGame('unnamedGame') !== null) {
        startGame(loadGame('unnamedGame'));
    }
    // Else make a new one
    else {
        startNewGame();
    }
}

function mouseReleased() {
    crntButtonChecks();
}

// Make title screen and set it to the current screen
var titleScreen = new TitleScreen(fps, 'titleScreenBg', 
    titleScreenBgImgSize, 'startUnnamedGame');

var draw;
var crntButtonChecks;
var game;

goToTitleScreen();