const widthCm = 800;
const heightCm = 500;

const fps = 60; // frames per second

// what fraction of the viewport is taken up by the game window in both width and height
const viewportSizeTaken = 0.95;

// technically this should consider both width and height...
// ...but this is a prototype so it doesn't matter
const scaleMult = getViewportHeight() / heightCm * viewportSizeTaken;

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

    titleScreenImg : 'images/titleScreenImg.png'
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
        titleScreen.draw();
    }
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

function mousePressed() {
    crntButtonChecks();
}

// Make title screen and set it to the current screen
var titleScreen = new TitleScreen(fps, gameForTitleScreenJSON, 'startGame');

var draw;
var crntButtonChecks;
var game;



// If there's a saved game, load it
if (loadGame('unnamedGame') !== null) {
    startGame(loadGame('unnamedGame'));
}
// Else make a new one
else {
    startNewGame();
}