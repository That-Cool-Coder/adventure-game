// This file is full of stuff that the program needs to know to make a new game

// World (terrain, time, etc)
const blockSizeCm = 50;
const mapCols = 150;
const mapRows = 15;
const gameTimeIncrement = 1/18000;
const gameBgImageNames = 'bgImage';

// Character
const characterName = 'Pete';
const characterStartPos = new p5.Vector(0, -blockSizeCm);
const characterSizeCm = new p5.Vector(30, 50);
const characterSpeed = 3;
const characterImageNames = 'characterIdle';

const oldestCompatibleVersion = 7;
const crntVersion = 7;

function startNewGame() {
    var blocks = makeTerrain(mapRows, mapCols);
    var tool = new Tool('Pickaxe', 10, new p5.Vector(30, 30),
        'pickaxe', 0.5, new p5.Vector(30, 10));

    var character = new Character(characterName, characterStartPos, 
        characterSizeCm, characterSpeed, characterImageNames, tool);

    game = new Game(gameSaveName, gameBgImageNames, character, 
        'goToTitleScreen', themeColors.mainBrown, themeColors.secondBrown,
        crntVersion, blocks, gameTimeIncrement);
    saveGame(game);
    startGame(game);
}